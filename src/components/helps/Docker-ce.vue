<template>
  <div>
    <h1>Docker-ce镜像使用指南</h1>
    <p>
      <customized-markdown :content="docker-ce_content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Docker-ce',
  data () {
    return {
      docker-ce_content: ''
    }
  },
  mounted () {
    this.$axios.get('/static/help/Docker-ce.md').then((response) => {
      this.docker-ce_content = response.data
    })
  }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>
