<template>
  <div id="app">
    <router-view/>
    <active></active>
  </div>
</template>

<script>
import Active from 'components/TheActive'

export default {
  components: {
    Active
  }
}
</script>

<style lang="stylus">
</style>
