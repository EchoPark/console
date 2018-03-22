import { WingBlank, Grid } from 'antd-mobile'
import coachSrc from '../../assets/coach.png'
import schoolSrc from '../../assets/school.png'
import { localUrl, onlineUrl, env } from '../../env'

const data = [
  {
    text: '驾校注册',
    icon: schoolSrc
  },
  {
    text: '教练注册',
    icon: coachSrc
  }
]

const onClick = (el, index) => {
  switch (index) {
    case 0:
      window.location.href = `${env === 'local' ? localUrl : onlineUrl}/school-register&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
      break
    case 1:
      window.location.href = `${env === 'local' ? localUrl : onlineUrl}/coach-register&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
      break
  }
}

function Login (props) {
  return (
    <div style={{ margin: '0 0.30rem' }}>
      <div style={{ paddingTop: '2rem' }}>
        <WingBlank size='lg'>
          <div>请根据您的角色选择不同的身份注册，一个微信号只能注册一次</div>
        </WingBlank>
        <div style={{ marginTop: '1rem' }}>
          <Grid
            onClick={onClick}
            data={data}
            columnNum={2} />
        </div>
      </div>
    </div>
  )
}

export default Login
