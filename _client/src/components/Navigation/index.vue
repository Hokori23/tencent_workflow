<template>
  <nav class="nav">
    <div class="currentFlow">
      <span class="currentFlow__text">{{ flowText }}</span>
      <div>
        <el-button type="danger" round size="mini" @click="handleDeleteDOM"
          >删除选中节点</el-button
        >
      </div>
    </div>
    <div class="nav__tool">
      <el-button
        type="primary"
        round
        size="mini"
        icon="el-icon-plus"
        @click="handleCreateFlow"
        >添加流程</el-button
      >
      <el-button
        type="success"
        round
        size="mini"
        icon="el-icon-upload"
        @click="handleUpdateFlow"
        >保存流程</el-button
      >
      <el-button
        type="danger"
        round
        size="mini"
        icon="el-icon-delete"
        @click="handleDeleteFlow"
        >删除当前流程</el-button
      >
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
    computed: {
      flowText() {
        const flow = this.flows.filter((flow) => {
          return flow.id === this.currentFlowId;
        });
        if (flow.length) {
          return `流程${flow[0].text}`;
        }
        return '暂无流程';
      }
    },
    methods: {
      handleFlowChange(id) {
        if (id !== this.currentFlowId) {
          this.$emit('changeFlow', id);
        }
      },
      handleDeleteDOM() {
        bus.$emit('deleteDOM');
      },
      handleCreateFlow() {
        this.$prompt('请输入新键流程的名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\w{1,10}$/,
          inputErrorMessage: '流程名长度应为1至10字符'
        }).then(({ value }) => {
          this.$emit('createFlow', value);
        });
      },
      handleDeleteFlow() {
        this.$confirm('确定要删除该流程？所有节点和线也会被一并删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('deleteFlow');
        });
      },
      handleUpdateFlow() {
        bus.$emit('updateFlow');
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