<?php

namespace App\Http\Controllers;
use App\FileUpload;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function store(Request $request)
    {

        if($request->file('image'))
        {
            $image = $request->file('image');
            $image_resized = \Image::make($image);
            $image_resized->resize(2048, 2048, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            $imagePath = $image->store('public');
            return response()->json(['success' => 'You have successfully uploaded an image', 'image'=>basename($imagePath)], 200);
        }
        
        
        
    }
}
