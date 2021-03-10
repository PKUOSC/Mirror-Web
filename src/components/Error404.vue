<template>
  <div>
    <h2> 404 Not Found </h2>
    <p>
      您要找的页面不存在，请去往<router-link to="/">首页</router-link>或返回<a v-on:click="$router.back()" href="javascript:void(0)">上页</a>。
    </p>
    <p class="url"> {{ url }} </p>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  data () {
    return {
      url: this.$route.query.url
    }
  }
}
</script>

<style scoped>
div {
  width: 300pt;
  margin: 0 auto;
}

p.url {
  color: gray;
}

a, a:visited {
  text-decoration: none;
  color: blue;
}
</style>
