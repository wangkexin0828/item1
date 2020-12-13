<template>
  <div class="layout">
    <el-container>
      <el-aside width="150px">
        <side-bar></side-bar>
      </el-aside>
      <el-container>
        <el-header>
          <my-header :username="username"></my-header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import SideBar from "@/components/SideBar";
import MyHeader from "@/components/MyHeader";
export default {
  components: {
    SideBar,
    MyHeader,
  },
  computed:{
    username(){
      return this.$store.state.info.username;
    }
  }
};
</script>
<style lang="less" scoped>
.layout {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      background-color: #b3c0d1;
      color: #333;
      text-align: right;
      line-height: 60px;
    }
    .el-aside {
      background-color: #20222a;
      color: #333;
      height: 100%;
    }
    .el-main {
      background-color: #e9eef3;
      color: #333;
    }
  }
}
</style>