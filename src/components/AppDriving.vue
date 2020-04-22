<template>
  <div class="driving">
    <div class="back" @click="back">
      <span class="icon-navigate_beforechevron_left"></span>
    </div>
    <app-map
      class="map"
      ref="map"
      :offsetY="offsetY"
      :showCircle="showCircle"
      :geolocation="geolocation"
      @initalMap="initalMap"
    >
    </app-map>
    <div class="driving-wrapper">
      <div class="settle" v-show="price">
        <p>快享</p>
        <img width="64" height="60" src="../common/images/car.png" alt="">
        <div class="expect">
          <span>预计</span>
          <span class="text-b">{{expectPrice}}</span>
          <span>元</span>
          <span class="icon-navigate_nextchevron_right"></span>
        </div>
        <div class="originalPrice">
          <span>原价</span>
          <del class="price">
            {{price | tofixed}}元
          </del>
        </div>
        <div class="info">
          <span>动态折扣抵扣</span>
          <span class="price"> 3 </span>
          <span>元  卷抵扣</span>
          <span class="price"> 1 </span>
          <span>元</span>
        </div>
      </div>
      <div class="animation" v-show="!price">
        <div class="loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
      <div class="operate">
        <div class="takePeople">
          <span>选乘坐人</span>
          <span class="icon-navigate_nextchevron_right"></span>
        </div>
        <div class="waypoint">
          <span>添加途径点</span>
          <span class="icon-navigate_nextchevron_right"></span>
        </div>
      </div>
      <div class="call">
        <span>呼叫快享</span>
      </div>
    </div>
  </div>
</template>

<script>
import AppMap from 'components/AppMap'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      offsetY: 300,
      showCircle: false,
      geolocation: false,
      expectPrice: 6.3
    }
  },
  computed: {
    ...mapGetters([
      'startPois',
      'endPois',
      'price',
      'poinWayList'
    ])
  },
  methods: {
    initalMap () {
      this.$nextTick(() => {
        this.setDriving()
      })
    },
    setDriving () {
      const startLng = this.startPois.location.lng
      const startLat = this.startPois.location.lat
      const endLng = this.endPois.location.lng
      const endLat = this.endPois.location.lat

      const startP = [startLng, startLat]
      const endP = [endLng, endLat]
      let opt = JSON.parse(JSON.stringify(this.poinWayList)) || []

      const name = {
        start: this.startPois.name,
        end: this.endPois.name
      }

      this.$refs.map.initalDirv(startP, endP, opt, name)
    },
    callback (status, result) {
      console.log('giaogiaogiao', status, result)
    },
    back () {
      this.$router.push({
        path: '/'
      })
    }
  },
  filters: {
    tofixed (val) {
      if (!val) return
      val = +val
      return val.toFixed(2)
    }
  },
  components: {
    AppMap
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.driving
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  z-index 999
  overflow hidden
  background $color-background
  .back
    width 32px
    height 32px
    position absolute
    text-align center
    line-height 36px
    font-size 28px
    color #666666
    left 14px
    top 14px
    background $color-background
    border-radius 50%
    box-shadow 1px 1px 6px 0 rgba(0, 0, 0, 0.1)
    z-index 1
  .map
    position fixed
  .driving-wrapper
    position fixed
    bottom 0
    left 0
    right 0
    text-align center
    border-top-left-radius 8px
    border-top-right-radius 8px
    background $color-background
    .settle
      box-shadow 0 2px 5px rgba(0, 0, 0, 0.1)
      font-size 15px
      padding 20px
      font-weight 600
      img
        margin-top 5px
        margin-bottom 5px
      .expect
        font-size 12px
        .text-b
          font-size 16px
          font-weight 600
          margin 0 1px
      .originalPrice
        color #ACACAC
        margin 5px 0
        font-size 12px
        letter-spacing 1px
        font-weight 600
      .info
        font-size 12px
        color #ACACAC
        .price
          color $color-text-o
    .animation
      position relative
      height 177px
      .loader
        position absolute
        top 50%
        left 40%
        margin-left 10%
        transform translate3d(-50%, -50%,0)
        .dot
          width 6px
          height 6px
          background #F4B769
          border-radius 100%
          display inline-block
          animation slide 1s infinite
          margin 4px
        for n in (1..4)
          .dot:nth-child({n})
            animation-delay (.1s * n)
            // background red(#3ac, (50 * n))
            background #EF8C47
        @keyframes slide
          0%
            transform scale(1)
          50%
            opacity .3
            transform scale(2)
          100%
            transform scale(1)
    .operate
      display flex
      justify-content space-between
      color #7E7E7E
      font-size 14px
      .takePeople
        padding 10px
        .icon-navigate_nextchevron_right
          vertical-align: middle
      .waypoint
        padding 10px
        .icon-navigate_nextchevron_right
          vertical-align: middle

    .call
      margin 6px
      height 44px
      background $color-text-o
      border-radius 6px
      text-align center
      line-height 46px
      color #fff
      font-size 16px
      font-weight 600
      margin-bottom 30px

/deep/ .amap-logo
  display none!important
/deep/ .custom-startMarker-wrapper
  position relative
  width 26px
  height 40px
  background-image url('../common/images/startP.png')
  background-size contain
/deep/.custom-endMarkder-wrapper
  position relative
  width 26px
  height 40px
  background-image url('../common/images/end.png')
  background-size contain
/deep/ .custom-end-text
  background $color-background
  padding 10px
  border-radius 6px
  .expect-time
    font-size 14px
    color #111
  .text-o
    color $color-text-o
    font-weight 600
  .driving-info
    font-size 12px
    color #B2B2B2
    margin-top 4px
/deep/ .custom-start-text
  background $color-background
  border-radius 6px
  padding 10px
  font-size 14px
  .text-o
    color $color-text-o
    font-weight 600
/deep/ .custom-point
  width 4px
  height 4px
  border-radius 50%
  background transparent
  border 2px solid #111
  margin-right 2px
</style>
