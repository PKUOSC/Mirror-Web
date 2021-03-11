<template>
  <div>
    <el-row>
      <h3>网络流量</h3>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>IPv4 Inbound Traffic</span>
          </div>
          <div v-if="chartdata_ipv4_in !== null">
            <my-line :chart-data="chartdata_ipv4_in"></my-line>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>IPv6 Inbound Traffic</span>
          </div>
          <div v-if="chartdata_ipv6_in !== null">
            <my-line :chart-data="chartdata_ipv6_in"></my-line>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:10px">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>IPv4 Outbound Traffic</span>
          </div>
          <div v-if="chartdata_ipv4_out !== null">
            <my-line :chart-data="chartdata_ipv4_out"></my-line>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>IPv6 Outbound Traffic</span>
          </div>
          <div v-if="chartdata_ipv6_out !== null">
            <my-line :chart-data="chartdata_ipv6_out"></my-line>
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
      chartdata_ipv4_in: null,
      chartdata_ipv4_out: null,
      chartdata_ipv6_in: null,
      chartdata_ipv6_out: null,
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
      this.$axios.get('/monitor_device/api/v1/data?chart=system.cpu&after=-86400&before=0&points=400&group=average&gtime=0&format=json&options=seconds&options=jsonwrap').then((response) => {
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
      this.$axios.get('/monitor_device/api/v1/data?chart=system.ram&after=-86400&before=0&points=400&group=average&gtime=0&format=json&options=seconds&options=jsonwrap').then((response) => {
        let allMem = 0
        let freeMem = 0
        response.data.result.data[0].forEach((val, idx, arr) => {
          if (idx !== 0) {
            allMem += val
            if (response.data.result.labels[idx] !== 'used') {
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
            val === 'buffers') {
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
        that.chartdata_memory = {
          type: 'Mib',
          axisX: that.calculateX(rawTimeline),
          data: data
        }
      })
    },
    generateIpv4InData: function () {
      let that = this
      this.$axios.get('/monitor_device/api/v1/data?chart=tc.world_in&after=-86400&before=0&points=400&group=average&gtime=0&format=json&options=seconds&options=jsonwrap').then((response) => {
        let raw = response.data.result.data.reverse()
        let needIdx = []
        let data = []
        let fraction = 1.0
        let type = 'Kib'
        response.data.result.labels.forEach((val, idx, arr) => {
          if (val === 'ipv4_http' ||
            val === 'ipv4_https' ||
            val === 'ipv4_rsync') {
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
          type = 'Mib'
          fraction /= 1024
        }
        if (maxv > 1024) {
          maxv /= 1024
          type = 'Gib'
          fraction /= 1024
        }
        raw.forEach((val, idx, arr) => {
          rawTimeline.push(val[0])
          needIdx.forEach((target, targetIdx, arr2) => {
            data[targetIdx].data.push(val[target] * fraction)
          })
        })
        that.chartdata_ipv4_in = {
          type: type,
          axisX: that.calculateX(rawTimeline),
          data: data
        }
      })
    },
    generateIpv6InData: function () {
      let that = this
      this.$axios.get('/monitor_device/api/v1/data?chart=tc.world_in&after=-86400&before=0&points=400&group=average&gtime=0&format=json&options=seconds&options=jsonwrap').then((response) => {
        let raw = response.data.result.data.reverse()
        let needIdx = []
        let data = []
        let fraction = 1.0
        let type = 'Kib'
        response.data.result.labels.forEach((val, idx, arr) => {
          if (val === 'ipv6_http' ||
            val === 'ipv6_https' ||
            val === 'ipv6_rsync') {
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
          type = 'Mib'
          fraction /= 1024
        }
        if (maxv > 1024) {
          maxv /= 1024
          type = 'Gib'
          fraction /= 1024
        }
        let rawTimeline = []
        raw.forEach((val, idx, arr) => {
          rawTimeline.push(val[0])
          needIdx.forEach((target, targetIdx, arr2) => {
            data[targetIdx].data.push(val[target] * fraction)
          })
        })
        that.chartdata_ipv6_in = {
          type: type,
          axisX: that.calculateX(rawTimeline),
          data: data
        }
      })
    },
    generateIpv4OutData: function () {
      let that = this
      this.$axios.get('/monitor_device/api/v1/data?chart=tc.world_out&after=-86400&before=0&points=400&group=average&gtime=0&format=json&options=seconds&options=jsonwrap').then((response) => {
        let raw = response.data.result.data.reverse()
        let needIdx = []
        let data = []
        let fraction = 1.0
        let type = 'Kib'
        response.data.result.labels.forEach((val, idx, arr) => {
          if (val === 'ipv4_http' ||
            val === 'ipv4_https' ||
            val === 'ipv4_rsync') {
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
          type = 'Mib'
          fraction /= 1024
        }
        if (maxv > 1024) {
          maxv /= 1024
          type = 'Gib'
          fraction /= 1024
        }
        raw.forEach((val, idx, arr) => {
          rawTimeline.push(val[0])
          needIdx.forEach((target, targetIdx, arr2) => {
            data[targetIdx].data.push(val[target] * fraction)
          })
        })
        that.chartdata_ipv4_out = {
          type: type,
          axisX: that.calculateX(rawTimeline),
          data: data
        }
      })
    },
    generateIpv6OutData: function () {
      let that = this
      this.$axios.get('/monitor_device/api/v1/data?chart=tc.world_out&after=-86400&before=0&points=400&group=average&gtime=0&format=json&options=seconds&options=jsonwrap').then((response) => {
        let raw = response.data.result.data.reverse()
        let needIdx = []
        let data = []
        let fraction = 1.0
        let type = 'Kib'
        response.data.result.labels.forEach((val, idx, arr) => {
          if (val === 'ipv6_http' ||
            val === 'ipv6_https' ||
            val === 'ipv6_rsync') {
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
          type = 'Mib'
          fraction /= 1024
        }
        if (maxv > 1024) {
          maxv /= 1024
          type = 'Gib'
          fraction /= 1024
        }
        raw.forEach((val, idx, arr) => {
          rawTimeline.push(val[0])
          needIdx.forEach((target, targetIdx, arr2) => {
            data[targetIdx].data.push(val[target] * fraction)
          })
        })
        that.chartdata_ipv6_out = {
          type: type,
          axisX: that.calculateX(rawTimeline),
          data: data
        }
      })
    },
    generateDiskData: function () {
      let that = this
      this.$axios.get('/monitor_device/api/v1/data?chart=disk_space._data&after=-1&before=0&points=1&group=average&gtime=0&format=json&options=seconds&options=jsonwrap').then((response) => {
        that.disk_used_size = Math.round(response.data.latest_values[1] / 1024)
        that.disk_avail_size = Math.round(response.data.latest_values[0] / 1024)
      })
    },
    generateData: function () {
      this.generateIpv4InData()
      this.generateIpv6InData()
      this.generateIpv4OutData()
      this.generateIpv6OutData()
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
