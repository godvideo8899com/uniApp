"use strict";
import httpPort from "./port";
// 变量可自行添加修改
let socketUrl = `http://154.92.15.136:${httpPort.port}/api`;
if (window&& window.location.hostname == "localhost") {
	socketUrl = `http://192.178.223.143:${httpPort.port}/api`;
}
export default { //存放变量的容器
	appid: '',
	baseUrl:socketUrl
    // baseUrl: 'http://192.178.223.143:8000/api',
}
/**
 * 	appid : 		小程序appid
 *  baseUrl : 		服务端域名
 */
