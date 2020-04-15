<template>
   <div class="wayPointList" v-show="poinWay.length > 0" ref="listWrapper">
      <transition-group name="poinList" tag="ul" ref="itemWrapper">
        <li
          class="item"
          v-for="item in poinWay"
          :key="item.id"
          ref="poinItem"
          :style="{transform: 'translate3d(0px, '+ item.order * 40 +'px, 0px)'}"
          :data-order="item.order"
          :data-id="item.id"
        >
          <div class="slider">
            <span class="icon-clearclose" @click="deleteItem(item.id)"></span>
            <input
              v-model="item.value"
              type="text"
              :placeholder="item.placeholder"
              ref="wayInput"
            >
            <span
              class="icon-menu"
              @touchstart="touchStart"
              @touchmove="touchMove"
              @touchend="touchEnd"
            ></span>
          </div>
        </li>
      </transition-group>
    </div>
</template>

<script>
import TouchData from 'common/js/touchData'
import client from 'common/js/compatibilityCss3'
import Item from 'common/js/item'
import Collection from 'common/js/collection'

const ITEM_HEIGHT = 40

const transform = client.transformProperty

export default {
  props: {
    poinWay: {
      type: Array,
      default() {
        return []
      }
    }
  },
  created() {
    // the array that holds TouchData objects
    this.touches = []
    this.targetItem = null
    this.collection = new Collection()
  },
  methods: {
    deleteItem(index) {
      // hanlder del
      let targetItem = this.collection.getItemById(index)

      if (targetItem) {
        targetItem.del()
      }

      this.$emit('delete-way', +index)
    },
    touchStart(e) {
      let touchEvent = e.touches[0]

      // inital touchData
      let touch = new TouchData(touchEvent, this.collection)
      this.touches.push(touch)

      let item = this.touches[0].targetItemNode

      this.targetItem = item

      if (this.touches.length === 1 && item) {
        // trigger start
        this.targetItem.onSortStart()
      }
    },
    touchMove(e) {
      if (!this.touches.length) return
      if (!this.targetItem) return

      // update dy
      this.touches[0].update(e.touches[0])
      
      // trigger moveEvent
      this.targetItem.onSortMove(this.touches[0].dy)
    },
    touchEnd(e) {
      // trigger end
      this.targetItem.onSortEnd()

      // reset data
      this.touches = []
      this.targetItem = null
      this.$emit('on-sort', this.collection.items)
    }
  },
  watch: {
    poinWay(newWayList) {
      this.$nextTick(() => {
        let listWrapper = this.$refs.listWrapper
        let poinItem = this.$refs.poinItem
        let input = this.$refs.wayInput
        let len = newWayList.length

        let i = poinItem.length

        // create collection
        while(i--) {
          let item = poinItem[i]

          if (!this.collection.hasItem(item.dataset.id)) {
             this.collection.addItem(item)
          }
        }

        // dynamic set totoal height
        listWrapper.style.height = len * ITEM_HEIGHT + 'px'

        // none el
        if (len === 0) return
        input[--len].focus()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.wayPointList
  position relative
  .item
    position absolute
    z-index 0
    top 0
    left 0
    opacity 1
    width 100%
    height 40px
    &.sorting {
      transition transform 0s linear !important
    }
    &.sorting .slider {
      box-shadow 0 2px 16px rgba(0, 0, 0, 0.25)
      transition transform 0s linear !important
      transform scale(1.05) !important
    }
    &.sorting-trans {
      z-index 999 !important
      transition transform 0.12s ease-out
    }
    &.sorting-trans .slider {
      transition: transform 0.12s ease-out
    }
    &.poinList-enter-active, &.poinList-leave-active
      transition all .1s
    &.poinList-enter, &.poinList-leave-to
      transform translateY(-20px)
      opacity 0
    .slider
      width 100%
      position relative
      height 40px
      display flex
      align-items center
      .icon-clearclose
        color #676767
        width 25px
        height 25px
        font-size 14px
        font-weight bolder
        margin-left -3px
        line-height 26px
      input
        flex 1
        height 25px
      .icon-menu
        color #676767
        width 25px
        height 25px
        flex 0 0 25px
        font-size 18px
        line-height 25px
        font-weight 700
</style>
