<template>
  <!-- <section
    class="flow-panel__node"
    :style="computedStyle"
  > -->
  <g
    :class="{
      'flow-panel__node': true,
      'flow-panel__node--active': selectedId === node.id
    }"
    @mousedown="handleSelectNode"
  >
    <foreignObject
      :width="width"
      :height="height"
      :x="fixXY(node.position.x)"
      :y="fixXY(node.position.y)"
      @mousedown="handleChangeTarget('NODE', true, idx)"
      @mouseup="handleChangeTarget('NODE', false, idx)"
      requiredExtensions="http://www.w3.org/1999/xhtml"
    >
      <el-button :type="btnType[node.type - 1]">
        {{ btnType[node.type - 1] ? node.name : '节点类型错误' }}
      </el-button>
    </foreignObject>
    <!-- 锚点 -->
    <g :class="`flow-panel__node__anchor--${btnType[node.type - 1]}`">
      <circle
        v-for="(position, index) in anchorPosition"
        :key="index"
        :cx="position.cx"
        :cy="position.cy"
        @mousedown="handleChangeTarget('ANCHOR', true)"
        @mouseup="handleChangeTarget('ANCHOR', false)"
        r="5"
      />
    </g>
  </g>
</template>
<script>
  import Vue from 'vue';
  export default {
    props: {
      node: Object,
      idx: Number,
      selectedId: Number
    },
    computed: {
      anchorPosition() {
        const { position } = this.node;
        const { x, y } = position;
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        return [
          { cx: x + halfWidth, cy: y },
          { cx: x, cy: y + halfHeight },
          { cx: x + this.width, cy: y + halfHeight },
          { cx: x + halfWidth, cy: y + this.height }
        ];
      }
    },
    data() {
      return {
        btnType: ['primary', 'success', 'danger'],
        width: 0,
        height: 0
      };
    },
    methods: {
      // 选中节点
      handleSelectNode(e) {
        this.$emit('selectNode', this.node);
      },
      handleChangeTarget(type, state, idx) {
        this.$emit(
          'changeTarget',
          {
            type,
            idx,
            x: this.width / 2,
            y: this.height / 2,
          },
          state
        );
      },
      fixXY(p) {
        return p % 5 > 2 ? p + (5 - (p % 5)) : p - (p % 5);
      }
    },
    mounted() {
      // 初始化宽高
      const nowStyle = getComputedStyle(this.$el.firstChild.firstChild);
      this.height = Number(nowStyle.height.split('px')[0]);
      this.width = Number(nowStyle.width.split('px')[0]);
    }
  };
</script>
<style lang="scss" scoped>
  .flow-panel__node {
    cursor: pointer;
    circle {
      stroke: #ffffff;
      &:hover {
        fill: #ffffff;
        r: 7;
      }
    }
    // 视线头寻找最近吸附点的情况决定
    > g {
      display: none;
    }
    &--active > g,
    &:hover > g {
      display: block;
    }
    // 视线头寻找最近吸附点的情况决定
    &__anchor--primary circle {
      fill: #409eff;
      &:hover {
        stroke: #409eff;
      }
    }
    &__anchor--success circle {
      fill: #67c23a;
      &:hover {
        stroke: #67c23a;
      }
    }
    &__anchor--danger circle {
      fill: #f56c6c;
      &:hover {
        stroke: #f56c6c;
      }
    }
  }
</style>