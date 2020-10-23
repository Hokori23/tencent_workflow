<template>
  <aside class="flow-panel__left">
    <el-collapse
      v-model="activeNames"
      style="margin: 0 20px 0 40px"
      @dragstart.native="handleDragStart"
    >
      <el-collapse-item title="开始节点" name="startNodes">
        <div v-for="startNode in startNodes" :key="startNode.label">
          <el-button style="margin-top: 10px" size="mini" draggable="true">
            {{ startNode.label }}
          </el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="结束节点" name="endNodes">
        <div v-for="endNode in endNodes" :key="endNode.label">
          <el-button style="margin-top: 10px" size="mini" draggable="true">
            {{ endNode.label }}
          </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </aside>
</template>
<script>
  import Vue from 'vue';
  export default {
    name: 'FlowPanel__Left',
    data() {
      return {
        activeNames: ['startNodes', 'endNodes'],
        startNodes: [
          {
            label: '数据接入'
          },
          {
            label: '接口调用'
          }
        ],
        endNodes: [
          {
            label: '流程结束'
          },
          {
            label: '数据清理'
          }
        ]
      };
    },
    methods: {
      handleDragStart(e) {
        const dom = e.target;
        if (dom.nodeName === 'BUTTON' && dom.draggable) {
          console.log('drag start');
        }
      }
    }
  };
</script>
<style lang="scss">
  .flow-panel__left {
    flex: 1 1 100%;
    max-width: 250px;
    border-right: 1px solid #e0e6eb;
  }
</style>