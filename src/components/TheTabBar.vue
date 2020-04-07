<template>
  <div class="tabBar">
    <div class="fastEnjoy">
      <span>快享</span>
    </div>
    <div class="logo">
    </div>
    <div class="business">
      <span>企业用车</span>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.tabBar
  display flex
  position fixed
  left 0
  bottom 0
  right 0
  width 100%
  height 80px
  background $color-background
  text-align center
  font-size 16px
  .fastEnjoy
    font-weight 600
    flex 1
    color $color-text-o
    box-sizing border-box
    padding-top 20px
  .logo
    width 88px
    height 88px
    border-radius 50%
    background transparent
    margin-top -30px
    background url('../common/images/logo.png') no-repeat center
    background-size contain
  .business
    flex 1
    color $color-text-b
    box-sizing border-box
    padding-top 20px
    font-weight 600
</style>
