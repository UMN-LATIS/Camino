<?php

namespace App\Http\Controllers;
use App\FileUpload;
use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Str;
use Storage;
use App\Tour;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('create', Tour::class);
        if($request->file('upload'))
        {
            $file = $request->file('upload');
            if(str_contains($file->getMimeType(), "image")){
                $validator = Validator::make($request->all(), [
                 'upload'  => 'required|max:8192',
                ]);
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()->getMessages()], 500);
                }

                \Image::configure(array('driver' => 'imagick'));
                $image_resized = \Image::make($file);
                $image_resized->resize(2048, 2048, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                $path =  "public/" . Str::random(40) . ".jpg";
                Storage::put($path, (string) $image_resized->encode("jpg", 70));
                $filePath = Storage::url($path);
                // $imagePath = $image->store('public');

            }
            if(str_contains($file->getMimeType(), "audio")){
                $filePath = Storage::put("public", $file);

            }

            if($filePath) {
                return response()->json(['success' => 'You have successfully uploaded a file', 'file'=>basename($filePath)], 200);
            }
            
        }
        
        
        
    }

    public function delete(Request $request, $filename) {
        $this->authorize('create', Tour::class);
        Storage::delete("public/" . $filename);
        return response()->json(['success' => 'success'], 200);
    }
}
