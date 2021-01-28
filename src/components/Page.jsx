import React, { useContext, useRef, useEffect, useMemo, useState } from 'react'
import { Row, Col, Card, Image, List, Form, Radio, Switch, Button } from 'antd'
import { AppCtx, get, post } from '../Helper'
import { AppConfig } from '../Config'
import { CheckOutlined, CloseOutlined, CloseCircleFilled } from '@ant-design/icons'
import { Line } from '@ant-design/charts'
import Draggable from 'react-draggable'
import FormItem from 'antd/lib/form/FormItem'



export const CardGrid = ({ dataSource, action }) => {
  const cardStyle = { height: '50vh', overflowY: 'auto' }
  return (
    <Card size="small" style={cardStyle}>
      {dataSource.map((item) => {
        return (
          <Card.Grid
            key={item.name}
            style={{ width: '50%', textAlign: 'center' }}>
            <div style={{ display: 'grid', placeItems: 'center' }}>
              <Image
                preview={false}
                width={128}
                height={128}
                fallback={AppConfig.fallbackImage}
                src={`${item.icon}.png`}
                onClick={() => {
                  if (action.current && action.current[0] && action.current[0].act.indexOf('SELECT') !== -1) {
                    return
                  }
                  action.current.unshift({ act: 'MOD_SELECT', url: `${item.icon}.FBX`, detail: { name: `${item.name}`, color: '' } })
                }
                }
              />
              <h5>{item.name}</h5>
            </div>
          </Card.Grid>

        )

      })}
    </Card>
  )
}

export function MpsAndRisksList({ action }) {
  const [dataSource, setDataSource] = useState({ 'mpsList': [], 'riskList': [] })
  let guid = localStorage.getItem('guid')
  useMemo(() => {
    post({ url: AppConfig.url.postUnpublishMpsAndRisk, data: { guid } })
      .then(data => {
        setDataSource(data.data)
      })
  }, [guid])
  return <div className="hide-scrollbar" style={{ overflowY: 'auto', height: '60vh', display: 'flex', justifyContent: 'space-between' }}>
    <List
      style={{ height: '60vh', width: '22vh' }}
      itemLayout="horizontal"
      dataSource={dataSource['mpsList']}
      renderItem={(item, index) => (
        <List.Item onClick={() => {
          if (action.current && action.current[0] && action.current[0].act.indexOf('SELECT') !== -1) {
            return
          }
          action.current.unshift({
            act: 'FLAG_SELECT',
            url: 'models/basic/Box.FBX',
            detail: {
              name: `${item.name}`,
              color: `${item.type}` === '2' ? '#ff0000' : '#00ff00',
              bimId: item.id,
              type: item.type
            }
          })
          let updateDataSource = { ...dataSource }
          updateDataSource['mpsList'].splice(index, 1)
          setDataSource(updateDataSource)
        }
        } >
          <List.Item.Meta
            title={<span>{item.name}</span>}
            description={`BimId: ${item.id}  |  类型: ${item.type}`}
          />
        </List.Item>
      )}
    />
    <List
      style={{ height: '60vh', width: '22vh' }}
      itemLayout="horizontal"
      dataSource={dataSource['riskList']}
      renderItem={(item, index) => (
        <List.Item onClick={() => {
          if (action.current && action.current[0] && action.current[0].act.indexOf('SELECT') !== -1) {
            return
          }
          action.current.unshift({
            act: 'FLAG_SELECT',
            url: `${item.id}` === '15' ? 'models/basic/Cone.FBX' : 'models/basic/Box.FBX',
            detail: {
              name: `${item.name}`,
              color: `${item.type}` === '2' ? '#ff0000' : '#00ff00',
              bimId: item.id,
              type: item.type
            }
          })
          let updateDataSource = { ...dataSource }
          updateDataSource['riskList'].splice(index, 1)
          setDataSource(updateDataSource)
        }
        } >
          <List.Item.Meta
            title={<span>{item.name}</span>}
            description={`BimId: ${item.id}  |  类型: ${item.type}`}
          />
        </List.Item>
      )}
    />
  </div>
}

export const ProjGrid = React.memo(
  ({ changeProj }) => {
    const [dataSource, setSource] = useState([])

    useEffect(() => {
      // get buildings info frome server 
      get({ url: AppConfig.url.getAllScenes })
        .then(data => {
          setSource(data.data.scenes)
        }).catch(err => {
          setSource([])
        })
    }, [])
    return <Card size='small' style={{ height: '60vh', overflowY: 'auto' }} >
      {
        dataSource.map(item => {
          return <Card.Grid key={Math.random()} style={{ width: '25%', textAlign: 'center' }}>
            <div style={{ display: 'grid', placeItems: 'center' }} onClick={() => {
              changeProj(item.name)
              localStorage.setItem('guid', item.guid || '0')
              localStorage.setItem('projName', item.name || '0')
              window.location.reload()
            }}>
              <Image
                preview={false}
                width={128}
                height={128}
                fallback={AppConfig.fallbackImage}
                src={`${item.asset}.png`}
                onClick={() => { }} />
              <h5 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '15px' }}>{item.name}</h5>
            </div>
          </Card.Grid>
        })
      }
    </Card>
  }
)

export function SceneSetting({ action }) {
  const { weather, setWeather, tf, setTf } = useContext(AppCtx)
  return <Row gutter={[10, 10]}>
    <Col span={5}>
      <Card title='天气切换'>
        <Radio.Group value={weather} onChange={(evt) => setWeather(evt.target.value)}>
          <Form.Item label="晴天" >
            <Radio value={'sunny'} />
          </Form.Item>
          <Form.Item label="阴天" >
            <Radio value={'cloudy'} />
          </Form.Item>
        </Radio.Group>
      </Card>
    </Col>
    <Col span={10}>
      <Card title='事故设置'>
        <Form.Item label="塌方">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked={false}
            onChange={(checked) => {
              checked ? setTf(true) : setTf(false)
            }}
          />
        </Form.Item>
      </Card>
    </Col>
    <Col flex={1}>
      <Card title='其他设置'>
        <Form.Item label="显示模型名称">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            onChange={(checked) => {
              document.querySelectorAll('.mod-name-flag').forEach(flag => {
                checked ? flag.classList.remove('hide') : flag.classList.add('hide')
              })
            }}
          />
        </Form.Item>
        <Form.Item label="显示标识名称">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            onChange={(checked) => {
              document.querySelectorAll('.flag').forEach(flag => {
                checked ? flag.classList.remove('hide') : flag.classList.add('hide')
              })
            }}
          />
        </Form.Item>
        <Form.Item label="显示标识">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            onChange={(checked) => {
              if (checked) {
                action.current.unshift({ act: 'SHOW_FLAG' })
              } else {
                action.current.unshift({ act: 'HIDE_FLAG' })
              }
              document.querySelectorAll('.flag').forEach(flag => {
                checked ? flag.classList.remove('hide') : flag.classList.add('hide')
              })
            }}
          />
        </Form.Item>
        <Form.Item >
          <Button>重置标识</Button>
        </Form.Item>
        <Form.Item>
          <Button>镜头复位</Button>
        </Form.Item>
      </Card>

    </Col>
  </Row>
}

export function FlagDetail({ action, bimId, type, name }) {
  const [mpsDetail, setMpsDetail] = useState({})
  const [lineData, setLineData] = useState([])
  const [riskDetail, setRiskDetail] = useState({})
  const chartRef = useRef()
  useMemo(() => {
    if (`${type}` === '1') {
      post({ url: AppConfig.url.postMps, data: { id: bimId } }).then(data => {
        setMpsDetail(data.data)
      })
      post({ url: AppConfig.url.postDataByMpsId, data: { id: bimId, diffDate: 0 } }).then(data => {
        setLineData(data.data)
      })
    } else if (`${type}` === '2') {

      post({ url: AppConfig.url.postRiskSource, data: { id: bimId } }).then(data => {
        console.log(data)
        setRiskDetail(data.data)
      })
    }
  }, [])
  return <div style={{ position: 'absolute', right: '1vw', top: '5.5vh', zIndex: '33333333' }} className='detail-panel'>
    <Draggable>
      <Card size='small' title={`${name} 详情`} bodyStyle={{ width: '85vh', height: '50vh' }}>
        <X1 action={action} />
        {
          `${type}` === '1' && <div style={{ display: 'flex', height: '47vh' }}>
            <div style={{ flex: 0.7 }}>
              <FormItem label="名称">{mpsDetail.name}</FormItem>
              <FormItem label="测点类型">{mpsDetail.category}</FormItem>
              <FormItem label="预警等级">{mpsDetail.alertLevel}</FormItem>
              <FormItem label="预警时间">{mpsDetail.alertDate}</FormItem>
              <FormItem label="里程时间">--</FormItem>
              <FormItem label="里程范围">{mpsDetail.startCourseStr}至{mpsDetail.endCourseStr}</FormItem>
            </div>
            <div style={{ flex: 1.3 }}>
              <Line data={lineData}
                height={'47vh'}
                xField='measTime'
                xAxis={{ type: 'timeCat', tickCount: 5 }}
                smooth
                yField='value'
                padding='auto'
              />
            </div>
          </div>
        }
        {
          `${type}` === '2' && <div style={{ padding: '0px 20px 0 20px', height: '47vh' }}>
            <Form>
              <Row>
                <Col flex={1}>
                  <FormItem label='名称'>{riskDetail.name}</FormItem>
                </Col>
                <Col flex={1}>
                  <FormItem label='风险等级'>{riskDetail.riskLevelName}</FormItem>
                </Col>
              </Row>
              <Row>
                <Col flex={1}>
                  <FormItem label='风险类型'>{riskDetail.type}</FormItem>
                </Col>
                <Col flex={1}>
                  <FormItem label='里程范围'>{riskDetail.startCourseStr} 至 {riskDetail.endCourseStr}</FormItem>
                </Col>
              </Row>
              <Row>
                <Col flex={1}>
                  <FormItem label='开工状态'>{riskDetail.constructionStatusName}</FormItem>
                </Col>
                <Col flex={1}>
                  <FormItem label='预计实施时间'>{riskDetail.estimatedStartingTime}</FormItem>
                </Col>
              </Row>
              <Row>
                <Col flex={1}>
                  <FormItem label='风险描述'>{riskDetail.riskRemark}</FormItem>
                </Col>
              </Row>
              <Row>
                <Col flex={1}>
                  <FormItem label='风险后果'>暂无</FormItem>
                </Col>
              </Row>
              <Row>
                <Col flex={1}>
                  <FormItem label='防范措施'>暂无</FormItem>
                </Col>
              </Row>
            </Form>
          </div>

        }
      </Card>
    </Draggable>
  </div>
}
const closeButtonStyle = {
  border: 'none',
  position: 'absolute',
  top: '2px',
  right: '2px',
  zIndex: 22222223
}
const X1 = ({ action }) => {
  const { toggle } = useContext(AppCtx)
  return <Button onClick={() => {
    toggle(false)
    // document.querySelector('.detail-panel').classList.add('hide')
  }} ghost style={closeButtonStyle} icon={<CloseCircleFilled />} />
} 