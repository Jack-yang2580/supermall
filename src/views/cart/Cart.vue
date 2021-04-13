<template>
    <!--导航-->
    <div class="cart">
      <nav-bar class="nav-bar">
        <div slot="center">购物车({{length}})</div>
      </nav-bar>
    <!--商品列表-->
      <cart-list></cart-list>
      <!--底部汇总-->
      <cart-bottom-bar/>
    </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartBottomBar from "./childComps/CartBottomBar";
  import CartList from "./childComps/CartList";
  import { mapGetters } from 'vuex'

    export default {
        name: "cart",
      components:{
          NavBar,
          CartList,
        CartBottomBar
      },
      computed:{
          //两种语法
          // ...mapGetters(['cartLength','cartList'])
        ...mapGetters({
          length:'cartLength'
        })
      }
    }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #ffffff;
    font-size: 16px;
    /*font-weight: 700;*/
  }
</style>
