import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/layout'
import Login from '@/pages/login'
import Index from '@/pages/index'
const Role = ()=>import("@/pages/Role")
const User = ()=>import("@/pages/User")
const Category = ()=>import("@/pages/Category")
const Specs = ()=>import("@/pages/Specs")
const Goods = ()=>import("@/pages/Goods")
const Menu =()=> import('@/pages/menu') /* 路由懒加载 */
const Member =()=>import('@/pages/member')
const Banner =()=>import('@/pages/banner')
const Seckill =()=>import('@/pages/seckill')
Vue.use(Router)

const router= new Router({
  routes: [
    {
      path:"/login",
      component:Login
    },
    {
      path: '/',
      component: Layout,
      children:[{
        path:"index",
        component:Index
      },{
        path:"menu",
        component:Menu
      },{
        path:"user",
        component:User
      },{
        path:"role",
        component:Role
      },{
        path:"category",
        component:Category
      },{
        path:"specs",
        component:Specs
      },{
        path:"goods",
        component:Goods
      },{
        path:"member",
        component:Member
      },{
        path:"banner",
        component:Banner
      },{
        path:"seckill",
        component:Seckill
      },{
        path:"*",
        redirect:"/index"
      },]
    }
  ]
});
// 登录拦截
router.beforeEach((to,from,next)=>{
  let token=sessionStorage.getItem("token");
  if(token){
    if(to.path=="/login"){
      next(false)
    }else{
      next()
    }
  }else{
    if(to.path=="/login"){
      next()
    }else{
      next("/login")
    }
  }
})

export default router;
