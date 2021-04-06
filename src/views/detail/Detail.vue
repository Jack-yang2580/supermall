<template>
  <div id="detail">
  <!--导航-->
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="content">
      <!--详情页轮播图-->
      <detail-swiper :top-images="topImages"/>
      <!--商品信息-->
      <detail-base-info :goods="goods"/>
      <!--商家信息-->
      <detail-shop-info :shop="shop"/>
      <!--商品的详细信息-->
      <detail-goods-info :detail-info="detailInfo"/>
      <!--商品的规格-->
      <detail-param-info :param-info="paramInfo"/>
    </scroll>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import {getDetail,Goods,Shop,GoodsParam} from "network/detail";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";

  import Scroll from "components/common/scroll/Scroll";

  export default {
        name: "Detail",
      components:{
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        Scroll
      },
      data() {
          return {
            iid:null,
            topImages: [],
            goods:{},
            shop:{},
            paramInfo:{},
            detailInfo:{}
          }
      },
      created() {
          //保存传入的iid
          this.iid = this.$route.params.iid
        //根据iid请求详情数据
        getDetail(this.iid).then(res => {
          //获取顶部图片轮播数据
          console.log(res)
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
        })
      }
    }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
    height: 100vh;
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
