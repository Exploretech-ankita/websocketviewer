# websocketviewer
This web simply fetches the massage from the ESP 32 server through websocket and show it ....  
Here Js is used for the connection building . ( Websocket API is used here )  
For the backend part I have used the flask of python  
The ##interesting part is that  
The one qr code is given which can be used to scan and web can be used from phone also  
#Use  
**"pyinstaller --onefile --add-data "index.html;." --add-data "script.js;." --add-data "style.css;." app.py"** run this command to convert this in .exe mode to avoid the local IP problem 
