<?php

namespace App\Http\Controllers;

use App\Http\Resources\SurveyResource;
use App\Models\Survey;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Models\SurveyQuestion;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

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
     * @throws Exception
     */
    public function store(StoreSurveyRequest $request): SurveyResource
    {
        $data = $request->validated();

        if (isset($data['image'])) {
            $path = $this->storeImage($data['image']);
            $data['image'] = $path;
        }

        $survey = Survey::create($data);

        // Create new questions:
        foreach($data['questions'] as $question) {
            $this->createQuestion($question, $survey->id);
        }
        return new SurveyResource($survey);
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
     * @throws Exception
     */
    public function update(UpdateSurveyRequest $request, Survey $survey): SurveyResource
    {
        $data = $request->validated();

        if (isset($data['image']) && !filter_var($data['image'], FILTER_VALIDATE_URL)) {
            $path = $this->storeImage($data['image']);
            $data['image'] = $path;
            if ($survey->image) {
                File::delete(public_path($survey->image));
            }
        }

        $survey->update($data);

        return new SurveyResource($survey);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Survey $survey
     * @return Response
     */
    public function destroy(Request $request, Survey $survey): Response
    {
        $user = $request->user();
        if ($survey->user_id !== $user->id) {
            abort(403);
        }

        $survey->delete();

        if ($survey->image) {
            File::delete(public_path($survey->image));
        }

        return response(null, 204);
    }

    /**
     * @throws Exception
     */
    private function storeImage(mixed $image): string
    {
        // Check if the image is a valid string:
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // Get the extension of the image:
            $image = substr($image, strpos($image, ',') + 1);

            // Get the extension of the image:
            $extension = strtolower($type[1]);

            // Check if the image is a valid string:
            if (!in_array($extension, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new Exception('The provided image is not valid.');
            }

            // Decode the image:
            $image = base64_decode($image);

            // Check if the image is a valid string:
            if ($image === false) {
                throw new Exception('The provided image is not valid.');
            }

            // Create a unique name for the image:
            $path = 'images/' . uniqid() . '.' . $extension;
            if (!File::exists(public_path('images/'))) {
                File::makeDirectory(public_path('images'));
            }

            // Save the image:
            file_put_contents($path, $image);

            return $path;
        } else {
            throw new Exception('The provided image is not valid.');
        }
    }

    private function createQuestion($data, $id) {
        $data["survey_id"] = $id;
        if (is_array($data["data"])) {
            $data["data"] = json_encode($data["data"]);
        }
        $validator = Validator::make($data, [
            "question" => "required|string",
            "type" => "required", Rule::in([
                Survey::TYPE_TEXT,
                Survey::TYPE_TEXTAREA,
                Survey::TYPE_RADIO,
                Survey::TYPE_CHECKBOX,
                Survey::TYPE_SELECT
            ]),
            "description" => "nullable|string",
            "data" => "present",
            "survey_id" => "exists:App\Models\Survey,id"
        ]);

        return SurveyQuestion::create($validator->validated());
    }
}
