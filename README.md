# t3-app

## 仿T3出行 webapp版本
使用vuejs, 地图接的高德，没使用任何UI框架

### 地图多功能组件的封装
### 设计Touch Item Collection类
用于实现：
  途径点拖拽排序组件
  收藏列表SwipeCell效果的实现
  
  可以直接通过
  ```
  let item = new Item(el)
  item.onDargStart(arg)
  item.onDragMove(arg)
  ```
  这种优雅的方式实现交互
### 封装suggest组件供多次调用
### 使用vuex
