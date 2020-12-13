<template>
  <el-dropdown @command="Logout">
    <span class="el-dropdown-link">{{username}}<i class="el-icon-setting el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>登出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  props:{
    username:{
      require:true,
      type:String
    }
  },
  methods:{
    Logout(){
      this.$store.commit("clearInfo");
      this.$router.replace("/login");
    }
  }
};
</script>
<style lang="less" scoped>
.el-dropdown{
  cursor: pointer;
}
</style>