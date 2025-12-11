// -----------------------------
// Fixed IP parts and default values
// -----------------------------
const FIXED1 = "192";
const FIXED2 = "168";
const FIXED3 = "1";
const DEFAULT_LAST = "107";
const DEFAULT_PORT = "80";

// Initialize UI
document.getElementById("ip1").innerHTML = FIXED1;
document.getElementById("ip2").innerHTML = FIXED2;
document.getElementById("ip3").innerHTML = FIXED3;
document.getElementById("ip4").innerHTML = DEFAULT_LAST;
document.getElementById("status").innerHTML = "Disconnected";
document.getElementById("port").innerHTML =  DEFAULT_PORT;
document.getElementById("espLink").href = `http://${FIXED1}.${FIXED2}.${FIXED3}.${DEFAULT_LAST}:${DEFAULT_PORT}/`;

// -----------------------------
// Connect WebSocket to ESP32
// -----------------------------
const WS_PORT = 80; // ESP32 WebSocket port
const socket = new WebSocket(`ws://${FIXED1}.${FIXED2}.${FIXED3}.107:${WS_PORT}/ws`);

// When WebSocket opens
socket.onopen = () => {
    document.getElementById("status").innerHTML = "Connected";
    console.log("Connected to ESP32 WebSocket");
};

// When a message arrives (ESP32 sends last octet)
socket.onmessage = (event) => {
    let data = JSON.parse(event.data);

    if (data.ip_last) {
        document.getElementById("ip4").innerHTML = data.ip_last;
    }
    if (data.http_port) {
        document.getElementById("port").innerHTML = data.http_port;
    }

    // Update clickable link dynamically
    const last = data.ip_last || DEFAULT_LAST;
    const port = data.http_port || DEFAULT_PORT;
    document.getElementById("espLink").href = `http://${FIXED1}.${FIXED2}.${FIXED3}.${last}:${port}/`;
    document.getElementById("espLink").innerHTML = document.getElementById("espLink").href;
};


// When WebSocket closes
socket.onclose = () => {
    document.getElementById("status").innerHTML = "Disconnected";
    document.getElementById("ip4").innerHTML = DEFAULT_LAST;
    document.getElementById("espLink").href =
    `http://${FIXED1}.${FIXED2}.${FIXED3}.${DEFAULT_LAST}:${DEFAULT_PORT}/`;
document.getElementById("espLink").innerHTML =
    `http://${FIXED1}.${FIXED2}.${FIXED3}.${DEFAULT_LAST}:${DEFAULT_PORT}/`;
};
socket.onerror = (err) => {
    console.log("WebSocket error:", err);
    document.getElementById("status").innerHTML = "Disconnected";
};
