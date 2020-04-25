<template>
  <div class="side" :style="{bottom: bottomPix}">
    <div class="logo">
      <span class="icon icon-shield"></span>
    </div>
    <div class="text">
      <transition name="slide">
        <p v-if="show">{{notify}}</p>
      </transition>
    </div>
  </div>
</template>

<script>
const notifyList = [
  '车辆全部严格消毒',
  '请您务必佩戴口罩出行',
  '司机全部体温合格上岗'
]

export default {
  props: {
    bottom: Number,
    default: 100
  },
  data() {
    return {
      notify: '司机全部体温合格上岗',
      length: 2,
      show: true
    }
  },
  computed: {
    bottomPix() {
      return this.bottom + 'px'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.whileText()
    })
  },
  methods: {
    whileText() {
      this.timerText = setInterval(() => {
        this.show = !this.show
        this.notify = notifyList[this.length--]
      }, 2000)
    }
  },
  watch: {
    length(newv) {
      if (newv === -1) {
        this.length = 2
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.side
  position absolute
  left 10px
  display flex
  align-items center
  .logo
    padding 9px 8px
    background #fff
    border-radius 6px
    color #3C88F7
    font-size 17px
  .text
    background #3C88F7
    color #ffffff
    font-size 12px
    font-weight 800
    padding 8px 10px
    border-top-right-radius 3px
    border-bottom-right-radius 3px
    overflow hidden
    transition width 3s ease-out
    .slide-leave-active
      transition all 3s ease-out
    .slide-enter-active
      transition all 1s ease-out
    .slide-enter
      transform: translateY(20px)
      opacity 0
    .slide-leave-to
      transform translate3d(0, -20px, 0)
      opacity 0
      p
        transition width 3s ease-out
</style>
