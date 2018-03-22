import { Component } from 'react'
import { Card, Button } from 'antd-mobile'
import { checkLoginState } from '../../services/register'
import { userInfo } from '../../services/userInfo'
import { localUrl, onlineUrl, env } from '../../env'

const CardHeader = Card.Header
const CardBody = Card.Body

const CoachInfo = props => {
  const { userInfo } = props
  if (userInfo) {
    return (
      <div>
        <Card>
          <CardBody>
            <p style={{ textAlign: 'center' }}>个人信息</p>
            <p><span style={{ letterSpacing: '0.3rem' }}>姓名</span>：{userInfo.name}</p>
            <p><span style={{ letterSpacing: '0.1rem' }}>手机号</span>：{userInfo.phone}</p>
            <p><span>身份证号</span>：{userInfo.identity}</p>
          </CardBody>
        </Card>
        <Card style={{ marginTop: '0.1rem' }}>
          <CardBody>
            <p style={{ textAlign: 'center' }}>其他信息</p>
            <p><span>教练编号：</span>{userInfo.coach_no}</p>
            <p><span>所属驾校：</span>{userInfo.school_name}</p>
            <p><span>联系地址：</span>{userInfo.address}</p>
          </CardBody>
        </Card>
      </div>
    )
  }
}

const SchoolInfo = props => {
  const { userInfo } = props
  if (userInfo) {
    return (
      <div>
        <Card>
          <CardBody>
            <p style={{ textAlign: 'center' }}>管理员信息</p>
            <p><span style={{ letterSpacing: '0.3rem' }}>姓名</span>：{userInfo.name}</p>
            <p><span style={{ letterSpacing: '0.1rem' }}>手机号</span>：{userInfo.phone}</p>
            <p><span>身份证号：</span>{userInfo.identity}</p>
          </CardBody>
        </Card>
        <Card style={{ marginTop: '0.1rem' }}>
          <CardBody>
            <p style={{ textAlign: 'center' }}>法人信息</p>
            <p><span style={{ letterSpacing: '0.3rem' }}>姓名</span>：{userInfo.legal_person_name}</p>
            <p><span style={{ letterSpacing: '0.1rem' }}>手机号</span>：{userInfo.legal_person_phone}</p>
            <p><span>身份证号：</span>{userInfo.legal_person_identity}</p>
          </CardBody>
        </Card>
        <Card style={{ marginTop: '0.1rem' }}>
          <CardBody>
            <p style={{ textAlign: 'center' }}>其他信息</p>
            <p><span>驾校名称：</span>{userInfo.school_name}</p>
            <p><span>营业执照：</span>{userInfo.business_license_no}</p>
            <p><span>驾校地址：</span>{userInfo.address}</p>
          </CardBody>
        </Card>
      </div>
    )
  }
}

class UserInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userInfo: {}
    }
  }
  backToWeichat = () => {
    WeixinJSBridge.invoke('closeWindow',{},function(res){
      //alert(res.err_msg)
    })
  }
  // 检查注册状态
  checkLoginStatus = async () => {
    const code = window.localStorage.getItem('wxCode')
    if (code) {
      const { data } = await checkLoginState(code)
      return data
    }
  }
  // 获取用户信息
  getUserInfo = async () => {
    const { data } = await userInfo()
    if (data) {
      return data
    }
  }
  componentDidMount () {
    this.checkLoginStatus().then(data => {
      const { code, token } = data
      if (code === '10001' && token) {
        const { data: { id } } = data
        window.localStorage.setItem('wxToken', token)
        window.localStorage.setItem('userId', id)
        this.getUserInfo().then(data => {
          const { code } = data
          if (code === '10001') {
            const { data: userInfo } = data
            this.setState({ userInfo: userInfo ? userInfo : {} })
          }
        })
      } else if (code === '10002') {
        window.location.href = `${env === 'local' ? localUrl : onlineUrl}/register&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
      } else if (code === '10003') {
	      window.location.href = `${env === 'local' ? localUrl : onlineUrl}/register&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
      } else if (code === '10004' || code === '10005' || code === '10007' ) {
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
    const { userInfo } = this.state
    if (userInfo.type) {
      const showInfo = userInfo.type === '0' ? <CoachInfo userInfo={userInfo} /> : <SchoolInfo userInfo={userInfo} />
      return (
        <div style={{ margin: '0 0.3rem' }}>
          {showInfo}
          <Button
            style={{ marginTop: '0.2rem', marginBottom: '0.2rem' }}
            type='primary'
            onClick={this.backToWeichat}
          >
            确定
          </Button>
        </div>
      )
    }
    return null
  }
}

export default UserInfo
