import { createUserForCoach } from '../services/register'

export default {
  namespace: 'register',
  state: {
    currentStep: 1
  },
  reducers: {
    setBasic (state, { payload: values }) {
      return { ...state, ...values }
    }
  },
  effects: {
    * coachRegister ({ payload: userInfo }, { call, put }) {
      const code = window.localStorage.getItem('wxCode')
      if (code) {
        const { data } = yield call(createUserForCoach, { code, userInfo })
        console.log(data)
      } else {
        // TODO
      }
    }
  }
}
