import { SwipeAction, Card } from 'antd-mobile'
import { browserHistory } from 'dva/router'
import styles from './AppointmentList.css'

const CardHeader = Card.Header
const CardBody = Card.Body

const SwipeList = (props) => {
  const { dataSource, onPress } = props
  if (dataSource.length > 0) {
    const list = dataSource.map((item, index) => {
      return (
        <SwipeItem
          key={index}
          data={item}
          onPress={onPress}
        />
      )
    })
    return (
      <div>{list}</div>
    )
  }
  return <p style={{ textAlign: 'center' }}>暂无预约记录</p>
}

const getInfo = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value))
  browserHistory.push(`/appointmentDetail/${key}`)
}

const SwipeItem = (props) => {
  const { data: { comp, date, car_auto: carAuto, car, appointmentId, subject, checkin }, onPress } = props
  const type = subject === '2' ? '科目二' : '科目三'
  const background = (() => {
    if (checkin === 1) {
      return styles.yidengji
    } else if (checkin === 3) {
      return styles.yiquxiao
    }
    return null
  })()
  return (
    <SwipeAction
      style={{ margin: '0.2rem 0.3rem 0', backgroundColor: 'gray' }}
      autoClose
      right={[
        {
          text: '取消预约',
          onPress: onPress.bind(this, { comp, date, appointmentId, checkin }),
          style: { backgroundColor: 'red', color: 'white' }
        }
      ]}
    >
      <Card
        className={background}
        onClick={getInfo.bind(this, appointmentId, props.data)}
      >
        <CardHeader
          title='预约编号'
          extra={<span>{appointmentId}</span>}
        />
        <CardBody>
          <p>预约科目：{type}</p>
          <p>预约日期：{date}</p>
          <p>预约时段：{comp}</p>
          {/* <p>预约车辆：{`${car}辆手动档,${carAuto}辆自动档`}</p> */}
        </CardBody>
      </Card>
    </SwipeAction>
  )
}

export default SwipeList
