<template>
  <transition name="side-fade">
    <div class="sideBar"
      ref="sidebar"
      v-show="sideShow"
      @click="close"
    >
      <div class="side-content" @click.stop>
        <div class="name">
          <img src="../common/images/logo.png" alt="logo">
          <span>{{name}}</span>
        </div>
        <div class="side-list">
          <div class="item" v-for="item in myList" :key="item.text">
            <span class="icon" :class="getIconCls(item)"></span>
            <span class="text">{{item.text}}</span>
          </div>
        </div>
        <transition name="text-fade">
          <div class="resume" v-show="showText">
            <p>
              Hi这是个仿T3出行的webapp！
              <br><br>目前只是实现了部分功能，以后可能会加上服务端，登陆，换肤等等
              <br><br>github地址: <a href="https://github.com/zy0228/T3-Travel">https://github.com/zy0228/T3-Travel</a>
            </p>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import client from 'common/js/compatibilityCss3'

const TRANSFORM = client.transformProperty

export default {
  data() {
    return {
      name: '请登录',
      myList: [
        {
          text: '行程',
          icon: 'todoist'
        },
        {
          text: '安全',
          icon: 'shield'
        },
        {
          text: '钱包',
          icon: 'credit_cardpayment'
        },
        {
          text: '设置',
          icon: 'cog'
        }
      ],
      sideShow: false,
      showText: false
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    getIconCls(item) {
      return 'icon-' + item.icon
    },
    show() {
      this.sideShow = true
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.showText = true
        })
      })
    },
    hide() {
      this.sideShow = false
      this.showText = false
    },
    close() {
      this.hide()
      this.$emit('close')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.side-fade-enter-active, .side-fade-leave-active
  transition all .38s
.side-fade-enter, .side-fade-leave-to
  transform translate3d(-100%, 0, 0)
.sideBar
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 999999
  background-color $color-background-d
  .side-content
    position fixed
    top 0
    left 0
    bottom 0
    width 75%
    background #FFFFFF
    z-index 9999
    .name
      margin 40px 0 20px 0
      display flex
      align-items center
      font-size 20px
      font-weight 600
    .side-list
      margin 0 30px
      white-space: nowrap
      .item
        font-size 16px
        position relative 
        padding 16px 0
        font-weight 600
        color #404040
        overflow hidden
        .icon
          font-size 18px
          vertical-align middle
          &.icon-todoist:before
            color #404040!important
        .text
          margin-left 12px
    .resume
       margin 120px 30px 0 30px
       font-size 16px
       line-height 22px
    .text-fade-enter-active
      transition all 2s
    .text-fade-enter
      opacity 0

</style>
