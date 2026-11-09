<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DependencyCompatibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_laravel_http_client_json_and_async_contracts()
    {
        Http::preventStrayRequests();
        Http::fake(['fixture.invalid/*' => Http::response(['ok' => true], 200, ['X-Fixture' => 'yes'])]);
        $response = Http::withHeaders(['X-Request' => 'fixture'])->post('https://fixture.invalid/json', ['message' => 'fixture']);
        $this->assertTrue($response->ok());
        $this->assertTrue($response->json('ok'));
        $this->assertSame('yes', $response->header('X-Fixture'));
        $async = Http::async()->get('https://fixture.invalid/async')->wait();
        $this->assertTrue($async->ok());
        Http::assertSent(fn ($request) => $request->url() === 'https://fixture.invalid/json' && $request['message'] === 'fixture');
    }

    public function test_guzzle_redirect_and_promise_contracts()
    {
        $history = [];
        $mock = new \GuzzleHttp\Handler\MockHandler([
            new \GuzzleHttp\Psr7\Response(302, ['Location' => '/finished']),
            new \GuzzleHttp\Psr7\Response(200, [], '{"ok":true}'),
        ]);
        $stack = \GuzzleHttp\HandlerStack::create($mock);
        $stack->push(\GuzzleHttp\Middleware::history($history));
        $client = new \GuzzleHttp\Client(['handler' => $stack, 'base_uri' => 'http://fixture.invalid']);
        $response = $client->getAsync('/redirect')->wait();
        $this->assertSame(200, $response->getStatusCode());
        $this->assertTrue(json_decode((string) $response->getBody(), true)['ok']);
        $this->assertCount(2, $history);
        $this->assertSame('/finished', $history[1]['request']->getUri()->getPath());
    }

    public function test_password_breach_check_uses_faked_http_and_never_calls_external_service()
    {
        Http::preventStrayRequests();
        $hash = strtoupper(sha1('fixture-only-password'));
        Http::fake(['api.pwnedpasswords.com/*' => Http::response(substr($hash, 5).':25', 200)]);
        $verifier = app(\Illuminate\Contracts\Validation\UncompromisedVerifier::class);
        $this->assertFalse($verifier->verify(['value' => 'fixture-only-password', 'threshold' => 0]));
        Http::assertSent(fn ($request) => $request->url() === 'https://api.pwnedpasswords.com/range/'.substr($hash, 0, 5));
    }

    public function test_sanctum_login_and_survey_crud_use_only_ephemeral_sqlite()
    {
        $this->getJson('/api/surveys')->assertUnauthorized();
        $user = User::factory()->create(['password' => Hash::make('fixture-only-password')]);
        $login = $this->postJson('/api/user/sign-in', ['email' => $user->email, 'password' => 'fixture-only-password']);
        $login->assertOk()->assertJsonStructure(['user', 'token']);
        Sanctum::actingAs($user);
        $this->getJson('/api/surveys')->assertOk();
        $payload = ['title' => 'Fixture survey', 'status' => true, 'description' => 'Fixture', 'expiration' => null, 'questions' => []];
        $created = $this->postJson('/api/surveys', $payload)->assertCreated();
        $id = $created->json('data.id');
        $this->assertNotNull($id);
        $this->getJson('/api/surveys/'.$id)->assertOk()->assertJsonPath('data.title', 'Fixture survey');
        $other = User::factory()->create();
        Sanctum::actingAs($other);
        $this->getJson('/api/surveys/'.$id)->assertForbidden();
        Sanctum::actingAs($user);
        $this->putJson('/api/surveys/'.$id, array_merge($payload, ['title' => 'Updated fixture']))->assertOk();
        $this->deleteJson('/api/surveys/'.$id)->assertNoContent();
        $this->getJson('/api/surveys/'.$id)->assertNotFound();
    }
}
