<template>
<!-- 
    default-active当前激活的index
    unique-opened 同时只打开一个子菜单
 -->
  <el-menu background-color="#20222A"

          :default-active="$route.path"
          unique-opened
  >
    <h2>后台管理系统</h2>
    <el-menu-item index="/index">
      <i class="el-icon-s-home"></i>
      <router-link to="/index">首页</router-link>
    </el-menu-item>
    <!-- 
            根据后台返回的数据 动态的生成导航栏
            menu:一级菜单
    -->
    <el-submenu v-for="(menu,index) in menus" :key="index" :index="(index+1).toString()">
      <!-- 子菜单标题插槽内容 -->
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{menu.title}}</span>
      </template>
      <!-- 子菜单的分组 -->
      <el-menu-item-group>
        <!-- submenu：子菜单 -->
        <el-menu-item v-for="(submenu,index) in menu.children" :key="index" 
        :index="submenu.url">
          <router-link :to="submenu.url">{{submenu.title}}</router-link>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  computed: {
    menus() {
      return this.$store.state.info.menus;
    }
  }
};
</script>
<style lang="less">
.el-menu {
  overflow-x: hidden;
  h2{
      color:#fff;
      margin: 20px auto;
      font-size: 16px;
      text-align: center
  }
  a {
    color: #fff;
    text-decoration: none;
  }
  .el-submenu__title {
    color: #fff;
  }
  .el-menu-item.is-active{
      color:rgb(255, 208, 75);
  }
  .is-active{
      .router-link-exact-active{
          color:rgb(255, 208, 75);
      }
  }
}
</style>