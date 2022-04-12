<template>
  <div>
    <h1>Docker-ce镜像使用指南</h1>
    <div>
      <div class="select-version">
        <strong>选择你的操作系统版本:</strong>
      </div>
      <div class="select-version">
        <el-select v-model="selected" placeholder="请选择" v-on:change="handleSelect()">
          <el-option value="CentOS"></el-option>
          <el-option value="Ubuntu"></el-option>
        </el-select>
      </div>
    </div>
    <p>
      <customized-markdown :content="content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Docker-ce',
  data () {
    return {
      selected: 'CentOS',
      content: ''
    }
  },
  mounted () {
    this.$axios.get('/static/help/Docker-ce/' + this.selected + '.md').then((response) => {
      this.content = response.data
    })
  },
  methods: {
    handleSelect: function () {
      // Avoid unnecessary scrolling when the rendering is complete.
      if (this.$route.hash) {
        this.$router.replace({ hash: '' })
      }
    }
  },
  watch: {
    selected: function () {
      this.$axios.get('/static/help/Docker-ce/' + this.selected + '.md').then((response) => {
        this.content = response.data
      })
    }
  }
}
</script>

<style scoped>
p {
  text-align: left;
}

.select-version {
  display: inline-block;
  vertical-align: middle;
}
</style>
