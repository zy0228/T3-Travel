<template>
  <scroll class="search-list" :data="searchHistory" :scrollbar="scrollbar" ref="scroll">
    <ul class="list-wrapper">
      <li @click="select(item)" v-for="item in searchHistory" :key="item.id" class="search-item">
        <div class="icon">
          <span class="icon-clock2"></span>
        </div>
        <div class="content">
          <div class="name">
            <span>{{item.name}}</span>
          </div>
          <div class="address">
            <span>{{item.address}}</span>
          </div>
        </div>
        <div class="icon-star" @click.stop="star(item)">
          <span class="icon-stargrade" :class="{'star' : item.favorite}"></span>
        </div>
      </li>
    </ul>
    <div v-show="!searchHistory.length">
      <no-result title="暂无历史记录"></no-result>
    </div>
  </scroll>
</template>

<script>
import NoResult from 'components/BaseNoResult'
import Scroll from 'components/BaseScroll'

export default {
  props: {
    searchHistory: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      scrollbar: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.scroll.refresh()
    }, 1000)
  },
  methods: {
    refresh() {
      this.$refs.scroll.refresh()
    },
    select(item) {
      this.$emit('selectHistory', item)
    },
    star(item) {
      this.$emit('star', item)
    }
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

.search-list
  overflow hidden
  height 100%
  .list-wrapper
    .search-item
      display flex
      align-items center
      padding 16px 12px
      position relative
      bt-line()
      .icon
        width 24px
        height 24px
        color #CCCCCC
        font-size 14px
        line-height 24px
      .content
        flex 1
        overflow hidden
        .name
          color #070707
          font-size 14
          font-weight 400
          no-warp()
        .address
          color #ACACAC
          margin-top 6px
          font-size 12px
          font-weight 400
          no-warp()
      .icon-star
        flex 0 0 24px
        width 24px
        height 24px
        .icon-stargrade
          color #D8D8D8
          font-size 18px
          font-weight 600
          &.star
            color $color-text-o!important
</style>
