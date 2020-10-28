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
            selectedDOM && selectedType === 'NODE' ? selectedDOM.idx : -1
          "
          :tempLinePoint="tempLinePoint"
          :tempLine="tempLine"
          @select="select"
          @changeTarget="changeTarget"
        />
        <LineComponent
          v-for="(line, idx) in lines"
          :key="`line-${idx}`"
          :line="line"
          :idx="idx"
          :selectedIdx="
            selectedDOM && selectedType === 'LINE' ? selectedDOM.idx : -1
          "
          :tempLinePoint="tempLinePoint"
          @select="select"
          @changeTarget="changeTarget"
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

  import {
    createNode,
    deleteNode,
    createLine,
    deleteLine,
    getFlow,
    updateFlow
  } from '@/api';
  import { dealWithResultCode } from '@/utils';

  export default {
    name: 'FlowPanel',
    props: {
      currentFlowId: Number
    },
    components: {
      FlowPanelLeft,
      FlowPanelRight,
      NodeComponent,
      LineComponent
    },
    watch: {
      currentFlowId: {
        async handler(val) {
          /**
           * 切换场景时清空状态
           * 比如当前选中节点
           */
          this.selectedDOM = this.nodes = this.lines = null;

          // 获取数据
          const { code, message, data } = await getFlow(this.currentFlowId);
          dealWithResultCode(code, message, this);
          if (code) {
            return;
          }
          // 处理数据
          let { nodes, lines } = data;
          console.log('处理前数据', nodes, lines);
          this.nodes = nodes.map((node) => {
            return this.formatNode(node);
          });
          nodes = this.nodes;
          this.lines = lines.map((line) => {
            return this.formatLine(line);
          });
          console.log('处理后数据', this.nodes, this.lines);
        },
        immediate: true
      }
    },
    data() {
      return {
        nodes: [],
        lines: [],
        selectedDOM: null,
        selectedType: null, // ['NODE', 'LINE']
        nowTarget: null, // 当前操作对象: [Node, Line]
        tempLinePoint: null, // 临时线头
        tempLine: null, // 临时线
        tempNodes: null, // 缓存原始起始节点
        isAttachedNode: false, // 用于判断是否触发了EventBus的'attachNode'事件
        preLinePoint: null // 拖动已存在的线时临时保存原节点 //test
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
        this.$set(this.selectedDOM, 'idx', arr.indexOf(node));
      },
      saveNode(preNode, node, type) {
        const map = {
          NODE: this.nodes,
          LINE: this.lines
        };
        const arr = map[type];
        for (let i = 0; i < arr.length; i++) {
          if (preNode === arr[i]) {
            Object.assign(arr[i], node);
            break;
          }
        }
      },
      changeTarget(nowTarget) {
        this.nowTarget = nowTarget;
      },
      async drop(e) {
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
        let node = new Node(
          null,
          this.currentFlowId,
          label,
          new Point(e.clientX - offsetLeft - 50, e.clientY - offsetTop - 20),
          [],
          newnodetype
        );
        const { code, message, data } = await createNode(this.destructNode(node));
        dealWithResultCode(code, message, this);
        node = this.formatNode(data);
        if (code) {
          return;
        }
        this.nodes.push(node);
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
        console.log('mousedown', type);
        const { offsetTop, offsetLeft } = this.$refs['flow-panel'];

        // 处理情况1 节点
        if (type === 'NODE') {
          const { idx, x, y } = this.nowTarget;
          const { position } = this.nodes[idx];
          this.$refs['flow-panel'].onmousemove = (e) => {
            position.x = ~~(e.clientX - offsetLeft - x);
            position.y = ~~(e.clientY - offsetTop - y);
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
          const tempLinePoint = (this.tempLinePoint = Object.assign({}, node));
          const tempLinePoinstPosition = JSON.parse(
            JSON.stringify(node.position)
          );
          tempLinePoint.position = tempLinePoinstPosition;
          // 给Line.vue标志，用于附加absolutePosition && 隐藏两端线头
          tempLinePoint.absolutePosition = true;

          // 临时从锚点拉扯出一条线
          const tempLine = (this.tempLine = new Line(
            null,
            this.currentFlowId,
            '',
            node,
            tempLinePoint,
            idx,
            idx,
            1
          ));
          this.lines.push(tempLine);
          this.$set(this.tempLine, 'new', true); // 标志新线
          bus.$emit('computeNearestAnchor', idx, node);
          this.$refs['flow-panel'].onmousemove = (e) => {
            tempLinePoint.position.x = ~~(e.clientX - offsetLeft - (cx - x));
            tempLinePoint.position.y = ~~(e.clientY - offsetTop - (cy - y));
          };
          return;
        }

        // 处理情况3 线端
        if (type === 'POINT') {
          const { idx, position, line, pointType } = this.nowTarget;
          const node = this.nowTarget.line[pointType]; // 当前线端的节点

          // Copy一个临时浮动节点
          const tempLinePoint = (this.tempLinePoint = {});
          this.tempLine = line;
          Object.keys(node).forEach((key) => {
            if (key === 'position') {
              this.$set(
                this.tempLinePoint,
                key,
                JSON.parse(JSON.stringify(node[key]))
              );
              return;
            }
            if (key === `${pointType}_anchor`) {
              this.$set(this.tempLinePoint, key, 1);
              return;
            }
            this.$set(this.tempLinePoint, key, node[key]);
          });
          const { x, y } = tempLinePoint.position; // 当前临时节点(左上)坐标
          const { cx, cy } = position; // 线端起始点坐标

          // 缓存原起始节点
          const start = line.start;
          const end = line.end;
          this.tempNodes = { start, end };
          // 将当前节点的线弹出
          line[pointType].lines.splice(line[pointType].lines.indexOf(line), 1);
          // 将当前节点换成临时浮动节点
          line[pointType] = tempLinePoint;
          // 给Line.vue标志，用于附加absolutePosition && 隐藏两端线头
          tempLinePoint.absolutePosition = true;

          if (line.type === 1) {
            // 动态锚点需要忽视两个节点
            bus.$emit('computeNearestAnchor', idx, [start, end], pointType);
          } else {
            bus.$emit(
              'computeNearestAnchor',
              idx,
              tempLinePoint === start ? end : start,
              pointType
            );
          }
          this.$refs['flow-panel'].onmousemove = (e) => {
            tempLinePoint.position.x = ~~(e.clientX - offsetLeft - (cx - x));
            tempLinePoint.position.y = ~~(e.clientY - offsetTop - (cy - y));
          };
        }
      },
      async mouseup(e) {
        this.$refs['flow-panel'].onmousemove = null;
        if (!this.nowTarget) {
          return;
        }
        const { type } = this.nowTarget;
        console.log('mouseup', type);
        // 处理情况1 线
        if (type === 'LINE') {
          let pointType;
          if (this.tempLine) {
            if (this.tempLine.start.absolutePosition) {
              pointType = 'start';
            } else if (this.tempLine.end.absolutePosition) {
              pointType = 'end';
            }
          }

          bus.$emit('stopComputingNearestAnchor', pointType);

          if (this.isAttachedNode) {
            if (this.tempLine.new) {
              // 判断是否符合逻辑
              let flag = true;
              if (this.tempLine.end.type === 1) {
                this.$alert('连线终止点不能为开始节点', '警告', {
                  confirmButtonText: '确定',
                  type: 'error'
                });
                flag = false;
              } else if (this.tempLine.start.type === 3) {
                this.$alert('连线起始点不能为结束节点', '警告', {
                  confirmButtonText: '确定',
                  type: 'error'
                });
                flag = false;
              }

              if (!flag) {
                // 还原
                this.lines.pop();
              } else {
                // 创建新线
                const { code, message, data } = await createLine({
                  ...this.destructLine(this.tempLine),
                  id: null
                });
                const newLine = this.formatLine(data);
                this.tempLine = Object.assign(this.tempLine, newLine);

                // 更新引用
                const { start, end } = this.tempLine;
                start.lines.splice(
                  start.lines.indexOf(newLine),
                  1,
                  this.tempLine
                );
                end.lines.splice(end.lines.indexOf(newLine), 1, this.tempLine);

                dealWithResultCode(code, message, this);
                code && this.lines.pop(); // 创建失败
                !code && this.$set(this.tempLine, 'new', false); // 创建成功
              }
            } else {
              // 改变节点或锚点
              const oldNode = this.tempNodes[pointType];
              const newNode = this.tempLine[pointType];
              if (newNode !== oldNode) {
                // 改变节点
                // 把当前线推入新节点
                newNode.lines.push(this.tempLine);
              }
            }
            this.isAttachedNode = false;
          } else if (this.tempLinePoint && this.tempLine) {
            // 删除线
            if (this.tempLine.new) {
              this.lines.pop();
              return;
            }
            const { code, message } = await deleteLine(
              this.lines[this.selectedDOM.idx].id
            );
            dealWithResultCode(code, message, this);
            !code && this.lines.splice(this.selectedDOM.idx, 1);
          }
        }
        // 处理情况2 节点锚点
        else if (type === 'ANCHOR') {
          bus.$emit('stopComputingNearestAnchor');
          if (this.isAttachedNode) {
            this.isAttachedNode = false;
          } else if (this.tempLinePoint && this.tempLine) {
            const { selectedDOM, selectedType } = this;
            this.select(this.tempLine, 'LINE');
            this.deleteDOM();
            // 复原当前选中状态
            this.selectedDOM = selectedDOM;
            this.selectedType = selectedType;
          }
        }
        // 清理临时数据
        this.tempLinePoint && delete this.tempLinePoint.absolutePosition;
        this.tempLine = this.tempLinePoint = null;
        this.nowTarget = null;
      },
      attachNode() {
        this.isAttachedNode = true;
      },
      async deleteDOM() {
        const selectedDOM = this.selectedDOM;
        if (!selectedDOM) {
          this.$alert('暂无选中节点', '警告', {
            confirmButtonText: '确定'
          });
          return;
        }
        const type = this.selectedType;
        if (type === 'NODE') {
          selectedDOM.lines.forEach(async (line) => {
            let node;
            if (line.start !== selectedDOM) {
              node = line.start;
            } else {
              node = line.end;
            }
            // 删除该节点上所有的线
            const idx1 = this.lines.indexOf(line);
            idx1 !== -1 && this.lines.splice(idx1, 1);

            // 删除线上另一个结点的引用
            const idx2 = node.lines.indexOf(line);
            idx2 !== -1 && node.lines.splice(idx2, 1);
          });
          // 删除该节点
          const { code, message } = await deleteNode(
            this.nodes[selectedDOM.idx].id
          );
          dealWithResultCode(code, message, this);
          !code && this.nodes.splice(selectedDOM.idx, 1);
          return;
        }
        if (type === 'LINE') {
          // 删除跟该线相关节点上的引用
          const { start, end } = selectedDOM;
          const startIdx = start.lines.indexOf(selectedDOM);
          const endIdx = end.lines.indexOf(selectedDOM);
          startIdx !== -1 && start.lines.splice(startIdx, 1);
          endIdx !== -1 && end.lines.splice(endIdx, 1);
          const { code, message } = await deleteLine(
            this.lines[selectedDOM.idx].id
          );
          dealWithResultCode(code, message, this);
          !code && this.lines.splice(selectedDOM.idx, 1);
        }
        this.selectedDOM = null;
      },
      updateFlow() {
        return new Promise(async (resolve, reject) => {
          const nodes = this.nodes.map((node) => {
            return this.destructNode(node);
          });
          const lines = this.lines.map((line) => {
            return this.destructLine(line);
          });
          const { code, message, data } = await updateFlow({
            id: this.currentFlowId,
            nodes,
            lines
          });
          dealWithResultCode(code, message, this);
          if (code) {
            reject(message);
          } else {
            resolve();
          }
        });
      },
      formatNode(node) {
        const { id, name, type, x, y } = node;
        const position = new Point(x, y);
        return new Node(id, this.currentFlowId, name, position, [], type);
      },
      formatLine(line) {
        const nodes = this.nodes;
        const {
          id,
          text,
          start_id,
          end_id,
          start_anchor,
          end_anchor,
          type,
          option
        } = line;
        // 查找startNode, endNode
        let start,
          startIdx,
          end,
          endIdx,
          count = 0;
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === start_id) {
            count++;
            start = nodes[i];
            startIdx = i;
          } else if (nodes[i].id === end_id) {
            count++;
            end = nodes[i];
            endIdx = i;
          }
          if (count === 2) {
            break;
          }
        }
        if (!start) {
          console.log('出问题，没有起始节点');
        }
        if (!end) {
          console.log('出问题，没有终止节点');
        }
        line = new Line(
          id,
          this.currentFlowId,
          text,
          start,
          end,
          start_anchor,
          end_anchor,
          type,
          option
        );
        nodes[startIdx].lines.push(line);
        nodes[endIdx].lines.push(line);
        return line;
      },
      destructNode(node) {
        const { id, name, position, type } = node;
        const { x, y } = position;
        return {
          id,
          flow_id: this.currentFlowId,
          name,
          x,
          y,
          type
        };
      },
      destructLine(line) {
        const {
          id,
          text,
          start,
          end,
          start_anchor,
          end_anchor,
          type,
          option
        } = line;
        const start_id = start.id;
        const end_id = end.id;
        return {
          id,
          flow_id: this.currentFlowId,
          text,
          start_id,
          end_id,
          start_anchor,
          end_anchor,
          type,
          option: JSON.stringify(option)
        };
      }
    },
    mounted() {
      bus.$on('deleteDOM', this.deleteDOM);
      bus.$on('attachNode', this.attachNode);
      bus.$on('updateFlow', this.updateFlow);
    },
    beforeDestroy() {
      bus.$off('deleteDOM', this.deleteDOM);
      bus.$off('attachNode', this.attachNode);
      bus.$on('updateFlow', this.updateFlow);
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