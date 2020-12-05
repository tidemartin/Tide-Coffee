<template>
  <div id="app">
    <!--  -->
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.fl{
  float: left;
}
.fr{
  float: right;
}
.clear::after{
  content:"";
  display: block;
  clear:both;
}
.auto-img{
  display: block;
  width: 100%;
}

</style>
