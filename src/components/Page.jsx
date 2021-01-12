import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Card, Image, List, Form, Radio, Switch, Button } from 'antd'
import { AppCtx, get, post } from '../Helper'
import { AppConfig } from '../Config'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
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
                onClick={() => action.current.unshift({ act: 'MOD_SELECT', url: `${item.icon}.FBX` })}
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
  useEffect(() => {
    post({ url: AppConfig.url.postMpsAndRiskAndBimPoint, data: { 'guid': '06354514-6379-4556-b880-3df3cdb2f307' } })
      .then(data => {
        setDataSource(data.data)
      })
  }, [])
  return <div className="hide-scrollbar" style={{ overflowY: 'auto', height: '60vh', display: 'flex', justifyContent: 'space-between' }}>
    <List
      style={{ height: '60vh', width: '22vh' }}
      itemLayout="horizontal"
      dataSource={dataSource['mpsList']}
      renderItem={item => (
        <List.Item onClick={() => action.current.unshift({ act: 'FLAG_SELECT', url: 'models/basic/Box.FBX', detail: { name: `${item.name}`, color: `${item.type}` === '2' ? '#ff0000' : '#00ff00' } })} >
          <List.Item.Meta
            title={<span>{item.name}</span>}
            description={`BimId: ${item.bimId}  |  类型: ${item.type}`}
          />
        </List.Item>
      )}
    />
    <List
      style={{ height: '60vh', width: '22vh' }}
      itemLayout="horizontal"
      dataSource={dataSource['riskList']}
      renderItem={item => (
        <List.Item onClick={() => action.current.unshift({ act: 'FLAG_SELECT', url: `${item.bimId}` === '15' ? 'models/basic/Cone.FBX' : 'models/basic/Box.FBX', detail: { name: `${item.name}`, color: `${item.type}` === '2' ? '#ff0000' : '#00ff00' } })} >
          <List.Item.Meta
            title={<span>{item.name}</span>}
            description={`BimId: ${item.bimId}  |  类型: ${item.type}`}
          />
        </List.Item>
      )}
    />
  </div>
}

export function ProjGrid() {
  const [dataSource, setSource] = useState([])

  useEffect(() => {
    // get buildings info frome server 
    get({ url: AppConfig.url.getAllProjs })
      .then(data => {
        console.log(data);
        setSource(data.data)
      })
  }, [])
  return <Card size='small' style={{ height: '60vh', overflowY: 'auto' }} >
    {
      dataSource.map(item => {
        return <Card.Grid key={Math.random()} style={{ width: '25%', textAlign: 'center' }}>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <Image
              preview={false}
              width={128}
              height={128}
              fallback={AppConfig.fallbackImage}
              src={`${item.Url}.png`}
              onClick={() => { }} />
            <h5 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '15px' }}>{item.PrjName}</h5>
          </div>
        </Card.Grid>
      })
    }
  </Card>
}

export function SceneSetting({ action }) {
  const { weather, setWeather } = useContext(AppCtx)
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
            defaultChecked
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