<?php

namespace App\Http\Controllers;
use App\FileUpload;
use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Str;
use Storage;
use App\Tour;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('create', Tour::class);
        if($request->file('image'))
        {
            $validator = Validator::make($request->all(), [
                 'image'  => 'required|max:8192',
            ]);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()->getMessages()], 500);
            }
            $image = $request->file('image');
            \Image::configure(array('driver' => 'imagick'));
            $image_resized = \Image::make($image)->orientate();
            $image_resized->resize(2048, 2048, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            $path =  "public/" . Str::random(40) . ".jpg";
            Storage::put($path, (string) $image_resized->encode("jpg", 70));
            $imagePath = Storage::url($path);
            // $imagePath = $image->store('public');
            return response()->json(['success' => 'You have successfully uploaded an image', 'image'=>basename($imagePath)], 200);
        }
        
        
        
    }

    public function delete(Request $request, $filename) {
        $this->authorize('create', Tour::class);
        Storage::delete("public/" . $filename);
        return response()->json(['success' => 'success'], 200);
    }
}
