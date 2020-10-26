<template>
  <div class="home">
    <Navigation
      :currentFlowId="currentFlowId"
      :flows="flows"
      @changeFlow="changeFlow"
      @createFlow="createFlow"
      @deleteFlow="deleteFlow"
    />
    <FlowPanel
      :currentFlowId="currentFlowId"
      v-if="currentFlowId && flows.length"
    />
    <section
      v-else
      class="flow-panel"
      style="justify-content: center; align-items: center"
    >
      <h1>暂无流程，请新建</h1>
    </section>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation';
  import FlowPanel from '@/components/FlowPanel';

  import { createFlow, getAllFlows, deleteFlow } from '@/api';
  import { dealWithResultCode } from '@/utils';

  export default {
    name: 'Home',
    components: {
      Navigation,
      FlowPanel
    },
    computed: {
      currentFlowId() {
        return Number(this.$attrs.flowId);
      }
    },
    data() {
      return {
        flows: [],
        isInit: false
      };
    },
    methods: {
      changeFlow(flowId) {
        this.$router.push({ name: 'Home', params: { flowId } });
      },
      getAllFlows() {
        return new Promise(async (resolve) => {
          const { data } = await getAllFlows();
          this.flows = data;

          const isNotExistedFlow =
            data.filter((flow) => {
              return flow.id === this.currentFlowId;
            }).length === 0 && data.length;

          if (!this.isInit) {
            if (isNotExistedFlow) {
              this.$message('当前访问的流程不存在，已自动跳转', {
                type: 'warning'
              });
            }
            this.isInit = true;
          }
          if (!this.currentFlowId || isNotExistedFlow) {
            this.changeFlow(data[0].id);
          }
          resolve();
        });
      },
      async createFlow(text) {
        const { code, message, data } = await createFlow({ text });
        dealWithResultCode(code, message, this);
        await this.getAllFlows();
        if (this.currentFlowId !== data.id) {
          this.changeFlow(data.id);
        }
      },
      async deleteFlow() {
        const { code, message } = await deleteFlow(this.currentFlowId);
        dealWithResultCode(code, message, this);
        this.getAllFlows();
      }
    },
    created() {
      this.getAllFlows();
    }
  };
</script>
<style lang="scss" scoped>
  .home {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
</style>
