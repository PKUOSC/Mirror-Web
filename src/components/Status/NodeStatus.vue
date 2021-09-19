<template>
  <div>
    <el-row :gutter='20' style='margin-top:10px'>
      <el-col :span='12'>
        <el-card shadow='hover'>
          <div slot='header'>
            <span>Traffic</span>
          </div>
          <div v-if='chartdata_ipv4_in !== null'>
            <my-line :chart-data='chart_data_network'></my-line>
          </div>
        </el-card>
      </el-col>
      <el-col :span='12'>
        <el-card shadow='hover'>
          <div slot='header'>
            <span>Disk</span>
          </div>
          <div v-if='chartdata_ipv6_in !== null'>
            <my-line :chart-data='chartdata_disk'></my-line>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <h3>CPU/内存</h3>
    </el-row>
    <el-row :gutter='20' style='margin-bottom: 40px'>
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
    <el-row :gutter='20'>
      <el-col :span='12'>
        <el-card shadow='hover'>
          <div slot='header'>
            <span>CPU Usage</span>
          </div>
          <div v-if='chartdata_cpu !== null'>
            <my-line :chart-data='chartdata_cpu'></my-line>
          </div>
        </el-card>
      </el-col>
      <el-col :span='12'>
        <el-card shadow='hover'>
          <div slot='header'>
            <span>Memory Usage</span>
          </div>
          <div v-if='chartdata_memory !== null'>
            <my-line :chart-data='chartdata_memory'></my-line>
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
      let network = ['network.bytes_recv', 'network.bytes_sent']
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
        'memory.active',
        'memory.inactive',
        'memory.cached',
        'memory.slab'
      ]
      let disk = ['disk.free', 'disk.used']
      /* Network in */
      that.chart_data_network = that.generateData(res, network)
      that.chart_data_cpu = that.generateData(res, cpu)
      that.chart_data_memory = that.generateData(res, memory)
      that.chart_data_disk = that.generateData(res, disk)
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
