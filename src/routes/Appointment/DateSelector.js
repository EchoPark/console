import { List, DatePicker } from 'antd-mobile'

const ListItem = List.Item

const DateSelector = props => {
  return (
    <div>
      <List renderHeader={() => '选择日期'}>
        <DatePicker
          mode='date'
          title='选择日期'
          value={props.date}
          onChange={props.onChange}
          minDate={props.minDate}
          maxDate={props.maxDate}
        >
          <ListItem arrow='horizontal'>日期</ListItem>
        </DatePicker>
      </List>
    </div>
  )
}

export default DateSelector
