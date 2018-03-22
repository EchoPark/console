import { Component } from 'react'
import { Button, Toast } from 'antd-mobile'
import DateSelector from './DateSelector'
import TimeSelector from './TimeSelector'
import { CarSelectorForCoach, CarSelectorForSchool } from './CarSelector'
import AppointmentCard from './AppointmentCard'
import ResultPage from './ResultPage'
import { createForm } from 'rc-form'
import moment from 'moment'
import 'moment/locale/zh-cn'

import { env, localUrl, onlineUrl } from '../../env'

import { browserHistory } from 'dva/router'

import { checkLoginState } from '../../services/register'
import { appointmentTime, appointmentDate, carsNum, add, hasAppointment } from '../../services/appointment'

// 深克隆
const deepClone = obj => JSON.parse(JSON.stringify(obj))

const Step1 = props => (
  <div>
    <DateSelector
      minDate={props.minDate}
      maxDate={props.maxDate}
      date={props.date}
      onChange={props.dateChange}
    />
    <TimeSelector
      onChange={props.timeChange}
      timeArr={props.timeArr}
      time={props.time}
      date={props.date}
      carNum={props.carNum}
    />
    <Button
      onClick={props.changeStep}
      type='primary'
      style={{ marginTop: '0.2rem', marginBottom: '0.2rem' }}
      disabled={!(props.date && props.time.length !== 0)}
    >
      下一步
    </Button>
  </div>
)

const Step2 = props => {
  const { carArr, carNum, times, userType, date, timeArr } = props

  const carSelector = ((userType) => {
    if (!userType) {
      return null
    } else if (userType === 'coach') {
      return times.map((time, index) => (
        <CarSelectorForCoach
          key={index}
          index={index}
          time={time}
          carType={carArr[index]}
          carNum={carNum[timeArr.map(item => `${item.start_time}-${item.end_time}`).indexOf(time)]}
          onChange={props.onChangeForCoach}
        />
      ))
    } else if (userType === 'school') {
      return times.map((time, index) => (
        <CarSelectorForSchool
          key={index}
          index={index}
          time={time}
          carType={carArr[index]}
          carNum={carNum[timeArr.map(item => `${item.start_time}-${item.end_time}`).indexOf(time)]}
          onChange={props.onChangeForSchool}
        />
      ))
    }
  })(userType)
  const disabled = carArr.some(item => item.mt + item.at === 0)
  return (
    <div>
      <p style={{ textAlign: 'center' }}>{date.format('YYYY-MM-DD')}</p>
      {carSelector}
      <Button
        onClick={props.prev}
        type='primary'
        style={{ marginTop: '0.2rem' }}
      >
        上一步
      </Button>
      <Button
        onClick={props.next}
        type='primary'
        style={{ marginTop: '0.2rem', marginBottom: '0.2rem' }}
        disabled={disabled}
      >
        下一步
      </Button>
    </div>
  )
}

const Step3 = props => (
  <AppointmentCard
    subjectType={props.subjectType}
    date={props.date.format('YYYY-MM-DD')}
    dataSource={props.dataSource}
    submit={props.submit}
    prev={props.prev}
  />
)

const Step4 = props => {
  const { orderResult, success, fail } = props
  const button = ((orderResult) => {
    if (orderResult === 1 || orderResult === 2) {
      return (
        <Button onClick={success ? success : null} type='primary' style={{ marginTop: '0.2rem' }}>查看我的预约</Button>
      )
    }
    return (
      <Button onClick={fail ? fail : null} type='primary' style={{ marginTop: '0.2rem' }}>确认</Button>
    )
  })(orderResult)
  return (
    <div>
      <ResultPage orderResult={orderResult} />
      {button}
    </div>
  )
}

class Appointment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      subjectType: '', // 预约科目类型
      orderResult: 3, // 预约结果
      currentStep: 0, // 当前所在步骤
      userType: 'coach',  // 用户类型
      carArr: [], // 车辆数量
      date: '', // 约车日期
      timeArr: [], // 可约车时间段
      dateArr: [], // 可约车日期段
      time: [],    // 选中约车时间段
      carNum: [],  // 相应时间段剩余车辆
      errMsg: '' // 错误信息提示
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
  // 获取可预约日期
  getAppointmentDate = async () => {
    const { subjectType } = this.state
    const { data: { data: dateArr } } = await appointmentDate(subjectType)
    return dateArr
  }
  // 判断今日预约状态
  hasAppointmentToday = async () => {
    const { data: { code } } = await hasAppointment()
    return code
  }
  // 获取可预约时间
  getAppointmentTime = async date => {
    const { subjectType } = this.state
    const { data: { data: timeArr } } = await appointmentTime({ subjectType, date })
    return timeArr
  }
  // 根据日期和时间获取可预约车辆数
  getCarsNum = async ({ timeArr, date: dateObj }) => {
    const { subjectType: subject } = this.state
    const date = dateObj.format('YYYY-MM-DD')
    const timePeriod = timeArr.map(item => ({
      startTime: item.start_time,
      endTime: item.end_time
    }))
    const { data: { data } } = await carsNum({ subject, timePeriod, date })
    if (data) {
      return data
    }
  }
  // 监听日期变化
  dateChange = async date => {
    const timeArr = await this.getAppointmentTime(date.format('YYYY-MM-DD'))
    const carNum = await this.getCarsNum({ timeArr, date })
    this.setState({ timeArr, date, carNum, time: [] })
  }
  // 监听车辆变化
  carChangeForSchool = (carType, index, value) => {
    let carArr = deepClone(this.state.carArr)
    carArr[index][carType] = value
    if (carArr[index].mt + carArr[index].at > 5) {
      Toast.info('同一时段最多预约5辆车！', 1)
      return
    }
    this.setState({ carArr })
  }
  carChangeForCoach = (carType, index) => {
    let { carArr } = this.state
    carArr[index] = (carType => {
      switch (carType) {
        case 'mt':
          return { mt: 1, at: 0 }
        case 'at':
          return { mt: 0, at: 1 }
      }
    })(carType)
    this.setState({ carArr })
  }
  // 监听时间段变化
  timeChange = (value, e) => {
    const checked = e.target.checked // 是否选中
    const time = deepClone(this.state.time)
    switch (checked) {
      case true:
        time.push(value)
        break
      case false:
        time.splice(time.indexOf(value), 1)
        break
    }
    const timeSort = time.sort()
    let carArr = []
    time.forEach(() => {
      carArr.push({ mt: 0, at: 0 })
    })
    this.setState({ time: timeSort, carArr })
  }
  // 下一步
  changeStep = (() => {
    const maxStep = 4  // 最大步骤
    const minStep = 1  // 最小步骤
    let currentStep = minStep  // 当前步骤
    const checkPage = (() => {
      const checkPage1 = () => {
        const { date, time } = this.state
        return date && time.length !== 0
      }
      const checkPage2 = () => {
        const { carArr } = this.state
        const result = carArr.every(({ mt, at }) => {
          return mt + at > 0
        })
        return result
      }
      return () => {
        switch (currentStep) {
          case 1:
            return checkPage1()
          case 2:
            return checkPage2()
          default:
            return true
        }
      }
    })()
    return (nextStep) => {
      if (currentStep < nextStep) {
        const checked = checkPage()
        if (!checked) {
          return
        }
      }
      currentStep = nextStep
      document.body.scrollTop = 0
      this.setState({ currentStep })
    }
  })()
  // 提交预约
  submit = async () => {
    const { date, time, carArr, subjectType } = this.state
    const params = {
      date: date.format('YYYY-MM-DD'),
      subject: subjectType,
      list: time.map((item, index) => ({
        comp: item,
        car_auto: carArr[index].at,
        car: carArr[index].mt
      }))
    }
    const { data: { code } } = await add(params)
    if (code === '10001') {
      this.setState({
        orderResult: 1,  // 预约成功
        currentStep: 4
      })
    } else if (code === '10002') {
      this.setState({   // 当天已有预约
        orderResult: 2,
        currentStep: 4
      })
    } else if (code === '10003') {
      this.setState({
        orderResult: 3,  // 校验失败
        currentStep: 4
      })
    } else if (code === '10004') {
      this.setState({
        orderResult: 4,  // 车辆数不足
        currentStep: 4
      })
    }
  }
  // 预约成功回调
  orderSuccess = () => {
    window.location.href = `${env === 'local' ? localUrl : onlineUrl}/appointmentList&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
  }
  // 预约失败回调
  orderFail = () => {
    const { subjectType } = this.state
    window.location.href = `${env === 'local' ? localUrl : onlineUrl}/appointment/${subjectType}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
  }
  componentDidMount () {
    const { subjectType } = this.props.params
    this.setState({ subjectType })
    this.checkLoginStatus().then(data => {
      const { code, token } = data
      if (code === '10001' && token ) {
        const { data: { type } } = data
        window.localStorage.setItem('wxToken', token)
        this.setState({ userType: type === '0' ? 'coach' : 'school' })
        this.hasAppointmentToday().then(code => {
          if (code === '10001') {
            this.getAppointmentDate(subjectType).then(dateArr => {
              this.dateChange(moment(dateArr[0]))
              this.setState({ dateArr, currentStep: 1 })
            })
          } else {
            this.setState({ currentStep: 4, orderResult: 2 })
          }
        })
      } else if (code === '10003') {
        window.location.href = `${env === 'local' ? localUrl : onlineUrl }/appointment/${subjectType}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
      } else if (code === '10002') {
        window.location.href = `${env === 'local' ? localUrl : onlineUrl }/register&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
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
  componentWillUnmount () {
    window.localStorage.clear()
  }
  render () {
    const { orderResult, subjectType, userType, timeArr, dateArr, carArr, carNum, currentStep, date, time } = this.state

    const minDate = moment(dateArr[0])
    const maxDate = moment(dateArr[dateArr.length - 1])

    const dataSource = time.map((item, index) => {
      return {
        time: item,
        at: carArr[index].at,
        mt: carArr[index].mt
      }
    })

    const currentPage = (currentStep => {
      switch (currentStep) {
        case 0:
          return <div />
        case 1:
          return (
            <Step1
              minDate={minDate}
              maxDate={maxDate}
              date={date}
              dateChange={this.dateChange}
              timeChange={this.timeChange}
              timeArr={timeArr}
              time={time}
              carNum={carNum}
              changeStep={this.changeStep.bind(this, 2)}
            />
          )
        case 2:
          return (
            <Step2
              userType={userType}
              times={time}
              date={date}
              timeArr={timeArr}
              carArr={carArr}
              carNum={carNum}
              onChangeForCoach={this.carChangeForCoach}
              onChangeForSchool={this.carChangeForSchool}
              prev={this.changeStep.bind(this, 1)}
              next={this.changeStep.bind(this, 3)}
            />
          )
        case 3:
          return (
            <Step3
              subjectType={subjectType}
              date={date}
              dataSource={dataSource}
              prevStep={this.changeStep.bind(this, 2)}
              submit={this.submit}
              prev={this.changeStep.bind(this, 2)}
            />
          )
        case 4:
          return (
            <Step4
              orderResult={orderResult}
              success={this.orderSuccess}
              fail={this.orderFail}
            />
          )
      }
    })(currentStep)
    return (
      <div style={{ margin: '0.2rem 0.3rem 0' }}>
        {currentPage}
      </div>
    )
  }
}

export default Appointment
