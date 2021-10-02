<template>
  <div>
    <el-row :gutter='20' v-if="chart_data_network != null || chart_data_disk != null">
      <el-col :span='12'>
        <el-card shadow='hover'>
          <div slot='header'>
            <span>Traffic</span>
          </div>
          <div v-if='chart_data_network !== null'>
            <my-line :chart-data='chart_data_network'></my-line>
          </div>
        </el-card>
      </el-col>
      <el-col :span='12'>
        <el-card shadow='hover'>
          <div slot='header'>
            <span>Disk</span>
          </div>
          <div v-if='chart_data_disk !== null'>
            <my-line :chart-data='chart_data_disk'></my-line>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <h3>CPU/内存</h3>
    </el-row>
    <el-row :gutter='20' style='margin-bottom: 40px' v-if="cpu_usage != null || ram_usage != null">
      <el-col :span='12'>
        <div>
          <el-progress type='circle' :percentage='cpu_usage'></el-progress>
          CPU使用率
        </div>
      </el-col>
      <el-col :span='12'>
        <div>
          <el-progress type='circle' :percentage='ram_usage'></el-progress>
          内存使用率
        </div>
      </el-col>
    </el-row>
    <el-row :gutter='20' v-if="chart_data_cpu != null && chart_data_memory != null">
      <el-col :span='12'>
        <el-card shadow='hover'>
          <div slot='header'>
            <span>CPU Usage</span>
          </div>
          <div v-if='chart_data_cpu !== null'>
            <my-line :chart-data='chart_data_cpu'></my-line>
          </div>
        </el-card>
      </el-col>
      <el-col :span='12'>
        <el-card shadow='hover'>
          <div slot='header'>
            <span>Memory Usage</span>
          </div>
          <div v-if='chart_data_memory !== null'>
            <my-line :chart-data='chart_data_memory'></my-line>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import MyLine from '@/components/Charts/MyLine'
export default {
  data () {
    return {
      cpu_usage: 0,
      ram_usage: 0,
      chart_data_network: null,
      chart_data_disk: null,
      chart_data_cpu: null,
      chart_data_memory: null
    }
  },
  mounted () {
    let that = this
    this.$axios.get('/monitor/node/' + this.nodeName).then((res) => {
      let network = [
        'network.send_speed',
        'network.recv_speed']
      let cpu = [
        'cpu.user',
        'cpu.system',
        'cpu.idle',
        'cpu.iowait',
        'cpu.irq',
        'cpu.softirq'
      ]
      let memory = [
        'memory.available',
        'memory.used',
        'memory.free',
        'memory.total',
        'memory.inactive',
        'memory.cached'
      ]
      let disk = ['disk.free', 'disk.used']
      /* Network in */
      that.chart_data_network = that.generateData(res.data, network)
      that.chart_data_cpu = that.generateData(res.data, cpu)
      that.chart_data_memory = that.generateData(res.data, memory)
      that.chart_data_disk = that.generateData(res.data, disk)

      that.cpu_usage = Math.round(100 - res.data['cpu.idle'].points[res.data['cpu.idle'].points.length - 1])

      let allMemory = res.data['memory.total'].points[res.data['memory.total'].points.length - 1]
      let usedMemory = res.data['memory.used'].points[res.data['memory.used'].points.length - 1]

      that.ram_usage = Math.round(1.0 * usedMemory / allMemory * 100 + 0.5)
    })
  },
  props: {
    nodeName: {
      type: String,
      default: ''
    }
  },
  methods: {
    formatDiskUsage: function (percentage) {
      return `${this.disk_used_size}/${this.disk_used_size + this.disk_avail_size}T ${percentage}%`
    },
    generateData: function (res, labels) {
      let ret = {
        axisX: [],
        type: '',
        data: []
      }
      let maxScale = 0
      labels.forEach((statLabel, idx, arr) => {
        if (res.hasOwnProperty(statLabel)) {
          if (res[statLabel].scale > maxScale) {
            maxScale = res[statLabel].scale
            ret.type = res[statLabel].unit
          }
          ret.axisX = res[statLabel].labels
        }
      })
      labels.forEach((statLabel, idx, arr) => {
        if (res.hasOwnProperty(statLabel)) {
          let cdata = []
          res[statLabel].points.forEach((val, idx2, arr2) => {
            cdata.push(Math.round((1.0 * val) / maxScale))
          })
          let cinfo = {
            label: statLabel.split('.')[1],
            data: cdata
          }
          ret.data.push(cinfo)
        }
      })
      return ret
    }
  },
  components: {
    'my-line': MyLine
  }
}
</script>

<style scoped>
h1,
h2 {
  font-weight: normal
}
</style>
<style>
.el-card__header {
  padding: 12px 20px
}
</style>
