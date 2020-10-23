<template>
  <section class="flow-panel">
    <FlowPanelLeft />
    <figure
      class="flow-panel__main"
      ref="flow-panel"
      @drop="drop"
      @dragover="dragover"
      @mousedown="mousedown"
      @mouseup="mouseup"
    >
      <!-- 工作流主要区域 -->
      <svg
        width="100%"
        height="100%"
        verision="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <NodeComponent
          v-for="(node, idx) in nodes"
          :key="idx"
          :node="node"
          :idx="idx"
          :selectedIdx="selectedNode ? selectedNode.idx : -1"
          @selectNode="selectNode"
          @changeTarget="handleTargetChange"
        />
      </svg>
      <!-- <NodeComponent
        v-for="(node, idx) in nodes"
        :key="idx"
        :node="node"
        @selectNode="selectNode"
      /> -->
    </figure>
    <FlowPanelRight :selectedNode="selectedNode" @saveNode="saveNode" />
  </section>
</template>
<script>
  import Vue from 'vue';

  import bus from '@/bus';
  import FlowPanelLeft from './Left.vue';
  import FlowPanelRight from './Right.vue';
  import NodeComponent from '@/components/Node.vue';
  import Node from '@/vo/Node';
  import Point from '@/vo/Point';
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
      NodeComponent
    },
    watch: {
      currentFlowId: {
        handler(val) {
          /**
           * 切换场景时清空状态
           * 比如当前选中节点
           */
          this.selectedNode = null;
        }
      }
    },
    data() {
      return {
        nodes: [
          new Node(1, '一个节点', new Point(150, 150), [], 1),
          new Node(2, '第二个节点', new Point(250, 200), [], 2)
        ], // read from back-end
        selectedNode: null,
        nowTarget: null // 当前操作对象: [Node, Line]
      };
    },
    methods: {
      selectNode(node) {
        this.selectedNode = node;
        this.selectedNode.idx = this.nodes.indexOf(node);
      },
      saveNode(node) {
        for (let i = 0; i < this.nodes.length; i++) {
          if (this.nodes[i].id === node.id) {
            this.nodes.splice(i, 1, node);
            break;
          }
        }
        // 保存?
      },
      handleTargetChange(nowTarget, state) {
        if (state) {
          this.nowTarget = nowTarget;
        } else {
          this.nowTarget = null;
        }
      },
      drop(e) {
        let { newnodetype, label } = JSON.parse(
          e.dataTransfer.getData('newNode')
        );
        newnodetype = Number(newnodetype);
        const { offsetTop, offsetLeft } = this.$refs['flow-panel'];

        // 至多存在一个开始或结束节点
        if (newnodetype === 1 || newnodetype === 3) {
          for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].type === newnodetype) {
              this.$alert(
                `至多存在一个${newnodetype === 1 ? '开始' : '结束'}节点`,
                '警告',
                {
                  confirmButtonText: '确定'
                }
              );
              return;
            }
          }
        }

        // 添加节点
        this.nodes.push(
          new Node(
            null,
            label,
            new Point(e.clientX - offsetLeft - 50, e.clientY - offsetTop - 20),
            [],
            newnodetype
          )
        );
      },
      dragover(e) {
        e.preventDefault();
      },
      mousedown(e) {
        if (!this.nowTarget) {
          this.selectedNode = null;
          return;
        }
        const { type, idx, x, y } = this.nowTarget;
        // 处理情况1 节点
        if (type === 'NODE') {
          const { position } = this.nodes[idx];
          const { offsetTop, offsetLeft } = this.$refs['flow-panel'];
          this.$refs['flow-panel'].onmousemove = (e) => {
            position.x = e.clientX - offsetLeft - x;
            position.y = e.clientY - offsetTop - y;
          };
          return;
        }
        // 处理情况2 节点锚点
        if (type === 'ANCHOR') {
          console.log('锚点拖拽');
        }
      },
      mouseup(e) {
        this.$refs['flow-panel'].onmousemove = null;
        console.log('up');
      },
      deleteNode() {
        if (!this.selectedNode) {
          this.$alert('暂无选中节点', '警告', {
            confirmButtonText: '确定'
          });
          return;
        }
        this.nodes.splice(this.selectedNode.idx, 1);
        this.selectedNode = null;
      }
    },
    mounted() {
      bus.$on('deleteNode', this.deleteNode);
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