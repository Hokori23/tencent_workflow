<template>
  <g
    :class="{
      'flow-panel__line': true,
      'flow-panel__line--active': selectedIdx === idx
    }"
    @mousedown="handleSelectLine"
  >
    <!-- 2:自定义直线样式, 固定锚点 -->
    <!-- <line
      :x1="position.x1"
      :y1="position.y1"
      :x2="position.x2"
      :y2="position.y2"
      :style="`stroke: black; stroke-width: 5; stroke-linecap: round`"
      @mousedown="handleChangeTarget('LINE', true, idx)"
      @mouseup="handleChangeTarget('LINE', false, idx)"
    >
    </line> -->
    <path
      :d="`M${position.x1}, ${position.y1} L${position.x2}, ${position.y2}`"
      @mousedown="handleChangeTarget('LINE', true, idx)"
      @mouseup="handleChangeTarget('LINE', false, idx)"
    >
    </path>
    <!-- 条件文字 -->
    <foreignObject
      :width="width"
      :height="height"
      :x="position.x1 - (position.x1 - position.x2) / 2 - width / 2"
      :y="position.y1 - (position.y1 - position.y2) / 2 - height / 2"
      @mousedown="handleChangeTarget('LINE', true, idx)"
      @mouseup="handleChangeTarget('LINE', false, idx)"
      requiredExtensions="http://www.w3.org/1999/xhtml"
    >
      <el-input
        ref="text"
        v-model="line.text"
        placeholder="请输入条件文字"
        style="min-width: 100px"
      />
    </foreignObject>

    <!-- 线两端 -->
    <g class="flow-panel__line__point" v-if="!line.end.absolutePosition">
      <circle
        :cx="position.x1"
        :cy="position.y1"
        @mousedown="handleChangeTarget('POINT', true, idx, 'start')"
        @mouseup="handleChangeTarget('POINT', false, idx, 'start')"
      />
      <circle
        :cx="position.x2"
        :cy="position.y2"
        @mousedown="handleChangeTarget('POINT', true, idx, 'end')"
        @mouseup="handleChangeTarget('POINT', false, idx, 'end')"
      />
    </g>
  </g>
</template>
<script>
  export default {
    name: 'LineComponent',
    props: {
      line: Object,
      idx: Number,
      selectedIdx: Number
    },
    watch: {
      line: {
        handler(val) {
          this.init();
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        proxyLine: null,
        position: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0
        },
        width: 0,
        height: 0
      };
    },
    methods: {
      // 选中线
      handleSelectLine(e) {
        this.$emit('select', this.line, 'LINE');
      },
      handleChangeTarget(type, state, idx, pointType) {
        const { x1, y1, x2, y2 } = this.position;
        const position =
          pointType === 'start'
            ? {
                cx: x1,
                cy: y1
              }
            : {
                cx: x2,
                cy: y2
              };
        this.$emit(
          'changeTarget',
          {
            type,
            idx,
            position,
            line: this.line,
            pointType
          },
          state
        );
      },
      async init() {
        const { start, end, start_anchor, end_anchor } = this.line;
        if (!start.width) {
          return;
        }
        const x = (node, anchor) => {
          const map = [
            node.position.x + node.width / 2,
            node.position.x + node.width,
            node.position.x + node.width / 2,
            node.position.x
          ];
          return map[anchor - 1];
        };
        const y = (node, anchor) => {
          const map = [
            node.position.y,
            node.position.y + node.height / 2,
            node.position.y + node.height,
            node.position.y + node.height / 2
          ];
          return map[anchor - 1];
        };
        this.position = {
          x1: x(start, start_anchor),
          y1: y(start, start_anchor),
          x2: x(end, end_anchor),
          y2: y(end, end_anchor)
        };

        // 给Node.vue提供绝对坐标
        end.absolutePosition && (end.absolutePosition = this.position);

        if (!this.$refs['text']) {
          return;
        }

        const nowStyle = await getComputedStyle(this.$refs['text'].$el);
        this.height = Number(nowStyle.height.split('px')[0]);
        this.width = Number(nowStyle.width.split('px')[0]);
      }
    }
    // created() {
    //   this.init();
    // }
  };
</script>
<style lang="scss" scoped>
  .flow-panel__line {
    path {
      stroke: #e6e6e6;
      stroke-width: 2;
      stroke-linecap: round;
      &:hover {
        stroke: ccc;
        stroke-width: 4;
      }
    }
    cursor: pointer;
    &__point circle {
      fill: #ccc;
      stroke: #ddd;
      r: 3;
      &:hover {
        fill: #ddd;
        stroke: #ccc;
        r: 7;
      }
    }
    &--active {
      path {
        stroke: ccc;
        stroke-width: 4;
      }
      .flow-panel__line__point circle {
        fill: #ddd;
        stroke: #ccc;
        r: 7;
      }
    }
  }
</style>