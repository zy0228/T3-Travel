<template>
  <div class="active" @touch.stop v-if="show">
    <div class="slide-banner-scroll" ref="slide">
      <div class="slide-banner-wrapper">
        <!-- <div class="slide-item page1"></div>
        <div class="slide-item page2"></div>
        <div class="slide-item page3"></div> -->
      </div>
    </div>
    <div class="docs-wrapper">
      <span
        class="doc"
        v-for="(item, index) in 3"
        :key="index"
        :class="{'doc-active': currentPageIndex === index}"
      >
      </span>
    </div>
    <div class="close" @click="hide">
      <span class="icon-clearclose"></span>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default {
  data() {
    return {
      currentPageIndex: 0,
      playTimer: 0,
      slide: null,
      show: true
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    clearTimeout(this.playTimer)
    this.slide.destroy()
  },
  methods: {
    hide() {
      this.show = false
    },
    init() {
      clearTimeout(this.playTimer)
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        slide: {
          loop: true,
          threshold: 100
        },
        useTransition: true,
        momentum: false,
        bounce: false,
        stopPropagation: true,
        probeType: 2
      })
      this.slide.on('scrollEnd', this._onScrollEnd)

      // user touches the slide area
      this.slide.on('beforeScrollStart', () => {
        clearTimeout(this.playTimer)
      })
      // user touched the slide done
      this.slide.on('scrollEnd', () => {
        this.autoGoNext()
      })
      this.slide.on('slideWillChange', (page) => {
        this.currentPageIndex = page.pageX
      })
      this.autoGoNext()
    },
    _onScrollEnd() {
      this.autoGoNext()
    },
    nextPage() {
      this.slide.next()
    },
    autoGoNext() {
      clearTimeout(this.playTimer)
      this.playTimer = setTimeout(() => {
        this.nextPage()
      }, 4000)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.active
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 999999
  background-color $color-background-d
  .slide-banner-scroll
    overflow hidden
    position fixed
    top 45%
    left 50%
    transform translate3d(-50%, -50%, 0)
    width 84%
    height 50%
    border-radius 8px
    .slide-banner-wrapper
      height 100%
      white-space nowrap
      font-size 0
      .slide-item
        display inline-block
        height 100%
        width 100%
        border-radius 8px
        overflow hidden
        &.page1
          background url('~common/images/active3.png') no-repeat center
          background-size contain
        &.page2
          background url('~common/images/active2.png') no-repeat center
          background-size contain
        &.page3
          background url('~common/images/active1.png') no-repeat center
          background-size contain
  .docs-wrapper
    position fixed
    top 70%
    left 50%
    transform translateX(-50%)
    .doc
      display inline-block
      margin 0 4px
      width 8px
      height 8px
      border-radius 50%
      background #CACACA
      opacity .8
      &.doc-active
        background #fff
        opacity 1
  .close
    position fixed
    top 73%
    left 50%
    border 1.5px solid #FFFFFF
    width 30px
    height 30px
    border-radius 50%
    text-align center
    line-height 33px
    color #ffffff
    font-size 18px
    transform translateX(-50%)
</style>
 