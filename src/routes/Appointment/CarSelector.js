import { List, Stepper, Radio } from 'antd-mobile'

const ListItem = List.Item
const RadioItem = Radio.RadioItem

// 车辆选择for驾校
const CarSelectorForSchool = props => {
  const { index, time, carType, carNum } = props
  return (
    <List renderHeader={() => time}>
      <ListItem
        extra = {
          <Stepper
            style={{ width: '100%', minWidth: '1rem' }}
            showNumber
            max={carNum.subjectRemain}
            min={0}
            onChange={value => props.onChange('mt', index, value)}
            value={carType.mt}
            disabled={carNum.subjectRemain === 0}
          />
        }
      >
        <p style={{ fontSize: '0.3rem' }}>手动档</p>
      </ListItem>
      <ListItem
        extra = {
          <Stepper
            style={{ width: '100%', minWidth: '1rem' }}
            showNumber
            max={carNum.subjectAutoRemain}
            min={0}
            onChange={value => props.onChange('at', index, value)}
            value={carType.at}
            disabled={carNum.subjectAutoRemain === 0}
          />
        }
      >
        <p style={{ fontSize: '0.3rem' }}>自动档</p>
      </ListItem>
    </List>
  )
}
// 车辆选择器for教练
const CarSelectorForCoach = props => {
  const { index, time, carType, carNum } = props
  return (
    <List renderHeader={() => time}>
      <RadioItem
        checked={carType.mt > 0}
        onChange={() => props.onChange('mt', index)}
        disabled={carNum.subjectRemain === 0}
      >
        手动档车一辆
      </RadioItem>
      <RadioItem
        checked={carType.at > 0}
        onChange={() => props.onChange('at', index)}
        disabled={carNum.subjectAutoRemain === 0}
      >
        自动档车一辆
      </RadioItem>
    </List>
  )
}

export { CarSelectorForCoach, CarSelectorForSchool }
