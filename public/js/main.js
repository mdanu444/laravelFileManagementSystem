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
let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

let currentDir = "Drive/"

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
folderCreator.onclick = () => {
    closer(folderModal);
}

let fileOptionMenu = document.querySelector(".fileOptionMenuIcon span");
let fileOptionModel = document.querySelector(".fileOptionModel");
let OptionCloser = document.querySelector(".OptionCloser");
fileOptionMenu.onclick = (e) => {
    e.preventDefault();
    let fileId = e.target.getAttribute("fileid");
    shower(fileOptionModel)

}

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


    ajax.open("post", "http://localhost:8000/fileUpload")
    ajax.setRequestHeader('X-CSRF-TOKEN', csrfToken)
    ajax.send(formData)
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
    progressDetails.innerHTML = "File Uploaded Successfull!"
}

function transferFailed(e) {
    console.log(e);
}

function transferCanceled(e) {
    console.log(e);
}
