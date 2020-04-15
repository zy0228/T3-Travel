import Item from './item'

export default class Collection {
  constructor() {
    this.items = []
    this.hash = new Map()
  }

  getItemById(id) {
    return this.hash.get(id)
  }

  hasItem(id) {
    return this.hash.has(+id)
  }

  addItem(data) {
    let newItem = new Item(data)

    newItem.collection = this

    this.items.push(newItem)

    this.hash.set(+(newItem.data.dataset.id), newItem)

    return newItem
  }

  getItemsBetween(origin, target) {
    let i = this.items.length
    let result = []

    while(i--) {
      let item = this.items[i]
      let order = item.order

      if ((order > origin && order <= target) || (order < origin && order >= target)) {
        result.push(item)
      }
    }

    return result
  }

  collapseAt(at, target) {
    let items = this.items, item
    let i = items.length
    let delIndex = null

    while(i--) {
      item = items[i]
      if (item === target) {
        if (target.deleted) delIndex = i // found item is to be deleted
      } else if (item.order > +at && target.deleted) {
        let item = items[i]
        item.order--
        // update el data-order at the same time
        item.data.dataset.order = item.order
        item.updatePosition()
      }
    }

    // if this item is deleted
    if (delIndex || delIndex === 0) {
      // delete item data
      items.splice(delIndex, 1)
      this.hash.delete(+item.data.dataset.id)
    }
  }
}