"use strict";const o=require("../common/vendor.js");let t="http://154.92.15.136:9000";window&&"localhost"==window.location.hostname&&(t="http://127.0.0.1:9000");const e=o.io(t,{query:{},transports:["websocket","polling"],timeout:5e3});e.on("connect",(()=>{console.log("连接成功")})),exports.socket=e;
