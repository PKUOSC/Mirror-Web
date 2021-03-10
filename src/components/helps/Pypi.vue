<template>
  <div>
    <h1>Pypi镜像使用指南</h1>
    <p>
      <customized-markdown :content="pypi_content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Pypi',
  data () {
    return {
      pypi_content: ''
    }
  },
  mounted () {
    this.$axios.get('/static/help/Pypi.md').then((response) => {
      this.pypi_content = response.data
    })
  }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>
