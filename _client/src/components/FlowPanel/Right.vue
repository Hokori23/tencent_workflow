<template>
  <aside class="flow-panel__right">
    <div class="flow-panel__right__title">编辑</div>
    <div
      v-if="!selectedDOM"
      class="flow-panel__right__content"
      style="text-align: center; margin-top: 200px"
    >
      <h3>暂无选中节点</h3>
    </div>

    <!-- 节点信息 -->
    <div v-else-if="selectedType === 'NODE'" class="flow-panel__right__content">
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

    <!-- 连线信息 -->
    <div v-else-if="selectedType === 'LINE'" class="flow-panel__right__content">
      <div>
        文字
        <el-input style="margin-top: 10px" size="small" v-model="node.text">
        </el-input>
      </div>
      <div>
        连线类别
        <el-select style="margin-top: 10px" size="small" v-model="node.type">
          <el-option
            v-for="item in LineTypeMap"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div v-if="selectedDOM.type === 2">
        <h4 style="transform: translateX(-25px); margin: 15px 0 10px 0">
          连线样式
        </h4>
        <div>
          颜色
          <el-input
            style="margin-top: 10px"
            size="small"
            v-model="node.style.path.stroke"
          >
          </el-input>
        </div>
        <div>
          宽度
          <el-input
            style="margin-top: 10px"
            size="small"
            v-model="node.style.path.strokeWidth"
          >
          </el-input>
        </div>
        <h4 style="transform: translateX(-25px); margin: 15px 0 10px 0">
          端点样式
        </h4>
        <div>
          填充颜色
          <el-input
            style="margin-top: 10px"
            size="small"
            v-model="node.style.point.fill"
          >
          </el-input>
        </div>
        <div>
          边框颜色
          <el-input
            style="margin-top: 10px"
            size="small"
            v-model="node.style.point.stroke"
          >
          </el-input>
        </div>
      </div>
      <div class="flow-panel__right__footer">
        <el-button size="small" plain @click="reset"> 重置 </el-button>
        <el-button size="small" type="primary" @click="save"> 保存 </el-button>
      </div>
    </div>
  </aside>
</template>
<script>
  import Node from '@/vo/Node';
  import Line from '@/vo/Line';
  import Point from '@/vo/Point';

  export default {
    name: 'FlowPanel__Right',
    props: {
      selectedDOM: Object,
      selectedType: String //['NODE', 'LINE']
    },
    watch: {
      selectedDOM: {
        handler(val) {
          this.formatProp();
        },
        deep: true
        // immediate: true
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
        node: {},
        type: null,
        LineTypeMap: ['默认连线样式', '自定义直线样式', '贝塞尔曲线'],
        Node,
        Line
      };
    },
    methods: {
      reset() {
        this.formatProp();
      },
      save() {
        const type = this.selectedType;
        const node = Object.assign({}, this.node);
        if (type === 'LINE') {
          node.type = this.LineTypeMap.indexOf(node.type) + 1;
          if (node.type === 2 && this.selectedDOM.type !== node.type) {
            node.style = this.defaultStyle();
          }
        }
        this.$emit('saveNode', this.selectedDOM, node, type);
      },
      defaultStyle() {
        return new Object({
          path: {
            stroke: '#e6e6e6',
            strokeWidth: 2
          },
          point: {
            fill: '#ccc',
            stroke: '#ddd'
          }
        });
      },
      formatProp() {
        if (!this.selectedDOM) {
          return;
        }
        const type = this.selectedType;
        this.node = Object.assign({}, this.selectedDOM);
        if (type === 'NODE') {
          this.node.position = JSON.parse(
            JSON.stringify(this.selectedDOM.position)
          );
          return;
        }
        if (type === 'LINE') {
          this.node.type = this.LineTypeMap[this.node.type - 1];
          if (this.selectedDOM.type === 2) {
            this.node.style = this.isEmptyObject(this.node.style)
              ? this.defaultStyle()
              : JSON.parse(JSON.stringify(this.selectedDOM.style));
          }
          // style clone -------------- to do
        }
      },
      isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
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