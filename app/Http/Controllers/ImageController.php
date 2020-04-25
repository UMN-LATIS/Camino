<?php

namespace App\Http\Controllers;
use App\FileUpload;
use Illuminate\Http\Request;
use Validator;

class ImageController extends Controller
{
    public function store(Request $request)
    {

        if($request->file('image'))
        {
            $validator = Validator::make($request->all(), [
                 'image'  => 'required|max:8192',
            ]);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()->getMessages()], 500);
            }
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
