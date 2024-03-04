<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class SurveyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable|\JsonSerializable
     */
    public function toArray($request): array|\JsonSerializable|Arrayable
    {
        Log::info("SurveyResource");
        Log::info($this->questions);
        return [
            "id" => $this->id,
            "image" => $this->image ? URL::to($this->image) : null,
            "title" => $this->title,
            "slug" => $this->slug,
            "status" => $this->status !== "draft",
            "description" => $this->description,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "expiration" => $this->expiration,
            "questions" => SurveyQuestionResource::collection($this->questions)
        ];
    }
}
