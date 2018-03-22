import request from '../utils/request'

export function createUserForCoach ({ code, userInfo }) {
  return request(`/api/userInfos/registerCoachInfo?code=${code}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(userInfo)
  })
}

export function createUserForSchool ({ code, schoolInfo }) {
  return request(`/api/userInfos/registerSchoolInfo?code=${code}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(schoolInfo)
  })
}

export function checkLoginState (code, url) {
  if (url) {
    return request(`/api/userInfos/checkLoginState?code=${code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ url })
    })
  }
  return request(`/api/userInfos/checkLoginState?code=${code}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
}

export function deleteUserInfo (id) {
  return request(`/api/userInfos/deleteWechatRegisterInfo?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
}
