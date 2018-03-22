import { Component } from 'react'
import { Card, Button, Flex } from 'antd-mobile'
import { browserHistory } from 'dva/router'

import JsBarcode from 'jsbarcode'

const CardBody = Card.Body

const checkStatus = key => {
  switch (key) {
    case 0:
      return '未登记练车'
    case 1:
      return '已登记练车'
    case 2:
      return '已过期'
    case 3:
      return '已取消'
    case 4:
      return '未登记练车'
  }
}

const backToList = () => {
  browserHistory.push('/appointmentList')
}

class AppointmentDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: JSON.parse(JSON.stringify({}))
    }
  }
  // 组件完成加载后载入数据
  componentDidMount () {
    const { appointmentId } = this.props.params
    const data = JSON.parse(window.sessionStorage.getItem(appointmentId))
    JsBarcode('#barcode', data.barCode)
    this.setState({ data })
  }
  render () {
    const { data: { appointmentId, subject, date, checkin, comp, car_auto: carAuto, car, timeParagraph } } = this.state
    const status = checkStatus(checkin)
    return (
      <div style={{ margin: '0 0.30rem' }}>
        <p style={{ textAlign: 'center' }}>提示</p>
        <p style={{ textAlign: 'center' }}>以现场实际安排为准，请提前1小时左右到现场登记练车</p>
        <Card>
          <CardBody>
            <img style={{ width: '60%', display: 'block', margin: '0 auto' }} id='barcode' />
            <p><span>预约编号：</span>{appointmentId}</p>
            <p><span>预约科目：</span>{subject === '2' ? '科目二' : '科目三'}</p>
            <p><span>预约日期：</span>{date}</p>
            <p><span>预约状态：</span>{status}</p>
          </CardBody>
        </Card>
        <Card style={{ marginTop: '0.1rem' }}>
          <CardBody>
            <Flex style={{ borderBottom: '1px solid #c9c9c9', color: '#a1a1a1' }}>
              <div style={{ flex: 1.5 }}><p style={{ textAlign: 'center' }}>学时</p></div>
              <div style={{ flex: 1 }}><p style={{ textAlign: 'center' }}>手动档</p></div>
              <div style={{ flex: 1 }}><p style={{ textAlign: 'center' }}>自动档</p></div>
            </Flex>
            {timeParagraph ? timeParagraph.map((item, index) => (
              <Flex key={index}>
                <div style={{ flex: 1.5 }}><p style={{ textAlign: 'center' }}>{item.comp}</p></div>
                <div style={{ flex: 1 }}><p style={{ textAlign: 'center' }}>{item.car}</p></div>
                <div style={{ flex: 1 }}><p style={{ textAlign: 'center' }}>{item.carAuto}</p></div>
              </Flex>
            )) : null}
          </CardBody>
        </Card>
        <Button
          style={{ marginTop: '0.2rem', marginBottom: '0.2rem' }}
          type='primary'
          onClick={backToList}
        >
          返回
        </Button>
      </div>
    )
  }
}

export default AppointmentDetail
