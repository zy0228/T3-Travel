<template>
  <div class="select-container">
    <header class="header">
      <div class="back" @click="back">
        <span class="icon-navigate_beforechevron_left"></span>
      </div>
      <div class="citySelect">
        <span v-if="city.length > 0">{{city}}</span>
        <span v-else>正在查找...</span>
        <span class="icon-expand_more"></span>
      </div>
      <div class="done">
        <span>完成</span>
      </div>
    </header>
    <transition name="upper">
      <div v-if="delayShow" class="search-wrapper">
        <search-box
          ref="searchBox"
          class="searchBox"
          :edit="edit"
          @query-start="startQuery"
          @query-end="endQuery"
          @onfocusStart="onfocusStart"
          @onfocusEnd="onfocusEnd"
          :startPlaceholder="startPlaceholder"
          @star="star"
        >
          <template #operate>
            <div class="add-way" v-show="isShowAdd">
              <span @click="addWay" class="icon-add"></span>
            </div>
          </template>
          <template #wayPoint>
            <drag-list
              :poinWay='poinWay'
              @delete-way="deleteItem"
              @on-sort="sort"
            >
            </drag-list>
          </template>
        </search-box>
        <div class="search-content" :style="{top: contentTop}" v-show="!query">
          <my-tag @selectTag="selectTag"></my-tag>
          <div class="history" :style="{top: histroyTop}">
            <div class="mapSelection" @click="mapSelect">
              <span class="icon-location"></span>
              <span class="text">在地图上选址</span>
            </div>
            <div class="history-wrapper" :style="{top: historyWrapperTop}">
              <search-list
                ref="searchList"
                :searchHistory="searchHistory"
                @star="star"
                @selectHistory="slectSearch"
              >
              </search-list>
            </div>
            <div class="clearHistory" v-show="searchHistory.length > 0">
              <span @click="clearHistory">清除历史记录</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="slide">
      <div ref="searchResult" class="search-result" v-show="query" :style="{top: searchResultTop}">
        <suggest ref="suggest"
          :query="query"
          @selectItem="selection"
          @list-scroll="listScroll"
        ></suggest>
      </div>
    </transition>
    <confirm
      ref="confirm"
      text="确认删除所有的历史记录吗？"
      @confirm="removeSearch"
    >
    </Confirm>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import SearchBox from 'components/AppSearchBox'
import DragList from 'components/BaseDragList'
import Suggest from 'components/AppSuggest'
import SearchList from 'components/MySearchList'
import MyTag from 'components/MyTag'
import Way from 'common/js/way'
import Pois from 'common/js/poi'
import Confirm from 'components/BaseConfirm'
import MapSelect from 'components/AppMapSelect'

const CONTENT_TOP = 167
const HISTORY_TOP = 242
const HISTORY_WRAPPER = 300
const SEARCH_RESULT = 178
const ITEM_HEIGHT = 40

export default {
  data() {
    return {
      startPlaceholder: '请输入您的起点位置',
      edit: true,
      poinWay: [],
      id: 0,
      delayShow: false,
      query: '',
      first: true,
      queryIsEnd: false,
      focusIsEnd: false,
      query1: '',
      query2: ''
    }
  },
  computed: {
    ...mapGetters([
      'city',
      'searchHistory',
      'startPois',
      'endPois'
    ]),
    isShowAdd() {
      return this.poinWay.length < 3
    },
    contentTop() {
      let top = (this.poinWay.length * ITEM_HEIGHT) +  CONTENT_TOP
      return `${top}px`
    },
    histroyTop() {
      let top = (this.poinWay.length * ITEM_HEIGHT) +  HISTORY_TOP
      return `${top}px`
    },
    historyWrapperTop() {
      let top = (this.poinWay.length * ITEM_HEIGHT) +  HISTORY_WRAPPER
      return `${top}px`
    },
    searchResultTop() {
      let top = (this.poinWay.length * ITEM_HEIGHT) +  SEARCH_RESULT
      return `${top}px`
    }
  },
  created() {
    setTimeout(() => {
      this.delayShow = true
      this.receive()
    }, (150))
  },
  beforeRouteUpdate(to, from, next) {
    let { path, params } = from

    if (/favorite|mapselect$/.test(path)) {
      if (params.flag === 'start') {
        let name = this.startPois.name
        if (name) {
          this.$refs.searchBox.setStartLocation(name)
        }
      } else if (params.flag === 'end'){
        let name = this.endPois.name
        if (name) {
          this.$refs.searchBox.setEndLoaction(name)
        }
      } else {
        throw new Error('check your router, params is exception ')
      }
    }

    next()
  },
  methods: {
    back() {
      this.$router.back()
    },
    receive() {
      let {start} = this.$route.query

      if (start === 'start') {
        this.$nextTick(() => {
          this.$refs.searchBox.focusStart()
          this.first = false
          return
        })
      }

      if (start === 'end') {
        this.$nextTick(() => {
          this.$refs.searchBox.setStartLocation(this.startPois.name)
          this.$refs.searchBox.focusEnd()
          this.first = true
        })
      }

      if (start === 'all') {
        // todo: 结算
      }
    },
    addWay() {
      let len = this.poinWay.length
      if (len === 3) {
        return
      }

      let newWay = new Way(len, this.id++, null, len)
      this.poinWay.push(newWay)
    },
    deleteItem(index) {
      let delIndex = this.poinWay.findIndex(item => {
        return item.id === index
      })

      if (delIndex != -1) {
        this.poinWay.splice(delIndex, 1)
      }

      // 重新改变一下id
      this.$nextTick(() => {
        this.poinWay.forEach((item, index) => {
          this.$set(item, 'placeholder', `请输入途径点${++index}`)
        })
      })
    },
    startQuery(query) {
      let queryFormat = query.trim()

      if (this.first) {
        this.first = false
        this.query1 = queryFormat
        return
      }

      let name = this.startPois.name || ''
      if (queryFormat === name) {
        this.query = ''
        this.query1 = queryFormat
        return
      }

      this.query = queryFormat
      this.query1 = queryFormat
      this.queryIsEnd = false
      this.saveStart(new Object())
    },
    endQuery(query) {
      let queryFormat = query.trim()
      let name = this.endPois.name || ''
      if (queryFormat === name) {
        this.query = ''
        this.query2 = queryFormat
        return
      }

      this.query = queryFormat
      this.query2 = queryFormat
      this.queryIsEnd = true
      this.saveEnd(new Object())
    },
    onfocusStart() {
      // TODO: 1聚焦了
      this.focusIsEnd = false
    },
    onfocusEnd() {
      // TODO: 2聚焦了
      this.focusIsEnd = true
    },
    listScroll() {
      this.$refs.searchBox.blur()
    },
    selection(item) {
      // TODO:save serach
      let poi = new Pois(item)

      this.saveSearch(poi)

      this.setLocation(item)

      this.query = ''
    },
    star(item) {
      this.saveFavoritesTag(item.id)
    },
    clearHistory() {
      this.$refs.confirm.show()
    },
    selectTag(flag, item) {
      if (flag === 'home') {
        if (item.id) {
          this.setLocation(item)
        } else {
          this.$router.push({
            path: '/search/home/select'
          })
        }
      } else if (flag === 'company') {
        if (item.id) {
          this.setLocation(item)
        } else {
          this.$router.push({
            path: '/search/company/select'
          })
        }
      } else {
        this.$router.push({
          path: `/search/${this.focusIsEnd ? 'end' : 'start'}/favorite`
        })
      }
    },
    slectSearch(item) {
      this.setLocation(item)
    },
    mapSelect() {
      this.$router.push({
          path: `/search/${this.focusIsEnd ? 'end' : 'start'}/mapselect`
        })
    },
    sort(items) {
      let i = items.length

      while(i--) {
        let id = +items[i].data.dataset.id
        let order = items[i].order

        if (id || id === 0) {
          let index = this.getCurrentIndex(id)

          if (index !== -1) {
            this.poinWay[index].order = order
            this.poinWay[index].placeholder = `请输入途径点${order + 1}`
          }
        }
      }

      // sort
      this.poinWay.sort((a, b) => a.order - b.order)
    },
    getCurrentIndex(id) {
      return this.poinWay.findIndex(item => {
        return +item.id === +id
      })
    },
    setLocation(item) {
      if (this.focusIsEnd) {
        this.saveEnd(new Pois(item))
        this.$nextTick(() => {
          this.$refs.searchBox.setEndLoaction(item.name)
          if (this.startPois.id)  return
          this.$refs.searchBox.focusStart()
          this.$refs.searchBox.focusSelectS()
        })
      } else {
        this.saveStart(new Pois(item))
        this.$nextTick(() => {
          this.$refs.searchBox.setStartLocation(item.name)
          if (this.endPois.id)  return
          this.$refs.searchBox.focusEnd()
          this.$refs.searchBox.focusSelectE()
        })
      }
    },
    ...mapMutations({
      setCity: 'SET_CITY'
    }),
    ...mapActions([
      'saveSearch',
      'removeSearch',
      'saveFavoritesTag',
      'saveStart',
      'saveEnd'
    ])
  },
  components: {
    SearchBox,
    DragList,
    MyTag,
    Suggest,
    SearchList,
    Confirm,
    MapSelect
  },
  watch: {
    query(newVal) {
      if (!newVal) {
        this.$nextTick(() => {
          this.$refs.searchList.refresh()
        })
      }
    },
    query1(newV) {
      let startName = this.startPois.name
      let endName = this.endPois.name

      if (!this.startPois.name || !this.endPois.name) return

      if (
        newV === startName  &&
        this.query2 === endName
      ) {
        this.$router.push({
          path: '/search/driving'
        })
      }
    },
    query2(newV) {
      let startName = this.startPois.name
      let endName = this.endPois.name

      if (!this.startPois.name || !this.endPois.name) return

      if (newV === endName &&
      this.query1 === startName
      ) {
        this.$router.push({
          path: '/search/driving'
        })
      }
    },
    poinWay() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.searchList.refresh()
        })
      }, 10)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.select-container
  position fixed
  width 100%
  top 0
  bottom 0
  overflow hidden
  background-color rgb(246,246,246)
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
      color $color-text-d
      line-height 37px
      font-size 14px
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
      & .light
        color #666
  .upper-enter-active, .upper-leave-active
    transition all .3s
  .upper-enter, .upper-leave-to
    transform translate3d(0, 100%, 0)
  .search-wrapper
    // position fixed
    // top: 57px;
    // bottom: 0;
    // left: 0;
    // right: 0;
    .searchBox
      z-index 999
      box-shadow 0 2px 3px rgba(0, 0, 0, 0.1)
      padding-top 0
      .add-way
        width 25px
        height 25px
        border-radius 50%
        background #FDF3EC
        text-align center
        line-height 27px
        color $color-text-o
        font-weight 700
        font-size 20px
        margin-left 30px
        &:hover
          color #111
    .search-content
      width 100%
      overflow hidden
      position fixed
      top 167px
      bottom 0
      background-color rgb(246,246,246)
      .history
        position fixed
        bottom 0
        top 242px
        left 10px
        right 10px
        border-top-left-radius 5px
        border-top-right-radius 5px
        background-color $color-background
        .mapSelection
          padding 20px 12px
          z-index 99999
          .icon-location
            color $color-text-o
            margin-right 10px
          .text
            font-weight 400
        .history-wrapper
          position fixed
          overflow: hidden
          right: 10px
          left: 10px
          bottom: 40px
          top: 300px
        .clearHistory
          position fixed
          left 10px
          right 10px
          text-align center
          height 40px
          line-height 40px
          bottom 0
          font-size 12px
          color #ACACAC
          font-weight 400
  .slide-enter-active, .slide-leave-active
    transition all 0.2s
  .slide-enter, .slide-leave-to
    transform translate3d(0, 60px, 0)
  .search-result
    position fixed
    top 178px
    left 10px
    right 10px
    background $color-background
    bottom 0
    z-index 111111
    border-top-left-radius 4px
    border-top-right-radius 4px
.fade-enter-active, .fade-leave-active
  transition all .2s
.fade-enter, .fade-leave-to
  transform translate3d(100%, 0, 0)

/deep/ .bscroll-vertical-scrollbar
  width 5px!important
  /deep/.bscroll-indicator
    background #A9A9A9!important
</style>
