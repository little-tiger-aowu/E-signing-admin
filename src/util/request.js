import axios from "axios"
// import Vue from 'vue'
import store from "@/store/index"
import { ElMessage } from "element-plus"
import qs from "qs"
import {baseUrl} from "./baseUrl"
import router from "@/router"
const toLogin = () => {
	router.push({
		path: "/login",
		query: {
			redirect: router.currentRoute.fullPath
		}
	})
}
const service = axios.create({
	baseURL: baseUrl,
	timeout: 5000, // 请求超时时间
	transformRequest: [function (data) {
		if (Object.prototype.toString.call(data) === "[object FormData]") {
			return data
		}
		if (Object.prototype.toString.call(data) === "[object String]") {
			return data
		}
		data = qs.stringify(data)
		return data
	}]
})

// request拦截器
service.interceptors.request.use(
	config => {
		let token = store.state.user.token
		if(token){
			config.headers["Authorization"] =`Bearer ${token}`
		}
		if(config.Accept == "json"){
			config.headers["Content-Type"] = "application/json"
		}else{
			config.headers["Content-Type"] = "application/x-www-form-urlencoded"
		}
		return config
	},
	error => {
		// Do something with request error
		console.log(error) // for debug
		Promise.reject(error)
	}
)

// let toastFail, errorFail;
// respone拦截器
service.interceptors.response.use(
	response => {
		const res = response.data
		if (res.code == 401 || res.code == 402 || res.code == 403) {
			ElMessage({
				message:res.msg,
				type: "error"
			})
			toLogin()
			return
		}
		return response.data
	},
	error => {
		let message = error.message
		if (message == "Network Error") {
			message = "后端网络故障"
		} else if (message.includes("timeout")) {
			message = "接口请求超时"
		} else if (message.includes("Request failed with status code")) {
			message = "接口" + message.substr(message.length - 3) + "异常"
		}
		ElMessage({
			message,
			type: "error"
		})
		return Promise.reject(error)
	}
)

export default service
