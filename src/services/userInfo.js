import request from '../utils/request'

// 获取用户信息
export function userInfo () {
  const wxToken = window.localStorage.getItem('wxToken')
  if (wxToken) {
    return request(`/api/userInfos/findWechat`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${wxToken}`
      }
    })
  }
}
