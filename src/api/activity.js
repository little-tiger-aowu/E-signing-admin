import request from '@/util/request'

// 获取活动表单列表
export function formsPage(params) {
    return request({
        Accept: 'json',
        url: '/forms/page',
        method: 'GET',
        params
    })
}

// 添加新活动
export function addforms(data) {
    return request({
        Accept: 'json',
        url: '/forms',
        method: 'POST',
        data
    })
}

// 修改活动
export function editforms(data) {
    return request({
        Accept: 'json',
        url: '/forms',
        method: 'PUT',
        data
    })
}

// 切换活动状态
export function update_status(data) {
    return request({
        url: '/forms/update_status',
        method: 'POST',
        data
    })
}

// 获取表单列表
export function by_form(params) {
    return request({
        url: '/form_datas/by_form',
        method: 'GET',
        params
    })
}

// 获取下载链接
export function downloadExl(formIdStr) {
    return request({
        url: `/form_datas/download?formIdStr=${formIdStr}`,
        method: 'GET'
    })
}

// 获取表单二维码
export function get_qrcode(formId) {
    return request({
        url: '/forms/get_qrcode',
        method: 'POST',
        params: { formId }
    })
}

// 获取彩页列表
export function brochureList(params) {
    return request({
        url: '/brochure_files/page',
        method: 'GET',
        params
    })
}

// 查询未停用账号的销售人员
export function getSysUserList(data) {
    return request({
        url: '/forms/listSysUser',
        method: 'POST',
        data
    })
}

