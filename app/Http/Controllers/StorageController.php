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
        return MyStorage::all()->sortByDesc("id");
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
        $dir = Directory::create(["dirName" => $request->currentDir.$request->folderName]);
        $data = [
            "fullname" => $request->folderName,
            "extension" => "folder",
            "type" => "folder",
            "size" => "0",
            "dir_id" => $dir->id,
            "fullPath" => $dir->dirName,
        ];
        MyStorage::create($data);
        return "Folder Created Successfully";
    }
        else{
            return "Folder name must not be empty!";
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    // [test:Symfony\Component\HttpFoundation\File\UploadedFile:private] =>
    // [originalName:Symfony\Component\HttpFoundation\File\UploadedFile:private] => 1 (1).pdf
    // [mimeType:Symfony\Component\HttpFoundation\File\UploadedFile:private] => application/pdf
    // [error:Symfony\Component\HttpFoundation\File\UploadedFile:private] => 0
    // [hashName:protected] =>
    // [pathName:SplFileInfo:private] => C:\xampp\tmp\phpFC58.tmp
    // [fileName:SplFileInfo:private] => phpFC58.tmp


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
                        "dir_id" => 1,
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
    public function show($id)
    {
        //
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
