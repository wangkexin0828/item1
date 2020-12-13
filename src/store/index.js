import Vue from "vue"
import Vuex from "vuex"
import http from "../utils/http"
import { Message } from 'element-ui';
import router from "../router"
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : "",
        // info登录用户信息
        info: sessionStorage.getItem("info") ? JSON.parse(sessionStorage.getItem("info")) : {}
    },
    mutations: {
        setInfo(state, payload) {
            // 保存登录信息
            // 数据在vuex里会随着页面的刷新重置 所以要保存一份
            sessionStorage.setItem("token", payload.token)
            sessionStorage.setItem("info", JSON.stringify(payload.info))
            state.token = payload.token;
            state.info = payload.info;
        },
        // 清空登录信息
        clearInfo(state, payload) {
            sessionStorage.clear();
            state.token = "";
            state.info = {};
        }
    },
    actions: {
        userLogin(context, payload) {
            http.post("api/userlogin", payload).then(res => {
                if (res.code == 200) {
                    context.commit("setInfo",{token:res.list.token,info:res.list})
                    router.replace("/index");
                }else{
                    // Message({
                    //     type:error,
                    //     msg:res.msg
                    // })
                    Message.error(res.msg)
                }
            })
        }
    }
})