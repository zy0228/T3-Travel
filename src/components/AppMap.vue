<template>
  <div class="map-container">
    <div id='container' ref="map" class="map"></div>
  </div>
</template>

<script>
/**
 * 只需要对外 emit (附近选址成功, 地址列表)
 */
import { mapGetters, mapMutations, mapActions } from 'vuex'
import mapConfig from 'common/js/config'
import {
  dirving,
  mapLoader,
  positionPicker,
  searchNearBy,
  addDragEvent,
  creatPointMarker,
  createPositionText
} from 'common/js/map'

const RAOUND_RADIUS = 0
const RESULT_OK = 'OK'
const KEYWORD = ''

export default {
  props: {
    zoom: {
      type: Number,
      default: 16
    },
    resizeEnable: {
      type: Boolean,
      default: true
    },
    showCircle: {
      type: Boolean,
      default: true
    },
    enableHighAccuracy: {
      type: Boolean,
      default: true
    },
    timeout: {
      type: Number,
      default: 10000
    },
    zoomToAccuracy: {
      type: Boolean,
      default: true
    },
    geolocation: {
      type: Boolean,
      default: false
    },
    offsetX: {
      type: Number,
      default: 10
    },
    offsetY: {
      type: Number,
      default: 40
    },
    markerText: {
      type: String,
      default: '在这里上车'
    },
    isNeedSetCenter: {
      type: Boolean,
      default: false
    },
    isneedShowDynamicText: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      map: null,
      point: null,
      positionText: null,
      positionPicker: null,
      dirv: null,
      time: 120
    }
  },
  computed: {
    ...mapGetters([
      'centerPosition',
      'startPois'
    ])
  },
  created () {
    this.drag = {
      inital: false
    }
  },
  mounted () {
    if (!this.geolocation) {
      this.setBottom()
    }
    setTimeout(() => {
      this.mpInital()
    }, 200)
  },
  methods: {
    setBottom (pix) {
      this.$refs.map.style.bottom = pix ? pix : '285px'
    },
    mpInital () {
      mapLoader().then(AMap => {
        if (AMap === null) return

        this.map && this.map.destory()

        // initmap====================================================================
        const map = new AMap.Map('container', {
          resizeEnable: this.resizeEnable,
          zoom: this.zoom,
          mapStyle: mapConfig.style
        })

        this.map = map

        map.on('complete', () => {
          this.$nextTick(() => {
            this.$emit('initalMap')
          })
        })

        // 是否需要定位功能
        if (!this.geolocation) {
          return
        }

        // 设置自定义的定位按钮
        let locationDom = document.createElement('div')
        locationDom.classList.add('custom-location')

        AMap.plugin('AMap.Geolocation', () => {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: this.enableHighAccuracy, // 是否使用高精度定位，默认:true
            timeout: this.timeout, // 超过10秒后停止定位，默认：5s
            buttonPosition: 'RB', // 定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(this.offsetX, this.offsetY), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: this.zoomToAccuracy, // 定位成功后是否自动调整地图视野到定位点
            showCircle: this.showCircle,        // 定位成功后用圆圈表示定位精度范围，默认：true  （去掉圆形区域）
            panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
            showMarker: false,
            buttonDom: locationDom
          })

          map.addControl(geolocation)

          geolocation.getCurrentPosition((status, result) => {
            if (status == 'complete') {
              // this.onComplete(result)
              this.onComplete(result, map)
            } else {
              this.onError(result)
            }
          })
        })
      })
    },
    // 解析定位结果
    onComplete (data, map) {
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
      this.positionPicker = positionPicker(map, this.onPickerSuccess, this.onPickerErr)
      addDragEvent(map, this.dragStartHandler, this.dragingHandler, this.dragEndHandler)
    },
    // 解析定位错误信息
    onError (data) {
      console.log('err', data)
    },
    setMapCenter (lnglat) {
      this.map && this.map.setCenter(lnglat)
    },
    setText (text) {
      this.positionText && this.positionText.setText(text)
    },
    /**
     * origin 起点
     * destination 终点
     * opt 途径点
     * cb 回调函数
     *  ======================处理规划路线================
    */
    initalDirv (...arg) {
      dirving(this.map, ...arg).then(res => {
        if (res) {
          this.setPrice(+res)
        }
      })
    },
    // =====================POI查询======================
    fuzzySearch (...arg) {
      if (this.isNeedSetCenter) {
        this.setCenterPosition(arg[2])
      }

      searchNearBy(...arg)
        .then(result => {
        // 返回最近的建筑
          console.log('附近的建筑', result)
          if (result.info === RESULT_OK) {
            let { pois } = result.poiList

            if (pois.length > 0) {
              let name = pois[1].name
              let { lng, lat } = pois[1].location

              if (this.point) {
                // 移除point点
                this.map.remove(this.point)
              }

              // 创建光点
              this.point = creatPointMarker(true, [lng, lat])
              this.point.setMap(this.map)
              this.point.setLabel({
                // offset: new AMap.Pixel(0 , 0),  //设置文本标注偏移量
                content: `<div class='custom-info'>${name}</div>`, // 设置文本标注内容
                direction: this.centerPosition[0] > lng ? 'left' : 'right' // 设置文本标注方位
              })

              // 当地图组件用于滑动选取目的地的时候，需要滑动结束显示位置
              if (this.isneedShowDynamicText) {
                let { lng, lat } = pois[0].location
                this.positionText.setText(pois[0].name)
              }

              this.$emit('get-pois', pois[0])
            }
          }
        })
        .catch(error => {
          throw new Error(error)
        })
    },
    // 设为拖拽模式初始化成功
    onPickerSuccess (positionResult) {
      if (positionResult.info === RESULT_OK) {
        const { city } = positionResult.regeocode.addressComponent
        const { lng, lat } = positionResult.position
        const options = { city, type: mapConfig.type, showCover: false }

        // 如果已经创建了textMarker,就无需再次创建了 改变状态及位置
        if (this.positionText) {
          this.positionText.setPosition([lng, lat])
          this.positionText.show()

          this.fuzzySearch(options, KEYWORD, [lng, lat], RAOUND_RADIUS)
          return
        }

        const textConfig = {
          text: this.markerText,
          style: {
            'border': 'none',
            'top': '-64px',
            // 'right': '-102px',
            'font-size': '14px'
          },
          position: [lng, lat]
        }

        this.positionText = createPositionText(textConfig)
        this.positionText.setMap(this.map)
      } else {
        throw new Error('拖动落地定位失败')
      }
    },
    createGlintPoint() {
      let { lng, lat } = this.startPois.location
      let position = [lng, lat]
      // 清除所有覆盖物
      this.map && this.map.clearMap()

      // 添加光点
      let g1 = this.createTextObject(30, 1, '#F3DAC5', 'blings-1', position)
      let g2 = this.createTextObject(120, 0.8, '#F5E8E3', 'blings-2', position)
      let g3 = this.createTextObject(240, 0.4, '#F6F1E3', 'blings-3', position)

      let text = {
        text: '等待120s',
        style: {
          'border': 'none',
          'top': '-64px',
          // 'right': '-102px',
          'font-size': '14px'
        },
        position: [lng, lat]
      }

      text = createPositionText(text)

      g1 = createPositionText(g1, false)
      g2 = createPositionText(g2, false)
      g3 = createPositionText(g3, false)

      g1.setMap(this.map)
      g2.setMap(this.map)
      g3.setMap(this.map)

      text.setMap(this.map)

      this.map.setCenter(position)
      this.timerHanlder(text)
    },
    timerHanlder(textMarker) {
      this.timer = setInterval(() => {
        let text = `等待${--this.time}s`
        textMarker.setText(text)
      }, 1000)
    },
    removeText() {
      this.map && this.map.clearMap()

      let { lng, lat } = this.startPois.location
      let position = [lng, lat]

      if (this.timer) {
        clearInterval(this.timer)
        this.time = 120
      }

      let startMarkerDom = document.createElement('div')
      startMarkerDom.className = 'custom-startMarker-wrapper'

      let startMarker = new AMap.Marker({
        position,
        content: startMarkerDom
        // offset: new AMap.Pixel(-13, -30)
      })

      this.map.add(startMarker)
    },
    createTextObject(pix, opacity, color, animationName, position) {
      return {
        text: ' ',
        verticalAlign: 'middle',
        style: {
          'border': 'none',
          'width': `${pix}px`,
          'height': `${pix}px`,
          'border-radius': '100%',
          'background-color': `${color}`,
          'opacity': `${opacity}`,
          'animation': `${animationName} 2s linear infinite`,
          'box-shadow': 'none'
        }, position
      }
    },
    onPickerErr (positionResult) {
      throw new Error('拖动定位失败')
    },
    dragStartHandler () {
      if (this.drag.inital) return
      this.drag.inital = true

      if (this.positionText) {
        this.positionText.hide()
      }

      this.$emit('drag-start')
    },
    dragingHandler () {
      this.$emit('draging')
    },
    dragEndHandler () {
      this.drag.inital = false
      this.$emit('drag-end')
    },
    destory () {
      this.map && this.map.destroy()
    },
    ...mapMutations({
      setCity: 'SET_CITY',
      setPrice: 'SET_PRICE'
    }),
    ...mapActions([
      'setCenterPosition'
    ])
  },
  watch: {
    time(newTime) {
      if (+newTime === 0) {
        this.time = 120
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.map-container
  .map
    position fixed
    top 0
    left 0
    right 0
    bottom 0
/deep/ .custom-location
  width 32px
  height 32px
  background url("../common/images/location.png") no-repeat center
  background-size contain
/deep/ .amap-marker-label
  background transparent
  border none
/deep/ .custom-info
  width 80px
  white-space normal
  margin-left 5px
</style>
