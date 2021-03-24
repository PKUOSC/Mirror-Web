<template>
  <div>
    <h1>Git-repos镜像使用指南</h1>
    <p>
      <customized-markdown :content="git_repos_content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Git-repos',
  data () {
    return {
      git_repos_content: ''
    }
  },
  mounted () {
    this.$axios.get('/static/help/Git-repos.md').then((response) => {
      this.git_repos_content = response.data
    })
  }
}
</script>

<style scoped>
p {
  text-align: left;
}
</style>
