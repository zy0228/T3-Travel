<template>
  <div class="header">
    <div class="my-icon">
      <span class="icon-user"></span>
    </div>
    <div class="citySelect">
      <span v-if="city.length > 0">{{city}}</span>
      <span v-else>正在查找...</span>
      <span class="icon-expand_more"></span>
    </div>
    <div class="message">
      <span class="icon-message"></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['city'])
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.header
  position relative
  display flex
  overflow hidden
  padding 10px 0
  z-index 999
  .citySelect
    flex 1
    text-align center
    color $color-text-d
    line-height 30px
    font-size 14px
  .my-icon, .message
    flex 0 0 37px
    width 36px
    height 36px
    border-radius 50%
    background #fff
    text-align center
    line-height 41px
    box-shadow  0 2px 2px rgba(0, 0, 0, 0.1)
    color #111111
    font-size 20px
</style>
