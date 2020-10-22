<template>
  <div class="home">
    <Navigation
      :currentFlowIdx="currentFlowIdx"
      :flows="flows"
      @changeFlow="changeFlow"
    />
    <FlowPanel :currentFlowIdx="currentFlowIdx" />
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation';
  import FlowPanel from '@/components/FlowPanel';

  import Node from '@/vo/Node';
  import Line from '@/vo/Line';
  export default {
    name: 'Home',
    components: {
      Navigation,
      FlowPanel
    },
    computed: {
      currentFlowIdx() {
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
