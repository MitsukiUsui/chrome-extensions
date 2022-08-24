const app = {
    file: {
        handle: null,
        writable: null,
        name: null
    }
};

let openButton = document.getElementById("openButton");
openButton.addEventListener("click", async () => {
    console.log("openButton is clicked");
    const handle = await window.showSaveFilePicker();
    app.file.handle = handle;
    app.file.writable = await handle.createWritable();
    console.log("open");
})


let saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", async () => {
    console.log("saveButton is clicked");
    if (app.file.writable) {
        await app.file.writable.close();
        app.file.handle = null;
        app.file.writable = null;
        console.log("close")
    } else {
        console.warn("handle does not exist")
    }
})

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    console.log(request);
    if (app.file.writable) {
        const line = `${JSON.stringify(request)}\n`
        await app.file.writable.write(line);
        console.log("write");
    } else {
        console.warn("handle does not exist");
    }
    if (request.action === "probe") {
        sendResponse({action: "ack", sender: "popup"});
    }
});
