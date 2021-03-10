<template>
  <div>
    <h2><i class="el-icon-s-help"></i><strong>镜像列表</strong></h2>
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column
        label="Name"
        width="180">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="jumpTo(scope.row.url)" class="mirror-link">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        width="180">
      </el-table-column>
      <el-table-column
        prop="timestamp"
        label="Last Update"
        width="180">
      </el-table-column>
      <el-table-column
        label="Help"
        align="right">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-question"
            @click="handleHelp(scope.row.help)"
            v-if="scope.row.help !== ''"
            type="text"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import mirrors from '@/assets/mirrors.json'
import {DateTime} from 'luxon'
export default {
  name: 'Mirrors',
  data () {
    return {
      data: mirrors.data,
      status: null,
      currentTime: DateTime.local()
    }
  },
  computed: {
    tableData: function () {
      const result = []
      for (const key in this.data) {
        let thisStatus, thisTimestamp
        if (this.status === null || !this.status[key]) {
          thisStatus = '--'
          thisTimestamp = '--'
        } else {
          thisStatus = {'done': '正常', 'running': '同步中', 'error': '错误'}[this.status[key].status]
          thisTimestamp = DateTime.fromMillis(this.status[key].timestamp).toRelative({base: this.currentTime})
        }
        result.push({
          name: this.data[key].name,
          status: thisStatus,
          timestamp: thisTimestamp,
          url: this.data[key].url,
          help: this.data[key].hasOwnProperty('help') ? this.data[key].help : ''
        })
      }
      return result
    }
  },
  methods: {
    handleHelp: function (val) {
      this.$router.push({
        path: `/Help/${encodeURIComponent(val)}`
      })
    },
    jumpTo: function (url) {
      this.$router.push({
        path: url
      })
    },
    tableRowClassName: function ({row, rowIndex}) {
      switch (row.status) {
        case '正常':
          return 'success-row'
        case '同步中':
          return 'warning-row'
        case '--':
        case '错误':
          return 'fail-row'
      }
      return 'success-row'
    }
  },
  mounted () {
    let that = this
    this.$axios.get('/monitor/stat').then(res => {
      this.status = res.data
    }).catch((error) => {
      if (error.response) {
        that.$message.error('无法加载状态信息')
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  margin-bottom: 0;
}
.mirror-link {
  text-decoration: none;
  color: #1989fa;
  display: block;
}
.el-button {
  padding: 0;
}
</style>
<style>
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: transparent;
}
.el-table .fail-row {
  background: rgb(255, 222, 222);
}
</style>
