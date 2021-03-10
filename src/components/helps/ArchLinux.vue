<template>
  <div>
    <h1>Arch Linux镜像使用指南</h1>
    <p>
      <customized-markdown :content="content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Arch Linux',
  data () {
    return {
      content: ''
    }
  },
  mounted () {
    this.$axios.get('/static/help/ArchLinux.md').then((response) => {
      this.content = response.data
    })
  }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>
