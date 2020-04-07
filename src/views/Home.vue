<template>
  <div class="home">
    <div class="header-warpper">
      <the-header></the-header>
    </div>
    <app-map
      :showCircle="showCircle"
      :geolocation="geolocation"
      @get-position-success="onComplete"
      @get-position-err="onError"
    >
    </app-map>
    <div class="search-wrapper">
      <search-box ref="searchBox" @on-start="onStart" @on-end="onEnd">
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
import { mapGetters, mapMutations } from 'vuex'
import {
  mapLoader,
  positionPicker,
  searchNearBy,
  addDragEvent,
  creatPointMarker,
  createPositionText
} from 'common/js/map.js'
import mapConfig from 'common/js/config'
import AppMap from 'components/AppMap'
import TheHeader from 'components/TheHeader'
import TabBar from 'components/TheTabBar'
import SearchBox from 'components/AppSearchBox'

const RAOUND_RADIUS = 0
const RESULT_OK = 'OK'
const KEYWORD = ''
const SING_LOCATION = {
  START: 0,
  END: 1
}

export default {
  name: 'home',
  data () {
    return {
      showCircle: false,
      geolocation: true,
      positionText: null,
      map: null,
      point: null
    }
  },
  computed: {
    ...mapGetters([
      'position'
    ])
  },
  created () {
    this.drag = {
      inital: false
    }
  },
  mounted () {
    this.setLocation(SING_LOCATION.START, '正在获取上车位置...')
  },
  methods: {
    // 解析定位结果
    onComplete (data, map) {
      console.log('定位解析成功了')
      this.map = map
      let { city, citycode, adcode } = data.addressComponent
      let { lng, lat } = data.position

      let options = { city, type: mapConfig.type, showCover: false }
      let lnglat = [lng, lat]

      // 设置起点Marker
      let startMarkerDom = document.createElement('div')
      startMarkerDom.className = 'custom-startMarker-wrapper'

      let startMarker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
        content: startMarkerDom
        // offset: new AMap.Pixel(-13, -30)
      })

      map.add(startMarker)

      this.setCity(city)
      this.fuzzySearch(options, KEYWORD, lnglat, RAOUND_RADIUS)
      positionPicker(map, this.onPickerSuccess, this.onPickerErr)
      addDragEvent(map, this.dragStartHandler, this.dragingHandler, this.dragEndHandler)
    },
    // 解析定位错误信息
    onError (data) {
      console.log('err', data)
    },
    // 查询附近的标志性建筑
    fuzzySearch (...arg) {
      // TODO: 修改postion store
      this.setPosition(arg[2])

      searchNearBy(...arg)
        .then(result => {
        // 返回最近的建筑
          console.log('附近的建筑', result)
          if (result.info === RESULT_OK) {
            let { pois } = result.poiList

            if (pois.length > 0) {
              let name = pois[0].name
              let { lng, lat } = pois[0].location

              // 创建光点
              this.point = creatPointMarker([lng, lat])
              console.log(this.position[0], lng, this.position[0] > lng)
              this.point.setMap(this.map)
              this.point.setLabel({
                // offset: new AMap.Pixel(0 , 0),  //设置文本标注偏移量
                content: `<div class='custom-info'>${name}</div>`, // 设置文本标注内容
                direction: this.position[0] > lng ? 'left' : 'right' // 设置文本标注方位
              })

              this.setLocation(SING_LOCATION.START, pois[0].name)
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    onPickerSuccess (positionResult) {
      if (positionResult.info === RESULT_OK) {
        const { city } = positionResult.regeocode.addressComponent
        const { lng, lat } = positionResult.position
        const options = { city, type: mapConfig.type, showCover: false }

        // 如果已经创建了text,就无需再次创建了 改变状态及位置
        if (this.positionText) {
          this.positionText.setPosition([lng, lat])
          this.positionText.show()
          this.fuzzySearch(options, KEYWORD, [lng, lat], RAOUND_RADIUS)
          return
        }

        const textConfig = {
          text: '在这里上车',
          style: {
            'border': 'none',
            'top': '-64px',
            'right': '-102px',
            'font-size': '14px'
          },
          position: [lng, lat]
        }

        this.positionText = createPositionText(textConfig)
        this.positionText.setMap(this.map)
      } else {
        console.warn('拖动落地定位失败')
      }
    },
    onPickerErr (positionResult) {
      console.warn('拖动定位失败')
    },
    dragStartHandler () {
      if (this.drag.inital) return
      this.drag.inital = true

      if (this.positionText) {
        this.positionText.hide()
      }

      if (this.point) {
        // 移除point点
        this.map.remove(this.point)
      }
    },
    dragingHandler () {
      this.setLocation(SING_LOCATION.START, '正在获取上车位置...')
    },
    dragEndHandler () {
      this.drag.inital = false
    },
    setLocation (sign, location) {
      if (sign === SING_LOCATION.START) {
        this.$refs.searchBox.setStartLocation(location)
      } else if (sign = SING_LOCATION.END) {
        this.$refs.searchBox.setEndLocation(location)
      }
    },
    onStart (e) {
      // TODO: 跳转页面
    },
    onEnd (e) {
      // TODO: 跳转页面
    },
    ...mapMutations({
      setCity: 'SET_CITY',
      setPosition: 'SET_POSITION'
    })
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
