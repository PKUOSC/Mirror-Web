<template>
  <div class="headerWrapper">
    <div class="header">
      <div class="container">
        <div class="logo-container" style="height:100%;display:flex;align-items:center;">
          <el-button id="navbar-logo" type="text" @click="jumpTo('/')" style="color:black;padding: 0;">
            <h1>
              <el-image
                style="width: 60px; height: 60px"
                src="/static/logo.png"
                fit="fill"></el-image>
            </h1>
          </el-button>
        </div>
        <ul class="my-nav">
          <li class="my-nav-item">
            <a href="javascript:void(0)" @click="jumpTo('/')" :class="$route.path === '/'?'active':'inactive'">Home</a>
          </li>
          <li class="my-nav-item">
            <a href="javascript:void(0)" @click="jumpTo('/Mirrors')" :class="$route.path === '/Mirrors'?'active':'inactive'">Mirrors</a>
          </li>
          <li class="my-nav-item">
            <a href="javascript:void(0)" @click="jumpTo('/Status')" :class="$route.path === '/Status'?'active':'inactive'">Status</a>
          </li>
          <li class="my-nav-item">
            <a href="javascript:void(0)" @click="jumpTo('/Help')" :class="$route.path.startsWith('/Help/')?'active':'inactive'">Help</a>
          </li>
          <li class="my-nav-item">
            <a href="javascript:void(0)" @click="jumpTo('/About')" :class="$route.path === '/About'?'active':'inactive'">About</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navbarVue',
  data () {
    return {
      activeIndex: '/'
    }
  },
  methods: {
    jumpTo: function (path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    }
  }
}
</script>

<style scoped>
.headerWrapper {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
}
.header {
  height: 80px;
  background-color: #fff;
  color: #fff;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 80px;
  z-index: 100;
  position: relative;
}
.header .container {
  height: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #dcdfe6;
  width: 1140px;
  padding: 0;
  margin: 0 auto;
}
.logo-container {
  float: left;
}
.my-nav {
  float: right;
  height: 100%;
  line-height: 80px;
  background: transparent;
  padding: 0;
  margin: 0 !important;
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
  display: table;
  content: "";
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}
.my-nav-item {
  margin: 0;
  float: left;
  list-style: none;
  position: relative;
  cursor: pointer;
  display: list-item;
  text-align: -webkit-match-parent;
}
.my-nav-item a{
  text-decoration: none;
  color: #1989fa;
  display: block;
  padding: 0 22px;
}
a.active {
  opacity: 1;
}
a.active:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: calc(50% - 15px);
  width: 30px;
  height: 2px;
  background: #409eff;
}
a.inactive {
  opacity: .5;
}
h1 {
  margin: 0;
  padding: 0;
}
</style>
