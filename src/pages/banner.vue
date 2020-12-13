<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="openFn">添加</el-button>
    <el-table :data="bannerlist">
      <el-table-column
        label="轮播图名称"
        width="180"
        prop="title"
      ></el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success" effect="dark"
            >启用</el-tag
          >
          <el-tag v-if="scope.row.status == 2" type="danger" effect="dark"
            >禁用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeFn">
      <el-form
        label-width="100px"
        :model="formdata"
        ref="roleform"
        :rules="rules">
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="分类图片" prop="img">
          <!-- 上传组件主题
                action:自动上传的地址
                auto-upload: 是否自动上传
                list-type:照片墙
                on-preview:设置预览时的 回调函数
                on-remove:设置移除时的 回调函数
                on-change:设置选择上传图片时的回调函数
           -->
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 放大图片设置 
            visible：显示状态
            apped-to-body:多个对话框的堆叠顺序问题
          -->
          <el-dialog :visible.sync="preVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
          </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogTitle:"",
      fileList:[],
      preVisible: false, //放大图片对话框显示状态
      dialogImageUrl: "", //放大图片的地址
      // 表格数据
      bannerlist: [],
      //表单内容
      formdata: {
        title: "",
        img: "",
        status: true,
      },
      dialogVisible: false, //对话框显示状态,
      rules: {
        title: [
          {
            required: true,
            message: "请填写轮播图名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // @file:上传文件信息对象 file.raw就是被上传的文件数据
    // @fileList: 上传文件列表
    fileChange(file, fileList) {
      console.log(file, fileList);
      this.formdata.img = file.raw;
    },
    handlePreview(file) {
      // console.log("handlePreview")
      this.dialogImageUrl = file.url; // 设置放大图片地址
      this.preVisible = true; //显示放大框
    },
    handleRemove() {
      // console.log("handlermove");
    },
    getList() {
      /* istree:数据以树形结构返回 */
      this.$http.get(this.$api.BANNERLIST).then((res) => {
        if (res.code == 200) {
          this.bannerlist = res.list ? res.list : [];
          console.log(res.list);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  editFn(data){
      this.dialogTitle="轮播图修改"
      this.dialogVisible = true;
      // console.log(id);
          this.formdata={
            ...data
          }
        this.formdata.status=this.formdata.status==1?true:false;
        this.fileList = [{ name: "", url: this.$domain + this.formdata.img }];
  },
  async deleteFn(id){
      let res = await this.$http.post(this.$api.BANNERDELETE,this.$qs.stringify({ id }));
      if (res.code == 200) {
        console.log(res);
        this.$message.success("删除成功");
        this.getList()
      } else {
        this.$message.error(res.msg);
      }
  },
  handleDelete(id) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "", {
        confirmButtonText: "确定", //确定按钮的文本
        cancelButtonText: "取消", //取消按钮的文本
        type: "warning"
      }).then(() => {
        this.deleteFn(id);
      }).catch(()=>{})
  },
  async submit(){
    this.formdata.status=this.formdata.status?1:2;
    let url = this.formdata.id?this.$api.BANNEREDIT:this.$api.BANNERADD;
    console.log(url);
    let res = await this.$http.upload(url, this.formdata);
    if(res.code==200){
        this.$message.success("操作成功")
    }else{
        this.$message.error(res.msg)
    };
    this.dialogVisible = false;
    this.getList();//获取编辑或新增后的列表
  },
  
  openFn(){
        this.dialogTitle="新增轮播图"
        this.dialogVisible=true;
  },
    closeFn(){
      this.formdata = {
        title: "",
        img: "",
        status: true,
      };
      this.fileList=[]
    },
  }
  
}
</script>
<style scoped lang="less">
</style>