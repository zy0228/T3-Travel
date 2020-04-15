let s = document.body.style

// only supports browsers with CSS 3D Transforms
let isWebkit = 'webkitTransform' in s
let transformProperty = 
  'webkitTransform' in s ? 'webkitTransform' :
  'mozTransform' in s ? 'mozTransform' :
  'msTransform' in s ? 'msTransform' : 'transform'

const client =  {
  isWebkit,
  transformProperty
}

export default client
