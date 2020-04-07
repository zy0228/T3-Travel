<template>
  <div class="search-box">
    <div class="startSearch">
      <span class="dot-start"></span>
      <input @click="onStart" v-model="startLocation" :placeholder="startPlaceholder" type="text">
    </div>
    <slot name="wayPoint"></slot>
    <div class="endSearch">
      <span class="dot-end"></span>
      <input @click="onEnd" v-model="endLocation" :placeholder="endPlaceholder" type="text">
      <div class="operate-wrapper">
        <slot name="operate"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'common/js/util'

export default {
  props: {
    startPlaceholder: {
      type: String,
      default: '从哪儿出发？'
    },
    endPlaceholder: {
      type: String,
      default: '您想去哪里？'
    }
  },
  data () {
    return {
      startLocation: '',
      endLocation: ''
    }
  },
  created () {
    this.$watch('startLocation', debounce((newLocation) => {
      this.$emit('query-start', newLocation)
    }, 200))

    this.$watch('endLocation', debounce((newLocation) => {
      this.$emit('query-end', newLocation)
    }, 200))
  },
  methods: {
    setStartLocation (location) {
      this.startLocation = location
    },
    setEndLoaction (location) {
      this.endLocation = location
    },
    onStart (e) {
      this.$emit('on-start')
    },
    onEnd (e) {
      this.$emit('on-end')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.search-box
  position relative
  width 100%
  box-sizing border-box
  background-color $color-background
  border-radius 4px
  padding 10px 15px
  font-size 16px
  box-shadow 0 2px 7px rgba(0, 0, 0, 0.1)
  .startSearch
    display flex
    align-items center
    height 50px
    .dot-start
      width 9px
      height 9px
      flex 0 0 9px
      border-radius 50%
      background $color-highlight-background
      margin-right 16px
    input
      flex 1
      height 25px
  .endSearch
    display flex
    align-items center
    height 50px
    .dot-end
      width 9px
      height 9px
      flex 0 0 9px
      box-sizing border-box
      border-radius 50%
      border 2.2px solid $color-text-o
      margin-right 16px
    input
      flex 1
      height 25px
    .operate-wrapper
      width 60px
      height 50px
      flex 0 0 70px
      display flex
      align-items center
</style>
