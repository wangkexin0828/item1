<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table :data="goodslist">
      <el-table-column
        label="一级分类"
        width="180"
        prop="firstcatename"
      ></el-table-column>
      <el-table-column
        label="二级分类"
        width="180"
        prop="secondcatename"
      ></el-table-column>
      <el-table-column
        label="商品名称"
        width="180"
        prop="goodsname"
      ></el-table-column>
      <el-table-column
        label="销售价"
        width="180"
        prop="price"
      ></el-table-column>
      <el-table-column
        label="市场价"
        width="180"
        prop="market_price"
      ></el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" v-if="scope.row.status == 1">启用</el-tag>
          <el-tag effect="dark" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
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
      title="新增商品"
      :visible.sync="dialogVisible"
      width="50%"
      @open="openFn"
      @close="closeFn"
       @opened="openedFn"
    >
      <el-form label-width="100px" :model="formdata">
        <el-form-item prop="first_cateid" label="一级分类">
          <el-select
            @change="selectFirst"
            v-model="formdata.first_cateid"
            placeholder="请选择一级分类"
          >
            <el-option
              v-for="item in firstList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="second_cateid" label="二级分类">
          <el-select
            v-model="formdata.second_cateid"
            placeholder="请选择二级分类"
          >
            <el-option
              v-for="item in secondList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsname">
          <el-input v-model="formdata.goodsname"></el-input>
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
        <el-form-item label="商品规格名">
          <el-select v-model="formdata.specsid" placeholder="请选择商品规格名" @change="selectSpecs">
            <el-option v-for="item in specslist" :key="item.id" :label="item.specsname" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格属性">
          <el-select v-model="formdata.specsattr" placeholder="请选择商品规格属性" multiple>
            <el-option v-for="item in attrs " :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售价" prop="price">
          <el-input type="number" v-model="formdata.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价" prop="market_price">
          <el-input type="number" v-model="formdata.market_price"></el-input>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="formdata.ishot" :label="1">是</el-radio>
          <el-radio v-model="formdata.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="formdata.isnew" :label="1">是</el-radio>
          <el-radio v-model="formdata.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
        <el-form-item label="商品描述">
          <div id="editor"></div>
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
import E from "wangeditor";
export default {
  data() {
    return {
      total: 0,
      firstList: [],
      secondList: [],
      goodslist: [],
      fileList: [],
      specslist: [],
      //  属性值列表 以数组形式暂时存放规格属性
      attrs: [],
      page: 1,
      size: 2,
      dialogVisible: false,
      preVisible: false, //放大图片对话框显示状态
      dialogImageUrl: "", //放大图片的地址
      formdata: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: true
      },
      
      // rules: {
      //   first_cateid: [
      //     {
      //       required: true,
      //       message: "请选择一级分类",
      //       trigger: "change",
      //     },
      //   ],
      //   second_cateid: [
      //     {
      //       required: true,
      //       message: "请选择二级分类",
      //       trigger: "change",
      //     },
      //   ],
      // },
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
    async getList() {
      let res1 = await this.$http.get(this.$api.GOODSCOUNT);
      this.total = res1.list[0].total;
      let res = await this.$http.get(this.$api.GOODSLIST, {
        page: this.page,
        size: this.size,
      });
      if (res.code == 200) {
        this.goodslist = res.list ? res.list : [];
        // console.log(res.list);
      } else {
        this.$message.error(res.msg);
      }
      //   console.log(res);
    },
    pageChange(page) {
      this.page = page;
      this.getList();
    },
    async getFirstCateList() {
      let res = await this.$http.get(this.$api.CATELIST, { pid: 0 });
      let res1 = await this.$http.get(this.$api.SPECSLIST);
      if (res.code == 200 && res1.code == 200) {
        this.firstList = res.list ? res.list : [];
        this.specslist = res1.list ? res1.list : [];
        // console.log(res.list);
      } else {
        this.$message.error(res.msg);
      }
    },
    async editFn(id) {
      this.dialogVisible = true;
      let res = await this.$http.get(this.$api.GOODSINFO, { id });
      if (res.code == 200) {
        this.formdata = {
          ...res.list,
        };
        //获取商品信息获取 二级分类列表
        this.selectFirst(this.formdata.first_cateid);
        this.attrs = this.formdata.specsattr.split(",");
        this.formdata.specsattr = this.formdata.specsattr.split(",");
        this.formdata.id = id;
        this.formdata.status=res.list.status==1?true:false;
        this.fileList = [{ name: "", url: this.$domain + this.formdata.img }];
            if(this.editor){
              this.editor.txt.html(this.formdata.description);
            }
            //返回的数据设置为 富文本编辑框的内容
      } else {
        this.$message.error(res.msg);
      }
    },
    async deleteFn(id) {
      let res = await this.$http.post(this.$api.GOODSDELETE, { id });
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.page = 1;
        this.getList();
      } else {
        this.$message.error(res.msg);
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "", {
        confirmButtonText: "确定", //确定按钮的文本
        cancelButtonText: "取消", //取消按钮的文本
        type: "warning",
      })
        .then(() => {
          this.deleteFn(id);
        })
        .catch(() => {});
    },
    async submit() {
      let url = this.formdata.id ? this.$api.GOODSEDIT : this.$api.GOODSADD;
      // console.log(url);
      this.formdata.status = this.formdata.status ? 1 : 2;
      this.formdata.specsattr=this.formdata.specsattr.join(",");
      let res = await this.$http.upload(url, this.formdata);
      console.log(res);
      if (res.code == 200) {
        this.$message.success("操作成功");
        // this.attrs=[];
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getList();
    },
    // 切换一级分类，将一级分类id作为pid获取二级分类
    selectFirst(pid) {
      this.$http.get(this.$api.CATELIST, { pid }).then(res => {
        this.secondList = res.list;
      });
    },
    // 将商品属性id作为参数传入找到对应属性获取属性值
    selectSpecs(id){
      this.attrs=this.specslist.find(item=>item.id==id).attrs;
    },
    openFn() {
      this.getFirstCateList();
    },
    openedFn() {
      // console.log(document.getElementById("editor"));
      this.editor = new E("#editor");
      // 设置监听输入操作的回调函数，newHtml ：输入的内容
      this.editor.config.onchange = newHtml => {
        // console.log("change 之后最新的 html", newHtml);
        this.formdata.description = newHtml;
      };
      this.editor.create();
      this.editor.txt.html(this.formdata.description);
    },
    closeFn() {
      this.formdata = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: true
      };
      this.fileList = [];
      this.editor = null;
      document.getElementById("editor").innerHTML = ""; //重置富文本编辑器的html内容
    },
  },
};
</script>