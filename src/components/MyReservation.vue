<template>
  <transition name="picker-fade">
    <div class="reservation" v-show="state===1" @click.stop>
      <div class="title">预约用车时间</div>
      <div class="picker-content">
        <div class="mask-top border-bottom-1px"></div>
        <div class="mask-bottom border-top-1px"></div>
        <div class="wheel-wrapper" ref="wheelWrapper">
          <div class="wheel" v-for="(data, index) in pickerData" :key="index">
            <ul class="wheel-scroll">
              <li
                v-for="item in data" :key="item.value"
                :class="{'wheel-disabled-item':item.disabled}"
                class="wheel-item">{{item.text}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="picker-choose">
        <div class="cancel" @click="_cancel">
          <span>取消</span>
        </div>
        <div class="choose" @click="_confirm">
          {{selectedText}}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'
import dataFormat from 'common/js/wheelData'

const DATA = dataFormat()

const STATE_HIDE = 0
const STATE_SHOW = 1

const COMPONENT_NAME = 'picker'
const EVENT_SELECT = 'select'
const EVENT_CANCEL = 'cancel'
const EVENT_CHANGE = 'change'

console.log(dataFormat())

BScroll.use(Wheel)

export default {
  data() {
    return {
      state: STATE_HIDE,
      selectedIndex: [0, 0, 0],
      pickerData: [],
      selectedText: '请选择'
    }
  },
  created() {
    this._loadPickerData(this.selectedIndex, undefined /* no prevSelectedIndex due to instantiating */)
  },
  methods: {
    _loadPickerData (newSelectedIndex, oldSelectedIndex) {
      let date
      let hour
      let minute
      // first instantiated
      if (!oldSelectedIndex) {
        date = DATA.map(({ value, text }) => ({ value, text }))
        hour = DATA[newSelectedIndex[0]].children
        minute = DATA[newSelectedIndex[0]].children[0].children
        this.pickerData = [date, hour, minute]
      } else {
        // provinces'index changed, refresh cities data
        if (newSelectedIndex[0] !== oldSelectedIndex[0]) {
          hour = DATA[newSelectedIndex[0]].children
          this.pickerData.splice(1, 1, hour)
          // Since cities data changed
          // refresh better-scroll to recaculate scrollHeight
          this.$nextTick(() => {
            this.wheels[1].refresh()
          })
        }

        // hour'index changed, refresh minute data
        if (newSelectedIndex[1] !== oldSelectedIndex[1]) {
          minute = DATA[newSelectedIndex[0]].children[newSelectedIndex[1]].children
          this.pickerData.splice(2, 1, minute)
          // Since minute data changed
          // refresh better-scroll to recaculate scrollHeight
          this.$nextTick(() => {
            this.wheels[2].refresh()
          })
        }
      }
    },
    show() {
      if (this.state === STATE_SHOW) {
        return
      }
      this.state = STATE_SHOW
      if (!this.wheels) {
        this.$nextTick(() => {
          this.wheels = []
          let wheelWrapper = this.$refs.wheelWrapper
          for (let i = 0; i < this.pickerData.length; i++) {
            this._createWheel(wheelWrapper, i)
          }
        })
      } else {
        for (let i = 0; i < this.pickerData.length; i++) {
          this.wheels[i].enable()
          this.wheels[i].wheelTo(this.selectedIndex[i])
        }
      }
    },
    _confirm() {
      if (this._isMoving()) {
        return
      }
      this.hide()
      this.$emit(EVENT_SELECT, this.selectedText)
    },
    valueHandler() {
      const currentSelectedIndex = this.selectedIndex = this.wheels.map(wheel => {
        return wheel.getSelectedIndex()
      })

      // store array for preventing multi-collecting array dependencies in Vue Source code
      const pickerData = this.pickerData
      const currentSelectedValue =
              pickerData.map((data, index) => {
                return data[currentSelectedIndex[index]].value
              })
              
            this.selectedText = currentSelectedValue[0] + '  ' + currentSelectedValue[1] + ':' + (currentSelectedValue[2] < 10 ? '0' + currentSelectedValue[2] : currentSelectedValue[2])
    },
    _cancel() {
      this.hide()
      this.$emit(EVENT_CANCEL)
    },
    _isMoving() {
      return this.wheels.some((wheel) => {
        return wheel.pending
      })
    },
    hide() {
      this.state = STATE_HIDE

      for (let i = 0; i < this.pickerData.length; i++) {
        this.wheels[i].disable()
      }
    },
    refresh() {
      this.$nextTick(() => {
        this.wheels.forEach((wheel, index) => {
          wheel.refresh()
        })
      })
    },
    _createWheel(wheelWrapper, i) {
      const wheels = this.wheels
      if (!wheels[i]) {
        wheels[i] = new BScroll(wheelWrapper.children[i], {
          wheel: {
            selectedIndex: this.selectedIndex[i],
            wheelWrapperClass: 'wheel-scroll',
            wheelItemClass: 'wheel-item'
          },
          probeType: 3
        })

        // this.valueHandler()
        // when any of wheels'scrolling ended , you should refresh data
        let prevSelectedIndex = this.selectedIndex
        wheels[i].on('scrollEnd', () => {
          const currentSelectedIndex = wheels.map(wheel => wheel.getSelectedIndex())
          this._loadPickerData(currentSelectedIndex, prevSelectedIndex)
          prevSelectedIndex = currentSelectedIndex
          this.$emit(EVENT_CHANGE, i, this.wheels[i].getSelectedIndex())
          this.valueHandler()
        })
      } else {
        this.wheels[i].refresh()
      }

      return this.wheels[i]
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

&.picker-fade-enter, &.picker-fade-leave-active
  opacity: 0
  transform: translate3d(0, 100%, 0)
&.picker-fade-enter-active, &.picker-fade-leave-active
  transition: all .3s ease-in-out
.reservation
  position fixed
  background #FFFFFF
  bottom 0
  left 0
  border-top-left-radius 6px
  border-top-right-radius 6px
  right 0
  .title
    position relative
    font-size 18px
    font-weight 600
    text-align center
    margin-top 30px
  .picker-content
    position: relative
    margin-top: 20px
    .mask-top, .mask-bottom
      z-index: 10
      width: 100%
      height: 68px
      pointer-events: none
      transform: translateZ(0)
    .mask-top
      position: absolute
      top: 0
      background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8))
    .mask-bottom
      position: absolute
      bottom: 1px
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8))
  .wheel-wrapper
      display: flex
      padding: 0 16px
      .wheel
        -ms-flex: 1 1 0.000000001px
        -webkit-box-flex: 1
        -webkit-flex: 1
        flex: 1
        -webkit-flex-basis: 0.000000001px
        flex-basis: 0.000000001px
        width: 1%
        height: 173px
        overflow: hidden
        font-size: 18px
        text-align center
        .wheel-scroll
          padding: 0
          margin-top: 68px
          line-height: 36px
          list-style: none
          .wheel-item
            list-style: none
            height: 36px
            overflow: hidden
            white-space: nowrap
            color: #333
            &.wheel-disabled-item
              opacity: .2
  .picker-choose
    position relative
    margin 30px 10px
    display flex
    justify-content space-between
    font-size 14px
    font-weight 600
    .cancel
      flex 1
      margin-right 5px
      border 1px solid $color-text-o
      border-radius 4px
      color $color-text-o
      text-align center
      padding 15px 0
      margin-bottom 20px
    .choose
      flex 1
      margin-left 5px
      background $color-text-o
      border-radius 4px
      color #FFFFFF
      text-align center
      padding 16px 0
      margin-bottom 20px
</style>
