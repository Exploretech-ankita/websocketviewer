// -----------------------------
// Fixed IP parts and defaults
// -----------------------------
const FIXED1 = "192";
const FIXED2 = "168";
const FIXED3 = "1";
const DEFAULT_LAST = "107";
let WS_PORT = 81;

// Show default IP
document.getElementById("ip1").innerHTML = FIXED1;
document.getElementById("ip2").innerHTML = FIXED2;
document.getElementById("ip3").innerHTML = FIXED3;
document.getElementById("ip4").innerHTML = DEFAULT_LAST;

document.getElementById("status").innerHTML = "Disconnected";

// Display link
function updateWSLink(lastOctet, port) {
    const link = `ws://${FIXED1}.${FIXED2}.${FIXED3}.${lastOctet}:${port}`;
    document.getElementById("espLink").href = link;
    document.getElementById("espLink").innerHTML = link;
}
updateWSLink(DEFAULT_LAST, WS_PORT);

// -----------------------------
// WebSocket Connect
// -----------------------------
function connectWS() {

    // use current values (not only default)
    const last = document.getElementById("ip4").innerHTML;
    const wsURL = `ws://${FIXED1}.${FIXED2}.${FIXED3}.${last}:${WS_PORT}`;

    const socket = new WebSocket(wsURL);

    socket.onopen = () => {
        document.getElementById("status").innerHTML = "Connected";
        console.log("Connected:", wsURL);
    };

    socket.onmessage = (event) => {
        let data;
        try {
            data = JSON.parse(event.data);
        } catch {
            console.log("Non-JSON:", event.data);
            return;
        }

        if (data.ip_last)
            document.getElementById("ip4").innerHTML = data.ip_last;

        if (data.ws_port)
            WS_PORT = data.ws_port;

        updateWSLink(
            data.ip_last || document.getElementById("ip4").innerHTML,
            WS_PORT
        );
    };

    socket.onclose = () => {
        document.getElementById("status").innerHTML = "Disconnected";

        setTimeout(connectWS, 1500); // auto reconnect
    };

    socket.onerror = () => {
        document.getElementById("status").innerHTML = "Error";
    };
}

connectWS();
