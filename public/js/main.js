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
let root = "Drive/"
let rootId = 0;
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
    formData.append("currentDir", root.replace(/^\/+|\/+$/g, ""));
    formData.append("currentId", rootId);
    // console.log(rootId);
    closer(fileModal);
    let ajax = new XMLHttpRequest();
    ajax.upload.addEventListener('progress', updateProgress, false);
    uploadProgressDiv.style.display = "block"
    ajax.addEventListener('load', transferComplete, false);
    ajax.addEventListener('error', transferFailed, false)
    ajax.addEventListener('error', transferCanceled, false)

    ajax.onreadystatechange = function() {
        if (ajax.readyState == XMLHttpRequest.DONE) {
            // console.log(ajax.response);
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
    fetchFolderData(rootId)
    progressDetails.innerHTML = "File Uploaded Successfull!"
}

function transferFailed(e) {
    // console.log(e);
}

function transferCanceled(e) {
    // console.log(e);
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
        formData.append("currentDir", root);
        formData.append("currentId", rootId);
        // console.log(root + forlderName + "/");
        // console.log(rootId);
        ajax.onreadystatechange = function() {
            if (ajax.readyState == XMLHttpRequest.DONE) {
                fetchFolderData()
                    // console.log(ajax.response);
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

let fetchFolderData = () => {
    // console.log(rootId);
    fetch(url + "getFolderData/" + rootId, {
        method: "get",
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
    }).then(res => res.json()).then(folderInnerData => {
        // console.log(folderInnerData);
        if (folderInnerData && folderInnerData.length && folderInnerData.length > 0) {
            loadFilesAndFolder(folderInnerData)
            handDirectoriesLinks()
        } else {
            content.innerHTML = "Folder Empty!"
        }

    })
}

// load files and folder
function loadFilesAndFolder(dirDatadata) {

    if (dirDatadata && dirDatadata.length > 0) {
        content.innerHTML = "";
        let extensions = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'doxs', 'xlsx'];
        for (let file of dirDatadata) {
            content.innerHTML += (`
            <div fullPath="${file.fullPath}" class="file" directoryId = "${file.id}" type="${file.type}">
            <div class="fileOption">
                    <div class="fileOptionMenuIcon" >
                        <span class="AllfileOption"><i class="fa fa-ellipsis-v"></i></span>
                    </div>
                    <div class="options"></div>
                </div>
                <img src="${url + extensions.indexOf(file.extension) ? "images/" +file.extension : 'images/other' }.png" alt="">
                <div class="fileDescription">
                <p class="filename">${file.fullname}</p>
                </div>
                ${file.importants == 1 ? "<div title='Important File' class='important'>i</div>" : ""}
            </div>
    `)

            // set current directoryId
            let LoadedFiles = document.querySelectorAll(".file")
            for (let file of LoadedFiles) {
                file.children[0].onclick = (e) => {
                    e.stopPropagation();
                    handleFileFolderClickEvent(file)
                }
            }
        }
    } else {
        content.innerHTML = "Loading...";
        let extensions = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'doxs', 'xlsx'];
        let files;
        fetch(url + "getfiles", {
            headers: {
                'X-CSRF-TOKEN': csrfToken
            }
        }).then(res => res.json()).then(data => {
            files = data;
            content.innerHTML = "";
            for (let file in files) {

                content.innerHTML += (`
        <div fullPath="${files[file].fullPath}" class="file" directoryId = "${files[file].id}" type="${files[file].type}">

        <div class="fileOption">
                <div class="fileOptionMenuIcon" >
                    <span class="AllfileOption"><i class="fa fa-ellipsis-v"></i></span>
                </div>
                <div class="options"></div>
            </div>
            <img src="${url + extensions.indexOf(files[file].extension) ? "images/" +files[file].extension : 'images/other' }.png" alt="">
            <div class="fileDescription">
            <p class="filename">${files[file].fullname}</p>

            </div>
            ${files[file].importants == 1 ? "<div title='Important File' class='important'>i</div>" : ""}
        </div>
`)

                // set current directoryId
                let LoadedFiles = document.querySelectorAll(".file")
                for (let file of LoadedFiles) {
                    file.children[0].onclick = (e) => {
                        e.stopPropagation();
                        handleFileFolderClickEvent(file)
                    }
                }
            }
        })
    }

}
loadFilesAndFolder();

function handleFileFolderClickEvent(file) {

    if (file.getAttribute("type") == "folder") {
        Options.innerHTML = "Loading...";
        handlefolderOptions(file)
    } else {
        Options.innerHTML = "Loading..."
        fileOptionMenu(file)
    }
}
let Options = document.querySelector(".Options");

function handlefolderOptions(file) {
    // console.log(file);
    let filepath = file.getAttribute("fullpath");
    shower(fileOptionModel)
    Options.innerHTML = (
            `
        <a fullpath="${file.getAttribute("fullpath")}" directoryid="${file.getAttribute("directoryid")}" onclick="FolderOpenHandler(event, this)" href="${url+ "storage/" +file.getAttribute("fullpath")}">Open</a>
        <a target="_blank" onclick="closeFileOptionModel()" download href="${url+"storage/"+file.getAttribute("fullpath")}">Download</a>
        <a onclick="fileDeleteHandler(event, this)" filepath="${filepath}" href="${url+ "deleteFile"}">Delete</a>
        ${file.children[3] && file.children[3].getAttribute("class") == "important" ? `<a onclick="normalizeFileHandler(event, this)" filepath="${filepath}" href="${url+ "normalizeFile/"+file.getAttribute("directoryid")}">Normalize</a>`: `<a onclick="fileImportantHandler(event, this)" filepath="${filepath}" href="${url+ "importantFile/"+file.getAttribute("directoryid")}">Important</a>`}
        `
        )
        // <span dirname="drive" dirid="">Drive/</span>
}
fileOptionMenu = (file) => {
        let filepath = file.getAttribute("fullpath");
        Options.innerHTML = (
                `
        <a target="_blank" onclick="fileOpenHandler(event, this)" href="${url+ "storage/" +file.getAttribute("fullpath")}">Open</a>
        <a target="_blank" onclick="closeFileOptionModel()" download href="${url+"storage/"+file.getAttribute("fullpath")}">Download</a>
        <a onclick="fileDeleteHandler(event, this)" filepath="${filepath}" href="${url+ "deleteFile"}">Delete</a>
        ${file.children[3] && file.children[3].getAttribute("class") == "important" ? `<a onclick="normalizeFileHandler(event, this)" filepath="${filepath}" href="${url+ "normalizeFile/"+file.getAttribute("directoryid")}">Normalize</a>`: `<a onclick="fileImportantHandler(event, this)" filepath="${filepath}" href="${url+ "importantFile/"+file.getAttribute("directoryid")}">Important</a>`}
        `
    )
    shower(fileOptionModel)
}
let fileOpenHandler = (e, option) => {
    closer(fileOptionModel);
}
let FolderOpenHandler = (e, option) => {
    e.preventDefault();
    // console.log(option);
    closer(fileOptionModel);
    // console.log(option);
    let fullpath = option.getAttribute("fullpath")
    rootId = option.getAttribute("directoryid");
    root = fullpath.replace(/^\/+|\/+$/g, "")+"/";
    // console.log(rootId);
    HeaderPathHandler(fullpath)
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

            loadFilesAndFolder()
            closer(fileOptionModel)
        })
}
let fileMoveHandler = (event, option) => {
    event.preventDefault();
    closer(fileOptionModel)
}
let closeFileOptionModel = (event, option) => {
    // event.preventDefault();
    closer(fileOptionModel)
}
let fileImportantHandler = (event, option) => {
    event.preventDefault();
    fetch(option.getAttribute("href"), {
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        method: "put"
    }).then(res => res.json()).then(data => {
        // console.log(data)
        loadFilesAndFolder();
        closer(fileOptionModel)
    })
}
let normalizeFileHandler = (event, option) => {
    event.preventDefault();
    fetch(option.getAttribute("href"), {
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        method: "put"
    }).then(res => res.json()).then(data => {
        // console.log(data)
        loadFilesAndFolder();
        closer(fileOptionModel)
    })
}
function handDirectoriesLinks(){
    let folders = filesHeading.children;
    for(let element of folders){
        if (element) {
            element.onclick = ()=>{
                let elementId = element.getAttribute("thisdirid")
                console.log(element);
                if (elementId && elementId > 0) {
                    rootId = elementId;
                    root = element.getAttribute("fullpath").replace(/^\/+|\/+$/g, "")+"/";
                    HeaderPathHandler()
                    fetchFolderData(rootId)
                    // console.log(elementId);
                }else{
                    loadFilesAndFolder()
                    filesHeading.innerHTML = `<span dirname="drive" dirid="">Drive/</span>`
                }
            }
        }else{
            loadFilesAndFolder()
            filesHeading.innerHTML = `<span dirname="drive" dirid="">Drive/</span></h1>`
        }
    };
}
handDirectoriesLinks()

let HeaderPathHandler = async () => {
    // console.log(root);
    filesHeading.innerHTML = `<span dirname="drive" dirid="">Drive/</span>`
    // console.log(fullpath);
    let myroot = root.replace("//","/");
     myroot = myroot.replace(/^\/+|\/+$/g,"");
    // console.log(myroot);
    let pathArray = myroot.split("/");
    let spans = [];
    pathArray.forEach(element => {
        console.log(element);

        fetch(url+"getfolderInfo/"+element, {
            method:"get",
            headers:{
                'X-CSRF-TOKEN': csrfToken
            },
        }).then(res => res.json()).then(data =>{
            // console.log(data);
            if (data[0] && data[0].id) {
                    data.forEach(folderData => {
                    // console.log("folderData", folderData);
                    let span = document.createElement("span")
                    span.setAttribute("fullname", folderData.fullname);
                    span.setAttribute("fullpath", folderData.fullPath);
                    span.setAttribute("folder_dir_id", folderData.dir_id);
                    span.setAttribute("thisdirid", folderData.id);
                    span.setAttribute("type", folderData.type);
                    span.innerHTML=folderData.fullname+"/"
                    root += folderData.fullname+"/"
                    rootId = folderData.id

                    spans.push(span);

                });
            }

        });

    });
            console.log(spans);
             filesHeading.append(spans.join(""))
            fetchFolderData(rootId)

}