import { List, Checkbox } from 'antd-mobile'
import moment from 'moment'
import 'moment/locale/zh-cn'

const CheckboxItem = Checkbox.CheckboxItem

const CarNumTips = props => {
  const { carNum } = props
  if (carNum) {
    const { subjectRemain: mtTotal, subjectAutoRemain: atTotal } = props.carNum
    const mtTips = mtTotal > 5 ? '手动档有车' : `手动档剩余${mtTotal}辆`
    const atTips = atTotal > 5 ? '自动档有车' : `自动档剩余${atTotal}辆`
    return <p style={{ fontSize: '0.3rem' }}>{`${mtTips}，${atTips}`}</p>
  }
  return null
}

const TimeSelector = props => {
  // timeArr 可预约时间段
  // time 选中预约时间段
  const { timeArr, time, carNum, date } = props
  const nowTime = moment().format('HH:mm')
  const nowDate = moment().format('YYYY-MM-DD')
  if (timeArr.length === 0) {
    return (
      <p style={{ textAlign: 'center', marginTop: '1.2rem' }}>无可预约时间段</p>
    )
  }
  return (
    <List renderHeader={() => '选择时间段'}>
      {
        timeArr.map((item, index) => {
          const disabled = carNum[index].subjectRemain === 0 && carNum[index].subjectAutoRemain === 0
          return (
            <CheckboxItem
              key={index}
              onChange={e => props.onChange(`${item.start_time}-${item.end_time}`, e)}
              checked={time.includes(`${item.start_time}-${item.end_time}`)}
              disabled={disabled || (item.end_time <= nowTime && date.format('YYYY-MM-DD') == nowDate) || date.format('YYYY-MM-DD') < nowDate}
            >
              <div>
                {`${item.start_time}-${item.end_time}`}
                <CarNumTips carNum={carNum[index]} />
              </div>
            </CheckboxItem>
          )
        })
      }
    </List>
  )
}

export default TimeSelector
