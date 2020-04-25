import { getDate } from './util'

export default function dataFormat() {
  let DATA = []
  let DATA_LENGTH = 4
  let HOUR_LENGTH = 24
  let MINUTES_LENGTH = 12

  let date = [
    {
      text: getDate(3),
      value: getDate(3),
      children: []
    },
    {
      text: '后天',
      value: '后天',
      children: []
    },
    {
      text: '明天',
      value: '明天',
      children: []
    },
    {
      text: '今天',
      value: '今天',
      children: []
    }
  ]

  while (DATA_LENGTH--) {
    DATA.push(date[DATA_LENGTH])
  }

  for (let i = 0; i < DATA.length; i++) {
    for (let h = 0; h < HOUR_LENGTH; h++) {
      DATA[i].children.push({
        text: `${h}点`,
        value: h,
        children: []
      })

      for(let d = 0; d < MINUTES_LENGTH; d++) {
        DATA[i].children[h].children.push({
          text: `${+d * 5}分`,
          value: `${+d * 5}`
        })
      }
    }
  }

  let hour = new Date().getHours()

  DATA[0].children = DATA[0].children.slice(++hour)

  return DATA
}