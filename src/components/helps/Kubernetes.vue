<template>
  <div>
    <h1>Kubernetes镜像使用指南</h1>
    <p>
      <customized-markdown :content="kubernetes_content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Kubernetes',
  data () {
    return {
      kubernetes_content: ''
    }
  },
  mounted () {
    this.$axios.get('/static/help/Kubernetes.md').then((response) => {
      this.kubernetes_content = response.data
    })
  }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>
