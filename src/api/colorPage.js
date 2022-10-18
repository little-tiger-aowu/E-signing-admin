import request from "@/util/request"

//添加彩页文件
export function add_file(params){
	return request({
		url:"/brochure_files/add_file",
		method:"GET",
		params
	})
}

//删除彩页
export function removePage(data){
	return request({
		url:"/brochure_files/remove",
		method:"POST",
		data
	})
}

//用户获取表单彩页
export function form_brochures(params){
	return request({
		url:"/form_brochures/page",
		method:"GET",
		params
	})
}

//新增表单的彩页信息
export function addNewBrochures(data){
	return request({
		url:"/form_brochures",
		method:"POST",
		data
	})
}

//批量删除表单的彩页信息
export function removeBrochures(data){
	return request({
		url:"/form_brochures/remove",
		method:"POST",
		data
	})
}

//批量删除表单的彩页信息
export function not_exitbrochure(params){
	return request({
		url:"/form_brochures/not_exit",
		method:"GET",
		params
	})
}