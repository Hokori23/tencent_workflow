<template>
  <g
    :class="{
      'flow-panel__line': true,
      'flow-panel__line--active': selectedIdx === idx,
      'flow-panel__line--non-select': Boolean(tempLinePoint)
    }"
    @mousedown="handleSelectLine"
  >
    <path
      v-if="line.type === 1 || line.type === 2"
      :d="`M${position.x1}, ${position.y1} L${position.x2}, ${position.y2}`"
      @mousedown="handleChangeTarget('LINE', true, idx)"
      @mouseup="handleChangeTarget('LINE', false, idx)"
      :style="line.type === 2 ? line.option.path : false"
    />
    <path
      v-else-if="line.type === 3"
      class="flow-panel__line--bezier"
      :d="`M${position.x1}, ${position.y1} Q${~~(
        (position.x1 + position.x2) /
        2
      )} ${position.y2} ${position.x2}, ${position.y2}`"
      @mousedown="handleChangeTarget('LINE', true, idx)"
      @mouseup="handleChangeTarget('LINE', false, idx)"
    />
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
        size="small"
        style="min-width: 80px"
      />
    </foreignObject>

    <!-- 线两端 -->
    <g
      class="flow-panel__line__point"
      v-if="!line.end.absolutePosition && !line.start.absolutePosition"
    >
      <circle
        :cx="position.x1"
        :cy="position.y1"
        @mousedown="handleChangeTarget('POINT', true, idx, 'start')"
        @mouseup="handleChangeTarget('POINT', false, idx, 'start')"
        :style="line.type === 2 ? line.option.point : false"
      />
      <circle
        :cx="position.x2"
        :cy="position.y2"
        @mousedown="handleChangeTarget('POINT', true, idx, 'end')"
        @mouseup="handleChangeTarget('POINT', false, idx, 'end')"
        :style="line.type === 2 ? line.option.point : false"
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
      selectedIdx: Number,
      tempLinePoint: Object
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
        start.absolutePosition && (start.absolutePosition = this.position);
        end.absolutePosition && (end.absolutePosition = this.position);

        if (!this.$refs['text']) {
          return;
        }

        const nowStyle = await getComputedStyle(this.$refs['text'].$el);
        this.height = Number(nowStyle.height.split('px')[0]);
        this.width = Number(nowStyle.width.split('px')[0]);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .flow-panel__line {
    path {
      stroke: #252525;
      stroke-width: 1;
      stroke-linecap: round;
      &:hover {
        stroke-width: 3;
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
        r: 5;
      }
    }
    &--active {
      path {
        stroke-width: 2;
      }
      .flow-panel__line__point circle {
        fill: #ddd;
        stroke: #ccc;
        r: 5;
      }
    }
    &--non-select {
      user-select: none;
    }
    &--bezier {
      fill: transparent;
    }
  }
</style>