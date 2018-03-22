import { Button, List } from 'antd-mobile'

const ListItem = List.Item

const AppointmentCard = props => {
  const { dataSource, date, subjectType } = props
  const subject = subjectType === 'subject2' ? '科目二' : '科目三'
  return (
    <div>
      <p style={{ textAlign: 'center' }}>{`预约${subject}`}</p>
      <p style={{ textAlign: 'center' }}>{date}</p>
      {
        dataSource.map((item, index) => {
          return (
            <List style={{ marginTop: '0.2rem' }} key={index}>
              <ListItem extra={<span style={{ fontSize: '0.3rem' }}>{item.time}</span>}>学时</ListItem>
              <ListItem extra={<span style={{ fontSize: '0.3rem' }}>{item.mt}</span>}>手动档</ListItem>
              <ListItem extra={<span style={{ fontSize: '0.3rem' }}>{item.at}</span>}>自动档</ListItem>
            </List>
          )
        })
      }
      <Button type='primary' onClick={props.prev} style={{ marginTop: '0.2rem' }}>上一步</Button>
      <Button type='primary' onClick={props.submit} style={{ marginTop: '0.2rem' }}>确认提交</Button>
    </div>
  )
}

export default AppointmentCard
