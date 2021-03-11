<template>
  <div id="app">
    <my-navbar class="my-navbar"></my-navbar>
    <div class="my-content">
      <transition name="fade">
        <router-view/>
      </transition>
    </div>
    <my-footer class="my-footer"></my-footer>
  </div>
</template>

<script>
import navbarVue from './components/Navbar/navbar.vue'
import navFooter from './components/Navbar/navfooter.vue'
export default {
  name: 'App',
  components: {
    'my-navbar': navbarVue,
    'my-footer': navFooter
  }
}
</script>

<style>
/* Note: Apply ``overflow-{x,y}: hidden'' on <li></li> will hide the marker. */
body {
  overflow-x: scroll;
  overflow-y: scroll;
}
@font-face {
  font-family: 'Avenir';
  src: url('/static/Avenir/avenir-next-regular.ttf'),
       url('/static/Avenir/avenir-next-regular.woff'),
       url('/static/Avenir/avenir-next-regular.woff2');
}
#app {
  font-family: 'Avenir',Helvetica,Arial,"Hiragino Sans GB","Microsoft Yahei","微软雅黑",STHeiti,"华文细黑",sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
.my-navbar {
  z-index: 1500;
}
.my-content {
  padding-top: 80px;
  max-width: 1140px;
  margin: 0 auto;
  z-index: 0;
}
.my-footer {
  z-index: 1500;
}
.fade-enter-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to, .fade-leave-active {
  opacity: 0;
}
</style>
