import { Component } from 'react'
import { InputItem, Button, Checkbox, TextareaItem, ImagePicker, Steps, WingBlank, Modal, Result, Icon, Toast } from 'antd-mobile'
import ImgPicker from './ImgPicker'

import { sendSMS, checkSMS } from '../../services/verifyCode'
import { createUserForSchool, checkLoginState, deleteUserInfo } from '../../services/register'
import { localUrl, onlineUrl, env } from '../../env';

const AgreeItem = Checkbox.AgreeItem
const Step = Steps.Step

const deepClone = obj => JSON.parse(JSON.stringify(obj))

const phoneRegex = /^1[0-9]{10}$/
const idRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

const RegisterNotice = (
  <div style={{ textAlign: 'left' }}>
    <p style={{ textAlign: 'center' }}>用户注册协议</p>
    <p>用户承诺以其真实身份注册康达考试场微信服务平台，并保证所提供的个人身份资料信息真实、完整、有效，依据法律规定和本协议约定对所提供的的信息承担相应的法律责任。用户以真实身份注册康达考试场微信服务平台，需要修改所提供的个人身份资料信息的，康达考试场微信服务平台应当及时、有效地为其提供该项服务。</p>
    <p>康达考试场微信服务平台有权审查用户注册所提供的身份信息是否真实、有效、并应积极地采取技术与管理等合理措施保障用户账号的安全、有效；用户有义务妥善保管其账号及密码，并正确、安全地使用其账号及密码。</p>
    <p>用户了解并同意：每注册一个康达考试场微信服务平台账号，即一次合同缔约行为，成就一份独立的服务合约，康达考试场微信服务平台有权暂停账号的登录和使用。</p>
    <p>用户在注册时应提供完整、详尽、真实的个人资料，若所提供的资料日后有变更，用户应及时更新账号信息。若用户在康达考试场微信服务平台留下的个人资料与事实不符，康达考试场微信服务平台可以停止向其继续提供产品和服务。当用户向康达考试场微信服务平台主张其拥有某账号时，若该账号在康达考试场微信服务平台的身份信息有任何不符，康达考试场有权不予认定该账号为该用户所有。</p>
    <p>用户了解并同意：在没有经过康达考试场微信服务平台允许并登记的情况下，用户不得将账号及密码泄露或提供他人知晓，也不得将账号出借或转让给他人使用。如果因用户自身过错或计算机感染病毒，而导致账号或密码泄露的，用户应自身承担由此造成的损失。康达考试场微信服务平台员工（包括但不限于康达考试场微信服务平台的网站管理人员、客服人员等）不会以任何方式询问用户的密码，所以用户不应该对任何人泄露自身的密码，不要多人共享同一个账号，不要安装非法或来路不明的程序 。如果用户遗失密码，康达考试场微信服务平台针对处理此问题之服务保留索取额外费用的权利。</p>
    <p>若用户发现账号或密码被他人非法使用或异常使用的情形，应立即根据康达考试场微信服务平台公布的处理方式通知康达考试场，并有权要求康达考试场微信服务平台暂停该账号的登录和使用。但用户在申请时应提供与其注册信息一致的有效信息。康达考试场微信服务平台核实用户所提供的有效信息与注册信息一致的，应当及时采取措施暂停账号的登录和使用。如用户没有提供有效信息或与其注册信息不一致的，康达考试场微信服务平台有权拒绝用户上述请求。</p>
    <p style={{ color: 'red' }}>用户已经了解并同意，康达考试场微信服务平台在服务数据出现异常（包括程序bug导致的数据异常）时，可以将该服务器数据还原到一定时间点，对此康达考试场微信服务平台不承担任何责任。</p>
  </div>
)

const BlackUserResult = props => {
  return (
    <div style={{ backgroundColor: '#fff', height: '100%', overflow: 'hidden' }}>
        <Result
        style={{ marginTop: '1rem' }}
        img={<Icon type='cross-circle-o' style={{ fill: '#F13642', width: '1.2rem', height: '1.2rem' }} />}
        title='账号异常'
        message='您的账号出现异常，请联系工作人员'
        />
        <p style={{ textAlign: 'center' }}>请在公众号内发送消息</p>
        <p style={{ textAlign: 'center' }}>或</p>
        <p style={{ textAlign: 'center' }}>发送邮件至：</p>
        <p style={{ textAlign: 'center' }}>kangdaserver@outlook.com</p>
        <Button
          type='primary'
          style={{ margin: '0.2rem 0.3rem', display: 'block' }}
          onClick={props.onOk}
        >
          确定
        </Button>
    </div>
  )
}

class SchoolRegister extends Component {
  constructor (props) {
    super(props)
    this.state = {
      corporationIdPicUrl: '',
      manageIdPicUrl: '',
      licencePicUrl: '',
      checked: false, // 用户注册协议是否打钩
      identifyingCode: '获取验证码', // 验证码按钮显示文字
      currentStep: 0, // 当前所在步骤
      checkStep: 2, // 审核所在步骤
      corporationIdPic: '', // 法人身份证
      manageIdPic: '',  // 管理员身份证
      licencePic: '', // 营业执照
      registerInfo: {},   // 注册信息
      verifyCode: '',     // 验证码
      registerMessage: '', // 错误反馈
      errMsg: '',
      checkResult: 'failed', // 结果页类型
      checkMsg: '', // 结果页提示
      visible: false // 用户协议弹出框
    }
  }
  // 点击获取验证码
  getIdentifyingCode = (() => {
    let timeId = null
    let count = 60 // 设定初始等待时间
    let identifyingCode = '' // 验证码按钮显示
    return () => {
      if (timeId) {
        return
      }
      const { registerInfo } = this.state
      if (registerInfo.phone) {
        sendSMS(registerInfo.phone)
      } else {
        return
      }
      timeId = setInterval(() => {
        if (count !== 0) {
          identifyingCode = `${--count}s`
        } else {
          count = 60
          identifyingCode = '获取验证码'
          clearInterval(timeId)
          timeId = null
        }
        this.setState({ identifyingCode })
      }, 1000)
      // TODO
    }
  })()
  // 是否同意用户协议
  agree = e => {
    const checked = e.target.checked
    this.setState({ checked })
  }
  // 点击上一步or下一步
  stepChange = async action => {
    let { currentStep } = this.state
    if (action === 'prev') {
      currentStep = currentStep === 1 ? currentStep : --currentStep
      this.setState({ currentStep, errMsg: '' })
      document.body.scrollTop = 0
    } else if (action === 'next') {
      let validate = false
      switch (currentStep) {
        case 1:
          validate = this.inputValidate(['name', 'identity', 'phone'])
          break
        case 2:
          validate = this.inputValidate(['legal_person_name', 'legal_person_phone', 'legal_person_identity', 'school_name', 'business_license_no', 'address'])
          break
      }
      if (validate) {
        // if (currentStep === 1) {
        //   const { phone } = this.state.registerInfo
        //   const { data } = await checkSMS(phone)
        //   if (data.code === '10002') {
        //     if (data.data != this.state.verifyCode) {
        //       this.setState({ errMsg: '验证码错误' })
        //       return
        //     }
        //   } else if (data.code === '10001') {
        //     this.setState({ errMsg: '验证码错误' })
        //     return
        //   }
        // }
        currentStep = currentStep !== 4 ? ++currentStep : currentStep
        this.setState({ currentStep, errMsg: '' })
        document.body.scrollTop = 0
      } else {
        return
      }
    }
  }
  // 防抖
  debounce = (fn, delay) => {
    let timer = null
    return () => {
      let args = arguments
      clearTimeout(timer)
      setTimeout(() => {
        fn.apply(this, arguments)
      }, delay)
    }
  }
  // 输入验证
  inputValidate = (keys) => {
    const { registerInfo } = this.state
    if (Array.isArray(keys)) {
      for (let key of keys) {
        if (!registerInfo[key]) {
          switch (key) {
            case 'name':
              this.setState({ errMsg: '用户名不能为空' })
              break
            case 'identity':
              this.setState({ errMsg: '身份证不能为空' })
              break
            case 'phone':
              this.setState({ errMsg: '手机号不能为空' })
              break
            case 'legal_person_name':
              this.setState({ errMsg: '法人姓名不能为空' })
              break
            case 'legal_person_phone':
              this.setState({ errMsg: '法人手机号不能为空' })
              break
            case 'legal_person_identity':
              this.setState({ errMsg: '法人身份证号不能为空' })
              break
            case 'school_name':
              this.setState({ errMsg: '驾校名称不能为空' })
              break
            case 'business_license_no':
              this.setState({ errMsg: '营业执照编号不能为空' })
              break
            case 'address':
              this.setState({ errMsg: '驾校地址不能为空' })
              break
          }
          return false
        } else {
          if (key === 'phone' || key === 'legal_person_phone') {
            if (!phoneRegex.test(registerInfo.phone)) {
              this.setState({ errMsg: '请输入正确格式的电话号码' })
              return false
            }
          } else if (key === 'identity' || key === 'legal_person_phone') {
            if (!idRegex.test(registerInfo.identity)) {
              this.setState({ errMsg: '请输入正确格式的身份证号' })
              return false
            }
          }
        }
      }
      return true
    }
  }
  // 验证码
  verifyCodeChange = verifyCode => {
    this.setState({ verifyCode })
  }
  // 提交注册信息
  registerSchool = async schoolInfo => {
    const code = window.localStorage.getItem('wxCode')
    if (code) {
      const { data } = await createUserForSchool({ code, schoolInfo })
      return data.code
    }
  }
  // 检查注册状态
  checkLoginStatus = async (url) => {
    const code = window.localStorage.getItem('wxCode')
    if (code) {
      const { data } = await checkLoginState(code, url)
      return data
    }
  }
  // 提交表单
  submit = () => {
    const { registerInfo, manageIdPicUrl, corporationIdPicUrl, licencePicUrl } = this.state
    Toast.loading(`提交中`, 0)
    this.registerSchool({
      files: [
        {
          name: 'identity',
          path: manageIdPicUrl
          // path: '12312312'
        },
        {
          name: 'legalidentity',
          path: corporationIdPicUrl
          // path: '12312312'
        },
        {
          name: 'license',
          path: licencePicUrl
          // path: '12312312'
        }
      ],
      ...registerInfo,
      remarks: registerInfo.remarks ? registerInfo.remarks : ''
    }).then(code => {
      Toast.hide()
      document.body.scrollTop = 0
      this.setState({ checkResult: 'done', checkStep: 2, currentStep: 4, checkMsg: '完成' })
    })
  }
  // 返回微信公众号
  returnToWeiChat = () => {
    WeixinJSBridge.invoke('closeWindow',{},function(res){
      //alert(res.err_msg)
    })
  }
  // 弹出用户协议
  showModal = e => {
    e.preventDefault()
    this.setState({ visible: true })
  }
  // 关闭用户协议
  closeModal = e => {
    e.preventDefault()
    this.setState({ visible: false })
  }
  // 结果页面完成按钮回调
  resultSubmit = async () => {
    const { checkResult } = this.state
    if (checkResult === 'failed') {
      const userId = window.localStorage.getItem('userId')
      const { data } = await deleteUserInfo(userId)
      console.log(data)
    }
    this.returnToWeiChat()
  }
  // 输入change
  inputChange = (key, val) => {
    const registerInfo = deepClone(this.state.registerInfo)
    registerInfo[key] = val
    this.setState({ registerInfo })
  }
  chooseImage = file => {
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.uploadImage({
          localId: res.localIds[0],
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            const serverId = res.serverId; // 返回图片的服务器端ID
            self.setState({ [`${file}Url`]: serverId })
          }
        })
        wx.getLocalImgData({
          localId: res.localIds[0],
          success: function (res) {
            const localData = res.localData;
            if (localData.indexOf('base64') > -1) {
              self.setState({ [file]: localData })
            } else {
              self.setState({ [file]: `data:image/png;base64,${localData}` })
            }
          }
        })
      }
    })
  }
  cancelImage = file => {
    this.setState({ [file]: '' })
  }
  componentDidMount () {
    const url = location.href.split('#')[0]
    this.checkLoginStatus(url).then(data => {
      const { code } = data
      if (code === '10001') {
        this.setState({ checkResult: 'done', checkStep: 3, currentStep: 4, checkMsg: '您已完成注册' })
      } else if (code === '10002') {
        const { data: { signature_data: signature } } = data
        wx.config({
          ...signature,
          jsApiList: ['chooseImage', 'getLocalImgData', 'uploadImage']
        });
        this.setState({ currentStep: 1 })
      } else if (code === '10003') {
        window.location.href = `${env === 'local' ? localUrl : onlineUrl}/school-register&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
      } else if (code === '10004') {
        this.setState({ checkResult: 'done', checkStep: 2, currentStep: 4, checkMsg: '完成' })
      } else if (code === '10005') {
        const { reason } = data
        const { data: { id } } = data
        window.localStorage.setItem('userId', id)
        this.setState({ checkResult: 'failed', checkStep: 3, currentStep: 4, checkMsg: `${reason},请重新注册` })
      } else if (code === '10007') {
        this.setState({ currentStep: 5 })
      }
    })
  }
  componentWillUnmount () {
    window.localStorage.clear()
  }
  render () {
    const { registerInfo, verifyCode } = this.state
    const { checked, identifyingCode, currentStep, checkStep } = this.state
    const { manageIdPic, corporationIdPic, licencePic } = this.state
    const { errMsg, checkResult, checkMsg } = this.state
    const { visible } = this.state
    const span = <span style={{ color: '#108ee9' }}>{identifyingCode}</span> // 验证码按钮DOM

    let currentPage

    const step1 = (
      <div style={{ margin: '2rem 0.3rem 0' }}>
        <InputItem
          placeholder='管理员姓名'
          onChange={this.inputChange.bind(this, 'name')}
          value={registerInfo.name ? registerInfo.name : ''}
        />
        <InputItem
          placeholder='管理员身份证号'
          style={{ marginTop: '0.1rem' }}
          onChange={this.inputChange.bind(this, 'identity')}
          value={registerInfo.identity ? registerInfo.identity : ''}
        />
        <InputItem
          placeholder='管理员手机号'
          style={{ marginTop: '0.1rem' }}
          onChange={this.inputChange.bind(this, 'phone')}
          value={registerInfo.phone ? registerInfo.phone : ''}
        />
        <InputItem
          placeholder='验证码'
          extra={span}
          onExtraClick={this.getIdentifyingCode}
          style={{ marginTop: '0.1rem' }}
          onChange={this.verifyCodeChange}
          value={verifyCode}
        />
        <Button
          disabled={!(registerInfo.name && registerInfo.identity && registerInfo.phone && verifyCode && checked)}
          onClick={this.stepChange.bind(this, 'next')}
          type='primary'
          style={{ marginTop: '0.2rem' }}
        >
        下一步
        </Button>
        <AgreeItem
          style={{ marginTop: '0.2rem' }}
          onChange={this.agree}
        >
          <a onClick={this.showModal} href='javascript:void(0)'>《用户注册协议》</a>
        </AgreeItem>
        <Modal
          maskClosable={false}
          visible={visible}
          closable={false}
          onClose={this.closeModal}
        >
          <div style={{ padding: '0 0.4rem',  }}>
            {RegisterNotice}
            <Button
              onClick={this.closeModal}
              type='primary'
              style={{ marginTop: '0.2rem', marginBottom: '1rem' }}
            >
              确定
            </Button>
          </div>
        </Modal>
      </div>
    )

    const step2 = (
      <div style={{ margin: '2rem 0.3rem 0' }}>
        <InputItem
          placeholder='法人姓名'
          onChange={this.inputChange.bind(this, 'legal_person_name')}
          value={registerInfo.legal_person_name ? registerInfo.legal_person_name : ''}
        />
        <InputItem
          placeholder='法人手机号'
          style={{ marginTop: '0.1rem' }}
          onChange={this.inputChange.bind(this, 'legal_person_phone')}
          value={registerInfo.legal_person_phone ? registerInfo.legal_person_phone : ''}
        />
        <InputItem
          placeholder='法人身份证号'
          style={{ marginTop: '0.1rem' }}
          onChange={this.inputChange.bind(this, 'legal_person_identity')}
          value={registerInfo.legal_person_identity ? registerInfo.legal_person_identity : ''}
        />
        <InputItem
          placeholder='驾校名称'
          style={{ marginTop: '0.1rem' }}
          onChange={this.inputChange.bind(this, 'school_name')}
          value={registerInfo.school_name ? registerInfo.school_name : ''}
        />
        <InputItem
          placeholder='营业执照编号'
          style={{ marginTop: '0.1rem' }}
          onChange={this.inputChange.bind(this, 'business_license_no')}
          value={registerInfo.business_license_no ? registerInfo.business_license_no : ''}
        />
        <InputItem
          placeholder='驾校地址'
          style={{ marginTop: '0.1rem' }}
          onChange={this.inputChange.bind(this, 'address')}
          value={registerInfo.address ? registerInfo.address : ''}
        />
        <TextareaItem
          placeholder='备注（选填）'
          autoHeight
          style={{ marginTop: '0.5rem' }}
          onChange={this.inputChange.bind(this, 'remarks')}
          value={registerInfo.remarks ? registerInfo.remarks : ''}
        />
        <Button
          disabled={!(registerInfo.legal_person_name && registerInfo.legal_person_phone && registerInfo.legal_person_identity && registerInfo.school_name && registerInfo.business_license_no && registerInfo.address)}
          onClick={this.stepChange.bind(this, 'next')}
          type='primary'
          style={{ marginTop: '0.2rem' }}
        >
        下一步
        </Button>
      </div>
    )

    const step3 = (
      <div style={{ margin: '2rem 0.3rem 0' }}>
        <p>上传管理人手持身份证照片</p>
        <ImgPicker
          imgSrc={manageIdPic}
          addImg={this.chooseImage.bind(this, 'manageIdPic')}
          cancelImg={this.cancelImage.bind(this, 'manageIdPic')}
        />
        <p>上传法人身份证照片</p>
        <ImgPicker
          imgSrc={corporationIdPic}
          addImg={this.chooseImage.bind(this, 'corporationIdPic')}
          cancelImg={this.cancelImage.bind(this, 'corporationIdPic')}
        />
        <p>上传营业执照</p>
        <ImgPicker
          imgSrc={licencePic}
          addImg={this.chooseImage.bind(this, 'licencePic')}
          cancelImg={this.cancelImage.bind(this, 'licencePic')}
        />
        <Button
          onClick={this.stepChange.bind(this, 'prev')}
          type='primary'
          style={{ marginTop: '0.2rem' }}
        >
        上一步
        </Button>
        <Button
          disabled={!(manageIdPic && corporationIdPic && licencePic)}
          onClick={this.debounce(this.submit, 1000)}
          type='primary'
          style={{ marginTop: '0.2rem' }}
        >
        提交注册
        </Button>
      </div>
    )

    const step4 = (
      <div style={{ margin: '2rem 0.3rem 0' }}>
        <WingBlank size="lg">
          <Steps current={checkStep}>
            <Step title='提交注册申请' description="您已提交注册申请" />
            <Step title="审核中" description='将在两个工作日内完成审核' />
            <Step
              status={checkResult === 'failed' ? 'error' : 'finish'}
              title={checkResult === 'failed' ? '失败' : '完成'}
              description={checkMsg}
            />
          </Steps>
        </WingBlank>
        <Button
          onClick={this.resultSubmit}
          type='primary'
          style={{ marginTop: '0.2rem' }}
        >
          完成
        </Button>
      </div>
    )

    switch (currentStep) {
      case 0:
        currentPage = null
        break
      case 1:
        currentPage = step1
        break
      case 2:
        currentPage = step2
        break
      case 3:
        currentPage = step3
        break
      case 4:
        currentPage = step4
        break
      case 5:
        currentPage = <BlackUserResult onOk={this.returnToWeiChat} />
    }

    return (
      <div>
        {currentPage}
        <p style={{ textAlign: 'center' }}>{errMsg}</p>
      </div>
    )
  }
}

export default SchoolRegister
