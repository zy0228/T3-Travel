<template>
  <Scroll
    class="myTage"
    :scrollX="scrollX"
    :scrollY="scrollY"
  >
    <ul class="tag-wrapper">
      <li class="tag-item" @click="selectTagHome">
        <div class="name">
          <span class="icon icon-home_filled"></span>
          <span>家</span>
        </div>
        <div class="des">
          {{(home.id && home.name) || '设置家的地址'}}
        </div>
      </li>
      <li class="tag-item" @click="selectTagCompany">
        <div class="name">
          <span class="icon icon-business_center"></span>
          <span>公司</span>
        </div>
        <div class="des">
          {{(company.id && company.name) || '设置公司地址'}}
        </div>
      </li>
      <li class="tag-item" @click="selectTagFavorite">
        <div class="name">
          <span class="icon icon-stargrade"></span>
          <span>收藏选点</span>
        </div>
        <div class="des">
          查看全部
        </div>
      </li>
    </ul>
  </Scroll>
</template>

<script>
import { mapGetters } from 'vuex'
import Scroll from 'components/BaseScroll'

export default {
  data() {
    return {
      scrollX: true,
      scrollY: false
    }
  },
  computed: {
    ...mapGetters([
      'home',
      'company'
    ])
  },
  methods: {
    selectTagHome() {
      this.$emit('selectTag', 'home', this.home)
    },
    selectTagCompany() {
      this.$emit('selectTag', 'company', this.company)
    },
    selectTagFavorite() {
      this.$emit('selectTag', 'favorite')
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.myTage
  position relative
  overflow hidden
  white-space nowrap
  .tag-wrapper
    display inline-block
    .tag-item
      display inline-block
      background-color $color-background
      width 145px
      margin 10px
      padding 10px
      box-shadow 0px 1px 2px 0px rgba(0, 0, 0, .1)
      border-radius 5px
      &:not(:first-child)
        margin-left 0
        margin-right 0
      &:last-child
        margin 10px
      .name
        color #111
        font-weight 600
        font-size 14px
        .icon
          color #9A9A9A
          font-size 15px
          margin-right 8px
      .des
        margin-top 5px
        color #c3c3c3
        font-size 14px
        margin-left 23px
        no-warp()
</style>
