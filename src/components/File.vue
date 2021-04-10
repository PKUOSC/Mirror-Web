<template>
  <div>
    <el-row>
      <el-card shadow="always">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in hierachy" :key="index">
            <a href="javascript:void(0);" @click="jumpTo(item.value)">
              {{item.label}}
            </a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>
    <el-row>
      <el-table
        v-loading="loading"
        :data="content"
        style="width: 100%">
        <el-table-column
          label="Name">
          <template slot-scope="scope">
            <div>
              <a class="my-url" v-if="scope.row.type === 'directory'" href="javascript:void(0);" @click="jumpTo(url + scope.row.name + '/')">
                {{scope.row.name}}
              </a>
              <a class="my-url" v-else :href="url + scope.row.name">
                {{scope.row.name}}
              </a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Size">
          <template slot-scope="scope">
            {{ scope.row.hasOwnProperty('size') ? scope.row.size : '' }}
          </template>
        </el-table-column>
        <el-table-column
          label="Date">
          <template slot-scope="scope">{{ scope.row.mtime }}</template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'File',
  mounted () {
    this.recalc()
  },
  methods: {
    make404Req: function () {
      let func
      if (history.length === 0) {
        // the first route resolution
        func = window.location.replace
      } else {
        // not the first route resolution
        func = window.location.assign
      }
      func.apply(window.location, [`/Error404`])
    },
    recalc: function () {
      let that = this
      this.$axios.get('/files' + this.url).then(res => {
        that.content = res.data
        that.loading = false
      }).catch(err => {
        if (err.response.status === 404) {
          this.make404Req()
        }
      })
    },
    jumpTo: function (path) {
      if (path.endsWith('/')) {
        console.log('Pushing')
        this.$router.push(path)
        // this.url = path
        // this.loading = true
        // this.recalc()
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    console.log(to)
    this.url = to.fullPath + (to.fullPath.endsWith('/') ? '' : '/')
    this.loading = true
    this.recalc()
    next()
  },
  data () {
    return {
      content: [],
      url: this.$route.fullPath + (this.$route.fullPath.endsWith('/') ? '' : '/'),
      loading: true
    }
  },
  computed: {
    hierachy: function () {
      let labels = this.url.substr(1).split('/')
      let res = []
      let sumv = ''
      for (var i = 0; i < labels.length - 1; i++) {
        sumv += '/' + labels[i]
        res.push({
          label: labels[i],
          value: sumv + '/'
        })
      }
      return res
    }
  }
}
</script>
<style scoped>
.my-url {
  color: #1989fa !important;
  text-decoration: none;
  font-family: 'Avenir',Helvetica,Arial,"Hiragino Sans GB","Microsoft Yahei","\5FAE\8F6F\96C5\9ED1",STHeiti,"\534E\6587\7EC6\9ED1",sans-serif;
}
</style>
