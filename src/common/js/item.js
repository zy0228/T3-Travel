import client from 'common/js/compatibilityCss3'

const ITEM_HEIGHT = 40
const transform = client.transformProperty
const CLS_NAME = ['sorting-trans', 'sorting']

class Item {
  constructor(data) {
    this.x = 0
    this.y = (data.dataset.order) * ITEM_HEIGHT
    this.data = data
    this.order = +data.dataset.order

    // cache styles
    this.style = data.style

  }

  moveY(y) {
    this.y = y
    this.style[transform] = 'translate3d(0px,' + y + 'px,0px)'
  }

  updatePosition() {
    // moveY
    this.moveY(this.order * ITEM_HEIGHT)
  }

  del() {
    this.deleted = true
    this.collection.collapseAt(this.order, this)
  }

  onSortStart() {
    this.data.classList.add(...CLS_NAME)
  }

  /**
   * @param {Number} dy  deltaY
   * @param {*} collection total collection
   */
  onSortMove(dy) {
    this.moveY(this.y + dy)

    this.checkSwap()
  }

  onSortEnd() {
    this.updatePosition()
    this.data.classList.remove('sorting')
    this.data.classList.remove('sorting-trans')
  }

  checkSwap() {
    let currentAt = Math.min(this.collection.items.length - 1, ~~((this.y + ITEM_HEIGHT / 2) / ITEM_HEIGHT))
    let origin = Number(this.order)


    if (currentAt !== origin) {
      let targets = this.collection.getItemsBetween(origin, currentAt),
      i = targets.length,
      increment = currentAt > origin ? -1 : 1;

      // if out of scope
      if (!i) return

      while (i--) {
          let target = targets[i];
          // first change data-order

          target.order += increment

          // update el data-order
          target.data.dataset.order = target.order

          // then implement updatePosition
          target.updatePosition()
      }

      // update current el data-order
      this.order = currentAt
      this.data.dataset.order = currentAt
    }
  }
}

export default Item