<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-menu
          :default-active="active"
          class="el-menu-vertical-demo"
          ref="menu"
          @select="handleSelect">
          <el-menu-item v-for="item in help_list" :key="item" :index="item">
            <span slot="title">{{comps[item].name == 'DefaultHelp' ? item : comps[item].name}}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18" :offset="1">
        <component :is="comps[active]" :help-file="active" v-on:render-complete="renderComplete()">
        </component>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'

import hljs from 'highlight.js/lib/core'
import Bash from 'highlight.js/lib/languages/bash'
import PlainText from 'highlight.js/lib/languages/plaintext'
import MarkdownItVue from 'markdown-it-vue/dist/markdown-it-vue-light.umd.min.js'
import DefaultHelp from '@/components/DefaultHelp.vue'
import allHelps from '@/components/helps'

hljs.registerLanguage('bash', Bash)
hljs.registerLanguage('plaintext', PlainText)
hljs.registerLanguage('unix-conf', (hljs) => {
  return {
    name: 'UNIX Config',
    aliases: [
      'unix-conf',
      'unix-config'
    ],
    disableAutodetect: true,
    contains: [
      hljs.COMMENT('^#', '$')
    ]
  }
})

/**
  * After build, highlight-js will be integrated into markdown-it-vue,
  * thus only calling registerLanguage does not work. We have to create
  * our own customized-markdown in order to support new languages.
  * The immediate reason to do so is that two useful languages, plaintext
  * and unix-conf, are missing in the markdown-it-vue.
  *
  * Another way is to patch markdown-it-vue and make it possible to
  * call registerLanguage directly. But it is not as easy as it looks
  * like. For example, a single HLJS instance is shared among all
  * markdown-it-vue instances and therefore, registerLanguage must be
  * designed to be a function that affects all markdown-it-vue instances,
  * which seems to be conflict with the interfaces that Vue.js provides.
  */
const CustomizedMarkdown = Object.assign({}, MarkdownItVue)
CustomizedMarkdown.data = function () {
  const d = MarkdownItVue.data.apply(this)
  d.md.use((md) => {
    md.renderer.rules.fence = (tokens, idx) => {
      const token = tokens[idx]
      const code = token.content
      const lang = token.info
      const langObj = hljs.getLanguage(lang)
      let cnt
      if (langObj) {
        cnt = hljs.highlight(lang, code).value
      } else {
        cnt = hljs.highlight('plaintext', code).value
      }
      return `<pre class="hljs"><code>${cnt}</code></pre>`
    }
  })
  return d
}
Vue.component('customized-markdown', CustomizedMarkdown)

let data = []
for (var key in allHelps) {
  data.push(key)
}

const checkRoute = function (to, from, next) {
  if (!to.params.hasOwnProperty('active')) {
    // Redirect to the default help page.
    next({ path: `/Help/Ubuntu`, replace: to.name === null })
  } else if (to.params.active in allHelps === false) {
    // throw err
    next({ path: `/Help/Ubuntu`, replace: to.name === null })
  } else {
    next()
  }
}

export default {
  name: 'Help',
  data () {
    return {
      help_list: data,
      active: this.$route.params.active,
      comps: allHelps
    }
  },
  methods: {
    handleSelect: function (key, keyPath) {
      if (this.active === key) {
        return
      }
      this.active = key
      this.$router.push({ params: { active: key } })
    },
    renderComplete: function () {
      // Scroll to the right position when the rendering is complete.
      let hash = window.location.hash
      if (hash.length <= 1) {
        return
      } else {
        hash = decodeURIComponent(hash.slice(1))
      }
      const el = document.getElementById(hash)
      if (!el) {
        return
      }
      el.scrollIntoView()
    }
  },
  /* beforeRouteEnter (to, from, next) {
    console.log(allHelps)
    checkRoute(to, from, next)
  }, */
  mounted () {
    let that = this
    this.$axios.get('/monitor/mirrors').then((res) => {
      for (var k in res.data) {
        let value = res.data[k]
        if (value.hasOwnProperty('help')) {
          if (!(value['help'] in allHelps)) {
            console.log('Not found And Added')
            that.help_list.push(value['help'])
            that.comps[value['help']] = DefaultHelp
          } else {
            // console.log('Found')
          }
        }
      }
      // console.log(that.help_list)
      if (!(that.active in that.comps)) {
        console.log('Handling')
        that.handleSelect('Ubuntu', 'Ubuntu')
      }
      that.help_list.sort()
    })
  },
  beforeRouteUpdate (to, from, next) {
    checkRoute(to, from, next)
    if (to.params.active !== this.active) {
      let el = this.$refs.menu.$el.querySelector(':focus')
      if (el) {
        // Unfocus from the previously clicked item.
        el.blur()
      }
      this.active = to.params.active
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>

<style>
/* Prevent navbar from covering the title that we are scrolling to. */
h1::before, h2::before {
  content: "";
  display: block;
  height: 80px;
  margin-top: -80px;
}
</style>
