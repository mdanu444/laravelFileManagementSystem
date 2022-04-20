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