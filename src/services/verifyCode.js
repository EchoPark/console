import request from '../utils/request'

function sendSMS (phone) {
  return request(`/api/userInfos/sendSMS`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ phone })
  })
}

function checkSMS (phone) {
  return request(`/api/userInfos/checkOutCode?phone=${phone}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
}

export { sendSMS, checkSMS }
