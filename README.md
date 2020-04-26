# t3-app

## 仿T3出行 webapp版本
使用vuejs, 地图接的高德，没使用任何UI框架

### 编写map.js 为多功能地图组件提供helper fn
  包含了如以下的功能
  定位处理
  拖动处理
  操作Marker
  规划路线的设置
  搜索服务
### 设计Touch Item Collection类
用于实现：
  途径点拖拽排序组件、收藏列表SwipeCell效果的实现
  可以直接通过调用Item的一些内部提供的方法去实现你想要的效果
### 封装suggest组件供多次调用
### 使用vuex
