<template>
  <div class="bottom-bar">
   <div class="checked-content">
     <check-button
       :is-checked="isSelectAll"
       class="checked-button"
     @click.native="selectAllClick"/>
     <span>全选</span>
   </div>
    <div class="price-total">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
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
        },
        isSelectAll() {
          // if (this.$store.state.cartList.length === 0) return false
          // return !(this.$store.state.cartList.filter(item => !item.checked).length)
          //需要判断购物车是否为空
          if (this.$store.state.cartList.length === 0) return false
          return !this.$store.state.cartList.find(item => !item.checked)
        }
      },
      methods:{
        selectAllClick() {
          // console.log('全选');
          if (this.isSelectAll) {// 全部选择
            this.$store.state.cartList.forEach(item => item.checked = false)
          }else {// 部分或全部不选中
            this.$store.state.cartList.forEach(item => item.checked = true)
          }
          // this.$store.state.cartList.forEach(item => item.checked = !this.isSelectAll)
        },
        calcClick() {
          if (!this.isSelectAll) {

          }
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
