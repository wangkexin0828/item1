<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员管理列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="memberlist">
      <el-table-column
        label="昵称"
        width="200"
        prop="nickname"
      ></el-table-column>
      <el-table-column
        label="手机号"
        width="200"
        prop="phone"
      ></el-table-column>
      <el-table-column
        label="注册日期"
        width="200">
      <template slot-scope="scope">
        {{scope.row.addtime|gettime}}
        </template>
        </el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" v-if="scope.row.status == 1">启用</el-tag>
          <el-tag effect="dark" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="会员修改"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeFn"
    >
      <el-form label-width="80px" :model="formdata">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formdata.nickname" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formdata.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formdata.password"></el-input>
          <span>不填写则不修改密码</span>
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
import an52 from '@dfeidao/fd-an000052';
// const now_date = new Date().getTime(); // 1551167783406
// const ran52 = an52(now_date, 'YYYY-MM-DD hh:mm:ss');   // 2019-02-26 15:56:23
// const ran52 = an52(now_date, 'YYYY/MM/DD');   
export default {
  data() {
    return {
      memberlist: [],
      dialogVisible: false,
      page:1,
      size:2,
      formdata: {
        nickname: "",
        password: "",
        phone: "",
        status: true,
      },
    };
  },
  mounted() {
    this.getList();
  },
  filters:{
       gettime:function (n) { 
          let oDate = new Date(parseInt(n));
          let Y = oDate.getFullYear();
          let M = oDate.getMonth()+1<10?"0"+(oDate.getMonth()+1):oDate.getMonth()+1;
          let D = oDate.getDate()<10?"0"+oDate.getDate():oDate.getDate();
          let h = oDate.getHours()<10?"0"+oDate.getHours():oDate.getHours();
          let m = oDate.getMinutes()<10?"0"+oDate.getMinutes():oDate.getMinutes();
          let s = oDate.getSeconds()<10?"0"+oDate.getSeconds():oDate.getSeconds();
          return `${Y}-${M}-${D} ${h}:${m}:${s}`
 }
  },
  methods: {
    async getList() {
      let res = await this.$http.get(this.$api.MEMBERLIST,{page: this.page, size: this.size});
      if (res.code == 200) {
        this.memberlist = res.list ? res.list : [];
        
      } else {
        this.$message.error(res.msg);
      }
      //   console.log(res);
    },
    async editFn(uid) {
      this.dialogVisible = true;
      let res = await this.$http.get(this.$api.MEMBERINFO, { uid });
      if (res.code == 200) {
        this.formdata = {
          ...res.list
        };
        this.formdata.status=res.list.status==1?true:false;
      } else {
        this.$message.error(res.msg);
      }
    },
    async submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      let str = this.$qs.stringify(this.formdata);
      let res = await this.$http.post(this.$api.MEMBEREDIT, str);
      // console.log(res);
      if (res.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getList();
    },
    closeFn() {
      this.formdata = {
        nickname: "",
        password: "",
        phone: "",
        status: true,
      };
    },
  },
};
</script>