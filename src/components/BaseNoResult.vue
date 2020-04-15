<template>
  <div class="no-result">
    <img class="img" src="../common/images/no-result.jpg" alt="">
     <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '目的地位置不存在哦~'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.no-result
  text-align center
  .img
    width 100%
  .no-result-text
    margin-top 30px
    font-size $font-size-medium
    color $color-text-d

</style>
