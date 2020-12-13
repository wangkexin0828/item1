<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table
      :data="catelist"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="分类名称" width="180" prop="catename">
      </el-table-column>
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
            @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹框 -->
    <el-dialog
      title="分类添加"
      :visible.sync="dialogVisible"
      width="50%"
      @open="getTop"
      @close="reset"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        :rules="rules"
        ref="menuform">
        <el-form-item label="菜单名称" prop="pid">
          <el-select v-model="formdata.pid" placeholder="请选择上级分类">
            <el-option :key="0" label="顶级分类" :value="0"></el-option>
            <el-option
              v-for="item in topcate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="formdata.catename"></el-input>
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
          <el-switch v-model="formdata.status"> </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      catelist: [],
      topcate: [],
      fileList: [],
      dialogVisible: false,
      preVisible: false, //放大图片对话框显示状态
      dialogImageUrl: "", //放大图片的地址
      formdata: {
        pid: 0,
        catename: "",
        img: "",
        status: true,
      },
      rules: {
        pid: [
          {
            required: true,
            message: "请选择上级分类",
            trigger: "change",
          },
        ],
        catename: [
          {
            required: true,
            message: "请填写分类名称",
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
      let res = await this.$http.get(this.$api.CATELIST, { istree: true });
      if (res.code == 200) {
        this.catelist = res.list;
        // console.log(res.list);
      } else {
        this.$message.error(res.msg);
      }
    },
    async getTop() {
      let res = await this.$http.get(this.$api.CATELIST, { pid: 0 });
      if (res.code == 200) {
        this.topcate = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
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
    submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      let url = this.formdata.id ? this.$api.CATEEDIT : this.$api.CATEADD;
      // 使用封装的upload方法提交
      this.$http.upload(url, this.formdata).then((res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.msg);
        }
        this.dialogVisible = false;
        this.getList();
      });
    },
    editFn(id) {
      this.$http.get(this.$api.CATEINFO, { id }).then((res) => {
        this.dialogVisible = true;
        if (res.code == 200) {
          this.fileList = [
            {
              name: "",
              url: this.$domain + res.list.img,
            },
          ];
          this.formdata = {
            ...res.list,
          };
          this.formdata.id = id;
          this.formdata.status = res.list.status == 1 ? true : false;
        }
      });
    },
    deleteFn(id) {
      this.$http.post(this.$api.CATEDELETE, { id }).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
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
    reset() {
      this.formdata = {
        pid: 0,
        catename: "",
        img: "",
        status: true,
      };
      this.fileList = [];
    },
  },
};
</script>