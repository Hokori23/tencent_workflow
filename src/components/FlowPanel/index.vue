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
          :key="`node-${idx}`"
          :node="node"
          :idx="idx"
          :selectedIdx="
            selectedDOM && selectedType === 0 ? selectedDOM.idx : -1
          "
          :tempLinePoint="tempLinePoint"
          :tempLine="tempLine"
          @select="select"
          @changeTarget="handleTargetChange"
        />
        <LineComponent
          v-for="(line, idx) in lines"
          :key="`line-${idx}`"
          :line="line"
          :idx="idx"
          :selectedIdx="
            selectedDOM && selectedType === 1 ? selectedDOM.idx : -1
          "
          @select="select"
          @changeTarget="handleTargetChange"
        />
      </svg>
      <!-- <NodeComponent
        v-for="(node, idx) in nodes"
        :key="idx"
        :node="node"
        @select="select"
      /> -->
    </figure>
    <FlowPanelRight
      :selectedDOM="selectedDOM"
      :selectedType="selectedType"
      @saveNode="saveNode"
    />
  </section>
</template>
<script>
  import bus from '@/bus';

  import FlowPanelLeft from './Left.vue';
  import FlowPanelRight from './Right.vue';
  import NodeComponent from '@/components/FlowPanel/Node.vue';
  import LineComponent from '@/components/FlowPanel/Line.vue';

  import Node from '@/vo/Node';
  import Line from '@/vo/Line';
  import Point from '@/vo/Point';
  // import FlowPanelMain from './Main.vue';
  const node1 = new Node(1, '一个节点', new Point(0, 0), [], 1);
  const node2 = new Node(2, '第二个节点', new Point(150, 150), [], 2);
  export default {
    name: 'FlowPanel',
    props: {
      currentFlowId: Number
    },
    components: {
      FlowPanelLeft,
      // FlowPanelMain,
      FlowPanelRight,
      NodeComponent,
      LineComponent
    },
    watch: {
      currentFlowId: {
        handler(val) {
          /**
           * 切换场景时清空状态
           * 比如当前选中节点
           */
          this.selectedDOM = null;
        }
      }
    },
    data() {
      return {
        nodes: [node1, node2], // read from back-end
        lines: [new Line(1, '条件1', node1, node2, 2, 4, 2)],
        selectedDOM: null,
        selectedType: null, // ['NODE', 'LINE']
        nowTarget: null, // 当前操作对象: [Node, Line]
        tempLinePoint: null, // 临时线头
        tempLine: null, // 临时线
        isAttachedNode: false // 用于判断是否触发了EventBus的'attachNode'事件
      };
    },
    methods: {
      select(node, type) {
        this.selectedDOM = node;
        this.selectedType = type;
        const map = {
          NODE: this.nodes,
          LINE: this.lines
        };
        const arr = map[type];
        this.selectedDOM.idx = arr.indexOf(node);
      },
      saveNode(node, type) {
        const map = {
          NODE: this.nodes,
          LINE: this.lines
        };
        const arr = map[type];
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === node.id) {
            arr.splice(i, 1, node);
            break;
          }
        }
        // 保存 ----------- to do
      },
      handleTargetChange(nowTarget) {
        this.nowTarget = nowTarget;
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
          this.selectedDOM = null;
          return;
        }
        const { type } = this.nowTarget;
        const { offsetTop, offsetLeft } = this.$refs['flow-panel'];
        // 处理情况1 节点
        if (type === 'NODE') {
          const { idx, x, y } = this.nowTarget;
          const { position } = this.nodes[idx];
          this.$refs['flow-panel'].onmousemove = (e) => {
            position.x = e.clientX - offsetLeft - x;
            position.y = e.clientY - offsetTop - y;
          };
          return;
        }
        // 处理情况2 节点锚点
        if (type === 'ANCHOR') {
          /**
           * idx: ANCHOR类别;
           * node: ANCHOR所属节点;
           * position: ANCHOR坐标;
           */
          const { idx, node, position } = this.nowTarget;
          const { x, y } = node.position; // 当前节点(左上)坐标
          const { cx, cy } = position; // 锚点起始点坐标
          // const tempLinePoint = (this.tempLinePoint = JSON.parse(
          //   JSON.stringify(node)
          // ));
          const tempLinePoint = (this.tempLinePoint = Object.assign({}, node));
          const tempLinePoinstPosition = JSON.parse(
            JSON.stringify(node.position)
          );
          tempLinePoint.position = tempLinePoinstPosition;
          tempLinePoint.absolutePosition = true; // 给Line.vue标志，用于附加absolutePosition

          // 临时从锚点拉扯出一条线
          const tempLine = (this.tempLine = new Line(
            null,
            '',
            node,
            tempLinePoint,
            idx,
            idx,
            1
          ));
          this.lines.push(tempLine);
          bus.$emit('computeNearestAnchor', idx, node);
          this.$refs['flow-panel'].onmousemove = (e) => {
            tempLinePoint.position.x = e.clientX - offsetLeft - (cx - x);
            tempLinePoint.position.y = e.clientY - offsetTop - (cy - y);
          };
        }
      },
      mouseup(e) {
        this.$refs['flow-panel'].onmousemove = null;
        if (!this.nowTarget) {
          return;
        }
        const { type } = this.nowTarget;
        // 处理情况1 线
        if (type === 'LINE') {
          bus.$emit('stopComputingNearestAnchor');
          if (this.isAttachedNode) {
            this.isAttachedNode = false;
          } else if (this.tempLinePoint && this.tempLine) {
            this.lines.pop();
          }

          // 清理临时数据
          this.tempLinePoint && delete this.tempLinePoint.absolutePosition;
          this.tempLine = this.tempLinePoint = null;
        }
        // 处理情况2 节点锚点
        if (type === 'ANCHOR') {
          console.log('取消锚点拖拽');
        }
        this.nowTarget = null;
      },
      attachNode() {
        this.isAttachedNode = true;
      },
      deleteDOM() {
        if (!this.selectedDOM) {
          this.$alert('暂无选中节点', '警告', {
            confirmButtonText: '确定'
          });
          return;
        }
        /**
         * 分类删除 ------------------------ to do
         */
        this.nodes.splice(this.selectedDOM.idx, 1);
        this.selectedDOM = null;
      }
    },
    mounted() {
      bus.$on('deleteDOM', this.deleteDOM);
      bus.$on('attachNode', this.attachNode);
    },
    beforeDestroy() {
      bus.$off('deleteDOM');
      bus.$off('attachNode');
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