<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table :data="userlist">
      <el-table-column
        label="用户编号"
        width="200"
        prop="uid"
      ></el-table-column>
      <el-table-column
        label="角色"
        width="200"
        prop="rolename"
      ></el-table-column>
      <el-table-column
        label="用户名"
        width="200"
        prop="username"
      ></el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" v-if="scope.row.status == 1">启用</el-tag>
          <el-tag effect="dark" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="pageChange"
      :current-page="page"
    ></el-pagination>
    <el-dialog
      title="新增角色"
      :visible.sync="dialogVisible"
      width="50%"
      @open="openFn"
      @close="closeFn"
    >
      <el-form label-width="80px" :model="formdata" :rules="rules">
        <el-form-item prop="roleid" label="角色">
          <el-select v-model="formdata.roleid" placeholder="请选择">
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item>
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
      total: 0,
      userlist: [],
      page: 1,
      size: 2,
      dialogVisible: false,
      rolelist: [],

      formdata: {
        username: "",
        password: "",
        roleid: "",
        status: true,
      },
      rules: {
        roleid: [
          {
            required: true,
            message: "请选择角色名称",
            trigger: "change",
          },
        ],
        username: [
          {
            required: true,
            message: "请填写用户名称",
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
    async getList() {
      let res1 = await this.$http.get(this.$api.USERCOUNT);
      this.total = res1.list[0].total;
      let res = await this.$http.get(this.$api.USERLIST, {
        page: this.page,
        size: this.size,
      });
      if (res.code == 200) {
        this.userlist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
      //   console.log(res);
    },
    pageChange(page) {
      this.page = page;
      this.getList();
    },
    async getRoleList() {
      let res = await this.$http.get(this.$api.ROLELIST);
      if (res.code == 200) {
        this.rolelist = res.list ? res.list : [];
        console.log(res.list);
      } else {
        this.$message.error(res.msg);
      }
    },
    async editFn(uid) {
      this.dialogVisible = true;
      let res = await this.$http.get(this.$api.USERINFO, { uid });
      if (res.code == 200) {
        this.formdata = {
          ...res.list
        };
        this.formdata.status=res.list.status==1?true:false;
      } else {
        this.$message.error(res.msg);
      }
    },
    async deleteFn(id){
      let res = await this.$http.post(this.$api.USERDELETE,{id});
      if(res.code==200){
        this.$message.success("删除成功");
        this.page=1;
        this.getList()
      }else{
        this.$message.error(res.msg)
      }
    },
    handleDelete(id){
      this.$confirm("此操作将永久删除该用户, 是否继续?","",{
        confirmButtonText: "确定", //确定按钮的文本
        cancelButtonText: "取消", //取消按钮的文本
        type: "warning"
      }).then(()=>{
        this.deleteFn(id);
      }).catch(()=>{})
    },
    async submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      let url = this.formdata.uid ? this.$api.USEREDIT : this.$api.USERADD;
        // console.log(url);
      let str = this.$qs.stringify(this.formdata);
      let res = await this.$http.post(url, str);
      console.log(res);
      if (res.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getList();
    },
    openFn() {
      this.getRoleList();
    },
    closeFn() {
      this.formdata = {
        username: "",
        password: "",
        roleid: "",
        status: true,
      };
    },
  },
};
</script>