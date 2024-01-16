// import io from "socket.io-client";
import io from '@hyoga/uni-socket.io';
import httpPort from "./port";
var realPort=''
if(window&&window.hasOwnProperty("windowPort")){
	 realPort= window.windowPort
}else{
	realPort= httpPort;
}

let socketUrl = `http://154.92.15.136:${realPort.socketPort}`;
if (window&&window.location.hostname == "localhost") {
  socketUrl = `http://127.0.0.1:${realPort.socketPort}`;
}

const socket = io(socketUrl, {
  query: {},
  transports: [ 'websocket', 'polling' ],
  timeout: 5000,
});
// const socket = io(socketUrl);
socket.on("connect", () => {
  console.log("连接成功");
});
export default socket;
