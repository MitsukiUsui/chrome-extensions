const app = {
    log: true,
    filter: {
        url: null,
    }
};

const isTargetRequest = (request) => {
    if (request.response.content.mimeType !== "application/json") {
        return false;
    }
    if (app.filter.url) {
        if (!request.request.url.match(app.filter.url)) {
            return false;
        }
    }
    return true;
}

const consoleLog = (obj) => {
    // can't use console.log() from devtools
    // https://developer.chrome.com/docs/extensions/mv3/devtools/#evaluating-js

    if (obj) {
        const line = JSON.stringify(obj).slice(0, 1000); // set length limit to avoid console.log error
        chrome.devtools.inspectedWindow.eval(`console.log('${line}');`)
    }
}

chrome.devtools.network.onRequestFinished.addListener(request => {
    if (isTargetRequest(request)) {
        request.getContent((content) => {
            const message = {
                timestamp: Date.now(),
                url: request.request.url,
                content: content
            }
            chrome.runtime.sendMessage(message);
            if (app.log) {
                consoleLog(message);
            }
        })
    }
});


let probeButton = document.getElementById("probeButton");
probeButton.addEventListener("click", () => {
    const message = {
        action: "probe",
        sender: "panel"
    }
    consoleLog(message);
    chrome.runtime.sendMessage(message, function (response) {
        consoleLog(response);
    });
})

let logInput = document.getElementById("logInput");
logInput.addEventListener("change", () => {
    app.log = logInput.checked;
    consoleLog(`updated log config : "${app.log}"`);
})

let urlInput = document.getElementById("urlInput");
urlInput.addEventListener("input", (event) => {
    const value = event.target.value;
    app.filter.url = value;
    consoleLog(`updated url filter: "${value}"`);
})
