<template>
  <div class="bottom-bar">
   <div class="checked-content">
     <check-button class="checked-button"/>
     <span>全选</span>
   </div>
    <div class="price-total">
      合计：{{totalPrice}}
    </div>
    <div class="calculate">
      去计算 ({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
    export default {
        name: "CartBottomBar",
      components:{
          CheckButton
      },
      computed:{
        totalPrice() {
          return '￥' + this.$store.getters.cartList.filter(item => {
            return item.checked
          }).reduce((preValue,item) => {
            return preValue + item.price * item.count
          },0).toFixed(2)
        },
        checkLength() {
          return this.$store.state.cartList.filter(item => item.checked).length
        }
      }
    }
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;
    background-color: #eee;
    height: 40px;
    line-height: 40px;
  }
  .checked-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .checked-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price-total {
    margin-left: 20px;
  }
  .calculate {
    width: 100px;
    margin-left:auto;
    background-color: #ff700d;
    color: #f6f6f6;
    text-align: center;
  }
</style>
