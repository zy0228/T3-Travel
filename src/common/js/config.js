const mapConfig = {
  prefix: 'https://webapi.amap.com/maps?v=1.4.15&callback=_initMap&key=',
  key: '4876a5aef877edb9ad19d09ea76759d7', // 高德地图的key
  type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
  uiUrl: 'https://webapi.amap.com/ui/1.0/main-async.js', // 1.0.11 version
  style: 'amap://styles/310c895f7715f227d191b9dec31ecfa4',
  price: 1.2,
  startPrice: 6
}

export const SING_LOCATION = {
  START: 0,
  END: 1
}

// 代表当前的打车状态
export const currentProcess = {
  notCall: 'NOCALL', // 未叫车
  calling: 'CALLING', // 等待中
  awaitDriver: 'AWAIT_DRIVER', // 等待司机到达
  driverArrive: 'DRIVER_ARRIVE', // 司机已到达
}

export default mapConfig
