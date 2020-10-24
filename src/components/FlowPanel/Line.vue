<template>
  <g
    :class="{
      'flow-panel__line': true,
      'flow-panel__line--active': selectedIdx === idx
    }"
    @mousedown="handleSelectLine"
  >
    <!-- 2:自定义直线样式, 固定锚点 -->
    <line
      :x1="position.x1"
      :y1="position.y1"
      :x2="position.x2"
      :y2="position.y2"
      :style="`stroke: black; stroke-width: 5; stroke-linecap: round`"
      @mousedown="handleChangeTarget('LINE', true, idx)"
      @mouseup="handleChangeTarget('LINE', false, idx)"
    >
    </line>
    <text
      style="fill: red"
      :x="(position.x1 - position.x2) / 2"
      :y="(position.y1 - position.y2) / 2"
    >
      <!-- <textPath :xlink:href="`#line-${idx}`">{{ line.text }}</textPath> -->
      {{ line.text }}
    </text>
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
        deep: true
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
        }
      };
    },
    methods: {
      // 选中线
      handleSelectLine(e) {
        this.$emit('select', this.line, 'LINE');
      },
      handleChangeTarget(type, state, idx) {
        this.$emit(
          'changeTarget',
          {
            type,
            idx
          },
          state
        );
      },
      init() {
        // this.proxyLine = JSON.parse(JSON.stringify(this.line));
        // const { start, end, start_anchor, end_anchor } = this.proxyLine;
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
      }
    },
    created() {
      this.init();
    }
  };
</script>
<style lang="scss" scoped>
  .flow-panel__line {
    cursor: pointer;
  }
</style>