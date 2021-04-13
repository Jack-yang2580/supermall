

export default {
//mutations唯一目的就是修改state中的状态
//mutations中的每个方法完成的事情尽可能单一
  addCounter(state, payload) {
    payload.count += 1
  },
  addToCart(state, payload) {
    payload.checked = true
    state.cartList.push(payload)
  }
}
