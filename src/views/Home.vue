<template>
  <div class="home">
    <div class="content-wrapper" ref="wrapper">
      <div class="header-warpper">
        <the-header @getUser="getUser"></the-header>
      </div>
      <app-map
        :offsetY="offsetY"
        :showCircle="showCircle"
        :geolocation="geolocation"
        :isNeedSetCenter="isNeedSetCenter"
        @draging="draging"
        @get-pois="getPois"
        @getCPosiError="getCPosiError"
      >
      </app-map>
      <div class="search-wrapper">
        <search-box ref="searchBox" @on-start="entery('start')" @on-end="entery('end')">
          <template #operate>
            <div class="reservation" @click="reservation" :class="{'reservationed' : resvernation}">
              <span class="icon-clock2" v-show="!resvernation"></span>
              <span class="text">{{text}}</span>
            </div>
          </template>
        </search-box>
      </div>
      <tab-bar></tab-bar>
      <Side :bottom="bottom"></Side>
      <Reservation ref="Reservation" @select="select"></Reservation>
      <transition name="cancel-fade">
        <div class="cancel-resvervation" v-show="isCancelRv">
          <transition name="fade">
            <div class="content" v-show="isCancelRv">
              <div class="implement">
                <div class="cancel-res" @click="cancelRes">
                  <span>取消预约</span>
                </div>
                <div class="changetime" @click="changeRes">
                  <span>更改预约时间</span>
                </div>
              </div>
              <div class="cancel" @click="cancel">
                <span>取消</span>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
    <confirm
      ref="confirm"
      text="T3出行暂时无法获取您的位置，很抱歉，由于安全原因暂时在安卓机型上无法正确开启定位~"
      confirmBtnText="输入上车点"
      cancelBtnText="我知道了"
      @confirm="inputStartPoi"
    >
    </Confirm>
    <SideBar ref="sidebar" @close="closeSide"></SideBar>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import AppMap from 'components/AppMap'
import TheHeader from 'components/TheHeader'
import TabBar from 'components/TheTabBar'
import SearchBox from 'components/AppSearchBox'
import { SING_LOCATION, currentProcess } from 'common/js/config'
import Pois from 'common/js/poi'
import Side from 'components/TheSide'
import Reservation from 'components/MyReservation'
import SideBar from 'components/TheSidebar'
import client from 'common/js/compatibilityCss3'
import Confirm from 'components/BaseConfirm'

const TRANSFORM = client.transformProperty

export default {
  name: 'home',
  data () {
    return {
      showCircle: false,
      geolocation: true,
      offsetY: 220,
      bottom: 224,
      location: '',
      locationend: false,
      isCancelRv: false,
      isNeedSetCenter: true
    }
  },
  computed: {
    ...mapGetters([
      'resvernation'
    ]),
    text() {
      return this.resvernation !== null ? this.resvernation : '预约'
    }
  },
  created() {
    this.setAddPoinWay(false)
    this.setPoinWay([])
    this.setCallCar(currentProcess.notCall)
    this.saveEnd({})
  },
  mounted() {
    this.setLocation(SING_LOCATION.START, '正在获取上车位置...')
  },
  methods: {
    getPois(pois) {
      this.setLocation(SING_LOCATION.START, pois.name)
      this.saveStart(new Pois(pois))
      this.location = pois.name
      this.locationend = true
    },
    draging() {
      this.setLocation(SING_LOCATION.START, '正在获取上车位置...')
      this.locationend = false
    },
    setLocation(sign, location) {
      if (sign === SING_LOCATION.START) {
        this.$refs.searchBox.setStartLocation(location)
      } else if (sign = SING_LOCATION.END) {
        if (!locationend) return
        this.$refs.searchBox.setEndLocation(location)
      }
    },
    entery(start) {
      this.$refs.searchBox.blur()
      if (!this.locationend) return

      if (start === 'start') {
        this.saveStart(new Object)
      }

      this.$router.push({
        path: '/search',
        query: { start }
      })
    },
    getCPosiError() {
      this.errTimer = setTimeout(() => {
        this.locationend = true
        this.$refs.confirm.show()
      }, 5000)
    },
    inputStartPoi() {
      this.entery('start')
    },
    getUser() {
      this.$refs.sidebar.show()
      this.$refs.wrapper.style['transition'] = 'transform .4s'
      this.$refs.wrapper.style[TRANSFORM] = `translate3d(75%, 0, 0)`
    },
    closeSide() {
      this.$refs.wrapper.style[TRANSFORM] = `translate3d(0, 0, 0)`

      
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.wrapper.style['transition'] = ''
          this.$refs.wrapper.style[TRANSFORM] = ''
        })
      }, 300)
    },
    reservation() {
      if (this.resvernation !== null) {
        this.isCancelRv = true
        return
      }

      this.$refs.Reservation.show()
    },
    select(time) {
      this.setResvernavtion(time)
    },
    cancelRes() {
      this.setResvernavtion(null)
      this.isCancelRv = false
    },
    changeRes() {
      this.isCancelRv = false
      this.$refs.Reservation.show()
    },
    cancel() {
      this.isCancelRv = false
    },
    ...mapMutations({
      setAddPoinWay: 'SET_ADD_POINWAY',
      setPoinWay: 'SET_POINWAY',
      setCallCar: 'SET_CALL_CAR',
      setResvernavtion: 'SET_RESVERNATION'
    }),
    ...mapActions([
      'saveStart',
      'saveEnd'
    ])
  },
  components: {
    AppMap,
    TheHeader,
    TabBar,
    SearchBox,
    Side,
    Reservation,
    SideBar,
    Confirm
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.home
  .content-wrapper
    overflow hidden
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    .header-warpper
      padding 6px 18px
    .search-wrapper
      position fixed
      box-sizing border-box
      width 100%
      bottom 95px
      left 0
      padding 0 10px
      .reservation
        box-sizing border-box
        height 34px
        width 68px
        border 1px solid $color-text-f
        border-radius 4px
        text-align center
        line-height 22px
        text-align center
        line-height 32px
        font-size 12px
        color #CACACA
        box-shadow 0 0 0.5px rgba(0, 0, 0, 0.1)
        &.reservationed
          border 1px solid $color-text-o
          color $color-text-o!important
          .text
            color $color-text-o!important
        .icon-clock2
          margin-right 5px
        .text
          color #111
          color #6D6D6D
          font-weight 600
    .cancel-fade-enter, .cancel-fade-leave-active
      opacity: 0
    .cancel-fade-enter-active, .cancel-fade-leave-active
      transition: all .3s ease-in-out
    .cancel-resvervation
      position fixed
      top 0
      bottom 0
      left 0
      right 0
      z-index 999999
      background-color $color-background-d
      .fade-enter, .fade-leave-active
        transform translate3d(0, 100%, 0)
        opacity 0
      .fade-enter-active, .fade-leave-active
        transition all .3s ease-in-out
      .content
        position fixed
        bottom 35px
        left 10px
        right 10px
        .implement
          background #FFFFFF
          border-radius 4px
          font-size 14px
          font-weight 600
          .cancel-res
            text-align center
            padding 15px 0
            border-bottom 1px solid #F7F7F7
          .changetime
            text-align center
            padding 15px 0
        .cancel
          background #FFFFFF
          border-radius 4px
          margin-top 10px
          color $color-text-o
          padding 15px 0
          text-align center
/deep/ .custom-startMarker-wrapper
  position relative
  width 44px
  height 44px
  background-image url('../common/images/start.png')
  background-size 44px 44px

/deep/ .custom-point
  width 6px
  height 6px
  border-radius 50%
  background $color-text-o
/deep/ .amap-marker-label
  background transparent
  border none
/deep/ .custom-info
  font-size 12px
  font-weight 600
  width 80px
  background transparent
  color $color-text-o
  white-space: normal
</style>
