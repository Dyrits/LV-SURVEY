<?php

namespace App\Http\Controllers;

use App\Http\Resources\SurveyResource;
use App\Models\Survey;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        return SurveyResource::collection(Survey::where('user_id', $user->id)->paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreSurveyRequest $request
     * @return SurveyResource
     */
    public function store(StoreSurveyRequest $request): SurveyResource
    {
        return new SurveyResource(Survey::create($request->validated()));
    }

    /**
     * Display the specified resource.
     *
     * @param Survey $survey
     * @return SurveyResource
     */
    public function show(Survey $survey, Request $request): SurveyResource
    {
        $user = $request->user();
        if ($survey->user_id !== $user->id) {
            abort(403);
        }
        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateSurveyRequest $request
     * @param Survey $survey
     * @return SurveyResource
     */
    public function update(UpdateSurveyRequest $request, Survey $survey): SurveyResource
    {
        $survey->update($request->validated());
        return new SurveyResource($survey);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Survey $survey
     * @return Response
     */
    public function destroy(Survey $survey): Response
    {
        $user = $request->user();
        if ($survey->user_id !== $user->id) {
            abort(403);
        }
        $survey->delete();
        return response(null, 204);
    }
}
