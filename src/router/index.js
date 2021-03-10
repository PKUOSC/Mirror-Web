import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('@/components/Home')
const Status = () => import('@/components/Status')
const Mirrors = () => import('@/components/Mirrors')
const Help = () => import('@/components/Help')
const About = () => import('@/components/About')
const Error404 = () => import('@/components/Error404')
const File = () => import('@/components/File')

Vue.use(Router)

/**
  * The HTML5 history mode should be used. Otherwise,
  * if we use the hash mode, we cannot use the anchor
  * part of the URL to link to some tags of the page
  * (say, a markdown section in the documentation).
  */
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/Status',
      name: 'Status',
      component: Status,
      meta: {
        title: '状态'
      }
    },
    {
      path: '/Mirrors',
      name: 'Mirrors',
      component: Mirrors,
      meta: {
        title: '镜像'
      }
    },
    /**
      * The alias option requires the number of parameters
      * to be the same, so it cannot be used here. Thus
      * we have to repeat the help component twice.
      */
    {
      path: '/Help/:active',
      name: 'Help',
      component: Help,
      meta: {
        title: '帮助'
      }
    },
    {
      path: '/Help',
      name: 'Help',
      component: Help,
      meta: {
        title: '帮助'
      }
    },
    {
      path: '/About',
      name: 'About',
      component: About,
      meta: {
        title: '关于'
      }
    },
    {
      path: '/Error404',
      name: 'Error404',
      component: Error404,
      meta: {
        title: '错误'
      }
    },
    {
      path: '*',
      name: 'File',
      component: File,
      meta: {
        title: '文件'
      }
    }
  ]
})

router.onError(err => {
  if (err.message === '404') {
    /**
      * We need to load a new page, so the server can generate a new
      * HTTP response whose status code is 404. And we want to guarantee
      * that whenever the user wants to go back, the browser goes to a
      * proper page.
      *
      * XXX: Should we use server side rendering?
      */
    let func
    let url
    if (err.source === null) {
      // the first route resolution
      func = window.location.replace
      url = window.location.href
    } else {
      // not the first route resolution
      func = window.location.assign
      url = window.location.origin + err.target
    }
    func.apply(window.location, [`/Error404?url=${encodeURIComponent(url)}`])
  }
})

export default router
