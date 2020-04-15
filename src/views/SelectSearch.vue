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
          :startPlaceholder="startPlaceholder"
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
        <div class="search-content" v-show="!query">
          <my-tag></my-tag>
          <div class="history">
            <span class="icon-location"></span>
            <span>在地图上选址</span>
          </div>
        </div>
      </div>
    </transition>
    <transition name="slide">
      <div ref="searchResult" class="search-result" v-show="query">
        <suggest ref="suggest"
          :query="query"
          @list-scroll="listScroll"
        ></suggest>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import SearchBox from 'components/AppSearchBox'
import DragList from 'components/BaseDragList'
import Suggest from 'components/AppSuggest'
import MyTag from 'components/MyTag'
import Way from 'common/js/way'

export default {
  data() {
    return {
      startPlaceholder: '请输入您的起点位置',
      edit: true,
      poinWay: [],
      id: 0,
      delayShow: false,
      query: '',
      query1: '',
      query2: '',
      first: true
    }
  },
  computed: {
    ...mapGetters([
      'city'
    ]),
    isShowAdd() {
      return this.poinWay.length < 3
    }
  },
  created() {
    setTimeout(() => {
      this.delayShow = true
      this.receive()
    }, (150))
  },
  methods: {
    back() {
      this.$router.back()
    },
    receive() {
      let {start, location} = this.$route.query

      if (start === 'start') return

      if (start === 'end') {
        this.$nextTick(() => {
          this.$refs.searchBox.setStartLocation(location)
          this.first = true
        })
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
      this.query1 = query
      if (this.first) {
        this.first = false
        return
      }
      this.query = query
    },
    endQuery(query) {
      this.query2 = query
      this.query = query
    },
    listScroll() {
      this.$refs.searchBox.blur()
    },
    sort(items) {
      let i = items.length

      while(i--) {
        let id = items[i].data.dataset.id
        let order = items[i].order

        if (id || id === 0) {
          let index = this.getCurrentIndex(id)

          if (index !== -1) {
            this.poinWay[index].order = order
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
    ...mapMutations({
      setCity: 'SET_CITY'
    })
  },
  components: {
    SearchBox,
    DragList,
    MyTag,
    Suggest
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
    transition all .1s
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
      position fixed
      top 167px
      bottom 0
      background-color rgb(246,246,246)
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
</style>
