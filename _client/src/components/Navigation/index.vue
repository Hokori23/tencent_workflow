<template>
  <nav class="nav">
    <div class="currentFlow">
      <span class="currentFlow__text"
        >流程{{ flows[currentFlowId - 1].text }}</span
      >
      <div>
        <el-button
          type="primary"
          icon="el-icon-delete"
          circle
          plain
          size="mini"
          @click="handleDeleteDOM"
        ></el-button>
      </div>
    </div>
    <div class="nav__tool">
      <el-button plain round size="mini">流程信息</el-button>
      <div class="nav__tool__btns">
        <el-button
          v-for="flow in flows"
          :key="flow.id"
          icon="el-icon-refresh"
          plain
          round
          size="mini"
          :disabled="flow.id === currentFlowId"
          @click="handleFlowChange(flow.id)"
          >切换流程{{ flow.text }}</el-button
        >
      </div>
    </div>
  </nav>
</template>
<script>
  import Vue from 'vue';

  import bus from '@/bus';

  export default {
    name: 'Navigation',
    props: {
      currentFlowId: Number,
      flows: Array
    },
    methods: {
      handleFlowChange(id) {
        if (id !== this.currentFlowId) {
          this.$emit('changeFlow', id);
        }
      },
      handleDeleteDOM() {
        bus.$emit('deleteDOM');
      }
    }
  };
</script>
<style lang="scss" scoped>
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .currentFlow {
      display: flex;
      align-items: center;
      &__text {
        margin: 0 10px 0 5px;
      }
    }

    .nav__tool {
      display: flex;
      align-items: center;
      > div {
        margin: 0 5px;
      }
    }
  }
</style>