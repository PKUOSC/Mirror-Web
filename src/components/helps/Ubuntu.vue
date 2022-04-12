<template>
  <div>
    <h1>Ubuntu镜像使用指南</h1>
    <div>
      <div class="select-version">
        <strong>选择你的Ubuntu版本:</strong>
      </div>
      <div class="select-version">
        <el-select v-model="version" value-key="version" placeholder="请选择" v-on:change="handleSelect()">
          <el-option v-for="v in versions" :key="v.version" :value="v" :label="v.version">
          </el-option>
        </el-select>
      </div>
    </div>
    <p>
      <customized-markdown :content="content" v-on:render-complete="$emit('render-complete')">
      </customized-markdown>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Ubuntu',
  data () {
    return {
      content_raw: '',
      versions: [
        {
          version: '14.04',
          codename: 'trusty'
        },
        {
          version: '16.04',
          codename: 'xenial'
        },
        {
          version: '18.04',
          codename: 'bionic'
        },
        {
          version: '20.04',
          codename: 'focal'
        },
        {
          version: '21.04',
          codename: 'hirsute'
        },
        {
          version: '21.10',
          codename: 'impish'
        }
      ],
      version: null
    }
  },
  created () {
    this.version = this.versions[4]
  },
  mounted () {
    this.$axios.get('/static/help/Ubuntu.md').then((response) => {
      this.content_raw = response.data
    })
  },
  methods: {
    handleSelect: function () {
      // Avoid unnecessary scrolling when the rendering is complete.
      if (this.$route.hash) {
        this.$router.replace({ hash: '' })
      }
    }
  },
  computed: {
    content () {
      if (!this.version) {
        return ''
      }
      return this.content_raw.replace(
        /{ubuntu_version}/g, this.version.version
      ).replace(
        /{ubuntu_codename}/g, this.version.codename
      )
    }
  }
}
</script>

<style scoped>
p {
  text-align: left;
}

.select-version {
  display: inline-block;
  vertical-align: middle;
}
</style>
