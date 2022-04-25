<?php

namespace App\Http\Controllers;

use App\Models\Directory;
use App\Models\MyStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class StorageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getfiles()
    {
        return MyStorage::all()->where("dir_id" , 0)->sortByDesc("id");
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function deleteFile(Request $request)
    {
        if (MyStorage::where("fullPath", $request->filepath)->delete()) {
            return ["message"=> "file deleted successfully!"];
        };
        return ["message"=> "something error"];
    }






    // create folder
    public function createFolder(Request $request)
    {
        if ($request->folderName !="") {
        $fullPath = Directory::create(["dirName" => $request->currentDir.$request->folderName]);
        $data = [
            "fullname" => $request->folderName,
            "extension" => "folder",
            "type" => "folder",
            "size" => "0",
            "dir_id" => $request->currentId,
            "fullPath" => $request->currentDir.$request->folderName."/",
        ];

        MyStorage::create($data);
        return "Folder Created Successfully";
    }
        else{
            return "Folder name must not be empty!";
        }
    }

    public function store(Request $request)
    {
        $fullPath = $request->currentDir;
        if ($request->hasFile("files")) {
            foreach($request->allFiles("files") as $file){
                foreach ($file as $value) {
                    $data = [
                        "fullname" => $value->getClientOriginalName(),
                        "extension" => strtolower($value->getClientOriginalExtension()),
                        "type" => "file",
                        "size" => $value->getSize(),
                        "dir_id" => $request->currentId,
                        "fullPath" => $fullPath.$value->getClientOriginalName(),
                    ];
                    MyStorage::create($data);
                    $value->storeAs($fullPath, $value->getClientOriginalName(), "public");
                }
            };
        }else{
            return "No file found";
        }

        return "All File Inserted Successfully";
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
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
