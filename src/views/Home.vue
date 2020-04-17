<template>
  <div class="home">
    <div class="header-warpper">
      <the-header></the-header>
    </div>
    <app-map
      :offsetY="offsetY"
      :showCircle="showCircle"
      :geolocation="geolocation"
      @draging="draging"
      @get-pois="getPois"
    >
    </app-map>
    <div class="search-wrapper">
      <search-box ref="searchBox" @on-start="entery('start')" @on-end="entery('end')">
        <template #operate>
          <div class="reservation">
            <span class="icon-clock2"></span>
            <span class="text">预约</span>
          </div>
        </template>
      </search-box>
    </div>
    <tab-bar></tab-bar>
  </div>
</template>

<script>
import AppMap from 'components/AppMap'
import TheHeader from 'components/TheHeader'
import TabBar from 'components/TheTabBar'
import SearchBox from 'components/AppSearchBox'
import { SING_LOCATION } from 'common/js/config'

export default {
  name: 'home',
  data () {
    return {
      showCircle: false,
      geolocation: true,
      offsetY: 220,
      location: '',
      locationend: false
    }
  },
  mounted() {
    this.setLocation(SING_LOCATION.START, '正在获取上车位置...')
  },
  methods: {
    getPois(pois) {
      this.setLocation(SING_LOCATION.START, pois.name)
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

      this.$router.push({
        path: '/search',
        query: {
          start,
          location: this.location
        }
      })
    }
  },
  components: {
    AppMap,
    TheHeader,
    TabBar,
    SearchBox
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.home
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
      .text
        color #111
        margin-left 5px
        color #6D6D6D
        font-weight 600
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
