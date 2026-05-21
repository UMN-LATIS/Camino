<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Validator;
use Illuminate\Support\Str;
use Storage;
use App\Tour;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\Laravel\Facades\Image;

class ImageController extends Controller {
    public function store(Request $request) {
        $this->authorize('create', Tour::class);

        $image = $request->file('image');
        if (!$image) {
            return response()->json(['error' => 'No image provided'], 400);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|max:8192',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->getMessages()], 422);
        }

        try {
            $image_resized = Image::decode($image)
                ->orient()
                ->scaleDown(2048, 2048)
                ->encode(new JpegEncoder(quality: 70));
        } catch (\Throwable $e) {
            Log::warning('Image upload failed to decode', [
                'mime' => $image->getMimeType(),
                'client_name' => $image->getClientOriginalName(),
                'size' => $image->getSize(),
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Image could not be read'], 400);
        }

        $path = 'public/' . Str::random(40) . '.jpg';
        Storage::put($path, $image_resized->toString());
        $imagePath = Storage::url($path);

        return response()->json(['success' => 'You have successfully uploaded an image', 'image' => basename($imagePath)], 200);
    }

    public function delete(Request $request, $filename) {
        $this->authorize('create', Tour::class);
        Storage::delete("public/" . $filename);
        return response()->json(['success' => 'success'], 200);
    }
}
