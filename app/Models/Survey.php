<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Survey extends Model
{
    use HasFactory, HasSlug;

    const TYPE_TEXT = "text";
    const TYPE_TEXTAREA = "textarea";
    const TYPE_RADIO = "radio";
    const TYPE_CHECKBOX = "checkbox";
    const TYPE_SELECT = "select";

    protected $fillable = [
        "title",
        "image",
        "slug",
        "status",
        "description",
        "expiration",
        "user_id",
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(SurveyQuestion::class);
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom("title")
            ->saveSlugsTo("slug");
    }
}
