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
    <div class="driving-wrapper" v-show="notStarting">
      <div class="settle" v-show="price">
        <div class="coupon">
          <span>发现1张劵</span>
          <span class="icon-notification"></span>
          <p>限22:00:00前下单</p>
        </div>
        <p>快享</p>
        <img width="64" height="60" src="../common/images/car.png" alt="">
        <div class="expect">
          <span>预计</span>
          <span class="text-b">{{expectPrice | tofixed}}</span>
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
        <div class="takePeople" @click="addTakePeople">
          <span>选乘坐人</span>
          <span class="icon-navigate_nextchevron_right"></span>
        </div>
        <div class="waypoint" @click="addPoinWay">
          <span>{{getPoinWayList ? getPoinWayList + '个途经点' : '添加途径点'}}</span>
          <span class="icon-navigate_nextchevron_right"></span>
        </div>
      </div>
      <div class="call" v-show="price">
        <span @click="callFastEnjoy">呼叫快享</span>
      </div>
    </div>
    <div class="calling" v-show="starting">
      <div class="des-text">
        <span>正在为您寻找周围车辆，请耐心等待</span>
      </div>
      <div class="bottom">
        <span class="icon-clearclose"></span>
        <span @click="cancel">取消订单</span>
      </div>
    </div>
    <div class="driver-info" v-show="awating">
      <div class="driver-content">
        <div class="car-info">
          <div class="car-number">
            <span>苏AD4733</span>
          </div>
          <div class="car-des">
            <span>白色-异动BEV</span>
          </div>
          <div class="driver-rating">
            <span class="name">严师傅 </span>
            <span class="icon-stargrade"></span>
            <span>4.9 </span>
            <span class="order-number">3480单</span>
          </div>
        </div>
        <div class="operate">
          <div class="tel">
            <span class="icon-call"></span>
          </div>
          <div class="message">
            <span class="icon-message"></span>
          </div>
          <div class="resume">
            <span class="icon-user1"></span>
          </div>
        </div>
      </div>
      <div class="driver-bottom">
        <div class="alarm">
          <span class="icon-bell-o"></span>
          <span>一键报警</span>
        </div>
        <div class="cancel-order" @click="cancel">
          <span class="icon-clearclose"></span>
          <span>取消订单</span>
        </div>
      </div>
    </div>
    <confirm
      ref="confirm"
      text="再等等，正在快速排单中~"
      :confirmBtnText="confirmBtnText"
      :cancelBtnText="cancelBtnText"
      @confirm="confirm"
    >
    </confirm>
    <side :bottom="bottom"></side>
    <transition name="side">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import AppMap from 'components/AppMap'
import { mapGetters, mapMutations } from 'vuex'
import { currentProcess } from 'common/js/config'
import Confirm from 'components/BaseConfirm'
import Side from 'components/TheSide'

export default {
  data () {
    return {
      offsetY: 300,
      showCircle: false,
      geolocation: false,  
      confirmBtnText: '不等了',
      cancelBtnText: '再等等',
      bottom: 300
    }
  },
  computed: {
    ...mapGetters([
      'startPois',
      'endPois',
      'price',
      'poinWayList',
      'callCar'
    ]),
    expectPrice() {
      return this.price - 4
    },
    getPoinWayList() {
      return this.poinWayList.length
    },
    notStarting() {
      return this.callCar === currentProcess.notCall
    },
    starting() {
      return this.callCar === currentProcess.calling
    },
    awating() {
      return this.callCar === currentProcess.awaitDriver
    }
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
    },
    back () {
      this.$router.push({
        path: '/'
      })
    },
    addPoinWay() {
      this.setAddPoinWay(true)
      this.$router.back()
    },
    addTakePeople() {
      this.$router.push({
        path: '/driving/takePeople'
      })
    },
    callFastEnjoy() {
      this.$refs.map.setBottom('128px')
      this.bottom = 150
      this.setCallCar(currentProcess.calling)
      // TODO: 给地图添加闪烁光点
      this.$refs.map.createGlintPoint()

      // TODO: 模拟派单成功
      setTimeout(() => {
        this.$refs.map.setBottom('180px')
        this.bottom = 200
        this.setCallCar(currentProcess.awaitDriver)
        this.$refs.map.removeText()
      }, 6000)
    },
    confirm() {
      // TODO:cancel order
      this.$router.push({
        path: '/driving/cancel'
      })
    },
    cancel() {
      this.$refs.confirm.show()
    },
    ...mapMutations({
      setAddPoinWay: 'SET_ADD_POINWAY',
      setCallCar: 'SET_CALL_CAR'
    })
  },
  filters: {
    tofixed (val) {
      if (!val) return
      val = +val
      return val.toFixed(2)
    }
  },
  components: {
    AppMap,
    Confirm,
    Side
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
      .coupon
        position absolute
        right 10px
        top 40px
        border 1px solid #FDF1E7
        border-radius 30px
        z-index 999
        background #FEFAF6
        padding 6px 30px
        font-weight 600
        font-size 12px
        color $color-text-o
        p
          font-size 10px
          color #666666
          margin-top 5px
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
  .calling
    position fixed
    bottom 0
    left 0
    right 0
    text-align center
    border-top-left-radius 8px
    border-top-right-radius 8px
    background $color-background
    .des-text
      height 60px
      text-align center
      line-height 60px
      border-top-left-radius 6px
      border-top-right-radius 6px
      border-bottom 1px solid #F5F5F5
    .bottom
      padding 20px 0 40px 0
      color #787878
      font-size 14px
      .icon-clearclose
        color #666666
  .driver-info
    position fixed
    bottom 0
    left 0
    right 0
    border-top-left-radius 8px
    border-top-right-radius 8px
    background $color-background
    .driver-content
      padding 14px 10px
      box-shadow 0 2px 5px rgba(0, 0, 0, 0.1)
      display flex
      .car-info
        flex 1
        .car-number
          color #111111
          font-size 24px
          font-weight 600
          letter-spacing 2px
        .car-des
          margin-top 13px
          font-size 14px
          font-weight 600
          color #111111
        .driver-rating
          margin-top 13px
          color #999999
          font-size 12px
          .icon-stargrade
            color $color-text-o
            display inline-block
            margin-left 8px
          .order-number
            display inline-block
            margin-left 8px
      .operate
        flex 1
        height 74px
        display flex
        margin-left 80px
        margin-right 10px
        justify-content space-between
        align-items center
        .tel
          width 36px
          height 36px
          text-align center
          font-size 22px
          line-height 42px
          box-shadow 1px 1px 1px 1px rgba(0, 0, 0, 0.1)
          background #F2F2F2
          border-radius 50%
        .message
          width 36px
          height 36px
          text-align center
          font-size 22px
          line-height 42px
          box-shadow 1px 1px 1px 1px rgba(0, 0, 0, 0.1)
          background #F2F2F2
          border-radius 50%
        .resume
          width 46px
          height 46px
          text-align center
          font-size 26px
          line-height 46px
          box-shadow 1px 1px 1px 1px rgba(0, 0, 0, 0.1)
          background #F2F2F2
          border-radius 50%
    .driver-bottom
      height 80px
      display flex
      align-items center
      font-size 12px
      color #666666
      .alarm
        flex 1
        text-align center
        font-size 14px
        .icon-bell-o
          color #EA3A2E
          font-size 16px
          font-weight 600
          margin-right 5px
      .cancel-order
        flex 1
        text-align center
        font-size 14px
        .icon-clearclose
          display inline-block
          border-radius 50%
          border 1px solid #666
          font-weight 600
          margin-right 5px
  .side-enter-active, .side-leave-active
    transition all .3s
  .side-enter, .side-leave-to
    transform translate3d(100%, 0, 0)
/deep/ .amap-logo
  display none!important
/deep/ .driv-custom-startMarker-wrapper
  position relative
  width 26px
  height 40px
  background-image url('../common/images/startP.png')
  background-size contain
/deep/ .custom-startMarker-wrapper
  position relative
  width 44px
  height 44px
  background-image url('../common/images/start.png')
  background-size 44px 44px
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
