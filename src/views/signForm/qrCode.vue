<template>
    <el-card class="box-card" style="margin: 20px 40px">
        <el-button v-auth="'admin'" type="primary" @click="addHtShowfrom('ruleForm')">
            添加新活动
        </el-button>
        <el-button
            v-auth="'admin'"
            type="success"
            :disabled="downLoadId.length == 0 ? true : false"
            style="margin-left: 30px"
            @click="downLoadFroms"
        >
            数据批量下载
        </el-button>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" />
            <el-table-column label="活动名称">
                <template #default="scope">{{ scope.row.formName }}</template>
            </el-table-column>
            <!-- <el-table-column prop="qrCode" label="链接地址"> </el-table-column> -->
            <!-- <el-table-column label="状态">
                <template #default="scope">
                    <el-switch
                        @change="updateStatus(scope.row)"
                        v-model="scope.row.status"
                        inactive-color="#ff4949"
                        :active-text="
                            scope.row.status == true ? '进行中' : '已结束'
                        "
                    >
                    </el-switch></template
            ></el-table-column> -->
            <el-table-column label="创建时间">
                <template #default="scope">
                    {{
                        formatDateDay(scope.row.createTime)
                    }}
                </template>
            </el-table-column>
            <el-table-column label="开始时间">
                <template #default="scope">
                    {{
                        formatDateDay(scope.row.startTime)
                    }}
                </template>
            </el-table-column>
            <el-table-column label="结束时间">
                <template #default="scope">
                    {{
                        formatDateDay(scope.row.endTime)
                    }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template #default="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="handleClick(scope.row.id)"
                    >
                        查看表单信息
                    </el-button>
                    <el-button
                        v-auth="'admin'"
                        type="text"
                        size="small"
                        @click="editForm(scope.row)"
                    >
                        编辑
                    </el-button>
                    <el-button
                        v-auth="'admin'"
                        type="text"
                        size="small"
                        @click="getQcode(scope.row.id)"
                    >
                        下载活动二维码
                    </el-button>
                    <el-button
                        v-auth="'admin'"
                        type="text"
                        size="small"
                        @click="setcolorPage(scope.row)"
                    >
                        彩页管理
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="text-align: right; margin: 20px 40px 0">
            <el-pagination
                :page-size="pageData.size"
                :page-sizes="[10, 50, 100, 200]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
            />
        </div>
        <!--添加修改新活动-->
        <el-dialog v-model="addHtShow" :title="daigoTxt" width="50%" center>
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item
                    ref="formNameActive"
                    label="活动名称"
                    prop="formName"
                >
                    <el-input
                        v-model="ruleForm.formName"
                        clearable
                        placeholder="请输入活动名称"
                    />
                </el-form-item>
                <el-form-item ref="activeTimes" label="活动时间" required>
                    <el-col :span="11">
                        <el-form-item prop="startTime">
                            <el-date-picker
                                v-model="ruleForm.startTime"
                                type="year/month/date"
                                placeholder="选择日期"
                                style="width: 100%"
                                value-format="YYYY-MM-DD"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="endTime">
                            <el-date-picker
                                v-model="ruleForm.endTime"
                                type="year/month/date"
                                placeholder="选择日期"
                                style="width: 100%"
                                value-format="YYYY-MM-DD"
                            />
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item ref="message" label="所需信息" required>
                    <el-form-item
                        label="姓名"
                        prop="nameStatus"
                        label-width="100px"
                    >
                        <el-radio-group v-model="ruleForm.nameStatus">
                            <el-radio :label="0">不展示</el-radio>
                            <el-radio :label="1">展示非必填</el-radio>
                            <el-radio :label="2">展示且必填</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="单位"
                        prop="employerStatus"
                        label-width="100px"
                    >
                        <el-radio-group v-model="ruleForm.employerStatus">
                            <el-radio :label="0">不展示</el-radio>
                            <el-radio :label="1">展示非必填</el-radio>
                            <el-radio :label="2">展示且必填</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="部门"
                        prop="departmentStatus"
                        label-width="100px"
                    >
                        <el-radio-group v-model="ruleForm.departmentStatus">
                            <el-radio :label="0">不展示</el-radio>
                            <el-radio :label="1">展示非必填</el-radio>
                            <el-radio :label="2">展示且必填</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="省份"
                        prop="provinceStatus"
                        label-width="100px"
                    >
                        <el-radio-group v-model="ruleForm.provinceStatus">
                            <el-radio :label="0">不展示</el-radio>
                            <el-radio :label="1">展示非必填</el-radio>
                            <el-radio :label="2">展示且必填</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="地址"
                        prop="addressStatus"
                        label-width="100px"
                    >
                        <el-radio-group v-model="ruleForm.addressStatus">
                            <el-radio :label="0">不展示</el-radio>
                            <el-radio :label="1">展示非必填</el-radio>
                            <el-radio :label="2">展示且必填</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="手机号"
                        prop="phoneStatus"
                        label-width="100px"
                    >
                        <el-radio-group v-model="ruleForm.phoneStatus">
                            <el-radio :label="0">不展示</el-radio>
                            <el-radio :label="1">展示非必填</el-radio>
                            <el-radio :label="2">展示且必填</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="邮箱"
                        prop="emailStatus"
                        label-width="100px"
                    >
                        <el-radio-group v-model="ruleForm.emailStatus">
                            <el-radio :label="0">不展示</el-radio>
                            <el-radio :label="1">展示非必填</el-radio>
                            <el-radio :label="2">展示且必填</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="感兴趣的内容"
                        prop="interestLabelStatus"
                        label-width="100px"
                    >
                        <el-radio-group v-model="ruleForm.interestLabelStatus">
                            <el-radio :label="0">不展示</el-radio>
                            <el-radio :label="1">展示非必填</el-radio>
                            <el-radio :label="2">展示且必填</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="是否接收信息"
                        prop="futureReceiveStatus"
                        label-width="100px"
                    >
                        <el-radio-group v-model="ruleForm.futureReceiveStatus">
                            <el-radio :label="0">不展示</el-radio>
                            <el-radio :label="1">展示非必填</el-radio>
                            <el-radio :label="2">展示且必填</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- <div>
            <el-checkbox label="姓名"
              :checked="ruleForm.nameStatus"
              v-model="ruleForm.nameStatus"
              @change="nameChange"
            >
            </el-checkbox>
            <el-checkbox label="手机"
              :checked="ruleForm.phoneStatus"
              v-model="ruleForm.phoneStatus"
              @change="phoneChange"
            >
            </el-checkbox>
            <el-checkbox label="省份"
              :checked="ruleForm.provinceStatus"
              v-model="ruleForm.provinceStatus"
              @change="provinceChange"
            >
            </el-checkbox>
            <el-checkbox label="科室"
              :checked="ruleForm.departmentStatus"
              @change="departChange"
              v-model="ruleForm.departmentStatus"
            >
            </el-checkbox>
            <el-checkbox label="邮箱"
             :checked="ruleForm.emailStatus"
             v-model="ruleForm.emailStatus"
             @change="emailChange">
            </el-checkbox>
          </div> -->
                </el-form-item>
                <el-form-item
                    ref="departBU"
                    label="BU部门"
                    prop="business_unit"
                >
                    <el-select
                        v-model="ruleForm.business_unit"
                        :multiple="true"
                        placeholder="选择需要的部门"
                        @change="selectDepart"
                    >
                        <el-option
                            v-for="item in departSelectList"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item ref="salesMan" label="销售姓名" prop="salesman">
                    <el-select
                        v-model="ruleForm.salesman"
                        filterable
                        :multiple="true"
                        placeholder="选择销售人员"
                        @remove-tag="removeTag"
                    >
                        <el-option
                            v-for="item in salesmanList"
                            :key="item.id"
                            :value="item.id"
                            :label="item.nickname"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addHtShow = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!--表单信息-->
        <el-dialog v-model="isFromShow" title="表单信息" width="60%" center>
            <el-table
                ref="multipleTable"
                :data="fromsData"
                tooltip-effect="dark"
                style="width: 100%"
            >
                <el-table-column label="姓名" prop="name" />
                <el-table-column label="手机号" prop="phone" />
                <el-table-column label="邮箱" prop="email" />
                <el-table-column
                    label="科室"
                    prop="department"
                />
                <el-table-column label="省份" prop="province" />
                <el-table-column label="更新时间">
                    <template #default="scope">
                        {{
                            formatDateDay(scope.row.updateTime)
                        }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="text-align: center; margin: 20px 40px 0">
                <el-pagination
                    :page-size="frompageData.size"
                    :page-sizes="[10, 50, 100, 200]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="fromsDatatotal"
                    @current-change="handleCurrentChangeForm"
                    @size-change="handleSizeChangeForm"
                />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <a
                        :href="
                            'http://40.72.185.89:8116/sdg-form/form_datas/download' +
                                `?formIdStr=${formId}`
                        "
                        download="下载.xls"
                    >
                        <el-button type="primary" :loading="loading">
                            下载表单</el-button></a>
                </span>
            </template>
        </el-dialog>
        <!--彩页弹窗-->
        <el-dialog v-model="ispageColor" title="彩页信息" center width="60%">
            <el-select
                v-model="colorpagevalue"
                placeholder="Select"
                @change="qieColorpage"
            >
                <el-option label="已添加彩页" :value="0" />
                <el-option label="彩页库" :value="1" />
            </el-select>
            <el-select
                v-model="colorfrompageData.type"
                style="margin-left: 20px"
                placeholder="请选择"
                @change="qieColorpage"
            >
                <el-option
                    v-for="item in typeOPtion"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
            <el-input
                v-model="colorfrompageData.keyword"
                placeholder="请输入搜索内容"
                class="input-with-select"
                style="width: 260px; margin-left: 20px"
            >
                <template #append>
                    <el-button type="primary" @click="qieColorpage">
                        <el-icon class="el-icon"><Search /></el-icon>
                    </el-button>
                </template>
            </el-input>
            <el-table
                ref="pagecolorTable"
                :data="pagecolorData"
                tooltip-effect="dark"
                style="width: 100%"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column
                    label="彩页名称"
                    prop="fileName"
                />
                <el-table-column label="分类">
                    <template #default="scope">
                        {{
                            formatType(scope.row.type)
                        }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="彩页地址"
                    prop="fileUrl"
                />
                <el-table-column label="更新时间">
                    <template #default="scope">
                        {{
                            formatDateDay(scope.row.createTime)
                        }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <el-button
                            v-show="colorpagevalue == 0"
                            type="text"
                            size="small"
                            @click="rdelcolorPage(scope.row.id)"
                        >
                            删除
                        </el-button>
                        <el-button
                            v-show="colorpagevalue == 1"
                            type="text"
                            size="small"
                            @click="addcolorPage(scope.row)"
                        >
                            添加
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="text-align: center; margin: 20px 40px 0">
                <el-pagination
                    :page-size="colorfrompageData.size"
                    :page-sizes="[10, 50, 100, 200]"
                    :current-page="colorfrompageData.current"
                    layout="total, prev, pager, next, jumper"
                    :total="fromscolorDatatotal"
                    @current-change="handlecolorCurrentChangeForm"
                />
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import { ElMessageBox, ElMessage } from 'element-plus'
import {
    formsPage,
    addforms,
    update_status,
    by_form,
    downloadExl,
    get_qrcode,
    editforms,
    getSysUserList
} from '@/api/activity'
import { baseUrl } from '@/util/baseUrl'
import { formatDate } from '@/util/filter.js'
import depart from '@/util/department.js'
import {
    form_brochures,
    removeBrochures,
    addNewBrochures,
    not_exitbrochure
} from '@/api/colorPage'
import { Search } from '@element-plus/icons'
export default {
    name: 'PersonalExmination',
    components: {
        Search
    },
    data() {
        return {
            typeOPtion: [
                {
                    label: '全部',
                    value: ''
                },
                {
                    label: 'SDG',
                    value: 1
                },
                {
                    label: 'MBD',
                    value: 2
                },
                {
                    label: 'IDD',
                    value: 3
                },
                {
                    label: 'TDx',
                    value: 4
                },
                {
                    label: 'CC',
                    value: 5
                },
                {
                    label: 'BMK',
                    value: 6
                },
                {
                    label: 'CMS',
                    value: 7
                }
            ],
            formatDate,
            colorpagevalue: 0, // 彩页状态
            daigoTxt: '添加新活动',
            baseUrl,
            loading: false,
            ispageColor: false,
            formId: 0,
            downLoadId: '', // 批量下载的formId
            salesmanList: [], // 获取销售人员
            isFromShow: false,
            addHtShow: false,
            tableData: [],
            fromsData: [],
            pagecolorData: [],
            fromscolorDatatotal: 0,
            frompageData: {
                current: 1,
                size: 10,
                formId: ''
            },
            colorfrompageData: {
                current: 1,
                size: 10,
                formId: '',
                type: '',
                keyword: ''
            },
            fromsDatatotal: 0,
            total: 0,
            pageData: {
                current: 1,
                size: 10
            },
            departSelectList: depart, //
            id: '',
            nameStatus: true,
            phoneStatus: true,
            ruleForm: {
                id: '',
                formName: '',
                startTime: '',
                endTime: '',
                departmentStatus: 2, // 科室状态展示
                employerStatus: 2,
                nameStatus: 2, // 名称的展示状态
                phoneStatus: 2, // 手机状态展示
                addressStatus: 1,
                futureReceiveStatus: 2,
                provinceStatus: 2, // 省份展示状态
                emailStatus: 1, // 邮箱展示状态
                business_unit: '', // BU
                // removeSalesmans: [], // 要删除的销售员id(修改使用)
                salesman: [], // 销售姓名
                interestLabelStatus: 2
            },
            rules: {
                // 校验规则
                formName: [
                    {
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    }
                ],
                startTime: [
                    {
                        required: true,
                        message: '请选择日期',
                        trigger: 'change'
                    }
                ],
                endTime: [
                    {
                        required: true,
                        message: '请选择时间',
                        trigger: 'change'
                    }
                ],
                business_unit: [
                    {
                        required: true,
                        message: '请选择部门',
                        trigger: 'change'
                    }
                ],
                salesman: [
                    {
                        required: true,
                        message: '请输入销售姓名',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {
        // 转换时间
        formatDateDay() {
            return function(value) {
                var date = new Date(value)
                return formatDate(date, 'yyyy-m-d')
            }
        },
        // 类型转换
        formatType() {
            return function(value) {
                let textname = ''
                if (value == 0) {
                    textname = '无分类'
                }
                if (value == 1) {
                    textname = 'SDG'
                }
                if (value == 2) {
                    textname = 'MBD'
                }
                if (value == 3) {
                    textname = 'IDD'
                }
                if (value == 4) {
                    textname = 'TDx'
                }
                if (value == 5) {
                    textname = 'CC'
                }
                if (value == 6) {
                    textname = 'BMK'
                }
                if (value == 7) {
                    textname = 'CMS'
                }
                return textname
            }
        }
    },
    created() {
        this._getListData()
    },
    methods: {
        // 彩页管理
        qieColorpage() {
            this._getcolorpagedata()
        },
        // 删除彩页
        rdelcolorPage(val) {
            let data = {
                ids: val
            }
            ElMessageBox.confirm('您确认要删除该彩页么?', 'Warning', {
                confirmButtonText: '是的',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    removeBrochures(data).then(res => {
                        this.$message.success('删除成功！')
                        this._getcolorpagedata()
                    })
                })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '已取消'
                    })
                })
        },
        // 添加彩页
        addcolorPage(row) {
            let data = {
                fileName: row.fileName,
                fileUrl: row.fileUrl,
                formId: this.formId,
                type: row.type
            }
            console.log(data)
            ElMessageBox.confirm('您确认要添加该彩页么?', 'Warning', {
                confirmButtonText: '是的',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    addNewBrochures(data).then(res => {
                        this.$message.success('添加成功！')
                        this._getcolorpagedata()
                    })
                })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '已取消'
                    })
                })
        },
        // 管理按钮
        setcolorPage(row) {
            this.formId = row.id
            this.colorfrompageData.current = 1
            this.colorpagevalue = 0
            this.ispageColor = true
            this.colorfrompageData.formId = row.id
            this._getcolorpagedata()
        },
        // 获取列表
        _getcolorpagedata() {
            if (this.colorpagevalue == 0) {
                console.log(1)
                form_brochures(this.colorfrompageData).then(res => {
                    this.pagecolorData = res.data.records
                    this.fromscolorDatatotal = Number(res.data.total)
                })
            } else {
                console.log(2)
                not_exitbrochure(this.colorfrompageData).then(res => {
                    this.pagecolorData = res.data.records
                    this.fromscolorDatatotal = Number(res.data.total)
                })
            }
        },
        // 翻页
        handlecolorCurrentChangeForm(val) {
            this.colorfrompageData.current = val
            this._getcolorpagedata()
        },
        // 获取数据列表
        _getListData() {
            formsPage(this.pageData).then(res => {
                this.tableData = res.data.records
                this.total = Number(res.data.total)
                // console.log(res);
            })
        },
        timestampToTime(time) {
            // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var date = new Date(time)
            let y = date.getFullYear()
            let MM = date.getMonth() + 1
            MM = MM < 10 ? '0' + MM : MM
            let d = date.getDate()
            d = d < 10 ? '0' + d : d
            return y + '-' + MM + '-' + d
        },
        removeTag(val) {
            if (this.id) {
                if (this.ruleForm.removeSalesmans) {
                    this.oldSalesman.forEach(item => {
                        if (item.sysUserId === val) {
                            val = item.id
                        }
                    })
                    this.ruleForm.removeSalesmans.push(val)
                } else {
                    this.oldSalesman.forEach(item => {
                        if (item.sysUserId === val) {
                            val = item.id
                        }
                    })
                    this.ruleForm['removeSalesmans'] = []
                    this.ruleForm.removeSalesmans.push(val)
                }
                console.log(this.ruleForm.removeSalesmans)
            }
        },
        // 编辑表单
        editForm(row) {
            console.log(row)
            this.getSalesman()
            this.addHtShow = true
            this.daigoTxt = '修改活动'
            this.id = row.id
            let rowData = JSON.stringify(row)
            this.ruleForm = JSON.parse(rowData) // 活动名称
            this.ruleForm.startTime = this.timestampToTime(row.startTime) // 开始时间
            this.ruleForm.endTime = this.timestampToTime(row.endTime) // 结束时间
            if (row.businessUnit != '') {
                // BU部门
                this.ruleForm.business_unit = row.businessUnit.split(',')
            } else {
                this.ruleForm.business_unit = ''
            }
            if (row.participatorMarkets) {
                this.ruleForm.salesman = Array.from(row.participatorMarkets, x => x.sysUserId)
                this.oldSalesman = row.participatorMarkets
            } else {
                this.ruleForm.salesman = ''
            }
            // console.log(row);
        },
        addHtShowfrom(formName) {
            this.addHtShow = true
            this.getSalesman()
            this.$nextTick(() => {
                this.daigoTxt = '添加新活动'
                this.formId = ''
                this.id = ''
                this.ruleForm.formName = '' // 活动名称
                this.ruleForm.startTime = this.getNowFormatDate() // 开始时间
                this.ruleForm.endTime = '' // 结束时间
                this.ruleForm.salesman = '' // 销售姓名
                this.ruleForm.business_unit = '' // BU
                this.ruleForm.departmentStatus = 2
                this.ruleForm.nameStatus = 2
                this.ruleForm.employerStatus = 2
                this.ruleForm.phoneStatus = 2
                this.ruleForm.provinceStatus = 2
                this.ruleForm.emailStatus = 1
                this.ruleForm.addressStatus = 1
                this.ruleForm.interestLabelStatus = 2
                this.ruleForm.futureReceiveStatus = 2
            })

            // console.log(this.ruleForm.startTime);
        },
        // 添加活动
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        id: this.id,
                        formName: this.ruleForm.formName,
                        startTime: Date.parse(this.ruleForm.startTime),
                        endTime: Date.parse(this.ruleForm.endTime),
                        employerStatus: this.ruleForm.employerStatus,
                        departmentStatus: this.ruleForm.departmentStatus, // 科室状态展示
                        nameStatus: this.ruleForm.nameStatus, // 名称的展示状态
                        phoneStatus: this.ruleForm.phoneStatus, // 手机状态展示
                        provinceStatus: this.ruleForm.provinceStatus, // 省份展示状态
                        emailStatus: this.ruleForm.emailStatus, // 邮箱展示状态
                        futureReceiveStatus: this.ruleForm.futureReceiveStatus, // 未来是否状态
                        addressStatus: this.ruleForm.addressStatus, // 地址状态
                        businessUnit: this.ruleForm.business_unit.toString(), // 部门选择
                        removeSalesmans: null, // 要删除的销售员id(修改时使用)
                        salesmans: Array.from(this.ruleForm.salesman), // 销售姓名
                        interestLabelStatus: this.ruleForm.interestLabelStatus
                    }
                    // console.log(data)
                    if (this.id == '') {
                        addforms(JSON.stringify(data)).then(res => {
                            this.addHtShow = false
                            this._getListData()
                            if (res.code === 200) {
                                this.addHtShow = false
                                this._getListData()
                                this.$message.success({
                                    message: '添加成功',
                                    type: 'success'
                                })
                            } else {
                                this.$message(res.msg)
                            }
                        })
                        // console.log(this.ruleForm)
                    } else {
                        if (this.ruleForm.removeSalesmans) {
                            data['removeSalesmans'] = Array.from(this.ruleForm.removeSalesmans)
                        }
                        let a = []
                        this.oldSalesman.forEach(item => {
                            a.push(item.sysUserId)
                        })
                        data.salesmans = data.salesmans.filter(e => !a.includes(e))
                        // console.log(data)
                        editforms(JSON.stringify(data)).then(res => {
                            this.addHtShow = false
                            this._getListData()
                            if (res.code === 200) {
                                this.addHtShow = false
                                this._getListData()
                                this.$message.success({
                                    message: '修改成功',
                                    type: 'success'
                                })
                            } else {
                                this.$message(res.msg)
                            }
                        })
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 修改活动状态
        updateStatus(row) {
            console.log(row.status)
            let data = {
                formId: row.id,
                status: row.status
            }
            this.$confirm('确实修改活动状态', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    update_status(data).then(res => {
                        this.$message({
                            type: 'success',
                            message: '修改成功！'
                        })
                    })
                })
                .catch(() => {
                    row.status = !row.status
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
        },
        // 查看表单信息
        handleClick(val) {
            this.formId = val
            this.isFromShow = true
            this.frompageData.formId = val
            by_form(this.frompageData).then(res => {
                this.fromsData = res.data.records
                this.fromsDatatotal = Number(res.data.total)
                // console.log(res);
            })
            console.log(val)
        },
        // 查询销售人员
        getSalesman(val) {
            let data = {
                name: val
            }
            getSysUserList(data).then(res => {
                this.salesmanList = res.data
            })
        },
        // 批量下载数据
        downLoadFroms() {
            window.location.href =
                'http://40.72.185.89:8116/sdg-form/form_datas/download' +
                `?formIdStr=${this.downLoadId}`
        },
        // 下载表单
        downExl() {
            window.location.href = ''
        },
        // 表单复选框选中状态
        handleSelectionChange(val) {
            let formId = []
            val.forEach(item => {
                formId.push(item.id)
            })
            this.downLoadId = formId.toString()
            // console.log(this.downLoadId);
        },
        // 获取表单二维码
        getQcode(val) {
            get_qrcode(val).then(res => {
                if (res.code === 200) {
                    window.open(res.data)
                } else {
                    this.$message(res.msg)
                }
                // console.log(res);
            })
        },
        handleCurrentChange(val) {
            this.pageData.current = val
            this._getListData()
        },
        handleCurrentChangeForm(val) {
            this.frompageData.current = val
            this.handleClick(this.frompageData.formId)
        },
        handleSizeChange(val) {
            this.pageData.size = val
            this._getListData()
        },
        handleSizeChangeForm(val) {
            this.frompageData.size = val
            this.handleClick(this.frompageData.formId)
        },
        // 获取当前时间
        getNowFormatDate() {
            var date = new Date()
            var seperator1 = '-'
            var seperator2 = ':'
            var month = date.getMonth() + 1
            var strDate = date.getDate()
            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate
            }
            var currentdate =
                date.getFullYear() +
                seperator1 +
                month +
                seperator1 +
                strDate +
                ' '
            // +
            // date.getHours() +
            // seperator2 +
            // date.getMinutes() +
            // seperator2 +
            // date.getSeconds();
            return currentdate
        },
        // BU单元业务
        selectDepart(e) {
            this.ruleForm.business_unit = e
        },
        // 姓名
        nameChange(e) {
            this.ruleForm.nameStatus = e
        },
        // 电话
        phoneChange(e) {
            this.ruleForm.phoneStatus = e
        },
        // 省份
        provinceChange(e) {
            this.ruleForm.provinceStatus = e
        },
        // 部门
        departChange(e) {
            this.ruleForm.businessUnit = e
        },
        // 邮箱
        emailChange(e) {
            this.ruleForm.emailStatus = e
        }
    }
}
</script>

<style lang="scss" scoped></style>
