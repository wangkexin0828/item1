<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table :data="rolelist">
      <el-table-column
        label="分类名称"
        width="180"
        prop="rolename"
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
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新增角色"
      :visible.sync="dialogVisible"
      width="50%"
      @open="openFn"
      @close="closeFn">
      <el-form
        label-width="100px"
        :model="formdata"
        ref="roleform"
        :rules="rules">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="formdata.rolename"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限">
          <!-- ref：为了提交时获取该元素的数据 -->
          <el-tree
            check-strictly
            ref="tree"
            :data="menulist"
            show-checkbox
            :default-checked-keys="checkedKeys"
            node-key="id"
            :props="{ children: 'children', label: 'title' }"
            ><!-- title:menulist里的title -->
          </el-tree>
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
      // 表格数据
      rolelist: [],
      //表单内容
      formdata: {
        rolename: "",
        menus: [],
        status: true,
      },
      checkedKeys:[],
      dialogVisible: false, //对话框显示状态,
      topmenu: [], //顶层菜单,
      menulist:[],
      rules: {
        rolename: [
          {
            required: true,
            message: "请填写角色名称",
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
    getList() {
      /* istree:数据以树形结构返回 */
      this.$http.get(this.$api.ROLELIST, { istree: true }).then((res) => {
        if (res.code == 200) {
          this.rolelist = res.list ? res.list : [];
          console.log(res);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 获取顶级菜单
    async getTop() {
      let res = await this.$http.get(this.$api.ROLELIST, { pid: 0 });
      if (res.code == 200) {
        console.log(res);
        this.topmenu = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
  async getMenuList(){
      let res = await this.$http.get(this.$api.MENULIST,{istree:true});
      if(res.code==200){
          this.menulist=res.list?res.list:[]
      }else{
          this.$message.error(res.msg);
      }
  },
  editFn(id){
      this.dialogVisible = true;
      this.$http.get(this.$api.ROLEINFO,{id}).then(res=>{
        if(res.code==200){
            this.formdata.menus = res.list ? res.list.menus.split(",") : [];//res.list存在就赋值不然就给个[]
            this.checkedKeys = res.list ? res.list.menus.split(",") : [];
            this.formdata.rolename = res.list.rolename;
            this.formdata.status=res.list.status==1?true:false;
            this.formdata.id = id;
        }
    });
  },
  async deleteFn(id){
      let res = await this.$http.post(
        this.$api.ROLEDELETE,
        this.$qs.stringify({ id })
      );
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
    console.log(this.$refs.tree.getCheckedKeys());
    this.formdata.menus=this.$refs.tree.getCheckedKeys().join(",");
    this.formdata.status=this.formdata.status?1:2;
    let url = this.formdata.id?this.$api.ROLEEDIT:this.$api.ROLEADD;
    let res= await this.$http.post(url,this.formdata);
    if(res.code==200){
        this.$message.success("操作成功")
    }else{
        this.$message.error(res.msg)
    };
    this.dialogVisible = false;
    this.getList();//获取编辑或新增后的列表
  },
  
  openFn(){
        this.getMenuList()
  },
    closeFn(){
      this.checkedKeys = [];
      this.formdata = {
        rolename: "",
        menus: [],
        status: true
      };
    },
  }
  
}
</script>
<style scoped lang="less">
</style>