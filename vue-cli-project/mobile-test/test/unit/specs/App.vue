<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div>我的
    <router-view/>
  </div>
</template>

<script>
import aa from '@/我的.vue'
export default {
  name:'App',
  data() {
    return {
      aa: '我的'
    }
  }            
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
