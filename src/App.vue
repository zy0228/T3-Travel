<template>
  <div id="app">
    <router-view/>
    <Layer v-if="showLayer"></Layer>
    <!-- <active></active> -->
  </div>
</template>

<script>
import Active from 'components/TheActive'
import Layer from 'components/TheLayer'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'showLayer'
    ])
  },
  components: {
    Active,
    Layer
  }
}
</script>

<style lang="stylus">
</style>
