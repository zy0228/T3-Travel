<template>
  <div class="mapSelect">
    <header class="header">
      <div class="city">
        <span>{{this.city || '南京'}}</span>
      </div>
      <input ref="searchBox" @focus="focus" type="text" v-model="location" :placeholder="placeholder">
      <span class="icon-clearclose" v-show="isFocus && location" @click="clear"></span>
      <div class="cancel" @click="cancel">
        <span>取消</span>
      </div>
    </header>
    <app-map
      ref="map"
      :offsetY="offsetY"
      :showCircle="showCircle"
      :geolocation="geolocation"
      :isneedShowDynamicText="isneedShowDynamicText"
      @draging="draging"
      @get-pois="getPois"
      v-show="!query"
    >
    </app-map>
    <div class="map-confirm" @click="select" v-show="pois && !query">
      <span>确认</span>
    </div>
    <transition name="slide">
      <div class="serach-wrapper" v-show="query">
        <suggest
          :query="query"
          @selectItem="selection"
          @list-scroll="listScroll"
        >
        </suggest>
      </div>
    </transition>
  </div>
</template>

<script>
import AppMap from 'components/AppMap'
import { mapGetters, mapActions } from 'vuex'
import Poi from 'common/js/poi'
import Suggest from 'components/AppSuggest'
import { debounce } from 'common/js/util'

export default {
  data() {
    return {
      showCircle: false,
      geolocation: true,
      offsetY: 110,
      locationend: false,
      placeholder: '',
      location: '',
      isneedShowDynamicText: true,
      isFocus: false,
      pois: null,
      query: '',
      selected: false
    }
  },
  computed: {
    ...mapGetters([
      'city'
    ])
  },
  created() {
    this.$watch('location', debounce((newVal) => {
      if (!this.isFocus) {
        return
      }

      this.query = newVal
    }, 200))
  },
  methods: {
    cancel() {
      this.$refs.map.destory()
      this.$router.back()
    },
    focus() {
      this.isFocus = true
      this.query = this.location
    },
    clear() {
      this.location = ''
    },
    draging() {
      this.pois = null
      this.$refs.searchBox.blur()
    },
    getPois(pois) {
      let { name } = pois
      this.isFocus = false
      this.$refs.searchBox.blur()

      if (this.selected) {
        this.selected = false
        return
      }

      this.isneedShowDynamicText = true
      this.location = name
      this.pois = new Poi(pois)
    },
    select() {
      let flag = this.$route.params.flag

      if (flag === 'start') {
        this.saveStart(this.pois)
      } else if (flag === 'end') {
        this.saveEnd(this.pois)
      } else {
        throw new Error('check your router ')
      }

      this.$refs.map.destory()
      this.$router.back()
    },
    selection(item) {
      this.selected = true
      this.query = ''
      this.isFocus = false
      this.isneedShowDynamicText = false

      let poi = new Poi(item)
      let { lng, lat } = poi.location
      let position  = [lng, lat]

      this.pois = poi

      setTimeout(() => {
        // this.location = poi.name
        this.$nextTick(() => {
          this.$refs.map.setMapCenter(position)
          this.$refs.map.setText(poi.name)
          this.location = poi.sname || poi.name
        })
      }, 20)
    },
    listScroll() {
      this.$refs.searchBox.blur()
    },
    ...mapActions([
      'saveStart',
      'saveEnd'
    ])
  },
  components: {
    AppMap,
    Suggest
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.mapSelect
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background #f6f6f6
  z-index 999
  .header
    position: relative;
    display: flex;
    overflow: hidden;
    padding: 10px 0;
    z-index: 999;
    background-color: #fff;
    align-items center
    .city
      margin-left 10px
      padding-right 20px
      margin-right 20px
      border-right 1px solid #E8E8E8
      color #A0A0A0
      font-size 14px
    input
      flex 1
      overflow hidden
      font-size 14px
      margin-top -1px
    span
      color #A0A0A0
      border-radius 50%
    .cancel
      margin-right 10px
      padding-left 20px
      margin-left 20px
      border-left 1px solid #E8E8E8
      color #A0A0A0
      font-size 14px
  .map-confirm
    position fixed
    bottom 40px
    left 12px
    right 12px
    padding 15px
    text-align center
    color #fff
    font-weight 600
    background $color-text-o
    border-radius 4px
  .slide-enter-active, .slide-leave-active
    transition all 0.2s
  .slide-enter, .slide-leave-to
    transform translate3d(0, 60px, 0)
  .serach-wrapper
    position fixed
    top 48px
    left 10px
    right 10px
    background $color-background
    bottom 0
    z-index 111111
    border-top-left-radius 4px
    border-top-right-radius 4px
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
/deep/.amap-logo{
    display: none!important;//去掉高德地图logo
}
/deep/.amap-copyright {
    opacity:0!important;//去掉高德的版本号
}
</style>
