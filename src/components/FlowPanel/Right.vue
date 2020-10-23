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
          :value="computedType"
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
        <el-input
          style="margin-top: 10px"
          size="small"
          v-model="node.position.x"
        >
          <template slot="append">px</template>
        </el-input>
      </div>
      <div>
        top坐标
        <el-input
          style="margin-top: 10px"
          size="small"
          v-model="node.position.y"
        >
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

  import Point from '@/vo/Point';
  export default {
    name: 'FlowPanel__Right',
    props: {
      selectedNode: Object
    },
    watch: {
      selectedNode: {
        handler(val) {
          this.formatProp();
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      computedType() {
        const typeDictionary = {
          1: '开始节点',
          2: '普通节点',
          3: '结束节点'
        };
        return typeDictionary[this.node?.type] || '错误类型';
      }
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
        const node = JSON.parse(JSON.stringify(this.node));
        const { position } = node;
        node.position = new Point(Number(position.x), Number(position.y));
        this.$emit('saveNode', node);
      },
      formatProp() {
        if (!this.selectedNode) {
          return;
        }
        this.node = JSON.parse(JSON.stringify(this.selectedNode));
      }
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