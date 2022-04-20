<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>File Manager</title>

    {{--  external  --}}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


    {{--  internal  --}}
    <link rel="shortcut icon" href="{{ asset('images/file.png') }}" type="image/x-icon">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<header>
    <nav>
        <a href="{{ url('') }}">
            <div class="logo">
                <img src="{{ asset('images/file.png') }}" alt="">
                <h3>File Manager</h3>
             </div>
        </a>
        <div class="search">
            <input type="text" placeholder="search">
        </div>
        <div class="user"><h3>Welcome Md. Anwar Hossain <a href="{{ url('/logout') }}"><i class="fa fa-power-off"></a></i></h3> </div>
    </nav>
    <saction class="filesection">
    <div class="sidebar">
        <div class="addNewSection">
        <button class="addbtn"> <span class="plus">+</span> <span class="new">New</span>
            </button>
            <div class="addDecisitionSection">
                <div class="addFileBtn">
                    Upload File</div>
                    <span class="closer">X</span>
                <div class="addFolder">New Folder</div>
            </div>
    </div>
        <div class="rootfolders"><i class="fa fa-arrow-right"></i> Root Folder 1</div>
        <div class="rootfolders"><i class="fa fa-arrow-right"></i> Root Folder 1</div>
        <div class="rootfolders"><i class="fa fa-arrow-right"></i> Root Folder 1</div>
        <div class="rootfolders"><i class="fa fa-arrow-right"></i> Root Folder 1</div>
        <div class="rootfolders"><i class="fa fa-arrow-right"></i> Root Folder 1</div>
        <div class="rootfolders"><i class="fa fa-arrow-right"></i> Root Folder 1</div>
    </div>
        <div class="container">
            <h1 class="filesHeading">Drive</h1>
            <div class="content">
                <a href="{{ url('') }}">
                    <div class="file">
                        <div class="fileOption">
                            <div class="fileOptionMenuIcon" >
                                <span fileid="10"><i class="fa fa-ellipsis-v"></i></span>
                            </div>
                            <div class="options"></div>
                        </div>
                        <img src="{{ asset('images/file.png') }}" alt="">
                        <div class="fileDescription">
                        <p class="filename">File Name</p>
                        <p class="filename">Last Edited 01/01/2013</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </saction>
</header>



{{--  modal upload new file/files  --}}
<div class="modal fileModal">
    <div class="modalBody">
        <input type="file">
        <input class="fileUploader" type="submit" value="Upload">
    <div class="ModalCloser fileModelCloser">x</div>
    </div>
</div>
{{--  modal create folder  --}}
<div class="modal folderModal">
    <div class="modalBody">
    <input type="text" placeholder="Filder Name">
    <input class="folderCreator" type="submit" value="Create">
    <div class="ModalCloser FolderModelCloser">x</div>
</div>
</div>




{{--  modal file options  --}}
<div class="modal fileOptionModel">
    <div class="modalBody">
        <div class="OptionCloser">x</div>
        <a href="#">Download</a>
        <a href="#">Rename</a>
        <a href="#">Delete</a>
    </div>
</div>




<div class="uploadProgressDiv">
    {{--  <div class="closeProgress">x</div>  --}}
<div class="filename">untitled1.jpg</div>
<progress id="progressbar" value="10" max="100" style="width: 300px; height: 20px;"></progress>
<div class="progressDetails">0% Upploaded. Please wait...</div>
</div>

<script src="{{ asset('js/main.js') }}"></script>
</body>
</html>
