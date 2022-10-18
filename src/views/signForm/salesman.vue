<template>
    <div class="salesman-box">
        <el-card class="box-card" style="margin: 20px 40px">
            <div class="top-toolbar">
                <el-button style="margin-right: 20px" type="primary" @click="addSalasman">添加销售</el-button>
                <el-input v-model="value" style="width: 20%" clearable placeholder="输入关键词搜索" @clear="clearInput" @change="selectUser" />
            </div>
            <el-table
                ref="multipleTable"
                :data="tableData.records"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                />
                <el-table-column
                    v-if="false"
                    prop="id"
                    label="id"
                    width="120"
                />
                <el-table-column
                    prop="username"
                    label="用户名"
                    width="120"
                />
                <el-table-column
                    prop="nickname"
                    label="昵称"
                    width="120"
                />
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="150"
                >
                    <template #default="scope">
                        {{
                            formatDateDay(scope.row.createTime)
                        }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="联系方式"
                    show-overflow-tooltip
                />
                <el-table-column
                    label="状态"
                    show-overflow-tooltip
                >
                    <template #default="scope">
                        <el-switch
                            :value="scope.row.isBlock"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            @change="start(scope.row.id,scope)"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    show-overflow-tooltip
                >
                    <template #default="scope">
                        <div class="row-toolbar">
                            <el-button type="text" size="small" @click="delSalesman(scope.row.id)">删除</el-button>
                            <el-button type="text" size="small" @click="alterSalesman(scope.row)">编辑</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="text-align: center; margin: 20px 40px 0">
                <el-pagination
                    :current-page="current"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
        <!-- 添加/编辑 -->
        <el-dialog v-model="dialogVisible" :title="diaTitle">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="请输入昵称" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input
                        v-model="form.phone"
                        placeholder="请输入手机号"
                        οninput="value=value.replace(/[^\d]/g,'');if(value.length > 11)value = value.slice(0, 11)"
                    />
                </el-form-item>
                <el-form-item v-if="isAdd" label="密码" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="密码" />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" placeholder="请输入备注" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {
    salesmanList,
    addSal,
    delSalesman,
    disableUser,
    checkUseNmae
} from '@/api/salesman'
import { formatDate } from '@/util/filter'
export default {
    name: 'Salesman',
    data() {
        // 用户名校验
        var checkName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'))
            } else {
                let params = {
                    username: value
                }
                checkUseNmae(params).then(res => {
                    if (res.code === 200) {
                        if (res.data) {
                            callback()
                        } else {
                            callback(new Error('用户名不可用'))
                        }
                    } else {
                        callback(new Error(res.msg))
                    }
                })

            }
        }
        // 手机号校验
        var validatorPhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('手机号不能为空'))
            } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('手机号格式错误'))
            } else {
                callback()
            }
        }
        return {
            tableData: [], // 列表数据
            current: 1, // 当前页
            size: 10, // 每页条数
            total: 0, // 总条数
            multipleSelection: [],
            options: [],
            value: '',
            diaTitle: '', // 弹出层标题
            form: {
                username: '', // 用户名
                nickname: '', // 昵称
                phone: '', // 手机号
                password: '', // 密码
                remark: '' // 备注
            }, // 表单数据
            rules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' },
                    { validator: checkName, trigger: 'blur' }
                ],
                nickname: [
                    { required: true, message: '昵称不能为空', trigger: 'blur' }
                ],
                phone: [
                    { required: true, validator: validatorPhone, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            },
            dialogVisible: false,
            isAdd: true
        }
    },
    computed: {
        // 转换时间
        formatDateDay() {
            return function(value) {
                var date = new Date(value)
                return formatDate(date, 'yyyy-m-d')
            }
        }
    },
    mounted() {
        this.getAllSalesman()
    },
    methods: {
        // 获取销售人员列表
        getAllSalesman(name) {
            let params = {
                current: this.current,
                size: this.size,
                name: name
            }
            salesmanList(params).then(res => {
                this.tableData = res.data
                this.total = parseInt(res.data.total)
                this.options = res.data.records
            })
        },
        // 多选行使用
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        // 每页条数
        handleSizeChange(val) {
            this.size = val
        },
        // 当前页
        handleCurrentChange(val) {
            this.current = val
        },
        // 添加销售
        addSalasman() {
            this.dialogVisible = true
            this.isAdd = true
            this.diaTitle = '添加'
        },
        // 提交表单
        onSubmit() {
            addSal(JSON.stringify(this.form)).then(res => {
                if (res.code === 200) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    })
                    this.dialogVisible = false // 关闭
                    this.form = {
                        username: '',
                        nickname: '',
                        phone: '',
                        password: '',
                        remark: ''
                    } // 清空表单
                    this.getAllSalesman() // 重新获取数据
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
        // 删除
        delSalesman(sid) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    sid: sid
                }
                delSalesman(params).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        })
                        this.getAllSalesman() // 重新获取数据
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        // 编辑
        alterSalesman(row) {
            this.isAdd = false
            this.dialogVisible = true
            this.form = row
            this.diaTitle = '编辑'
        },
        // 修改账号状态
        start(id, scope) {
            if (!scope.row.isBlock) {
                this.$confirm('此账号将会被禁用, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        sid: id
                    }
                    disableUser(data).then(res => {
                        if (res.code === 200) {
                            scope.row.isBlock = !scope.row.isBlock
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            })
                        }
                    }).catch(err => {
                        this.$message.error(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消禁用'
                    })
                })
            } else {
                let data = {
                    sid: id
                }
                disableUser(data).then(res => {
                    if (res.code === 200) {
                        scope.row.isBlock = !scope.row.isBlock
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        })
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            }

        },
        // 搜索
        selectUser(val) {
            this.getAllSalesman(val)
        },
        // 清空输入框
        clearInput() {
            this.value = ''
            let name = null
            this.getAllSalesman(name)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
