<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>规格列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table :data="specslist" style="width: 100%" row-key="id">
      <el-table-column
        label="属性名称"
        width="200"
        prop="specsname"
      ></el-table-column>
      <el-table-column label="属性值" width="200">
        <template slot-scope="scope">
          <el-tag
            type="primary"
            v-for="(item, index) in scope.row.attrs"
            :key="index"
            >{{ item }}</el-tag
          >
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
    <el-dialog
      title="规格添加"
      :visible.sync="dialogVisible"
      width="50%"
      @close="reset"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        :rules="rules"
        ref="menuform"
      >
        <el-form-item label="属性名称" prop="specsname">
          <el-input v-model="formdata.specsname"></el-input>
        </el-form-item>
        <el-form-item label="属性值">
          <div v-for="(item, index) in attrsArr" :key="index">
            <el-input v-model="item.value" :style="{ width: '60%' }"></el-input>
            <el-button type="primary" v-if="index == 0" @click="addAttr(index)"
              >添加属性</el-button
            >
            <el-button type="danger" v-else @click="deleteAttr(index)"
              >删除属性</el-button
            >
          </div>
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
      specslist: [],
      dialogVisible: false,
      // 解决vue无法监测到数组成员变化的问题采用的对象存储方式
      attrsArr: [{ value: "" }],
      formdata: {
        specsname: "",
        status: true,
        attrs: "",
      },
      rules: {
        specsname: [
          {
            required: true,
            message: "请填写属性名称",
            trigger: blur,
          },
        ],
      },
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      this.$http.get(this.$api.SPECSLIST).then((res) => {
        console.log(res.list);
        if (res.code == 200) {
          this.specslist = res.list;
        }
      });
    },
    addAttr() {
      this.attrsArr.push({ value: "" });
    },
    deleteAttr(i){
        this.attrsArr.splice(i,1);
    },
    editFn(id){
      this.dialogVisible=true;
      this.$http.get(this.$api.SPECSINFO,{id}).then(res=>{
        console.log(res.list);
        if(res.code==200){
          this.formdata={...res.list[0]};
          this.formdata.status=res.list[0].status==1?true:false;
          this.attrsArr = res.list[0].attrs.map(item=>({value:item}))
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    deleteFn(id){
      this.$http.post(this.$api.SPECSDELETE, { id }).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getlist();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleDelete(id){
      this.$confirm("此操作将永久删除该属性, 是否继续?","",{
        confirmButtonText: "确定", //确定按钮的文本
        cancelButtonText: "取消", //取消按钮的文本
        type: "warning"
      }).then(()=>{
        this.deleteFn(id);
      }).catch(()=>{})
    },
    async submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      // 将数组套对象的attrArr遍历回到普通的字符串数组赋值给formdata的attrs
      this.formdata.attrs = this.attrsArr.map(item => item.value).join(",");
      let url = this.formdata.id ? this.$api.SPECSEDIT : this.$api.SPECSADD;
      let str = this.$qs.stringify(this.formdata);
      let res = await this.$http.post(url, str);
      // console.log(res);
      if (res.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getlist();
    },
    reset() {
      this.formdata= {
        specsname: "",
        status: true,
        attrs: "",
      };
      this.attrsArr= [{ value: "" }]
    }
  },
};
</script>