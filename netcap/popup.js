const app = {
    file: {
        handle: null,
        writable: null,
    }
};


let toggleButton = document.getElementById("toggleButton");
toggleButton.addEventListener("click", async () => {
    if (!app.file.writable) {
        const handle = await window.showSaveFilePicker();
        const writable = await handle.createWritable();
        console.log(`opened ${handle.name}`);
        app.file.handle = handle;
        app.file.writable = writable;
        toggleButton.style.backgroundColor = "red";
    } else {
        await app.file.writable.close();
        console.log(`saved ${app.file.handle.name}`);
        app.file.handle = null;
        app.file.writable = null;
        toggleButton.style.backgroundColor = "gray";
    }
})


chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    const isProbe = request.action === "probe";
    if (isProbe) {
        console.log(request);
    }
    if (app.file.writable) {
        const line = `${JSON.stringify(request)}\n`
        await app.file.writable.write(line);
        if (isProbe) {
            console.log("wrote probe request");
        }
    } else {
        if (isProbe) {
            console.log("file is currently closed");
        }
    }
    sendResponse({action: "ack", sender: "popup"});
});
