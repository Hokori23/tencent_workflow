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
      v-if="line.type === 1"
      class="flow-panel__line--dynamic"
      :d="dynamicPath"
      @mousedown="handleChangeTarget('LINE', true, idx)"
      @mouseup="handleChangeTarget('LINE', false, idx)"
      :style="line.type === 2 ? line.option.path : false"
    />
    <path
      v-else-if="line.type === 2"
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
      v-if="
        selectedIdx === idx &&
        !line.end.absolutePosition &&
        !line.start.absolutePosition
      "
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
    computed: {
      dynamicPath() {
        const { x1, y1, x2, y2 } = this.position;
        const point1 = `${x1}, ${y1}`;
        const point2 = this.dynamicLineIsHorizontal
          ? `${~~((x1 + x2) / 2)}, ${y1}`
          : `${x1}, ${~~((y1 + y2) / 2)}`;
        const point3 = this.dynamicLineIsHorizontal
          ? `${~~((x1 + x2) / 2)}, ${y2}`
          : `${x2}, ${~~((y1 + y2) / 2)}`;
        const point4 = `${x2}, ${y2}`;
        return `M${point1} L${point2} L${point3} L${point4}`;
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
        height: 0,
        dynamicLineIsHorizontal: false
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

        // 默认直线动态锚点
        if (this.line.type === 1 && !this.line.new) {
          const { start, end, start_anchor, end_anchor } = this.line;
          let x1, x2, y1, y2;
          (() => {
            const { position } = start;
            const { x, y } = position;
            x1 = x;
            y1 = y;
          })();
          (() => {
            const { position } = end;
            const { x, y } = position;
            x2 = x;
            y2 = y;
          })();
          const pmSignX = x2 - x1 > 0 ? 1 : -1; // x轴
          const pmSignY = y1 - y2 > 0 ? 1 : -1; // y轴
          const startAnchorPosition = start.anchorPosition;
          const endAnchorPosition = end.anchorPosition;

          const distanceX =
            pmSignX === 1
              ? endAnchorPosition[3].cx - startAnchorPosition[1].cx
              : startAnchorPosition[3].cx - endAnchorPosition[1].cx;
          const distanceY =
            pmSignY === 1
              ? startAnchorPosition[0].cy - endAnchorPosition[2].cy
              : endAnchorPosition[2].cy - startAnchorPosition[0].cy;

          // true为左右连线; false为上下连线
          // 大于60是为了美观优化
          // let flag = (this.dynamicLineIsHorizontal =
          //   pmSignX === 1
          //     ? endAnchorPosition[3].cx - startAnchorPosition[1].cx > 60
          //     : startAnchorPosition[3].cx - endAnchorPosition[1].cx > 60);
          let flag = (this.dynamicLineIsHorizontal = distanceX > distanceY);
          if (flag) {
            // 左右连线
            if (pmSignX === 1) {
              this.line.start_anchor = 2;
              this.line.end_anchor = 4;
            } else {
              this.line.start_anchor = 4;
              this.line.end_anchor = 2;
            }
          } else {
            // 上下连线
            if (pmSignY === 1) {
              this.line.start_anchor = 1;
              this.line.end_anchor = 3;
            } else {
              this.line.start_anchor = 3;
              this.line.end_anchor = 1;
            }
          }
        }
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
    &--bezier,
    &--dynamic {
      fill: transparent;
    }
  }
</style>