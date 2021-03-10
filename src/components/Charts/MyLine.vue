<template>
  <div class="chart">
    <canvas ref='cvs'></canvas>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import {
  LineChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'

echarts.use([ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer])

export default {
  name: 'MyLine',
  data () {
    return {
      option: null
    }
  },
  mounted () {
    let series = []
    let legendData = []
    this.chartData.data.forEach((val, idx, arr) => {
      series.push({
        name: val.label,
        smooth: true,
        type: 'line',
        data: val.data
      })
      legendData.push(val.label)
    })
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: legendData
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.chartData.axisX
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} ' + this.chartData.type
        },
        axisPointer: {
          snap: true
        }
      },
      series: series,
      grid: {
        containLabel: true,
        x: 10,
        y: 40,
        x2: 10,
        y2: 10
      }
    }
    var myChart = echarts.init(this.$refs.cvs, '', {
      devicePixelRatio: 2
    })
    myChart.setOption(option)
    myChart.resize({
      width: 518,
      height: 400
    })
  },
  props: {
    chartData: {
      type: Object,
      required: true
    }
  }
}
</script>
