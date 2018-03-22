import React from 'react'
import { Router, Route } from 'dva/router'
import IndexPage from './routes/Home/IndexPage'
import Register from './routes/Register/Register'
import CoachRegister from './routes/Register/CoachRegister'
import SchoolRegister from './routes/Register/SchoolRegister'
import Appointment from './routes/Appointment/Appointment'
import AppointmentList from './routes/AppointmentList/AppointmentList'
import AppointmentDetail from './routes/AppointmentList/AppointmentDetail'
import UserInfo from './routes/UserInfo/UserInfo'

function RouterConfig ({ history }) {
  return (
    <Router history={history}>
      <Route path='/' component={IndexPage}>
        {/* <IndexRoute component={Register} /> */}
        <Route path='register' component={Register} />
        <Route path='coach-register' component={CoachRegister} />
        <Route path='school-register' component={SchoolRegister} />
        <Route path='appointment/:subjectType' component={Appointment} />
        <Route path='appointmentList' component={AppointmentList} />
        <Route path='appointmentDetail/:appointmentId' component={AppointmentDetail} />
        <Route path='userInfo' component={UserInfo} />
      </Route>
    </Router>
  )
}

export default RouterConfig
