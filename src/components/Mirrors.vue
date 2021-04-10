<template>
  <div>
    <h2><i class="el-icon-s-help"></i><strong>镜像列表</strong></h2>
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column
        label="Name"
        >
        <template slot-scope="scope">
          <div style="">
            <el-tooltip effect="dark" v-if="scope.row.describe!==''" :content="scope.row.describe" placement="right">
              <a href="javascript:void(0)" @click="jumpTo(scope.row.url)" class="mirror-link">{{scope.row.name}}</a>
            </el-tooltip>
            <a href="javascript:void(0)" @click="jumpTo(scope.row.url)" class="mirror-link" v-else>{{scope.row.name}}</a>
            <el-button
            icon="el-icon-question"
            @click="handleHelp(scope.row.help)"
            v-if="scope.row.help !== ''"
            type="text"></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
        width="180">
        <template slot-scope="scope">
          {{scope.row.status}} <i v-if="scope.row.status === '同步中'" class="el-icon-loading"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="lasttimestamp"
        label="Last Update"
        width="180">
      </el-table-column>
      <el-table-column
        prop="nexttimestamp"
        label="Next Update"
        width="180">
      </el-table-column>
    </el-table>
    <div style="height: 35px;"></div>
  </div>
</template>

<script>
import {DateTime} from 'luxon'
export default {
  name: 'Mirrors',
  data () {
    return {
      data: null,
      status: null,
      currentTime: DateTime.local()
    }
  },
  computed: {
    tableData: function () {
      const result = []
      if (this.data === null) {
        return result
      }
      for (const key in this.data) {
        let thisStatus, thisTimestamp, nextTimestamp, thisDescribe
        if (this.status === null || !this.status.hasOwnProperty(key)) {
          thisStatus = '--'
          thisTimestamp = '--'
          nextTimestamp = '--'
        } else {
          thisStatus = {'done': '正常', 'sync': '同步中', 'error': '错误'}[this.status[key].state]
          thisTimestamp = DateTime.fromMillis(this.status[key].lastSyncTime).toRelative({base: this.currentTime})
          nextTimestamp = DateTime.fromMillis(this.status[key].nextSyncTime).toRelative({base: this.currentTime})
        }
        thisDescribe = ''
        if (this.data[key].hasOwnProperty('describe')) {
          thisDescribe = this.data[key].describe
        }
        result.push({
          name: this.data[key].name,
          status: thisStatus,
          lasttimestamp: thisTimestamp,
          nexttimestamp: nextTimestamp,
          url: this.data[key].url,
          describe: thisDescribe,
          help: this.data[key].hasOwnProperty('help') ? this.data[key].help : ''
        })
      }
      return result.sort((a, b) => {
        if (a.name < b.name) {
          return -1
        }
        return 1
      })
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
    this.$axios.get('/monitor/mirrors').then(res => {
      this.data = res.data
    })
    this.$axios.get('/monitor/status').then(res => {
      let status = {}
      res.data.forEach((val, idx, arr) => {
        status[val['id']] = val
      })
      this.status = status
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
  width: auto;
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
