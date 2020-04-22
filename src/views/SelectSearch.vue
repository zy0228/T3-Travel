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
      <div class="done" :class="{'light' : isAlready}">
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
              @focus-list="focusList"
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
      query2: '',
      focusId: null,
      query1Ready: false,
      query2Ready: false,
      poiWayReady: false
    }
  },
  computed: {
    ...mapGetters([
      'city',
      'searchHistory',
      'startPois',
      'endPois',
      'poinWayList'
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
    },
    clonePoinWay() {
      return JSON.parse(JSON.stringify(this.poinWay))
    },
    isAlready() {
      return this.query1Ready && this.query2Ready && !this.poiWayReady
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
        // throw new Error('check your router, params is exception ')
        if (this.focusId === null) return

        let index = this.getCurrentIndex(this.focusId)
        let theIndex = this.poinWayList.findIndex(item => item.id === this.focusId)

        if (index > -1 && theIndex > -1) {
          this.$set(this.poinWay[index], 'value', this.poinWayList[theIndex].name)
        }

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

      let newWay = new Way(len, this.id++, '', len)
      this.poinWay.push(newWay)
    },
    deleteItem(index) {
      let delIndex = this.poinWay.findIndex(item => {
        return item.id === index
      })

      let i = this.poinWayList.findIndex(item => item.id === index)

      if (delIndex != -1) {
        this.poinWay.splice(delIndex, 1)
        // this.setPoinWay(this.poiWayRemove(delIndex))
      }

      if (i > -1) {
        this.setPoinWay(this.poiWayRemove(i))
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

      // let name = this.startPois.name || ''
      // if (queryFormat === name) {
      //   this.query = ''
      //   this.query1 = queryFormat
      //   return
      // }

      this.query = queryFormat
      this.query1 = queryFormat
      this.queryIsEnd = false
    },
    endQuery(query) {
      let queryFormat = query.trim()
      // let name = this.endPois.name || ''
      // if (queryFormat === name) {
      //   this.query = ''
      //   this.query2 = queryFormat
      //   return
      // }

      this.query = queryFormat
      this.query2 = queryFormat
      this.queryIsEnd = true
    },
    onfocusStart() {
      this.focusIsEnd = false
      this.focusId = null
    },
    onfocusEnd() {
      this.focusIsEnd = true
      this.focusId = null
    },
    listScroll() {
      this.$refs.searchBox.blur()
    },
    selection(item) {
      let poi = new Pois(item)

      if (this.focusId !== null) {

        // change input value
        this.setPoinWayValue(item)
      } else {
        this.setLocation(item)
        this.query = ''
      }

      this.saveSearch(poi)
    },
    setPoinWayValue(item) {
      let poiWay = {
        id: this.focusId,
        name: item.name.trim(),
        location: item.location
      }

      let poiWayList = this.poiWayPush(poiWay)

      // add state
      this.setPoinWay(poiWayList)

      // set poinway value
      let index = this.getCurrentIndex(this.focusId)
      if (index > -1) {
        this.$set(this.poinWay[index], 'value', item.name)
      }
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
          if (this.focusId !== null) {
            this.setPoinWayValue(item)
            return
          }
          this.setLocation(item)
        } else {
          this.$router.push({
            path: '/search/home/select'
          })
        }
      } else if (flag === 'company') {
        if (item.id) {
          if (this.focusId !== null) {
            this.setPoinWayValue(item)
            return
          }

          this.setLocation(item)
        } else {
          this.$router.push({
            path: '/search/company/select'
          })
        }
      } else {
        if (this.focusId === null) {
          this.$router.push({
            path: `/search/${this.focusIsEnd ? 'end' : 'start'}/favorite`
          })
        } else {
          this.$router.push({
            path: `/search/${this.focusId}/favorite`
          })
        }
      }
    },
    slectSearch(item) {
      if (this.focusId !== null) {
        this.setPoinWayValue(item)
        return
      }
      this.setLocation(item)
    },
    focusList(id) {
      // current focus input
      this.focusId = +id
    },
    mapSelect() {
      if (this.focusId === null) {
        this.$router.push({
          path: `/search/${this.focusIsEnd ? 'end' : 'start'}/mapselect`
        })
      } else {
        this.$router.push({
          path: `/search/${this.focusId}/mapselect`
        })
      }
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
    ...mapMutations({
      setCity: 'SET_CITY',
      setPoinWay: 'SET_POINWAY'
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
      // console.log('query的值', newVal)
      if (!newVal) {
        this.$nextTick(() => {
          this.$refs.searchList.refresh()
        })
      }
    },
    query1(newV) {
      let startName = this.startPois && this.startPois.name

      if (newV === startName) {
        this.query1Ready = true
        this.query = ''
      } else {
        this.query1Ready = false
        this.saveStart(new Object())
      }
    },
    query2(newV) {
      let endName = this.endPois && this.endPois.name

      if (newV === endName) {
        this.query2Ready = true
        this.query = ''
      } else {
        this.query2Ready = false
        this.saveEnd(new Object())
      }
    },
    clonePoinWay: {
      handler(cur, pre) {
        if (!cur.length) {
          this.focusId = null
          this.query = ''
        }

        // refresh search-list scroll =============================
        if ((cur.length || 0) !== (pre.length || 0)) {
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.searchList.refresh()
            })
          }, 10)
        }

        // change query to search ==================================
        let index = cur.findIndex((item) => item.id === this.focusId)
        let pIndex = this.poinWayList.findIndex(item => item.id === +this.focusId)

        if (index > -1) {
          if (this.poinWayList.length > 0 && pIndex > -1 && this.poinWayList[pIndex].name === cur[index].value.trim()) {
            this.query = ''
          } else {
            this.query = cur[index].value
          }
        }

        let findIndex
        // check poinWay is Already ===============================
        if (!this.poinWayList.length) return
        this.poiWayReady = this.poinWayList.some((item, i) => {
          let id = item.id
          let index = cur.findIndex((poi) => poi.id === id)

          if (index > -1) {
            findIndex = i
            return item.name !== cur[index].value.trim()
          } else {
            return false
          }
        })

        if (this.poiWayReady) {
          this.setPoinWay(this.poiWayRemove(findIndex))
        }
      },
      deep: true
    },
    isAlready: {
      handler(newv) {
        console.log(newv)
      },
      deep: true
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
    .light
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
