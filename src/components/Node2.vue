<template>
  <!-- <section
    class="flow-panel__node"
    :style="computedStyle"
    @mousedown="handleNodeSelect"
  > -->
  <g
    class="flow-panel__node"
    @mousedown="handleSelectNode"
  >
    <rect
      :x="node.position.x"
      :y="node.position.y"
      width="100"
      height="40"
      rx="4"
      ry="4"
      :style="`fill: ${color[node.type - 1]}`"
    >
    </rect>
    <!-- :x="node.position.x + 49"
      :y="node.position.y + 25" -->
    <text
      :x="node.position.x + 50"
      :y="node.position.y + 20"
      height="40"
      text-anchor="middle"
      alignment-baseline="middle"
      fill="#ffffff"
      >{{ color[node.type - 1] ? node.name : '节点类型错误' }}</text
    ></g
  >
  <!-- <el-button :type="btnType[node.type - 1] || 'warning'">{{
      btnType[node.type - 1] ? node.name : '节点类型错误'
    }}</el-button>
  </section> -->
</template>
<script>
  import Vue from 'vue';
  export default {
    props: {
      node: Object
    },
    computed: {
      computedStyle() {
        const { position } = this.node;
        const { x, y } = position;
        return {
          left: `${x}px`,
          top: `${y}px`
        };
      }
    },
    data() {
      return {
        color: ['#409eff', '#67c23a', '#f56c6c']
      };
    },
    methods: {
      handleSelectNode(e) {
        console.log(e);
        this.$emit('selectNode', this.node);
      }
    },
    mounted() {
      console.log(this.node);
    }
  };
</script>
<style lang="scss" scoped>
  .flow-panel__node {
    cursor: pointer;
    rect:hover {
      stroke-dashoffset: 0;
      stroke-dasharray: 300;
    }
  }
</style>