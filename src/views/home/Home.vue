<template>
   <div id="home">
     <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
     <tab-control :titles="['流行','新款','精选']"
                  @tabClick="tabClick"
                  ref="tabControl1"
                  class="tab-control" v-show="isTabFixed"/>
     <scroll class="content"
             ref="scroll"
             :probe-type="3"
             @scroll="contentScrolll"
             :pull-up-load="true" @pullingUp="loadMore">
       <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
       <recommend-view :recommends="recommends"/>
       <feature-view/>
       <tab-control :titles="['流行','新款','精选']"
                    @tabClick="tabClick"
                    ref="tabControl2"/>
       <goods-list :goods="showGoods"/>
     </scroll>
     <!--.native是用来监听组件根元素的原生事件，组件本身是不能监听点击的-->
     <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
   </div>
</template>

<script>
  import HomeSwiper from "./childComponents/HomeSwiper";
  import RecommendView from "./childComponents/RecommendView";
  import FeatureView from "./childComponents/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import {getHomeMultidata, getHomeGoods}from "network/home";

  import {itemListenerMixin} from "common/mixin";

  export default {
        name: "home",
        components: {
          HomeSwiper,
          RecommendView,
          FeatureView,
          NavBar,
          TabControl,
          GoodsList,
          Scroll,
          BackTop
      },
    mixins:[itemListenerMixin],
        data() {
          return {
            banners:[],
            recommends:[],
            goods:{
              'pop':{page:0, list:[]},
              'new':{page:0, list:[]},
              'sell':{page:0, list:[]}
            },
            currentType:'pop',
            isShowBackTop:false,
            tabOffsetTop:0,
            isTabFixed:false,
            saveY:0
          }
    },
    computed:{
        showGoods() {
          return this.goods[this.currentType].list
        }
    },
    activated() {
      // console.log('activated');
      this.$refs.scroll.scrollTo(0,this.saveY, 100)

      this.$refs.scroll.refresh()
    },
    deactivated() {
          //保存Y值
      this.saveY = this.$refs.scroll.getScrollY()
      //console.log(this.saveY);
      //取消全局事件的监听
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    created() {
          //请求首页数据
          this.getHomeMultidata()
          //请求商品数据
          this.getHomeGoods('pop')
          this.getHomeGoods('new')
          this.getHomeGoods('sell')
    },
    mounted() {

    },
    methods:{
          /*
          * 事件监听的相关的方法
          * */
      tabClick(index){
        //console.log(index);
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        //两个tabcontrol的点击保持一致
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0)
      },
      contentScrolll(position) {
        // console.log(position);
        //判断backTop是否显示
        this.isShowBackTop = (-position.y) > 3000

        //决定tanControl是否吸顶（position：fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        // console.log('加载更多');
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        //获取tabControl的offsetTop
        // console.log(this.$refs.tabControl.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
          /**
           * 网络请求相关的方法
           * */
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type){
        //请求当前页数的下一页。以此类推
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          //console.log(res);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //完成了上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;

    /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  .content {
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

.tab-control {
  position: relative;
  z-index: 9;
}

  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>
