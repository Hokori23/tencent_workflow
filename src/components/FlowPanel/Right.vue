<template>
  <aside class="flow-panel__right">
    <div class="flow-panel__right__title">编辑</div>
    <div v-if="selectedNode" class="flow-panel__right__content">
      <div>
        类型
        <el-input
          style="margin-top: 10px"
          size="small"
          disabled
          v-model="node.type"
        >
        </el-input>
      </div>
      <div>
        名称
        <el-input style="margin-top: 10px" size="small" v-model="node.name">
        </el-input>
      </div>
      <div>
        left坐标
        <el-input style="margin-top: 10px" size="small" v-model="node.left">
          <template slot="append">px</template>
        </el-input>
      </div>
      <div>
        top坐标
        <el-input style="margin-top: 10px" size="small" v-model="node.top">
          <template slot="append">px</template>
        </el-input>
      </div>
      <div>
        ico图标
        <el-input style="margin-top: 10px" size="small" v-model="node.ico">
        </el-input>
      </div>
      <div class="flow-panel__right__footer">
        <el-button size="small" plain @click="reset"> 重置 </el-button>
        <el-button size="small" type="primary" @click="save"> 保存 </el-button>
      </div>
    </div>
    <div
      v-else
      class="flow-panel__right__content"
      style="text-align: center; margin-top: 200px"
    >
      <h3>暂无选中节点</h3>
    </div>
  </aside>
</template>
<script>
  import Vue from 'vue';
  export default {
    name: 'FlowPanel__Right',
    props: {
      selectedNode: Object
    },
    data() {
      return {
        node: {}
      };
    },
    methods: {
      reset() {
        this.formatProp();
      },
      save() {
        /**
         * $emit here
         */
      },
      formatProp() {
        const typeDictionary = {
          1: '开始节点',
          2: '普通节点',
          3: '结束节点'
        };
        this.node = {
          ...this.selectedNode,
          type: typeDictionary[this.selectedNode?.type] || '错误类型'
        };
      }
    },
    created() {
      this.formatProp();
    }
  };
</script>

<style lang="scss">
  .flow-panel__right {
    flex: 1 1 15%;
    min-width: 200px;
    border-left: 1px solid #e0e6eb;
    &__title {
      padding: 10px 20px;
      background-color: #f1f3f4;
      border-bottom: 1px solid #e0e6eb;
      font-weight: bold;
    }
    &__content {
      padding: 10px 40px;
      > div {
        margin-top: 10px;
      }
    }
    &__footer {
      margin-top: 30px !important;
      display: flex;
      justify-content: space-around;
    }
  }
</style>