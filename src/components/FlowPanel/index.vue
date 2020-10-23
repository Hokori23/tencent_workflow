<template>
  <section class="flow-panel">
    <FlowPanelLeft />
    <figure
      class="flow-panel__main"
      @drop="handleNodeDrop"
      @dragover="handleNodeDragOver"
    >
      <Node
        v-for="(node, idx) in nodes"
        :key="idx"
        :text="node.text"
        :position="node.position"
        :lines="node.lines"
        :type="node.type"
      />
      <!-- 工作流主要区域 -->
    </figure>
    <FlowPanelRight :selectedNode="selectedNode" />
  </section>
</template>
<script>
  import Vue from 'vue';

  import FlowPanelLeft from './Left.vue';
  import FlowPanelRight from './Right.vue';
  import Node from '@/components/Node.vue';
  // import FlowPanelMain from './Main.vue';

  export default {
    name: 'FlowPanel',
    props: {
      currentFlowId: Number
    },
    components: {
      FlowPanelLeft,
      // FlowPanelMain,
      FlowPanelRight,
      Node
    },
    watch: {
      currentFlowId: {
        handler(val) {
          console.log(val);
          /**
           * 切换场景时清空状态
           * 比如当前选中节点
           */
        }
      }
    },
    data() {
      return {
        nodes: [
          {
            text: '节点1',
            position: {
              x: 0,
              y: 0
            },
            lines: [],
            type: 1
          }
        ], // read from back-end
        selectedNode: {
          type: 1,
          name: '节点名',
          left: 0,
          top: 0,
          ico: ''
        }
      };
    },
    methods: {
      handleNodeDrop() {},
      handleNodeDragOver(e) {
        e.preventDefault();
      }
    }
  };
</script>
<style lang="scss">
  .flow-panel {
    display: flex;
    flex: 1 1 100%;
    &__main {
      position: relative;
      flex: 1 0 70%;
    }
  }
</style>