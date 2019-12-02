<template>
  <vuedraggable class="wrapper" v-model="list">
    <transition-group>
      <div v-for="item in list" :key="item" class="item">
        <p>{{item}}</p>
      </div>
    </transition-group>
  </vuedraggable>
</template>

<script>
import vuedraggable from 'vuedraggable';

export default {
  name: 'HelloWorld',
  components: {vuedraggable},
  props: {
  },
  data() {
    return {
      list: [1,2,34,4,54,5]
    }
  },
  updated() {
    console.log(this.list)
  },
  methods: {
  }
}
</script>
<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.item{
  width: 300px;
  height: 50px;
  background-color: #42b983;
  color: #ffffff;
}
</style>