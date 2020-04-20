<template>
  <div class="driving">
    <div class="back">
      <span class="icon-navigate_beforechevron_left"></span>
    </div>
    <app-map
      ref="map"
      :offsetY="offsetY"
      :showCircle="showCircle"
      :geolocation="geolocation"
    >
    </app-map>
    <div class="driving-wrapper">
      <div class="settle">
        <span>快享</span>
        <img src="" alt="">
        <div class="expect">
          <span>预计</span>
          <span>{{price}}</span>
          <span>元</span>
          <span class="icon-navigate_nextchevron_right"></span>
        </div>
        <div class="originalPrice">
          <span>原价</span>
          <span class="price">
            {{originalprice}}元
          </span>
        </div>
        <div class="info">
          <span>动态折扣抵扣</span>
          <span class="price">3</span>
          <span>元  卷抵扣4.6元</span>
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
  data() {
    return {
      offsetY: 220,
      showCircle: false,
      geolocation: false,
      price:6.3,
      originalprice: 17.5
    }
  },
  computed: {
    ...mapGetters([
      'startPois',
      'endPois'
    ])
  },
  mounted() {
    setTimeout(() => {
          this.setDriving()
    }, 0)
  },
  methods: {
    setDriving() {
      const startLng = this.startPois.location.lng
      const startLat = this.startPois.location.lat
      const endLng = this.endPois.location.lng
      const endLat = this.endPois.location.lat

      const startP = [startLng, startLat]
      const endP = [endLng, endLat]
      const opt = {}

      const name = {
        start: this.startPois.name,
        end: this.endPois.name
      }

      this.$refs.map.initalDirv(startP, endP, opt, name)
    },
    callback(status, result) {
      console.log('giaogiaogiao', status, result)
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
  .driving-wrapper
    position fixed
    bottom 0
    left 0
    right 0 
    border-top-left-radius 6px
    border-top-right-radius 6px
    background $color-background
/deep/ .amap-logo
  display none!important
</style>
