<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  import Vue from 'vue';
  export default {
    name: 'App'
  };
</script>

<style lang="scss">
  html,
  body,
  #app {
    height: 100%;
    width: 100%;
    font-size: 14px;
  }
  * {
    margin: 0;
  }
</style>
