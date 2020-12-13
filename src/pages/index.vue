<template>
  <div class="index-container">
    <div id="main" style="width: 800px; height: 400px"></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
    mounted(){
        var myChart = echarts.init(document.getElementById('main'));
        // 配置项
        let option={
            toolbox:{
                feature:{
                    saveAsImage:{}
                }
            },
            // 标题
            tooltip:{},
            // 图例
            legend:{
                data:["近一周订单数量"]
            },
            xAxis:{
                data:["周一","周二","周三","周四","周五","周六","周日"],
                boundaryGap:false
            },
            yAxis:{},
            // 数据列表
            series:[{
                name: '近一周订单数量',//数据名称
                type: 'line',//图表类型
                data: [550, 600, 500, 300, 400, 700,801]
            }],
            color:['red','yellow']
        };
        myChart.setOption(option);
    }
};
</script>>