<template>
  <g
    :class="{
      'flow-panel__node': true,
      'flow-panel__node--active': selectedIdx === idx
    }"
    @mousedown="handleSelectNode"
  >
    <foreignObject
      :width="width"
      :height="height"
      :x="fixXY(node.position.x)"
      :y="fixXY(node.position.y)"
      @mousedown="handleChangeTarget('NODE', idx)"
      requiredExtensions="http://www.w3.org/1999/xhtml"
    >
      <el-button :type="btnType[node.type - 1]">
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
        @mousedown="handleChangeTarget('ANCHOR', idx, position)"
        r="5"
      />
    </g>
  </g>
</template>
<script>
  export default {
    name: 'NodeComponent',
    props: {
      node: Object,
      idx: Number,
      selectedIdx: Number
    },
    watch: {
      node: {
        handler() {
          this.init();
        },
        deep: true
      }
    },
    computed: {
      anchorPosition() {
        const { position } = this.node;
        const { x, y } = position;
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        return [
          { cx: x + halfWidth, cy: y }, // 上
          { cx: x + this.width, cy: y + halfHeight }, // 右
          { cx: x + halfWidth, cy: y + this.height }, // 下
          { cx: x, cy: y + halfHeight } // 左
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
      fixXY(p) {
        return p % 5 > 2 ? p + (5 - (p % 5)) : p - (p % 5);
      },
      async init() {
        const nowStyle = await getComputedStyle(this.$el.firstChild.firstChild);
        this.height = Number(nowStyle.height.split('px')[0]);
        this.width = Number(nowStyle.width.split('px')[0]);
        this.$set(this.node, 'height', this.height);
        this.$set(this.node, 'width', this.width);
      }
    },
    mounted() {
      this.init();
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