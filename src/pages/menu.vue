<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <my-table
      :menulist="menulist"
      @changeMenu="changeFn"
      @edit="editFn"></my-table>
    <!-- 添加菜单弹框 -->
    <el-dialog
      title="新增菜单"
      :visible.sync="dialogVisible"
      width="50%"
      @open="getTop"
      @close="reset">
      <el-form
        label-width="100px"
        :model="formdata"
        :rules="rules"
        ref="menuform">
        <el-form-item label="菜单名称">
          <el-select
            v-model="formdata.pid"
            placeholder="请选择"
            @change="changeMenu">
            <el-option :key="0" label="顶级菜单" :value="0"> </el-option>
            <el-option
              v-for="item in topmenu"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" v-if="formdata.pid == 0" prop="icon">
          <el-input v-model="formdata.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址" v-else prop="url">
          <el-input v-model="formdata.url"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio
            v-model="formdata.type"
            :disabled="formdata.type !== 1"
            :label="1">目录</el-radio>
          <el-radio
            v-model="formdata.type"
            :disabled="formdata.type === 1"
            :label="2">菜单</el-radio>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formdata.status"> </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      formdata: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: true,
      },
      dialogVisible: false,
      topmenu: [],
      rules: {
        title: [
          {
            required: true,
            message: "请填写菜单名称",
            trigger: "blur",
          },
        ],
        icon: [
          {
            required: true,
            message: "请填写图标名称",
            trigger: "blur",
          },
        ],                                
        url:[
          {
            required: true,
            message: "请填写地址",
            trigger: "blur"
          },
        ]
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    editFn(row) {
      this.dialogVisible = true;
      this.formdata = {...row};
      this.formdata.status=1?true:false;
    },
    reset() {
      this.formdata = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: true,
      };
    },
    submit() {
      let url = this.formdata.id?this.$api.MENUEDIT:this.$api.MENUADD
      this.$refs.menuform.validate((value) => {
        this.formdata.status = this.formdata.status ? 1 : 2;
        if (!value) {
          return false;
        }
        this.$http.post(url, this.formdata).then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.$message.success("操作成功");
            this.getList();
            this.dialogVisible = false;
          }
        });
      });
    },
    changeMenu(pid) {
      this.formdata.type = pid > 0 ? 2 : 1;
    },
    changeFn(menulist) {
      this.menulist = menulist;
    },
    getList() {
      /* istree:数据以树形结构返回 */
      this.$http.get(this.$api.MENULIST, { istree: true }).then((res) => {
        if (res.code == 200) {
          this.menulist = res.list ? res.list : [];
          // console.log(res);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getTop() {
      /* istree:数据以树形结构返回 */
      this.$http.get(this.$api.MENULIST, { pid: 0 }).then((res) => {
        if (res.code == 200) {
          this.topmenu = res.list ? res.list : [];
          console.log(res);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
</style>