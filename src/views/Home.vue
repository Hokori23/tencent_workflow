<template>
  <div class="home">
    <Navigation
      :currentFlowId="currentFlowId"
      :flows="flows"
      @changeFlow="changeFlow"
    />
    <FlowPanel :currentFlowId="currentFlowId" />
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation';
  import FlowPanel from '@/components/FlowPanel';

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
        flows: [
          {
            id: 1,
            text: 'A'
          },
          {
            id: 2,
            text: 'B'
          },
          {
            id: 3,
            text: 'C'
          }
          // {
          //   id: 4,
          //   text: 'B'
          // },
          // {
          //   id: 5,
          //   text: 'B'
          // },
          // {
          //   id: 6,
          //   text: 'B'
          // },
          // {
          //   id: 7,
          //   text: 'B'
          // },
          // {
          //   id: 8,
          //   text: 'B'
          // },
          // {
          //   id: 9,
          //   text: 'B'
          // }
        ] // 简略遍历
      };
    },
    methods: {
      changeFlow(flowId) {
        console.log('push', flowId);
        this.$router.push({ name: 'Home', params: { flowId } });
      }
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
