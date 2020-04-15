export default class Way {
  constructor(order, id, value, index) {
    this.order = order
    this.id = id
    this.value = value
    this.placeholder = '请输入途径点' + ++index
  }
}