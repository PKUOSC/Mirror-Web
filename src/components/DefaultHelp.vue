<template>
  <div>
    <h1>{{helpFile}}镜像使用指南</h1>
    <p>
      <customized-markdown :content="epel_content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'DefaultHelp',
  data () {
    return {
      epel_content: ''
    }
  },
  mounted () {
    this.$axios.get(`/static/help/${this.helpFile}.md`).then((response) => {
      this.epel_content = response.data
    })
  },
  props: {
    helpFile: {
      type: String,
      default: 'EPEL'
    }
  }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>
