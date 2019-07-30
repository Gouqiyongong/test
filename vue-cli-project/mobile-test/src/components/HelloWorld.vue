<template>
  <div class="cs">
    <slider></slider>
    {{value}}
  </div>
</template>

<script>
import slider from './slider/index.vue'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      value: 80
    }
  },
  components: {
    slider,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.cs {
  font-size: 100px;
  width: 60%;
  height: 400px;
  margin-left: 40px;
  color: red;
}
</style>
