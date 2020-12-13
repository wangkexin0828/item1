<template>
  <div class="login-bg">
    <div class="login-container">
      <!-- el-form 表单容器
    model表单属性，data需要设置对应的数据对象
    ref表单组件引用
    rules：验证规则
     -->
      <el-form :model="ruleForm" ref="loginForm" :rules="rules">
        <h2>登录</h2>
        <!-- 
              获取rule中的同名验证规则进行验证
              label：表单关联文字
           -->
        <el-form-item prop="username" label>
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label>
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form>
          <el-button type="primary" @click="submit('loginForm')"
            >登录</el-button
          >
        </el-form>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["userLogin"]),
    ...mapMutations(["setInfo"]),
    submit(form) {
      // validate element-ui的方法
      this.$refs[form].validate((value) => {
        if (!value) {
          return false;
        }
        // this.userLogin(this.ruleForm);

        let str = this.$qs.stringify(this.ruleForm);
        console.log(str)
        this.$http.post(this.$api.USERLOGIN, str).then(res => {
          console.log(res);
          // 登录成功
          if (res.code == 200) {
            // this.$store.commit("setInfo",{ token: res.list.token, info: res.list })
            this.setInfo({ token: res.list.token, info: res.list });
            this.$router.replace("/index");
          } else {
            // 登录失败
            // this.$message({
            //                 type:"error",
            //                 msg:res.msg
            //             })
            this.$message.error(res.msg);
          }
        });
      });
    },
  },
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true, //必填项
            message: "请输入管理员名称",
            trigger: "blur", //失去焦点时触发验证
          },
          {
            pattern: /^\S{4,8}$/g,
            message: "请输入4到8位字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true, //必填项
            message: "请输入管理员密码",
            trigger: "blur",
          },
          {
            max: 8,
            min: 5,
            message: "请输入5到8位字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>
<style lang="less">
.login-bg {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
  .login-container {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 300px;
    height: 250px;
    h2 {
      margin-bottom: 20px;
      color: #fff;
    }
    .el-button--primary {
      width: 100%;
    }
  }
}
</style>