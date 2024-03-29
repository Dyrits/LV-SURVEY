<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyQuestion extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        "question",
        "description",
        "type",
        "survey_id",
        "data"
    ];

    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }
}
