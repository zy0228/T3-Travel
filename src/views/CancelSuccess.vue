<template>
  <div class="take-people">
    <header>
      <div class="back" @click="back">
         <span class="icon-navigate_beforechevron_left"></span>
      </div>
      <span class="text">取消订单成功</span>
      <div class="place"></div>
    </header>
    <div class="content">
      <div class="title">
        <p>您为什么要取消</p>
        <span class="text">请告知我们，我们会努力做到更好</span>
      </div>
      <div class="advice-list">
        <div v-for="item in reason" :key="item.id" class="item">
          <div class="des">
            <span>{{item.value}}</span>
          </div>
          <input class="oinput" type="checkbox" :value="item.value" :id="item.id" v-model="checkedNames">
        </div>
      </div>
      <div class="other-reason">
        <textarea placeholder="如有其他取消原因，请在这里告知我们" />
      </div>
    </div>
    <div class="confirm" @click="back">
      <span>提交原因</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reason: [
        {
          id: '1',
          value: '暂不需要用车'
        },
        {
          id: '2',
          value: '临时改变行程'
        },
        {
          id: '3',
          value: '等待时间太长'
        },
        {
          id: '4',
          value: '司机不愿意来'
        }
      ],
      checkedNames: []
    }
  },
  methods: {
    back() {
      this.$router.push({
        path: '/'
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

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
  .content
    margin 10px 10px 0 10px
    padding 10px
    background $color-background
    .title
      margin-top 15px
      font-size 18px
      font-weight 600
      .text
        font-size 14px
        font-weight 400
        color #666666
        line-height 38px
    .advice-list
      .item
        position relative
        padding 20px 0
        display flex
        font-size 14px
        align-items center
        bt-line()
        .des
          flex 1
        .oinput
          background #fff!important
        input[type=checkbox]
          display inline-block
          vertical-align middle
          width 18px
          height 18px
          background $color-background
          border 1px solid #666666
          color $color-text-o
    .other-reason
      padding 13px 10px
      border-radius 6px
      textarea
        width 100%
        background-color #f6f6f6
        border none
        padding 10px
        box-sizing border-box
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