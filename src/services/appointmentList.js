import request from '../utils/request'

// 查询当日预约情况
export function todayList () {
  const wxToken = window.localStorage.getItem('wxToken')
  if (wxToken) {
    return request(`/api/appointment/wechatTheDayAppointment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${wxToken}`
      }
    })
  }
}

// 查询所有预约情况
export function allList () {
  const wxToken = window.localStorage.getItem('wxToken')
  if (wxToken) {
    return request(`/api/appointment/wechatAllAppointment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${wxToken}`
      }
    })
  }
}

// 取消预约
export function deleteAppointmentById (id) {
  const wxToken = window.localStorage.getItem('wxToken')
  if (wxToken) {
    return request(`/api/appointment/deleteAppointmentById?appointmentId=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${wxToken}`
      }
    })
  }
}