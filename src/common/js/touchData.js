class TouchData {
  constructor(e, collection) {
    this.id = e.identifier || 'mouse'

    // staring and current x, y
    this.ox = this.cx = e.pageX
    this.oy = this.cy = e.pageY

    // dela x y 
    this.dx = this.dy = 0 

    // total distance x, y
    this.tdx = this.tdy = 0

    // staring and current time
    this.ot = this.ct = Date.now()

    // delta time
    this.dt = 0

    // target item
    this.targetItemNode = getParentItem(e.target) ?
      collection.getItemById(getParentItem(e.target).dataset.id) : null

    this.moved = false
  }

  update(e) {
    this.moved = true

    this.dx = e.pageX - this.cx
    this.cx = e.pageX

    this.dy = e.pageY - this.cy
    this.cy = e.pageY

    this.dtx = this.cx - this.ox
    this.dty = this.cy - this.oy

    this.dt = Date.now() - this.ct
    this.ct = Date.now()
  }
}

function getParentItem(node) {
  while(node) {
    if (node.className && node.className.match(/\bitem\b/)) {
      // found node!
      return node
    } else {
      node = node.parentNode
    }
  }
}

export default TouchData