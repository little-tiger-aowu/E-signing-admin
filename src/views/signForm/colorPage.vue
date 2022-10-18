<template>
    <div>
        <PageHeader title="彩页管理"></PageHeader>
        <PageMain>
            <el-button  type="primary" @click="dialogVisible = true">
                添加新彩页
            </el-button>
            <el-button
                type="danger"
                @click="delfata(multipleSelection.join())"
                :disabled="multipleSelection.length == 0 ? true : false"
            >
                批量删除彩页
            </el-button>
            <el-select
                style="margin-left: 20px"
                v-model="pageData.type"
                @change="_getfromData"
                placeholder="请选择"
            >
                <el-option
                    v-for="item in typeOPtion"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-input
                v-model="pageData.keyWord"
                placeholder="请输入搜索内容"
                class="input-with-select"
                style="width: 260px; margin-left: 20px"
            >
                <template #append>
                    <el-button @click="_getfromData" type="primary">
                        <el-icon class="el-icon"><Search /></el-icon>
                    </el-button>
                </template>
            </el-input>
            <el-table
                ref="multipleTable"
                :data="tableData"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column label="彩页名称">
                    <template #default="scope">{{
                        scope.row.fileName
                    }}</template>
                </el-table-column>
                <el-table-column label="分类">
                    <template #default="scope">{{
                        formatType(scope.row.type)
                    }}</template>
                </el-table-column>
                <el-table-column property="fileUrl" label="彩页地址" />
                <el-table-column property="createTime" label="创建时间">
                    <template #default="scope">{{
                        formatDateDay(scope.row.createTime)
                    }}</template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                    <template #default="scope">
                        <el-button
                            @click="delfata(scope.row.id)"
                            type="text"
                            size="small"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="text-align: center; margin: 20px 40px 0">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="pageData.size"
                    :page-sizes="[10, 50, 100, 200]"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
        </PageMain>
        <!--添加彩页-->
        <el-dialog v-model="dialogVisible" title="添加彩页 " width="30%" center>
            <el-form
                ref="addform"
                :model="addform"
                :rules="rulesform"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item label="上传彩页" prop="fileUrl">
                    <el-upload
                        class="upload-demo"
                        action="action"
                        :http-request="httprequest"
                        multiple
                        :limit="3"
                        :file-list="fileList"
                    >
                        <el-button size="small" type="primary"
                            >点击上传</el-button
                        >
                        <template #tip>
                            <!-- <div class="el-upload__tip">请上传pdf文件</div> -->
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="彩页名称" prop="fileName">
                    <el-input
                        v-model="addform.fileName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="彩页分类" prop="type">
                    <el-select v-model="addform.type" placeholder="请选择">
                        <el-option
                            v-for="item in typeOPtion"
                            v-show="item.value != ''"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加到活动中" prop="isAdd">
                    <el-switch
                        v-model="addform.isAdd"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm('addform')"
                        >提交</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { ElMessageBox, ElMessage } from "element-plus";
import { brochureList } from "@/api/activity";
import { upload_token, qiniupSynco } from "@/api/login";
import { formatDate } from "@/util/filter.js";
import { add_file, removePage } from "@/api/colorPage";
import { Search } from "@element-plus/icons";
export default {
    components: {
        Search,
    },
    data() {
        return {
            dialogVisible: false,
            fileList: [],
            formatDate,
            filetype: "",
            typeOPtion: [
                {
                    label: "全部",
                    value: "",
                },
                {
                    label: "SDG",
                    value: 1,
                },
                {
                    label: "MBD",
                    value: 2,
                },
                {
                    label: "IDD",
                    value: 3,
                },
                {
                    label: "TDx",
                    value: 4,
                },
                {
                    label: "CC",
                    value: 5,
                },
                {
                    label: "BMK",
                    value: 6,
                },
                {
                    label: "CMS",
                    value: 7,
                },
            ],
            total: 0,
            tableData: [],
            addform: {
                fileName: "",
                fileUrl: "",
                type: 1,
                isAdd: false,
            },
            rulesform: {
                fileName: [
                    {
                        required: true,
                        message: "请填写彩页名称",
                        trigger: "blur",
                    },
                ],
                fileUrl: [
                    {
                        required: true,
                        message: "请上传彩页",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "请选择分类",
                        trigger: "change",
                    },
                ],
                isAdd: [
                    {
                        required: true,
                        message: "请选择",
                        trigger: "change",
                    },
                ],
            },
            multipleSelection: [],
            pageData: {
                current: 1,
                keyWord: "",
                size: 10,
                type: "",
            },
        };
    },
    mounted() {
        this._getfromData();
    },
    computed: {
        //转换时间
        formatDateDay() {
            return function (value) {
                var date = new Date(value);
                return formatDate(date, "yyyy-m-d");
            };
        },
        //类型转换
        formatType() {
            return function (value) {
                let textname = "";
                if (value == 0) {
                    textname = "无分类";
                }
                if (value == 1) {
                    textname = "SDG";
                }
                if (value == 2) {
                    textname = "MBD";
                }
                if (value == 3) {
                    textname = "IDD";
                }
                if (value == 4) {
                    textname = "TDx";
                }
                if (value == 5) {
                    textname = "CC";
                }
                if (value == 6) {
                    textname = "BMK";
                }
                if (value == 7) {
                    textname = "CMS";
                }
                return textname;
            };
        },
    },
    methods: {
        //删除彩页
        delfata(row) {
            console.log(row);
            let data = {
                ids: row,
            };
            ElMessageBox.confirm("您确认要删除该彩页么?", "Warning", {
                confirmButtonText: "是的",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    removePage(data).then((res) => {
                        this.$message.success("删除成功！");
                        this._getfromData();
                    });
                })
                .catch(() => {
                    ElMessage({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        //添加彩页
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var time = Date.now();
                    this.addform.fileName =
                        this.addform.fileName + "-" + time + this.filetype;
                    add_file(this.addform).then((res) => {
                        this.$message.success("添加成功！");
                        this.dialogVisible = false;
                        this._getfromData();
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //上传图片
        httprequest(refUp) {
            // if (refUp.file.type != "application/pdf") {
            //     this.$message.error("请上传Pdf文件");
            //     return false
            // }
            var name = refUp.file.name;
            var index = name.lastIndexOf("\.");
            upload_token().then((res) => {
                let data = new FormData();
                // var time = Date.now();
                data.append("file", refUp.file);
                data.append("token", res.data.uploadToken);
                data.append("name", refUp.file.name.replace(/\s*/g,""));
                data.append("key", this.$uuid.v1()+ name.substring(index));
                qiniupSynco(data).then((respron) => {
                    this.fileList = [
                        {
                            name: refUp.file.name,
                            url: res.data.prefixUrl + respron.key,
                        },
                    ];
                    this.addform.fileUrl = res.data.prefixUrl + respron.key;
                    this.addform.fileName = name.substring(0, index);
                    this.filetype = name.substring(index);
                });
            });
        },
        //h获取列表
        _getfromData() {
            brochureList(this.pageData).then((res) => {
                this.tableData = res.data.records;
                this.total = Number(res.data.total);
            });
        },
        handleCurrentChange(val) {
            this.pageData.current = val;
            this._getfromData();
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach((row) => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((element) => {
                this.multipleSelection.push(element.id);
            });
        },
    },
};
</script>
