<template>
  <div class="map-container">
    <div id='container' class="map"></div>
  </div>
</template>

<script>
import { mapLoader, searchNearBy } from 'common/js/map'

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
    }
  },
  mounted () {
    this.mpInital()
  },
  methods: {
    mpInital () {
      mapLoader().then(AMap => {
        if (AMap === null) return

        const map = new AMap.Map('container', {
          resizeEnable: this.resizeEnable,
          zoom: this.zoom
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
              this.$emit('get-position-success', result, map)
            } else {
              this.$emit('get-position-err', results)
            }
          })
        })
      })
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
    width 100%
    height 100%
/deep/ .custom-location
  width 32px
  height 32px
  background url("../common/images/location.png") no-repeat center
  background-size contain
</style>
