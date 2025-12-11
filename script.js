let ws;

// Build websocket URL from editable input boxes
function getWSUrl() {
    const ip1 = document.getElementById("ip1").value;
    const ip2 = document.getElementById("ip2").value;
    const ip3 = document.getElementById("ip3").value;
    const ip4 = document.getElementById("ip4").value;
    const port = document.getElementById("port").value;

    const url = `ws://${ip1}.${ip2}.${ip3}.${ip4}:${port}/`;
    document.getElementById("espLink").value = url;
    return url;
}

// Connect WebSocket
function connectWebSocket() {
    const url = getWSUrl();
    ws = new WebSocket(url);

    ws.onopen = () => {
        document.getElementById("status").innerText = "Connected";
        document.getElementById("status").style.background = "lightgreen";
        console.log("Connected to", url);
    };

    ws.onclose = () => {
        document.getElementById("status").innerText = "Disconnected";
        document.getElementById("status").style.background = "salmon";
    };

    ws.onerror = () => {
        document.getElementById("status").innerText = "Error";
        document.getElementById("status").style.background = "orange";
    };

    ws.onmessage = (msg) => {
        console.log("Received:", msg.data);

        if (msg.data.startsWith("IP:")) {
            const ip = msg.data.replace("IP:", "");
            document.getElementById("fetchedIP").innerText = ip;
        }
    };
}

// Button event for fetching IP
document.getElementById("fetchBtn").addEventListener("click", () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        connectWebSocket();
        setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) ws.send("GET_IP");
        }, 500);
    } else {
        ws.send("GET_IP");
    }
});
