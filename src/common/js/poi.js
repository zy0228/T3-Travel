export default class Poi {
  constructor({id, name, location, address, children}) {
    this.id = id
    this.name = name
    this.location = location
    this.address = address
    this.children = children ? childrenSlice(children) : null
  }
}

function childrenSlice(children, max = 12) {
  if (Array.isArray(children)) {
    return children.slice(0, max)
  }

  return children
}