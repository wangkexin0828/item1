import axios from "axios";
axios.defaults.baseURL = "";
axios.defaults.timeout = 3000;

axios.interceptors.request.use(config => {
    // Do something before request is sent
    let token = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : "";
    config.headers.Authorization = token;
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    // Do something before response is sent
    return response.data;
}, error => {
    // Do something with response error
    return Promise.reject(error);
});

// 自己封装的get方法
function get(url,params={}) {
    return new Promise((res, rej) => {
        axios({
            url,
            method: "get",
            params
        }).then(data => {
            res(data)
        }).catch(err => {
            rej(err)
        })
    })
};

// 自己封装的post方法
// @url:string 请求路径
// @data:Object|string 请求参数

function post(url,data={}) {
    return new Promise((res, rej) => {
        axios({
            url,
            method: "post",
            data
        }).then(data => {
            res(data)
        }).catch(err => {
            rej(err)
        })
    })
};

/* 封装包含上传内容的方法
@url：上传地址
@data：上传数据 */
function upload(url,data={}){
    return new Promise((res,rej)=>{
        let form = new FormData();
        for(var key in data){
            /* 
            append:向表单实例添加数据的方法
            key：数据名称
            value：数据的值
            */
            form.append(key,data[key]);
        }
        axios({
            method:"post",
            url,
            data:form,
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then(data=>{
            res(data)
        }).catch(err=>{
            rej(err)
        })
    })
}
export default{
    get,
    post,
    upload
}