<template>
  <div>
    <h1>Openwrt镜像使用指南</h1>
    <p>
      <customized-markdown :content="openwrt_content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Openwrt',
  data () {
    return {
      openwrt_content: ''
    }
  },
  mounted () {
    this.$axios.get('/static/help/Openwrt.md').then((response) => {
      this.openwrt_content = response.data
    })
  }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>
