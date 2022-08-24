chrome.devtools.network.onRequestFinished.addListener(request => {
    if (request.response.content.mimeType === "application/json") {
        request.getContent((body) => {
            const message = {
                url: request.request.url,
                body: body
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

const consoleLog = (obj) => {
    // can't use console.log() from devtools
    // https://developer.chrome.com/docs/extensions/mv3/devtools/#evaluating-js

    if (obj) {
        const line = JSON.stringify(obj).slice(0, 1000); // set length limit to avoid console.log error
        chrome.devtools.inspectedWindow.eval(`console.log('${line}');`)
    }
}
