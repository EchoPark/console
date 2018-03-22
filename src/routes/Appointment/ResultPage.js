import { Result, Icon } from 'antd-mobile'

const ResultPage = (props) => {
  const { orderResult } = props
  switch (orderResult) {
    case 1:
      return (
        <Result
          img={<Icon type='check-circle' style={{ fill: '#1F90E6', width: '1.2rem', height: '1.2rem' }} />}
          title='预约成功'
          message='以现场实际安排为准，请提前1小时左右到现场登记练车'
        />
      )
    case 2:
      return (
        <Result
          img={<Icon type='cross-circle-o' style={{ fill: '#F13642', width: '1.2rem', height: '1.2rem' }} />}
          title='预约失败'
          message='当天已有预约'
        />
      )
    case 3:
      return (
        <Result
          img={<Icon type='cross-circle-o' style={{ fill: '#F13642', width: '1.2rem', height: '1.2rem' }} />}
          title='预约失败'
          message='请重新预约'
        />
      )
    case 4:
      return (
        <Result
          img={<Icon type='cross-circle-o' style={{ fill: '#F13642', width: '1.2rem', height: '1.2rem' }} />}
          title='车辆数不足'
          message='车辆数不足，请点击确认返回重新预约'
        />
      )
  }
}

export default ResultPage
