<template>
  <scroll
    :data="result"
    :beforeScroll="beforeScroll"
    @beforeScroll="listScroll"
    :pullup="pullup"
    @scroll-end="searchMore"
    class="suggest"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li v-for="(item, index) in result" :key="index" class="suggest-item" @click="selectItem(item)">
        <div class="suggest-item-main">
          <div class="icon">
            <span class="icon-location_city"></span>
          </div>
          <div class="name">
            <p class="text">{{item.name}}</p>
            <p class="des">{{item.address}}</p>
          </div>
          <div class="distance">
            <span>{{getDistance(item.location)}}</span>
          </div>
        </div>
        <div class="suggest-item-child" v-show="item.children">
          <div v-for="child in item.children" :key="child.id" class="child-item" @click.stop="selectItem(child)">
            {{child.sname}}
          </div>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result></no-result>
    </div>
  </scroll>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadMap, searchPlace } from 'common/js/map'
import Poi from 'common/js/poi'
import Scroll from 'components/BaseScroll'
import Loading from 'components/BaseLoading'
import NoResult from 'components/BaseNoResult'

export default {
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      result: [],
      checkAMap: '',
      pageSize: 13,
      pageIndex: 1,
      beforeScroll: true,
      pullup: true,
      hasMore: false
    }
  },
  computed: {
    ...mapGetters([
      'city',
      'centerPosition'
    ])
  },
  methods: {
    search() {
      this.pageIndex = 1
      this.result = []
      this.hasMore = true
      let options = {
        keyword: this.query,
        city: this.city,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }

      searchPlace(options).then(res => {
        if (res.info === 'OK') {
          let {pois, count} = res.poiList

          // none result
          if (!count) {
            this.result = []
            return
          }

          this.result = pois.map((item) => new Poi(item))
          this._checkHasMore(res.poiList)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    searchMore() {
      if (!this.hasMore) return

      let options = {
        keyword: this.query,
        city: this.city,
        pageSize: this.pageSize,
        pageIndex: ++this.pageIndex
      }

      searchPlace(options).then(res => {
        if (res.info === 'OK') {
          let {pois, count} = res.poiList

          // none result
          if (!count) {
            this.result = []
            return
          }

          this.result = this.result.concat(pois.map((item) => new Poi(item)))
          this._checkHasMore(res.poiList)
        }
      }).catch(e => {
        throw new Error(e)
      })
    },
    _checkHasMore(data) {
      let {pageIndex, pageSize, count} = data

      if (pageIndex * pageSize >= count) {
        this.hasMore = false
      }
    },
    selectItem(item) {
      this.$emit('selectItem', item)
    },
    getDistance(location) {
      if(!this.centerPosition) return '11km'
      let {lng, lat} = location
      let center = new AMap.LngLat(...this.centerPosition)

      let ret = center.distance([lng, lat]) / 1000
      return ret.toFixed(1) + 'km'
    },
    listScroll() {
      this.$emit('list-scroll')
    }
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        return
      }
      
      // refresh page will make some question
      try {
        this.checkAMap = AMap.version
        this.search()
      } catch(err) {
        // AMap lose reintroduction
        console.warn('AMap is not undefined')
        mapLoader().then(() => {
          console.info('AMap is ok!')
          this.search()
        })
      }
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.suggest
  height 100%
  overflow hidden
  .suggest-list
    .suggest-item
      padding 16px 12px
      position relative
      bt-line()
      .suggest-item-main
        display flex
        align-items center
        .icon
          width 24px
          height 24px
          color #CCCCCC
        .name
          flex 1
          overflow hidden
          .text
            color #070707
            font-size 14px
            font-weight 400
          .des
            color #ACACAC
            margin-top 6px
            font-size 12px
            font-weight 400
            no-warp()
        .distance
          color #BBBBBB
          font-size 12px
          font-weight 600
          margin-top -16px
      .suggest-item-child
        margin-top 10px
        display: flex
        flex-wrap: wrap
        justify-content space-between
        &:after
          content ''
          height 0
          width 31%
        .child-item
          margin-top 8px
          flex: 0 0 31%
          height 30px
          line-height 30px
          font-size 12px
          text-align: center
          border-radius 3px
          border 1px solid #F5F5F5
          no-warp()

</style>
