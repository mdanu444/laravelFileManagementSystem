<?php

namespace App\Http\Controllers;

use App\Models\Directory;
use App\Models\MyStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use ZipArchive;

class StorageController extends Controller
{
    public function getfiles()
    {
        return MyStorage::all()->where("dir_id", 0)->sortByDesc("id");
    }
    public function getimportantfiles()
    {
        return MyStorage::all()->where("importants", 1)->sortByDesc("id");
    }
    public function gettrashedfiles()
    {
        return MyStorage::onlyTrashed()->get();
    }

    public function deleteFile(Request $request)
    {
        if (MyStorage::where("fullPath", $request->filepath)->delete()) {
            return ["message" => "file deleted successfully!"];
        };
        return ["message" => "something error"];
    }

    // create folder
    public function createFolder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "fullname" => "unique:storages,fullname|required"
        ], [
            'required' => 'The Folder Name field is required.',
            'unique' => 'The Folder Name must be unique.',
        ]);
        if (!$validator->fails()) {
            if ($request->fullname != "")
                Directory::create(["dirName" => $request->currentDir . $request->fullname]);
            $data = [
                "fullname" => $request->fullname,
                "extension" => "folder",
                "type" => "folder",
                "size" => "0",
                "dir_id" => $request->currentId,
                "fullPath" => $request->currentDir . $request->fullname . "/",
            ];

            MyStorage::create($data);
            return ["message" => "Folder Created Successfully"];
        } else {
            return ["error" => $validator->messages()];
        }
    }

    public function store(Request $request)
    {
        $fullPath = $request->currentDir;
        if ($request->hasFile("files")) {
            foreach ($request->allFiles("files") as $file) {
                foreach ($file as $value) {
                    $data = [
                        "fullname" => $value->getClientOriginalName(),
                        "extension" => strtolower($value->getClientOriginalExtension()),
                        "type" => "file",
                        "size" => $value->getSize(),
                        "dir_id" => $request->currentId,
                        "fullPath" => $fullPath ."/". $value->getClientOriginalName(),
                    ];
                    MyStorage::create($data);
                    $value->storeAs($fullPath, $value->getClientOriginalName(), "public");
                }
            };
        } else {
            return "No file found";
        }

        return "All File Inserted Successfully";
    }


    public function importantFile($id)
    {
        $data = MyStorage::find($id);
        $data->importants = 1;
        $data->save();
        return $data;
    }
    public function normalizeFile($id)
    {
        $data = MyStorage::find($id);
        $data->importants = "";
        $data->save();
        return $data;
    }
    public function getfolderInfo($folder)
    {
        $data = MyStorage::where("fullname", $folder)->get();
        return $data;
    }
    public function getFolderData($id)
    {
        $data = MyStorage::where("dir_id", $id)->get();
        if ($data) {
            return $data;
        }
        return ["message" => "Data not found"];
    }


        /**

         * Display a listing of the resource.

         *

         * @return \Illuminate\Http\Response

         */

    public function downloadZip(Request $request)
        {
            $folderpath = $request->folderName;
            $zip = new ZipArchive();
            $fileName = $request->filename.".zip";
        if ($zip->open(public_path($fileName), ZipArchive::CREATE)== TRUE)
        {
                $files = File::files(public_path('storage/'.$folderpath));
                foreach ($files as $key => $value){
                    $relativeName = basename($value);
                    $zip->addFile($value, $relativeName);
                }
                $zip->close();
            }
            response()->download(public_path($fileName));
            // if (response()->download(public_path($fileName))) {
            //     unlink(public_path($fileName));
            // }
        }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function fileRestore(Request $request)
    {
        $file = MyStorage::onlyTrashed()->where("id", $request->id)->restore();
        return $file;
    }
    public function fileDeleteForever(Request $request)
    {
        $folderOrFile =MyStorage::onlyTrashed()->find($request->id);
        MyStorage::onlyTrashed()->where("dir_id", $request->id)->forceDelete();
        DB::table("storages")->where("dir_id", $request->id)->delete();
        MyStorage::onlyTrashed()->where("id", $request->id)->forceDelete();
        if ($folderOrFile && $folderOrFile->type == "folder") {
            File::deleteDirectory(public_path("storage/".$folderOrFile['fullPath']));
        }else{
            unlink(public_path("storage/".$folderOrFile['fullPath']));
        }
        return $folderOrFile;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
