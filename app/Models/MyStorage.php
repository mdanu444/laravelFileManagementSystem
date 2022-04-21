<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MyStorage extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable =
    [
        "fullname",
        "extension",
        "type",
        "size",
        "dir_id",
        "fullPath"
    ];

    protected $table = 'storages';
}
