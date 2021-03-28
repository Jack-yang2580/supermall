<template>
   <div id="home">
     <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
     <home-swiper :banners="banners"/>
     <recommend-view :recommends="recommends"/>
     <feature-view/>
     <tab-control class="tab-control" :titles="['流行','新款','精选']"/>
     <goods-list :goods="goods['pop'].list"/>
   </div>
</template>

<script>
  import HomeSwiper from "./childComponents/HomeSwiper";
  import RecommendView from "./childComponents/RecommendView";
  import FeatureView from "./childComponents/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";

  import GoodsList from "components/content/goods/GoodsList";

  import {getHomeMultidata,
          getHomeGoods
  }from "network/home";

  export default {
        name: "home",
        components: {
          HomeSwiper,
          RecommendView,
          FeatureView,
          NavBar,
          TabControl,
          GoodsList
      },
        data() {
          return {
            banners:[],
            recommends:[],
            goods:{
              'pop':{page:0, list:[]},
              'new':{page:0, list:[]},
              'sell':{page:0, list:[]}
            }
          }
    },
        created() {
          //请求首页数据
          this.getHomeMultidata()
          //请求商品数据
          this.getHomeGoods('pop')
          this.getHomeGoods('new')
          this.getHomeGoods('sell')
    },
    methods:{
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          //console.log(res);
          //this.result = res
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
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
    height: 2000px;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }
</style>
