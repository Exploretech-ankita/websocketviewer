import asyncio
import websockets
import socket
import threading
from flask import Flask, send_from_directory, render_template_string
import sys
import os
import qrcode
from io import BytesIO
import base64

# --------------------
# Flask setup
# --------------------
app = Flask(__name__)

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS  # PyInstaller temp folder
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# Detect local IP
local_ip = socket.gethostbyname(socket.gethostname())
port = 5000

# Generate QR code as base64 string
def generate_qr_base64(url):
    qr = qrcode.QRCode(box_size=6, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str

qr_img_str = generate_qr_base64(f"http://{local_ip}:{port}")

# --------------------
# Flask routes
# --------------------
@app.route("/")
def index():
    # Inject QR code into HTML dynamically
    html_file = resource_path("index.html")
    with open(html_file, "r", encoding="utf-8") as f:
        html_content = f.read()

    # Replace placeholder <img id="qrImg"> src with generated QR
    html_content = html_content.replace(
        'id="qrImg" src=""',
        f'id="qrImg" src="data:image/png;base64,{qr_img_str}"'
    )
    return render_template_string(html_content)

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(resource_path("."), path)

# --------------------
# WebSocket server
# --------------------
async def ws_handler(websocket, path):
    print("Client connected")
    try:
        async for message in websocket:
            print("Received:", message)
            if message == "GET_IP":
                if ser.in_waiting > 0:
                    esp_data = ser.readline().decode().strip()
                    await websocket.send(esp_data)
                else:
                    await websocket.send("NO_DATA")

            
    except:
        print("Client disconnected")

def run_ws():
    async def ws_main():
        async with websockets.serve(ws_handler, "0.0.0.0", 81):
            print("WebSocket server running on ws://<IP>:81")
            await asyncio.Future()  # run forever

    asyncio.run(ws_main())


# --------------------
# Start servers
# --------------------
if __name__ == "__main__":
    threading.Thread(target=run_ws).start()
    threading.Thread(target=lambda: app.run(host="0.0.0.0", port=port)).start()
    print(f"Open your browser at http://{local_ip}:{port} or scan the QR code above")
    input("Servers running. Press Enter to exit...")
