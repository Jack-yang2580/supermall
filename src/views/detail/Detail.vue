<template>
  <div id="detail">
  <!--导航-->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <!--详情页轮播图-->
      <detail-swiper :top-images="topImages"/>
      <!--商品信息-->
      <detail-base-info :goods="goods"/>
      <!--商家信息-->
      <detail-shop-info :shop="shop"/>
      <!--商品的详细信息-->
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
      <!--商品的规格-->
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <!--获取评论信息-->
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <!--获取推荐数据-->
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>

    <!--底部工具栏，不需要滚动-->
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import GoodsList from "components/content/goods/GoodsList";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import BackTop from "components/content/backTop/BackTop";

  import Scroll from "components/common/scroll/Scroll";
  import {itemListenerMixin} from "common/mixin";
  import {debounce} from "../../common/utils";

  export default {
        name: "Detail",
      components:{
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar,
        BackTop,
        Scroll
      },
    mixins:[itemListenerMixin],
      data() {
          return {
            iid: null,
            topImages: [],
            goods: {},
            shop: {},
            paramInfo: {},
            detailInfo: {},
            commentInfo: {},
            recommends: [],
            themeTopYs: [],
            getThemeTopY: null,
            currentIndex: 0,
            isShowBackTop: false
          }
      },
      created() {
          //保存传入的iid
          this.iid = this.$route.params.iid
        //根据iid请求详情数据
        getDetail(this.iid).then(res => {
          //获取顶部图片轮播数据
          //console.log(res)
          const data = res.result;
          this.topImages = data.itemInfo.topImages

          //获取商品信息
          this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
          //获取商家信息
          this.shop = new Shop(data.shopInfo)
          //保存商品的详情数据
          this.detailInfo = data.detailInfo;
          //保存商品的规格
          this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
          //获取评论信息
          if (data.rate.cRate !== 0) {
            this.commentInfo = data.rate.list[0]
          }
          // this.$nextTick(() => {
          //   //根据最新的数据，对应的DOM已经被渲染出来
          //   //但是图片依然没有被加载出来（目前获取到的offsetTop不包含其中的图片）
          //   //offsetTop值不对的时候，都是因为图片的问题
          //   this.themeTopYs = []
          //   this.themeTopYs.push(0)
          //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          //
          //   console.log(this.themeTopYs);
          // })

        })

        //请求推荐数据
        getRecommend().then(res => {
          //console.log(res);
          this.recommends = res.data.list
        })

        //给getThemeTopY赋值
        this.getThemeTopY = debounce(() => {
          //等待图片加载完成后再计算它的offsetTop,
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopYs.push(Number.MAX_VALUE)

          //console.log(this.themeTopYs);
        },500)
      },
    destroyed() {
      //console.log('destroyed');
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    methods:{
      detailImageLoad() {
       // this.$refs.scroll.refresh()
        this.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        //console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],1000)
      },
      contentScroll(position) {
        //console.log(position);
        //获取position的Y值
        const positionY = -position.y
        //用positionY和主题中的值进行对比
        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
          //   console.log(i);
          // }

          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }

          // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
          //   || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //  this.currentIndex = i;
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }

        }
        //判断backTop是否显示
        this.isShowBackTop = positionY > 3000
      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0,500)
      },
      addToCart() {
        //获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.nowPrice
        product.iid = this.iid

        //将商品添加到购物车里面
        // this.$store.commit('addCart',product)
        this.$store.dispatch('addCart',product)
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
    height: 100vh;
    overflow: hidden;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
  }
  .content {
    height: calc(100% - 44px);
  }
</style>
