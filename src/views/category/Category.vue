<template>
  <div class="wrapper">
    <div class="content"></div>
    <h2>分类</h2>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
    export default {
        name: "category",
      data(){
          return {
            scroll:null
        }
      },
      mounted() {
        //console.log(document.querySelector('.wrapper'));
        this.scroll = new BScroll(document.querySelector('.wrapper'),{
          probeType:3,
          click:true,
          pullUpLoad:true,
          mouseWheel:true
        })

        // this.scroll.on('scroll',(position) => {
        //   console.log(position);
        // })

        this.scroll.on('pullingUp',() => {
          console.log('上拉加载更多');

          setTimeout(() => {
            this.scroll.finishPullUp()
          },2000)
        })
      }
    }
</script>

<style scoped>
  .wrapper {
    height: 450px;
    /*background-color: #ff5777;*/

    overflow: hidden;
    /*overflow-y: scroll;*/
  }
</style>
