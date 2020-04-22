import mapConfig from './config'

const STATUS_COMPLETE = 'complete'
const STATUS_ERROR = 'error'

export function mapLoader () {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      // 分别创建两个scripthtml元素 用来动态插入JS API
      let scriptTag = document.createElement('script')

      scriptTag.type = 'text/javascript'
      scriptTag.async = true
      scriptTag.src = `${mapConfig.prefix}${mapConfig.key}`
      scriptTag.onerror = reject
      document.body.appendChild(scriptTag)

      let scriptUi = document.createElement('script')
      scriptUi.type = 'text/javascript'
      scriptUi.src = `${mapConfig.uiUrl}`
      document.body.appendChild(scriptUi)
    }
    window.initMap = () => {
      // 这里调用initAMapUI初始化
      initAMapUI()
      resolve(window.AMap)
    }
  })
}

/**
 * AMap拖拽事件
 * @param {fn} successCk
 * @param {fn} failCK
 */
export function positionPicker (map, successBk, failBK) {
  AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
    let positionPicker = new PositionPicker({
      mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
      map, // 依赖地图对象
      iconStyle: {// 自定义外观
        url: require('common/images/control-point.png'),
        size: [48, 48], // 要显示的点大小，将缩放图片
        ancher: [10.5, 46]// 锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
      }
    })

    // 事件处理 拖拽结束后 获取 success / fail
    positionPicker.on('success', successBk)
    positionPicker.on('fail', failBK)

    positionPicker.start()

    return positionPicker
  })
}

/**
 *  查找附近标志性建筑
 * @param {object} autoOptions 可选配置
 * @param {string} keyword    关键字
 * @param {position[lng, lat]} cpoint  中心点
 * @param {number} radius  范围
 */
export function searchNearBy (autoOptions, keyword, cpoint, radius) {
  return new Promise((resolve, reject) => {
    AMap.service(['AMap.PlaceSearch'], () => {
      let placeSearch = new AMap.PlaceSearch(autoOptions)
      placeSearch.searchNearBy(keyword, cpoint, radius, function (status, result) {
        // 搜索成功时，result即是对应的匹配数据
        if (status === STATUS_COMPLETE) {
          resolve(result)
        } else if (status === STATUS_ERROR) {
          reject(result)
        } else {
          reject(result)
        }
      })
    })
  })
}

/**
 * 添加监听拖动事件
 * @param {Class AMap} map
 * @param {fn} dragStart
 * @param {fn} draging
 * @param {fn} dragEnd
 */
export function addDragEvent (map, dragStart, draging, dragEnd = () => {}) {
  if (map === null ||
    typeof dragStart !== 'function' ||
    typeof dragEnd !== 'function') return

  map.on('dragstart', dragStart)
  map.on('dragging', draging)
  map.on('dragend', dragEnd)
}

/**
 * 创建文本标记
 * @param {*} target
 * @param {class AMap} map
 * @param {object} config
 */
export function createPositionText (config) {
  let style = {
    position: 'absolute',
    padding: '10px',
    color: '#111111',
    'box-shadow': '0 2px 2px rgba(0, 0, 0, .2)'
  }

  style = Object.assign(style, config.style ? config.style : {})

  return new AMap.Text(Object.assign({
    text: '默认文字',
    anchor: 'center',
    draggable: false,
    animation: 'AMAP_ANIMATION_DROP'
  }, config, { style }))
}

// 如果isShow为ture 还需要搭配你页面上的css
export function creatPointMarker (isShowCircle, position, offset) {
  let pointDom = isShowCircle ? `<div class="custom-point"></div>` : `<div class="custom-noShow-point"></div>`

  return new AMap.Marker({
    position,
    offset: new AMap.Pixel(offset ? offset.x : 0, offset ? offset.y : 0),
    // 将 html 传给 content
    content: pointDom
  })
}

export function searchPlace ({ keyword, city, pageSize, pageIndex }) {
  return new Promise((resolve, reject) => {
    AMap.service('AMap.PlaceSearch', () => {
      let autoOptions = {
        city: city || '南京',
        children: 1, // show children
        type: mapConfig.type,
        pageSize,
        pageIndex
      }

      let autoComplete = new AMap.PlaceSearch(autoOptions)
      autoComplete.search(keyword, function (status, result) {
        if (status === 'complete') {
          resolve(result)
        } else {
          reject(result)
        }
      })
    })
  })
}

export function dirving (map, origin, destination, opt, name) {
  console.log(opt)
  let poiWay = {}
  let thePrice = ''
  let poinList = []
  let nameList = []

  if (opt.length > 0) {
    opt.forEach(item => {
      if (item.location) {
        let { lng, lat } = item.location
        poinList.push([lng, lat])
        nameList.push(item.name)
      }
    })

    poiWay['waypoints'] = poinList
  }

  return new Promise((resolve, reject) => {
    AMap.plugin('AMap.Driving', function () {
      var driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
        ferry: 1,
        map: map,
        autoFitView: true,
        hideMarkers: true
      })

      driving.search(origin, destination, poiWay, function (status, result) {
        if (status === 'complete') {
          if (result.routes && result.routes.length) {
            let startLoction = result.start.location
            let endLocation = result.end.location
            let waypoints = result.waypoints
            console.log(result)

            if (waypoints.length > 0) {
              // add pointway marker and show name
              waypoints.forEach((item, index) => {
                let { lng, lat } = item.location
                let point = creatPointMarker(true, [lng, lat])
                point.setMap(map)
                point.setLabel({
                  // offset: new AMap.Pixel(0 , 0),  //设置文本标注偏移量
                  content: `<div class='custom-info'>${nameList[index]}</div>`
                })
              })
            }

            drawRoute(result.routes[0])
            setMarker([startLoction.lng, startLoction.lat], [endLocation.lng, endLocation.lat])
            setTextMarker([startLoction.lng, startLoction.lat], [endLocation.lng, endLocation.lat], result)
            resolve(thePrice)
          }
        }
      })
    })
  })

  // hepler  =======================================================================
  function setTextMarker (start, end, result) {
    // createPositionText
    let routes = result.routes[0]
    let totoalTime = routes.time
    let distance = (routes.distance / 1000).toFixed(1)
    let date = new Date()
    let min = date.getMinutes()
    let startPoi = creatPointMarker(false, start, { x: -45, y: -75 })
    let endPoi = creatPointMarker(false, end, { x: -65, y: -90 })
    let unit = ''
    let startTime = 5
    let endtime = 0

    if (totoalTime < 60) {
      unit = '秒'
    } else {
      totoalTime = ~~(totoalTime / 60)

      unit = '分钟'
    }

    if (distance < 1) {
      // 起步价
      thePrice = mapConfig.startPrice
    } else {
      thePrice = (distance - 1) * mapConfig.price + mapConfig.startPrice
    }

    date.setMinutes(min + totoalTime)
    endtime = `${date.getHours()}:${date.getMinutes()}`

    startPoi.setMap(map)
    endPoi.setMap(map)

    let startDom = `
      <div class="custom-start-text">
        <span class="text-o">${startTime}分钟后</span><span>上车</span> 
      </div>`

    let endDom = `
      <div class="custom-end-text">
        <div class="expect-time">
          <span>预计</span>
          <span class="text-o">${endtime}</span>
          <span>到达</span>
        </div>
        <div class="driving-info">
          <span>全程</span>
          <span class="distance text-o">${distance}</span>
          <span>公里,</span>
          <span class="text-o">${totoalTime}</span>
          <span>${unit}</span>
        </div>
      </div>
    `

    startPoi.setLabel({
      // offset: new AMap.Pixel(0 , 0),  //设置文本标注偏移量
      content: startDom
    })

    endPoi.setLabel({
      // offset: new AMap.Pixel(0 , 0),  //设置文本标注偏移量
      content: endDom
    })
  }

  function setMarker (start, end) {
    let startPoi = creatPointMarker(false, start, { x: 4, y: -10 })
    let endPoi = creatPointMarker(false, end, { x: 4, y: -10 })

    startPoi.setMap(map)
    endPoi.setMap(map)

    startPoi.setLabel({
      // offset: new AMap.Pixel(0 , 0),  //设置文本标注偏移量
      content: `<div class='custom-info'>${name.start}</div>`
    })

    endPoi.setLabel({
      // offset: new AMap.Pixel(0 , 0),  //设置文本标注偏移量
      content: `<div class='custom-info'>${name.end}</div>`
    })
  }

  function drawRoute (route) {
    var path = parseRouteToPath(route)
    let startDom = document.createElement('div')
    let endDom = document.createElement('div')
    startDom.className = 'custom-startMarker-wrapper'
    endDom.className = 'custom-endMarkder-wrapper'

    var startMarker = new AMap.Marker({
      position: path[0],
      content: startDom,
      map: map
    })

    var endMarker = new AMap.Marker({
      position: path[path.length - 1],
      content: endDom,
      map: map
    })

    var routeLine = new AMap.Polyline({
      path: path,
      isOutline: true,
      outlineColor: '#5FBC3A',
      borderWeight: 2,
      strokeWeight: 5,
      strokeColor: '#5FBC3A',
      lineJoin: 'round',
      zIndex: 100
    })

    routeLine.setMap(map)

    // 调整视野达到最佳显示区域
    map.setFitView([ startMarker, endMarker, routeLine ])
  }
  // helper
  function parseRouteToPath (route) {
    var path = []

    for (var i = 0, l = route.steps.length; i < l; i++) {
      var step = route.steps[i]

      for (var j = 0, n = step.path.length; j < n; j++) {
        path.push(step.path[j])
      }
    }

    return path
  }
}
