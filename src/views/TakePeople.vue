<template>
  <div class="take-people">
    <header>
      <div class="back" @click="back">
         <span class="icon-navigate_beforechevron_left"></span>
      </div>
      <span class="text">添加乘坐人</span>
      <div class="place"></div>
    </header>
    <div class="instruction">
      <div class="instruction-item">
        <span class="dot"></span>
        <span class="instruction-text">未成年人乘车须由监护人陪同</span>
      </div>
      <div class="instruction-item">
        <span class="dot"></span>
        <span class="instruction-text">乘车行程违反平台规则，代叫车人需承担连带责任</span>
      </div>
    </div>
    <div class="content">
      <div class="title">乘坐人</div>
      <div class="tel">
        <input type="tel" placeholder="手机号">
        <div class="addressList">
          通讯录<span class="icon-navigate_nextchevron_right"></span>
        </div>
      </div>
      <div class="name">
        <input type="text" placeholder="乘车人姓名">
      </div>
    </div>
    <div class="confirm">
      <span>确定</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    back() {
      this.$router.back()
    }
  }
}

</script>
<style lang='stylus' scoped>
@import '~common/stylus/variable'

.take-people
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color #f6f6f6
  z-index 99
  header
    position relative
    display flex
    text-align  center
    align-items center
    font-size 16px
    font-weight 600
    background $color-background
    .back
      font-size 30px
      font-weight 400
      width 36px
      height 36px
    .text
      flex 1
      font-size 18px
    .place
      width 36px
      height 36px
  .instruction
    margin-top 10px
    .instruction-item
      padding 10px
      font-size 12px
      .dot
        display inline-block
        width 6px
        height 6px
        border-radius 50%
        background $color-text-o
        margin-right 10px
      .instruction-text
        color #7e7e7e
  .content
    margin 20px 10px
    background $color-background
    border-radius 3px
    box-shadow 0px 1px 5px 2px rgba(0, 0, 0, .1)
    .title
      font-size $font-size-large-x
      font-weight 600
      padding 10px
    .tel
      padding 10px
      display flex
      align-items center
      input
        flex 1
        height 28px
        font-size 16px
        outline none
      .addressList
        padding 2px 10px
        font-size 14px
        height 18px
        color #7e7e7e
        border-left 1px solid #ccc
    .name
      padding 10px
      input
        height 28px
        font-size 16px
        outline none
  .confirm
    position fixed
    bottom 34px
    left 12px
    right 12px
    padding 15px
    text-align center
    color #fff
    font-weight 600
    background $color-text-o
    border-radius 4px
</style>