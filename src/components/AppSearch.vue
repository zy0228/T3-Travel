<template>
  <div class="search" v-show="city">
    <header class="header">
      <div class="city">
        <span>{{this.city || '南京'}}</span>
      </div>
      <input ref="searchBox" type="text" v-model="location" :placeholder="placeholder">
      <span class="icon-clearclose" v-show="location" @click="clear"></span>
      <div class="cancel" @click="cancel">
        <span>取消</span>
      </div>
    </header>
    <transition name="slide">
      <div class="serach-wrapper" v-show="location">
        <suggest
          ref="ref"
          :query="location"
          @selectItem="selection"
          @list-scroll="listScroll"
        >
        </suggest>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Suggest from 'components/AppSuggest'

export default {
  data() {
    return {
      location: '',
      placeholder: '',
      flag: null
    }
  },
  computed: {
    ...mapGetters([
      'city'
    ])
  },
  created() {
    this.flag = this.$route.params.flag
  },
  methods: {
    clear() {
      this.location = ''
    },
    selection(item) {
      if (this.flag === 'home') {
        this.saveHomeTag(item)
        this.$router.back()
      }

      if (this.flag === 'company') {
        this.saveCompanyTag(item)
        this.$router.back()
      }
    },
    listScroll() {
      this.$refs.searchBox.blur()
    },
    cancel() {
      this.$router.back()
    },
    ...mapActions([
      'saveHomeTag',
      'saveCompanyTag'
    ])
  },
  components: {
    Suggest
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.search
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background #f6f6f6
  z-index 999
  .header
    position: relative;
    display: flex;
    overflow: hidden;
    padding: 10px 0;
    z-index: 999;
    background-color: #fff;
    align-items center
    .city
      margin-left 10px
      padding-right 20px
      margin-right 20px
      border-right 1px solid #E8E8E8
      color #A0A0A0
    input
      flex 1
      overflow hidden
    span
      color #A0A0A0
      border-radius 50%
    .cancel
      margin-right 10px
      padding-left 20px
      margin-left 20px
      border-left 1px solid #E8E8E8
      color #A0A0A0
  .slide-enter-active, .slide-leave-active
    transition all 0.2s
  .slide-enter, .slide-leave-to
    transform translate3d(0, 60px, 0)
  .serach-wrapper
    position fixed
    top 48px
    left 10px
    right 10px
    background $color-background
    bottom 0
    z-index 111111
    border-top-left-radius 4px
    border-top-right-radius 4px
</style>
