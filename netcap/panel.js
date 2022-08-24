const app = {
    filter: {
        url: null,
    }
};

chrome.devtools.network.onRequestFinished.addListener(request => {
    if (isTargetRequest(request)) {
        request.getContent((content) => {
            const message = {
                url: request.request.url,
                content: content
            }
            chrome.runtime.sendMessage(message);
            consoleLog(message);
        })
    }
});


let probeButton = document.getElementById("probeButton");
probeButton.addEventListener("click", async () => {
    const message = {
        action: "probe",
        sender: "panel"
    }
    consoleLog(message);
    chrome.runtime.sendMessage(message, function (response) {
        consoleLog(response);
    });
})

let urlInput = document.getElementById("urlInput");
urlInput.addEventListener("input", async (event) => {
    const value = event.target.value;
    app.filter.url = value;
    consoleLog(`updated url filter: "${value}"`);
})

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
