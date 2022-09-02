<template>
  <div>
    <el-row>
      <h3>网络流量/磁盘IO</h3>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>Network Traffic</span>
          </div>
          <div v-if="chartdata_network !== null">
            <my-line :chart-data="chartdata_network"></my-line>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>Disk IO</span>
          </div>
          <div v-if="chartdata_disk_io !== null">
            <my-line :chart-data="chartdata_disk_io"></my-line>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <h3>磁盘状态</h3>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-progress :text-inside="true" :stroke-width="26" :format="formatDiskUsage" :percentage="disk_used_percentage"></el-progress>
      </el-col>
    </el-row>
    <el-row>
      <h3>CPU/内存</h3>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:40px">
      <el-col :span="12">
        <div>
          <el-progress type="circle" :percentage="cpu_usage"></el-progress>
          CPU使用率
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <el-progress type="circle" :percentage="ram_usage"></el-progress>
          内存使用率
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>CPU Usage</span>
          </div>
          <div v-if="chartdata_cpu !== null">
            <my-line :chart-data="chartdata_cpu"></my-line>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>Memory Usage</span>
          </div>
          <div v-if="chartdata_memory !== null">
            <my-line :chart-data="chartdata_memory"></my-line>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MyLine from '@/components/Charts/MyLine'
export default {
  name: 'Status',
  data () {
    return {
      chartdata_network: null,
      chartdata_disk_io: null,
      chartdata_cpu: null,
      chartdata_memory: null,
      cpu_usage: 0,
      ram_usage: 0,
      disk_avail_size: 1,
      disk_used_size: 1
    }
  },
  methods: {
    formatDiskUsage: function (percentage) {
      return `${this.disk_used_size}T/${this.disk_used_size + this.disk_avail_size}T ${percentage}%`
    },
    generateTestY: function (multi) {
      let data = []
      var h = 0
      var m = 0
      var prev = Math.random() * multi
      for (h = 0; h < 24; h++) {
        for (m = 0; m < 60; m += 10) {
          prev += (Math.random() - 0.5) * 2 * multi * 0.05
          if (prev < 0) {
            prev = 0
          }
          if (prev > multi) {
            prev = multi
          }
          data.push(prev)
        }
      }
      return data
    },
    generateTestX: function () {
      let data = []
      var h = 0
      var m = 0
      for (h = 0; h < 24; h++) {
        for (m = 0; m < 60; m += 10) {
          let hStr = h.toString().padStart(2, '0')
          let mStr = m.toString().padStart(2, '0')
          data.push(hStr + ':' + mStr)
        }
      }
      return data
    },
    calculateX: function (data) {
      let result = []
      data.forEach((val, idx, arr) => {
        let date = new Date(val * 1000) // sec to millisec
        let hStr = date.getHours().toString().padStart(2, '0')
        let mStr = date.getMinutes().toString().padStart(2, '0')
        result.push(hStr + ':' + mStr)
      })
      return result
    },
    generateCpuData: function () {
      let that = this
      this.$axios.get('/static/cpu.json').then((response) => {
        response.data.result.data[0].forEach((val, idx, arr) => {
          if (idx !== 0) {
            that.cpu_usage += val
          }
        })
        that.cpu_usage = Math.round(that.cpu_usage + 0.5)
        let raw = response.data.result.data.reverse()
        let needIdx = []
        let data = []
        response.data.result.labels.forEach((val, idx, arr) => {
          if (val === 'softirq' ||
            val === 'irq' ||
            val === 'user' ||
            val === 'system' ||
            val === 'iowait') {
            needIdx.push(idx)
          }
        })
        needIdx.forEach((val, idx, arr) => {
          data.push({
            label: response.data.result.labels[val],
            data: []
          })
        })
        let rawTimeline = []
        raw.forEach((val, idx, arr) => {
          rawTimeline.push(val[0])
          needIdx.forEach((target, targetIdx, arr2) => {
            data[targetIdx].data.push(val[target])
          })
        })
        that.chartdata_cpu = {
          type: '%',
          axisX: that.calculateX(rawTimeline),
          data: data
        }
      })
    },
    generateRamData: function () {
      let that = this
      this.$axios.get('/static/ram.json').then((response) => {
        let allMem = 0
        let freeMem = 0
        response.data.result.data[0].forEach((val, idx, arr) => {
          if (idx !== 0) {
            if (response.data.result.labels[idx] === 'total') {
              allMem += val
            }
            if (response.data.result.labels[idx] !== 'used' & response.data.result.labels[idx] !== 'total') {
              freeMem += val
            }
          }
        })
        that.ram_usage = Math.round((1.0 - freeMem / allMem) * 100)
        let raw = response.data.result.data.reverse()
        let needIdx = []
        let data = []
        response.data.result.labels.forEach((val, idx, arr) => {
          if (val === 'free' ||
            val === 'used' ||
            val === 'cached' ||
            val === 'buffers' ||
            val === 'total') {
            needIdx.push(idx)
          }
        })
        needIdx.forEach((val, idx, arr) => {
          data.push({
            label: response.data.result.labels[val],
            data: []
          })
        })
        let rawTimeline = []
        raw.forEach((val, idx, arr) => {
          rawTimeline.push(val[0])
          needIdx.forEach((target, targetIdx, arr2) => {
            if (targetIdx !== 4) {
              data[targetIdx].data.push(val[target])
            }
          })
          data[4].data.push(val[4] - val[1])
        })
        that.chartdata_memory = {
          type: 'MiB',
          axisX: that.calculateX(rawTimeline),
          data: data
        }
      })
    },
    generateNetworkData: function () {
      let that = this
      this.$axios.get('/static/network.json').then((response) => {
        let raw = response.data.result.data.reverse()
        let needIdx = []
        let data = []
        let fraction = 1.0
        let type = 'Kbps'
        response.data.result.labels.forEach((val, idx, arr) => {
          if (val === 'inbound' ||
            val === 'outbound') {
            needIdx.push(idx)
          }
        })
        needIdx.forEach((val, idx, arr) => {
          data.push({
            label: response.data.result.labels[val],
            data: []
          })
        })
        let rawTimeline = []
        let maxv = 0
        raw.forEach((val, idx, arr) => {
          needIdx.forEach((target, targetIdx, arr2) => {
            if (val[target] > maxv) {
              maxv = val[target]
            }
          })
        })
        if (maxv > 1024) {
          maxv /= 1024
          type = 'Mbps'
          fraction /= 1024
        }
        if (maxv > 1024) {
          maxv /= 1024
          type = 'Gbps'
          fraction /= 1024
        }
        raw.forEach((val, idx, arr) => {
          rawTimeline.push(val[0])
          needIdx.forEach((target, targetIdx, arr2) => {
            data[targetIdx].data.push(val[target] * fraction)
          })
        })
        that.chartdata_network = {
          type: type,
          axisX: that.calculateX(rawTimeline),
          data: data
        }
      })
    },
    generateDiskIOData: function () {
      let that = this
      this.$axios.get('/static/disk_io.json').then((response) => {
        let raw = response.data.result.data.reverse()
        let needIdx = []
        let data = []
        let fraction = 1.0
        let type = 'Kib'
        response.data.result.labels.forEach((val, idx, arr) => {
          if (val === 'read' ||
            val === 'read_cache') {
            needIdx.push(idx)
          }
        })
        needIdx.forEach((val, idx, arr) => {
          data.push({
            label: response.data.result.labels[val],
            data: []
          })
        })
        let maxv = 0
        raw.forEach((val, idx, arr) => {
          needIdx.forEach((target, targetIdx, arr2) => {
            if (val[target] > maxv) {
              maxv = val[target]
            }
          })
        })
        if (maxv > 1024) {
          maxv /= 1024
          type = 'MB/s'
          fraction /= 1024
        }
        if (maxv > 1024) {
          maxv /= 1024
          type = 'GB/s'
          fraction /= 1024
        }
        let rawTimeline = []
        raw.forEach((val, idx, arr) => {
          rawTimeline.push(val[0])
          needIdx.forEach((target, targetIdx, arr2) => {
            data[targetIdx].data.push(val[target] * fraction)
          })
        })
        that.chartdata_disk_io = {
          type: type,
          axisX: that.calculateX(rawTimeline),
          data: data
        }
      })
    },
    generateDiskData: function () {
      let that = this
      this.$axios.get('/static/disk_space.json').then((response) => {
        that.disk_used_size = Math.round(response.data.result.data.slice(-1)[0][1] / 1024 / 1024)
        that.disk_avail_size = Math.round(response.data.result.data.slice(-1)[0][2] / 1024 / 1024)
      })
    },
    generateData: function () {
      this.generateNetworkData()
      this.generateDiskIOData()
      this.generateDiskData()
      this.generateCpuData()
      this.generateRamData()
    }
  },
  computed: {
    disk_used_percentage: function () {
      return Math.round(this.disk_used_size / (this.disk_avail_size + this.disk_used_size) * 100)
    }
  },
  components: {
    'my-line': MyLine
  },
  mounted () {
    this.generateData()
    // this.$message('测试数据，非真实数据')
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
<style>
.el-card__header {
  padding: 12px 20px;
}
</style>
