<template>
  <div v-if="node_list != null && form.current_node != null">
    <el-row style="margin-top:10px">
      <el-col :span="8" :offset="8">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="Status of">
            <el-select v-model="form.current_node" placeholder="Select">
              <el-option
                v-for="item in node_list"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <my-node-status node-name="node"></my-node-status>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import NodeStatus from '@/components/Status/NodeStatus'
export default {
  name: 'Status',
  data () {
    return {
      node_list: null,
      form: {
        current_node: null
      }
    }
  },
  methods: {
  },
  mounted () {
    let that = this
    this.$axios.get('/monitor/node_list').then((res) => {
      that.node_list = res.data
      that.form.current_node = res.data[0]
    })
  },
  components: {
    'my-node-status': NodeStatus
  }
}
</script>
