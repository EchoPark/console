import { Component } from 'react'
import { Tabs, WhiteSpace, Toast, NoticeBar } from 'antd-mobile'
import SwipeList from './SwipeList'

import moment from 'moment'
import 'moment/locale/zh-cn'

import { checkLoginState } from '../../services/register'
import { todayList, allList, deleteAppointmentById } from '../../services/appointmentList'
import { localUrl, onlineUrl, env } from '../../env';

const TabPane = Tabs.TabPane

class AppointmentList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showList: false,
      currentTab: 1, // 当前tab
      today: [], // 今日预约列表
      all: []    // 全部预约列表
    }
  }
  // 检查注册状态
  checkLoginStatus = async () => {
    const code = window.localStorage.getItem('wxCode')
    if (code) {
      const { data } = await checkLoginState(code)
      return data
    }
  }
  getAppoinmentList = async type => {
    if (type === 'today') {
      const { data: { data: today }, data: { code } } = await todayList()
      if (code === '10001' && Array.isArray(today)) {
        this.setState({ today })
      }
    } else if (type === 'all') {
      const { data: { data: all }, data: { code } } = await allList()
      if (code === '10001' && Array.isArray(all)) {
        this.setState({ all })
      }
    }
  }
  tabChange = key => {
    if (key === '1') {
      this.setState({ currentTab: 1 })
      this.getAppoinmentList('today')
    } else {
      this.setState({ currentTab: 2 })
      this.getAppoinmentList('all')
    }
  }
  onPress = async record  => {
    const { comp, date, appointmentId, checkin } = record
    if (checkin === 3) {
      Toast.fail('预约已取消，无法再次取消', 2)
      return
    }
    if (checkin === 1) {
      Toast.fail('预约已登记，无法取消', 2)
      return
    }
    const dateNow = moment().format('YYYY-MM-DD')
    const timeNow = moment().format('HH:mm')
    const startTime = comp.split('~')[0]
    if (date < dateNow) {
      Toast.fail('已过开始时间无法取消', 2)
      return
    }
    if (startTime < timeNow && date == dateNow) {
      Toast.fail('已过开始时间无法取消', 2)
      return
    }
    const { data: { code } } = await deleteAppointmentById(appointmentId)
    if (code === '10001') {
      const { currentTab } = this.state
      if (currentTab === 1) {
        this.getAppoinmentList('today')
      } else if (currentTab === 2) {
        this.getAppoinmentList('all')
      }
    }
  }
  componentDidMount () {
    this.checkLoginStatus().then(data => {
      const { code, token } = data
      if (code === '10001' && token) {
        window.localStorage.setItem('wxToken', token)
        this.setState({ showList: true })
        this.getAppoinmentList('today')
      } else if (code === '10003') {
        window.location.href = `${env === 'local' ? localUrl : onlineUrl}/appointmentList&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
      } else if (code === '10002') {
        window.location.href = `${env === 'local' ? localUrl : onlineUrl}/register&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
      } else if (code === '10004' || code === '10005' || code === '10007') {
        const { data: { type } } = data
        if (type === '0') {
          window.location.href = `${env === 'local' ? localUrl : onlineUrl}/coach-register&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
        } else {
          window.location.href = `${env === 'local' ? localUrl : onlineUrl}/school-register&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
        } 
      }
    })
  }
  render () {
    const { today, all, showList } = this.state
    if (showList) {
      return (
        <div>
          <Tabs
            defaultActiveKey='1'
            onChange={this.tabChange}
            swipeable={false}
          >
            <TabPane
              tab='今日预约'
              key='1'
            >
              <NoticeBar style={{ textAlign: 'center' }} mode="closable" icon>滑动卡片可取消预约</NoticeBar>
              <SwipeList
                dataSource={today}
                onPress={this.onPress}
              />
            </TabPane>
            <TabPane
              tab='全部预约'
              key='2'
            >
              <SwipeList
                dataSource={all}
                onPress={this.onPress}
              />
            </TabPane>
          </Tabs>
        </div>
      )
    }
    return <div />
  }
}

export default AppointmentList
