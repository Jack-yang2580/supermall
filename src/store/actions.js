
export default {
  addCart(context,payload) {
  return new Promise(((resolve, reject) => {
    //查找之前数组中是否有该商品
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

    //判断oldProduct
    if (oldProduct) {// 数量+1
      // oldProduct.count += 1
      context.commit('addCounter',oldProduct)
      resolve('当前商品数量+1')
    }else {// 添加新的商品
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit('addToCart',payload)
      resolve('加入购物车成功！')
    }
  }))


  }
}
