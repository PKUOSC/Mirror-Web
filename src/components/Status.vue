<template>
  <div>
    <my-node-status node-name="node_node"></my-node-status>
  </div>
</template>

<script>
import NodeStatus from '@/components/Status/NodeStatus'
export default {
  name: 'Status',
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
  },
  components: {
    'my-node-status': NodeStatus
  }
}
</script>
