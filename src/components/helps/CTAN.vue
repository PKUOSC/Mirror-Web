<template>
  <div>
    <h1>CTAN镜像使用指南</h1>
    <p>
      <customized-markdown :content="epel_content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'CTAN',
  data () {
    return {
      epel_content: ''
    }
  },
  mounted () {
    this.$axios.get('/static/help/CTAN.md').then((response) => {
      this.epel_content = response.data
    })
  }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>
