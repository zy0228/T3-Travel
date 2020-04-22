<template>
  <div class="favorites">
    <header class="header">
      <div class="back" @click="back">
        <span class="icon-navigate_beforechevron_left"></span>
      </div>
      <div class="citySelect">
        <span>收藏选点</span>
      </div>
      <div class="done">
        <span></span>
      </div>
    </header>
    <scroll :data="favorite" class="list-wrapper" v-show="favorite.length > 0">
      <ul>
        <li
          class="list-item" v-for="item in favorite" :key="item.id" @click="select(item)">
          <div
            :data-id="item.id"
            class="item"
            ref="item"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
          >
            <div class="swipe-wrapper">
              <div class="icon">
                <span class="icon-location"></span>
              </div>
              <div class="content">
                <div class="name">{{item.name}}</div>
                <div class="address">
                  {{item.address}}
                </div>
              </div>
            </div>
            <div class="right" @click.stop="saveFavoritesTag(item.id)">
              <span>取消收藏</span>
            </div>
          </div>
        </li>
      </ul>
    </scroll>
    <no-result v-show="!favorite.length" title="暂无收藏"></no-result>
  </div>
</template>

<script>
import { mapGetters, mapMutations,  mapActions } from 'vuex'
import NoResult from 'components/BaseNoResult'
import Scroll from 'components/BaseScroll'
import Collection from 'common/js/collection'
import TouchData from 'common/js/touchData'
import Item from 'common/js/item'
import Pois from 'common/js/poi'

export default {
  data() {
    return{}
  },
  computed: {
    ...mapGetters([
      'searchHistory',
      'poinWayList'
    ]),
    favorite() {
      return this.searchHistory.filter(item => item.favorite)
    } 
  },
  created() {
    this.touches = []
    this.targetItem = null
    this.collection = new Collection()
  },
  mounted() {
    let itemList = this.$refs.item
    if (!itemList) return
    itemList.forEach((item, index) => {
      this.collection.addItem(item)
    })
  },
  methods: {
    back() {
      this.$router.back()
    },
    select(item) {
      let pois = new Pois(item)
      let flag = this.$route.params.flag

      if (flag === 'start') {
        this.saveStart(pois)
      } else if (flag === 'end') {
        this.saveEnd(pois)
      } else {
        let poinway = {
          id: +flag,
          name: item.name.trim(),
          location: item.location
        }

        let poinWayList = this.poiWayPush(poinway)
        this.setPoinWay(poinWayList)
      }

      this.$router.back()
    },
    poiWayPush(item) {
      let way = JSON.parse(JSON.stringify(this.poinWayList))

      let id = item.id
      let index = this.poinWayList.findIndex(item => item.id === id)

      if (index > -1) {
        way = this.poiWayRemove(index)
      }

      way.push(item)
      return way
    },
    poiWayRemove(index) {
      let way = JSON.parse(JSON.stringify(this.poinWayList))
      way.splice(index, 1)

      return way
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
        this.targetItem.onDragStart()
      }
    },
    touchMove(e) {
      if (!this.touches.length) return
      if (!this.targetItem) return

      // update dx
      this.touches[0].update(e.touches[0])

      // trigger moveEvent
      this.targetItem.onDragMove(this.touches[0].dx, this.touches[0].dy, 'right')
    },
    touchEnd(e) {
      this.targetItem.onDragEnd()
      this.touches = []
    },
    ...mapMutations({
      setPoinWay: 'SET_POINWAY'
    }),
    ...mapActions([
      'saveFavoritesTag',
      'saveStart',
      'saveEnd'
    ])
  },
  components: {
    NoResult,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
  .favorites
    position fixed
    z-index 111111
    background $color-background
    top 0
    left 0
    right 0
    bottom 0
    .header
      position relative
      display flex
      overflow hidden
      padding 10px 0
      z-index 999
      background-color $color-background
      .citySelect
        flex 1
        text-align center
        color #111
        line-height 37px
        font-weight 900
        font-size 16px
      .back
        flex 0 0 37px
        width 36px
        height 36px
        text-align center
        line-height 41px
        color #666666
        font-size 30px
      .done
        flex 0 0 37px
        width 36px
        height 36px
        text-align center
        line-height 41px
        color #E3E3E3
        font-size 16px
        padding-right 14px
    .list-wrapper
      position fixed
      bottom 0
      top 57px
      left 0
      right 0
      .list-item
        position relative
        overflow hidden
        .item
          transform: translate3d(0px, 0px, 0px)
          transition-duration: 0.3s
          .swipe-wrapper
            padding 16px 12px
            position relative
            display flex
            align-items center
            width 100%
            overflow hidden
            box-sizing: border-box
            bt-line()
            .icon
              width 24px
              height 24px
              color #CCCCCC
              line-height 24px
            .content
              flex 1
              overflow hidden
              .name
                color #070707
                font-size 16px
                font-weight 400
              .address
                color #ACACAC
                margin-top 6px
                font-size 12px
                font-weight 400
                no-warp()
          .right
            position absolute
            z-index 99999
            top 0
            right -1px
            height 100%
            width 80px
            font-size 16px
            font-weight 900
            background #ee0a24
            text-align center
            line-height 66px
            color #fff
            transform translate3d(100%, 0, 0)
</style>
