<template>
  <div>
    <h1>Kubernetes镜像使用指南</h1>
    <p>
      <customized-markdown :content="anaconda_content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Anaconda',
  data () {
    return {
      anaconda_content: ''
    }
  },
  mounted () {
    this.$axios.get('/static/help/Kubernetes.md').then((response) => {
      this.anaconda_content = response.data
    })
  }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>
