let addbtn = document.querySelector(".addbtn");
let addDecisitionSection = document.querySelector(".addDecisitionSection");
let close = document.querySelector(".closer");
let addFileBtn = document.querySelector(".addFileBtn");
let addFolder = document.querySelector(".addFolder");
let fileModal = document.querySelector(".fileModal");
let folderModal = document.querySelector(".folderModal");
let fileModelCloser = document.querySelector(".fileModelCloser");
let FolderModelCloser = document.querySelector(".FolderModelCloser");
let fileUploader = document.querySelector(".fileUploader");
let folderCreator = document.querySelector(".folderCreator");
let filesHeading = document.querySelector(".filesHeading");
let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
let url = "http://localhost:8000/";
let currentDir = "Drive/"
let currentDirId = null;
let prveiousDri = "";
let nextDir = "";
addbtn.onclick = () => {
    shower(addDecisitionSection);
}

close.onclick = () => {
    closer(addDecisitionSection)
};
addFileBtn.onclick = () => {
    shower(fileModal)
    closer(addDecisitionSection)
};
addFolder.onclick = () => {
    shower(folderModal)
    closer(addDecisitionSection)
};

function closer(selector) {
    selector.style.display = "none"
}

function shower(selector) {
    selector.style.display = "block"
}
fileModelCloser.onclick = () => {
    closer(fileModal);
}
FolderModelCloser.onclick = () => {
    closer(folderModal);
}
fileUploader.onclick = () => {
    closer(fileModal);
}


let fileOptionMenu = document.querySelector(".fileOptionMenuIcon span");
let fileOptionModel = document.querySelector(".fileOptionModel");
let OptionCloser = document.querySelector(".OptionCloser");




OptionCloser.onclick = () => {
    closer(fileOptionModel)
}

// fontend section ended




// comunication with server started
let progressbar = document.getElementById("progressbar");
let uploadProgressDiv = document.querySelector('.uploadProgressDiv')
let progressDetails = document.querySelector('.progressDetails')
let uploadingFilename = document.querySelector('.uploadingFilename')
fileUploader.onclick = (e) => {
    e.preventDefault();
    progressDetails.innerHTML = ""
    uploadProgressDiv.style.backgroundColor = "white"
    progressDetails.innerHTML = ""
    let form = fileModal.children[0].children[0];
    let formData = new FormData(form);
    formData.append("currentDir", currentDir);
    closer(fileModal);
    let ajax = new XMLHttpRequest();

    ajax.upload.addEventListener('progress', updateProgress, false);
    uploadProgressDiv.style.display = "block"
    ajax.addEventListener('load', transferComplete, false);
    ajax.addEventListener('error', transferFailed, false)
    ajax.addEventListener('error', transferCanceled, false)

    ajax.onreadystatechange = function() {
        if (ajax.readyState == XMLHttpRequest.DONE) {
            console.log(ajax.response);
        }
    }


    ajax.open("post", url + "fileUpload")
    ajax.setRequestHeader('X-CSRF-TOKEN', csrfToken)
    ajax.send(formData)
    form.reset();

}


function updateProgress(e) {
    let progress = Math.floor((e.loaded / e.total) * 100)
    progressbar.value = progress;
    progressDetails.innerHTML = progress + "% Upploaded. Please wait...";
    if (progress == 100) {
        progressDetails.innerHTML = "Please Wait..."
        setTimeout(() => {
            uploadProgressDiv.style.display = "none"
        }, 3000)
    }
}

function transferComplete(e) {
    uploadProgressDiv.style.backgroundColor = "lightgreen"
    loadFilesAndFolder()
    progressDetails.innerHTML = "File Uploaded Successfull!"
}

function transferFailed(e) {
    console.log(e);
}

function transferCanceled(e) {
    console.log(e);
}

// folder create section
let folderCreateForm = document.querySelector(".folderCreateForm");
let folderNameInput = document.querySelector(".folderNameInput");
folderCreator.onclick = (e) => {
    e.preventDefault()
    let forlderName = folderNameInput.value;
    if (forlderName != "") {
        let ajax = new XMLHttpRequest();
        let formData = new FormData(folderCreateForm);
        formData.append("currentDir", currentDir);
        ajax.onreadystatechange = function() {
            if (ajax.readyState == XMLHttpRequest.DONE) {
                loadFilesAndFolder()
            }
        }

        ajax.open("post", url + "createFolder");
        ajax.setRequestHeader('X-CSRF-TOKEN', csrfToken)
        ajax.send(formData)
        folderCreateForm.reset();
        closer(folderModal);
    } else {
        alert("Please give a Filder name.")
    }
}


let content = document.querySelector(".content");

// load files and folder
function loadFilesAndFolder() {
    content.innerHTML = "";
    let extensions = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'doxs', 'xlsx'];
    let files;
    fetch(url + "getfiles", {
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    }).then(res => res.json()).then(data => {
        files = data;
        for (let file in files) {

            content.innerHTML += (`
        <div fullPath="${files[file].fullPath}" class="file" directoryId = "${files[file].id}" type="${files[file].type}">
            <div class="fileOption">
                <div class="fileOptionMenuIcon" >
                    <span fileid="10"><i class="fa fa-ellipsis-v"></i></span>
                </div>
                <div class="options"></div>
            </div>
            <img src="${url + extensions.indexOf(files[file].extension) ? "images/" +files[file].extension : 'images/other' }.png" alt="">
            <div class="fileDescription">
            <p class="filename">${files[file].fullname}</p>

            </div>
        </div>
`)

            // set current directoryId
            let LoadedFiles = document.querySelectorAll(".file")
            for (let file of LoadedFiles) {
                file.onclick = (e) => {
                    e.stopPropagation();
                    handleFileFolderClickEvent(file)
                }
            }
        }
    })

}

loadFilesAndFolder();

function handleFileFolderClickEvent(file) {
    if (file.getAttribute("type") == "folder") {
        handlefolderOptions(file)
    } else {
        fileOptionMenu(file)
    }
}

let Options = document.querySelector(".Options");

function handlefolderOptions(file) {
    shower(fileOptionModel)
    currentDirId = file.getAttribute("directoryid");
    foldername = file.getAttribute("type");
    prveiousDri = currentDir;
    currentDir = currentDir + foldername + "/"
        // <span dirname="drive" dirid="">Drive/</span>
}


fileOptionMenu = (file) => {
    let filepath = file.getAttribute("fullpath");
    Options.innerHTML = (
        `
        <a target="_blank" onclick="fileOpenHandler(this)" href="${url+ "storage/" +file.getAttribute("fullpath")}">Open</a>
        <a onclick="closeFileOptionModel()" download href="${url+"storage/"+file.getAttribute("fullpath")}">Download</a>
        <a onclick="fileDeleteHandler(event, this)" filepath="${filepath}" href="${url+ "deleteFile"}">Delete</a>

        `
    )
    shower(fileOptionModel)
}

let fileOpenHandler = (option) => {
    console.log(option);
}

let fileDeleteHandler = (event, option) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("filepath", option.getAttribute("filepath"))
    fetch(option.getAttribute("href"), {
            headers: {
                'X-CSRF-TOKEN': csrfToken
            },
            method: "post",
            body: formData

        }).then(res => res.json())
        .then(data => {
            console.log(data);
            loadFilesAndFolder()
            closer(fileOptionModel)
        })
}
let fileMoveHandler = (event, option) => {
    event.preventDefault();
    console.log("Move", option);
    closer(fileOptionModel)

}