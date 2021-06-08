<template>

   <grid-view>
     <good-list-item v-for="(item, index) in categoryDetail" :key="index" :goods="item"></good-list-item>
   </grid-view>

</template>

<script>
  // import GoodsListItem from 'views/home/childComps/GoodsListItem'//
import GoodListItem from "../../../components/content/goods/GoodListItem";
import GridView from "../../../components/common/gridView/GridView";
  export default {
    name: "TabContentDetail",
    components: {
      GoodListItem,
      GridView
    },
    props: {
      categoryDetail: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>

</style>
