import { Component } from 'react'

class CalendarMain extends Component {
  // 处理日期选择事件，如果是当月，触发日期选择，如果不是当月，切换月份
  handleDatePick (index, styleName) {
    switch (styleName) {
      case 'thisMonth':
        const month = this.props.viewData[this.props.month]
        this.props.datePick(month[index])
        break
      case 'prevMonth':
        this.props.prevMonth()
        break
      case 'nextMonth':
        this.props.nextMonth()
        break
    }
  }
  // 处理选中的样式效果
  // 在月份切换和重新选择日期时重置上一次选择的元素的样式
  changeColor () {
    let previousEl = null
    return function (e) {
      const name = e.target.nodeName.toLocaleLowerCase()
      if (previousEl && (name === 'i' || name === 'td')) {
        previousEl.style = ''
      }
      if (e.target.className === 'thisMonth') {
        e.target.style = 'background: #f8f8f8; color: #000'
        previousEl = e.target
      }
    }
  }
  // 绑定颜色改变事件
  componentDidMount () {
    const changeColor = this.changeColor()
    document.getElementById('calendarContainer').addEventListener('click', changeColor, false)
  }
  render () {
    let month = this.props.viewData[this.props.month]
    let rowsInMonth = []
    let i = 0
    let styleOfDays = (() => {
      let i = month.indexOf(1)
      let j = month.indexOf(1, i + 1)
      let arr = new Array(42)
      arr.fill('prevMonth', 0, i)
      arr.fill('thisMonth', i, j)
      arr.fill('nextMonth', j)
      return arr
    })()
    // 把每一个月的显示数据以七天为一组等分
    month.forEach((day, index) => {
      if (index % 7 === 0) {
        rowsInMonth.push(month.slice(index, index + 7))
      }
    })
    return (
      <table className='calendarMain'>
        <thead>
          <tr>
            <th>日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th>六</th>
          </tr>
        </thead>
        <tbody>
          {
            rowsInMonth.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {
                    row.map(day => {
                      return (
                        <td className={styleOfDays[i]} onClick={this.handleDatePick.bind(this, i, styleOfDays[i])} key={i++}>{day}</td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}

export default CalendarMain
