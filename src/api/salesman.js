import request from '@/util/request'

// 获取销售列表
export  function salesmanList(params) {
    return request({
        url: '/sysUser',
        method: 'GET',
        params
    })
}

// 添加/编辑 销售人员
export function addSal(data) {
    return request({
        Accept: 'json',
        url: '/sysUser',
        method: 'POST',
        data
    })
}

// 判断用户名是否可使用
export function checkUseNmae(params) {
    return request({
        url: '/sysUser/estimateUsername',
        method: 'GET',
        params
    })
}

// 删除销售人员
export function delSalesman(params) {
    return request({
        url: '/sysUser',
        method: 'DELETE',
        params
    })
}

// 停用账号
export function disableUser(data) {
    return request({
        url: '/sysUser/disableUsername',
        method: 'POST',
        data
    })
}


