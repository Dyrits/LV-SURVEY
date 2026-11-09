#!/usr/bin/env python3
"""Local-only backend transport check. Uses a new disposable SQLite file."""
import base64
import datetime
import json
import os
from pathlib import Path
import socket
import subprocess
import tempfile
import time
import urllib.error
import urllib.request

root = Path(__file__).resolve().parents[1]
if (root / 'bootstrap/cache/config.php').exists():
    raise SystemExit('Refusing tests with cached application config.')
php = os.environ.get('PHP_BIN', 'php')
with tempfile.TemporaryDirectory(prefix='lv-survey-http-') as tmp:
    db = Path(tmp) / 'scratch.sqlite'
    db.touch()
    env = dict(os.environ, APP_ENV='testing', APP_DEBUG='false',
               APP_KEY='base64:' + base64.b64encode(os.urandom(32)).decode(),
               DB_CONNECTION='sqlite', DB_DATABASE=str(db), DATABASE_URL='', DB_URL='',
               CACHE_DRIVER='array', SESSION_DRIVER='array', MAIL_MAILER='array',
               QUEUE_CONNECTION='sync', BCRYPT_ROUNDS='4', LOG_CHANNEL='stderr')
    subprocess.run([php, 'artisan', 'migrate', '--force', '--no-interaction'],
                   cwd=root, env=env, check=True, stdout=subprocess.DEVNULL)
    seed = """require 'vendor/autoload.php'; $app=require 'bootstrap/app.php';
$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();
foreach (['one', 'two'] as $name) { App\\Models\\User::factory()->create([
'email'=>$name.'@fixture.invalid', 'password'=>Illuminate\\Support\\Facades\\Hash::make('fixture-only-password')]); }
"""
    subprocess.run([php, '-r', seed], cwd=root, env=env, check=True, stdout=subprocess.DEVNULL)
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    url = f'http://127.0.0.1:{port}'
    checks = []

    def request(method, path, expected, payload=None, token=None):
        headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = 'Bearer ' + token
        req = urllib.request.Request(url + path, method=method, headers=headers,
                                     data=json.dumps(payload).encode() if payload is not None else None)
        try:
            response = urllib.request.urlopen(req, timeout=5)
        except urllib.error.HTTPError as error:
            response = error
        raw = response.read()
        assert response.code == expected, (method, path, expected, response.code, raw[:500])
        checks.append([method, path, expected])
        return json.loads(raw) if raw else None

    with open(Path(tmp) / 'server.log', 'w+') as log:
        server = subprocess.Popen([php, '-d', 'display_errors=stderr', '-S', f'127.0.0.1:{port}', '-t', str(root / 'public'),
                                   str(root / 'vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php')],
                                  cwd=root / 'public', env=env, stdout=log, stderr=log)
        try:
            for attempt in range(50):
                try:
                    with socket.create_connection(('127.0.0.1', port), timeout=0.1):
                        break
                except OSError:
                    time.sleep(0.1)
            request('GET', '/api/surveys', 401)
            request('POST', '/api/user/sign-in', 422, {})
            request('POST', '/api/user/sign-in', 401,
                    {'email': 'one@fixture.invalid', 'password': 'wrong'})
            token = request('POST', '/api/user/sign-in', 200,
                            {'email': 'one@fixture.invalid', 'password': 'fixture-only-password'})['token']
            other = request('POST', '/api/user/sign-in', 200,
                            {'email': 'two@fixture.invalid', 'password': 'fixture-only-password'})['token']
            assert request('GET', '/api/user', 200, token=token)['email'] == 'one@fixture.invalid'
            request('GET', '/api/user', 401, token='not-a-real-token')
            request('POST', '/api/surveys', 422, {}, token)
            question = {'type': 'select', 'question': 'Choose one', 'description': None,
                        'data': {'options': [{'text': 'A'}, {'text': 'B'}]}}
            payload = {'title': 'Fixture survey', 'status': True, 'description': 'Fixture',
                       'expiration': (datetime.date.today() + datetime.timedelta(days=30)).isoformat(),
                       'questions': [question]}
            created = request('POST', '/api/surveys', 201, payload, token)['data']
            survey = '/api/surveys/' + str(created['id'])
            assert created['slug'] == 'fixture-survey'
            assert created['questions'][0]['data'] == question['data']
            assert created['expiration'].startswith(payload['expiration'])
            assert request('GET', survey, 200, token=token)['data']['title'] == payload['title']
            assert len(request('GET', '/api/surveys', 200, token=token)['data']) == 1
            assert request('GET', '/api/surveys', 200, token=other)['data'] == []
            request('GET', survey, 403, token=other)
            request('PUT', survey, 403, payload, other)
            request('DELETE', survey, 403, token=other)
            invalid = dict(payload, expiration='2000-01-01')
            request('PUT', survey, 422, invalid, token)
            updated = dict(payload, title='Updated fixture', questions=[])
            assert request('PUT', survey, 200, updated, token)['data']['questions'] == []
            request('DELETE', survey, 204, token=token)
            request('GET', survey, 404, token=token)
            request('POST', '/api/user/sign-out', 200, {}, token)
            request('GET', '/api/user', 401, token=token)
            print(json.dumps({'checks': len(checks), 'results': checks, 'database': 'disposable SQLite',
                              'transport': 'real loopback HTTP', 'external_requests': 'none'}))
        finally:
            server.terminate()
            server.wait(timeout=10)
