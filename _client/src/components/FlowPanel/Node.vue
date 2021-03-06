<template>
  <g
    :class="{
      'flow-panel__node': true,
      'flow-panel__node--active':
        !isIgnore && (selectedIdx === idx || isListening)
    }"
    ref="node"
    @mousedown="handleSelectNode"
  >
    <rect
      :width="width + 80"
      :height="height + 80"
      :x="node.position.x - 40"
      :y="node.position.y - 40"
      style="fill: transparent; cursor: default"
    />
    <foreignObject
      :width="width"
      :height="height"
      :x="node.position.x"
      :y="node.position.y"
      @mousedown="handleChangeTarget('NODE', idx)"
      requiredExtensions="http://www.w3.org/1999/xhtml"
    >
      <el-button ref="button" :type="btnType[node.type - 1]" :icon="node.ico">
        {{ btnType[node.type - 1] ? node.name : '节点类型错误' }}
      </el-button>
    </foreignObject>
    <!-- 锚点 -->
    <g :class="`flow-panel__node__anchor--${btnType[node.type - 1]}`">
      <circle
        v-for="(position, idx) in anchorPosition"
        :key="idx"
        :cx="position.cx"
        :cy="position.cy"
        :class="{ 'flow-panel__node__circle--active': nearstAnchor === idx }"
        @mousedown="handleChangeTarget('ANCHOR', idx, position)"
        r="5"
      />
    </g>
  </g>
</template>
<script>
  import bus from '@/bus';

  import { getDistance, isUndef, isDef } from '@/utils';
  export default {
    name: 'NodeComponent',
    props: {
      node: Object,
      idx: Number,
      selectedIdx: Number,
      tempLinePoint: Object,
      tempLine: Object
    },
    watch: {
      node: {
        handler() {
          this.init();
        },
        deep: true
      },
      tempLinePoint(v) {
        if (!v) {
          return;
        }
      }
    },
    computed: {
      anchorPosition() {
        const { position } = this.node;
        const { x, y } = position;
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        const anchorPosition = [
          { cx: x + halfWidth, cy: y }, // 上
          { cx: x + this.width, cy: y + halfHeight }, // 右
          { cx: x + halfWidth, cy: y + this.height }, // 下
          { cx: x, cy: y + halfHeight } // 左
        ];
        const parent = this.$parent;
        parent.$set(parent.nodes[this.idx], 'anchorPosition', anchorPosition);
        return anchorPosition;
      }
    },
    data() {
      return {
        btnType: ['primary', 'success', 'danger'],
        width: 0,
        height: 0,
        isListening: false,
        nearstAnchor: null,
        isIgnore: false
      };
    },
    methods: {
      // 选中节点
      handleSelectNode(e) {
        this.$emit('select', this.node, 'NODE');
      },
      handleChangeTarget(type, idx, position) {
        if (type === 'NODE') {
          this.$emit('changeTarget', {
            type,
            idx,
            x: this.width / 2,
            y: this.height / 2
          });
        } else {
          this.$emit('changeTarget', {
            node: this.node,
            type,
            idx: idx + 1,
            position
          });
        }
      },
      computeNearestAnchor(idx, node, pointType) {
        this.$nextTick(() => {
          this.isListening = true;
          this.isIgnore = false;
          if (node === this.node) {
            return;
          } else if (node instanceof Array && node.indexOf(this.node) !== -1) {
            this.isIgnore = true;
            return;
          }
          this.$refs['node'].onmousemove = () => {
            let x, y;
            if (pointType === 'start') {
              const { x1, y1 } = this.tempLinePoint.absolutePosition; // 线头绝对坐标
              x = x1;
              y = y1;
            } else {
              const { x2, y2 } = this.tempLinePoint.absolutePosition; // 线头绝对坐标
              x = x2;
              y = y2;
            }
            // 计算出最近的锚点
            let minAnchor;
            let minDistance;
            this.anchorPosition.forEach((anchor, idx) => {
              const distance = getDistance(x, y, anchor.cx, anchor.cy);
              if (isUndef(minDistance) || minDistance > distance) {
                minDistance = distance;
                minAnchor = idx;
              }
            });
            this.nearstAnchor = minDistance > 20 ? null : minAnchor;
          };
        });
      },
      stopComputingNearestAnchor(pointType) {
        this.isListening = false;
        this.$refs['node'].onmousemove = null;
        if (isDef(this.nearstAnchor)) {
          // 吸附在锚点上
          const parent = this.$parent;
          parent.$set(this.tempLine, pointType, this.node);
          parent.$set(
            this.tempLine,
            `${pointType}_anchor`,
            this.nearstAnchor + 1
          );
          bus.$emit('attachNode');
        }
        this.nearstAnchor = null;
      },
      async init() {
        const nowStyle = await getComputedStyle(this.$refs['button'].$el);
        this.height = Number(nowStyle.height.split('px')[0]);
        this.width = Number(nowStyle.width.split('px')[0]);
        this.$set(this.node, 'height', this.height);
        this.$set(this.node, 'width', this.width);
      }
    },
    mounted() {
      bus.$on('computeNearestAnchor', this.computeNearestAnchor);
      bus.$on('stopComputingNearestAnchor', this.stopComputingNearestAnchor);
      this.init();
    },
    beforeDestroy() {
      bus.$off('computeNearestAnchor', this.computeNearestAnchor);
      bus.$off('stopComputingNearestAnchor', this.stopComputingNearestAnchor);
    }
  };
</script>
<style lang="scss" scoped>
  .flow-panel__node {
    cursor: pointer;
    circle {
      stroke: #ffffff;
      &.flow-panel__node__circle--active,
      &:hover {
        fill: #ffffff;
        r: 7;
      }
    }
    > g {
      display: none;
    }
    &--active > g,
    &:hover > g {
      display: block;
    }
    &__anchor--primary circle {
      fill: #409eff;
      &.flow-panel__node__circle--active,
      &:hover {
        stroke: #409eff;
      }
    }
    &__anchor--success circle {
      fill: #67c23a;
      &.flow-panel__node__circle--active,
      &:hover {
        stroke: #67c23a;
      }
    }
    &__anchor--danger circle {
      fill: #f56c6c;
      &.flow-panel__node__circle--active,
      &:hover {
        stroke: #f56c6c;
      }
    }
  }
</style>