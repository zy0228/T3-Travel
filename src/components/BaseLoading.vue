<template>
  <div class="loading">
    <img width="36" height="36" src="../common/images/loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  },
  data () {
    return {
    }
  }
}
</script>
<style lang='stylus' scoped>
@import "~common/stylus/variable"

.loading
  width 100%
  text-align center
  .desc
    line-height 20px
    font-size $font-size-small
    color $color-text-l
</style>