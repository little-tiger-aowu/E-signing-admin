import request from "@/util/request"

//登陆
export function loginIn(data){
	return request({
		url:"/authentication/login",
		method:"POST",
		data
	})
}

//获取用户权限
export function getJWTUserRoles(){
	return request({
		url:"/authorization/getJWTUserRoles",
		method:"POST",
	})
}

//获取七牛云token
export function upload_token(){
	return request({
	  url:'/common/upload_token',
	  method:'GET',
	})
  }


  //上传七牛云
  export function qiniupSynco(data) {
	return request({
		url: `http://up-z2.qiniup.com/thermo-fisher-sdg`,
		method: 'POST',
		data
	})
  }
