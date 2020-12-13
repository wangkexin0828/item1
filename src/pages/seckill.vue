<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="add()">添加</el-button>
    <!-- 表格数据 -->
    <el-table :data="secklist" row-key="id">
      <el-table-column
        label="活动名称"
        prop="title"
        width="200"
      ></el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status == 1"
            >启用</el-tag
          >
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row)">编辑</el-button>
          <el-button size="mini" @click="deleteFn(scope.row.id)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="pageChange"
      :current-page="page"
    >
    </el-pagination>
    <!-- 表单数据 -->
    <el-dialog
      title="修改/添加活动"
      :visible.sync="dialogFormVisible"
      width="50%"
      @open="getItem"
      @close="reset"
      @opened="openedfn"
    >
      <el-form label-width="100px" :model="formdata" ref="goodsform">
        <el-form-item label="活动名称">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="活动期限">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selecttime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类">
          <el-select
            @change="selectfirst"
            v-model="formdata.first_cateid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in firstlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="formdata.second_cateid"
            @change="selectattrs"
            placeholder="请选择"
          >
            <el-option
              v-for="item in secondlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品">
          <el-select v-model="formdata.goodsid" placeholder="请选择">
            <el-option
              v-for="item in attrs"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import An52 from "@dfeidao/fd-an000052";
import An53 from "@dfeidao/fd-an000053";
export default {
  data() {
    return {
      secklist: [], //数据 列表
      dialogFormVisible: false,
      formdata: {
        id: "", //编号，必填项
        title: "", //限时秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: false, //状态1正常2禁用
      },
      value1: [], //存放时间对象
      timelist: [],
      //放大图片对话库显示状态
      preVisible: false,
      fileList: [],
      //一级分类列表
      firstlist: [],
      //二级分类列表
      secondlist: [],
      //商品名称
      goodslist: [],
      //存放商品名称
      attrs: [],
      //page,szie用于分页!
      page: 1,
      size: 2,
      total: 2,
    };
  },
  mounted() {
    this.getsecklist();
  },
  watch: {},
  methods: {
    getTimestr(val) {
      let temp = val.toLocaleString();
      if (temp.match(/[\u4e00-\u9fa5]/g)[0] == "上") {
        temp = temp.replace(/[\u4e00-\u9fa5]/g, "");
        return temp.slice(-8, -7) == " "
          ? temp.slice(0, -7) + "0" + temp.slice(-7) : temp;
      } else {
        temp = temp.replace(/[\u4e00-\u9fa5]/g, "");
        let templist = temp.split(" ");
        let temptime = templist[1].split(":");
        temptime[0] = parseInt(temptime[0]) + 12;
        temptime = temptime.join(":");
        return templist[0] + " " + temptime;
      }
    },
    add() {
      this.getfirstlist();
      this.dialogFormVisible = true;
    },
    selecttime() {
      console.log(this.value1);
      this.value1.map((item) => {
        item = this.getTimestr(item);
        item = An53(item, "yyyy/M/d HH:mm:ss");
        this.timelist.push(item);
      });
      this.formdata.begintime = this.timelist[0];
      this.formdata.endtime = this.timelist[1];
    },
    pageChange(page) {
      this.page = page;
      this.getgoodslist();
    },
    //打开弹窗请求分类列表
    async getfirstlist() {
      console.log("打开弹窗");
      let res = await this.$http.get(this.$api.CATELIST, { pid: 0 });
      let res1 = await this.$http.get(this.$api.GOODSLIST);
      if (res.code == 200 && res1.code == 200) {
        this.firstlist = res.list ? res.list : [];
        this.goodslist = res1.list ? res1.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    //选择一级分类获取二级分类
    selectfirst(pid) {
      this.$http.get(this.$api.CATELIST, { pid }).then((res) => {
        this.secondlist = res.list;
        console.log(this.secondlist);
      });
    },
    //选择二级分类获取商品名
    selectattrs(id) {
      this.attrs = this.goodslist.filter((item) => item.second_cateid == id);
    },
    getItem() {},
    openedfn() {},

    //获取规格数据
    async getsecklist() {
      let res = await this.$http.get(this.$api.SECKILL);
      if (res.code == 200) {
        this.secklist = res.list;
      }
    },
    reset() {
      this.formdata={
        id: "", //编号，必填项
        title: "", //限时秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: false, //状态1正常2禁用
      };
      this.value1=[];
    },

    //提交
    async submit() {
      let url = this.formdata.id ? this.$api.SECKEDIT : this.$api.SECKADD;
      this.formdata.status = this.formdata.status ? 1 : 2;

      let res = await this.$http.post(url, this.formdata);
      if (res.code == 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
      this.dialogFormVisible = false;
      this.getsecklist();
    },
    //编辑按钮
    async editFn(data) {
      let res = await this.$http.get(this.$api.CATELIST, { pid: 0 });
      let res1 = await this.$http.get(this.$api.GOODSLIST);
      if (res.code == 200 && res1.code == 200) {
        this.firstlist = res.list ? res.list : [];
        this.goodslist = res1.list ? res1.list : [];
        this.dialogFormVisible = true;
        this.formdata = {
          ...data,
        };
        this.selectfirst(this.formdata.first_cateid);
        this.selectattrs(this.formdata.second_cateid);

        this.formdata.status = this.formdata.status == 1 ? true : false;
        this.value1.push(new Date(Number(this.formdata.begintime)));
        this.value1.push(new Date(Number(this.formdata.endtime)));
      }

      /* this.$http.get("/api/seckinfo",{id}).then(res=>{
        if(res.code==200){
          // this.attrs = this.goodslist.filter((item) => item.second_cateid == res.list.goodsid);
          this.formdata=res.list
        }
      }); */
    },
    //删除按钮？
    deleteFn(id) {
      this.$http.post(this.$api.SECKDELETE, { id }).then(res => {
        if (res.code == 200) {
          this.page = 1;
          this.getsecklist();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>>