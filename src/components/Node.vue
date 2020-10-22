<template>
  <section class="flow-panel__node">
    <el-button :type="btnType[type - 1] || 'warning'">{{ text }}</el-button>
  </section>
</template>
<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    props: {
      text: String,
      position: Object, // Point
      lines: Array, // Array<Line>
      type: Number // 1. 开始节点; 2. 普通节点; 3. 结束节点
    },
    data() {
      return {
        btnType: ['primary', 'info', 'danger']
      };
    }
  });
</script>
<style lang="scss" scoped>
  .flow-panel__node {
    position: absolute;
  }
</style>