import request from '../utils/request'

// 获取可预约时间段
export function appointmentTime ({ subjectType, date }) {
  const wxToken = window.localStorage.getItem('wxToken')
  if (wxToken) {
    return request(`/api/appointments/findDateAndSubject?subject=${subjectType}&date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${wxToken}`
      }
    })
  }
}

// 获取可预约日期
export function appointmentDate (subjectType) {
  const wxToken = window.localStorage.getItem('wxToken')
  if (wxToken) {
    return request(`/api/appointmentsTime/selectAppointmentDate?subject=${subjectType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${wxToken}`
      }
    })
  }
}

// 获取剩余车辆数
export function carsNum (params) {
  const wxToken = window.localStorage.getItem('wxToken')
  if (wxToken) {
    return request(`/api/appointments/timePeriodNumber`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${wxToken}`
      },
      body: JSON.stringify(params)
    })
  }
}

// 添加预约信息
export function add (params) {
  const wxToken = window.localStorage.getItem('wxToken')
  if (wxToken) {
    return request(`/api/appointments/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${wxToken}`
      },
      body: JSON.stringify(params)
    })
  }
}

// 查看当天预约状态
export function hasAppointment () {
  const wxToken = window.localStorage.getItem('wxToken')
  if (wxToken) {
    return request(`/api/appointment/viewTodayAppointment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${wxToken}`
      }
    })
  }
}
