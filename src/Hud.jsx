import React, { useState } from 'react'
import { Button, Card, Col, Form, Input, Radio, Row, Switch, Tabs } from 'antd'
import { CheckOutlined, CloseCircleFilled, CloseOutlined, GoldenFilled, SaveFilled, MinusCircleFilled } from '@ant-design/icons'
import {
  basicMenu,
  vehicleMenu,
  buildingMenu,
  plantMenu,
  bridgeMenu,
  Menus
} from './Config'
import { CardGrid, MpsAndRisksList, ProjGrid, SceneSetting } from './components/Page'
const basicStyle = {
  width: '50vh',
  position: 'absolute',
  top: '5.5vh',
  left: '4.2vw',
  zIndex: 22222222

}
export default ({ action }) => {
  const [link, linkTo] = useState(null)
  return <>
    <div className="top-nav">
      <div className="top-band">
        <img src='images/logo.png' />
        <div className='top-baba'>
          <img src='images/baba.png' />
        </div>
      </div>
      <div>
        <div><Button icon={<SaveFilled />}>保存</Button><Button icon={<MinusCircleFilled />}>退出</Button></div>
      </div>
    </div>
    <div className="top-hud">
      {
        Menus.map(menu => <Button icon={menu.icon} key={menu.key} onClick={() => linkTo(menu.key)}>{menu.name}</Button>)
      }
    </div>
    <Route link={link} linkTo={linkTo} action={action} />
  </>
}
function Route({ link, linkTo, action }) {
  if (link === 'GEO_INFO') {
    return null
  } else if (link === 'FIND_FLAG') {
    return <Card size='small' bodyStyle={{ padding: '6px' }} style={{ ...basicStyle, borderRadius: '8px' }}>
      <Input.Search placeholder="查找BIM标识点" onSearch={() => { }} enterButton />
    </Card>

  } else if (link === 'MOD_LIB') {
    return (
      <Card size="small" title="模型库" style={basicStyle}>
        <X linkTo={linkTo} />
        <Tabs tabPosition="left">
          <Tabs.TabPane tab="基础类" key="1">
            <CardGrid dataSource={basicMenu} action={action} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="交通工具" key="2">
            <CardGrid dataSource={vehicleMenu} action={action} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="植物" key="3">
            <CardGrid dataSource={plantMenu} action={action} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="建筑" key="4">
            <CardGrid dataSource={buildingMenu} action={action} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="桥" key="5">
            <CardGrid dataSource={bridgeMenu} action={action} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    )
  } else if (link === 'ADD_FLAG') {
    return <Card size='small' title='BIM标识' style={{ ...basicStyle, height: '70vh' }}>
      <X linkTo={linkTo} />
      <MpsAndRisksList action={action} />
    </Card>

  } else if (link === 'SCENE_SETTING') {
    return < Card size='small' title='场景设置' style={{ ...basicStyle, minHeight: '50vh' }}>
      <X linkTo={linkTo} />
      <SceneSetting style={basicStyle} action={action} />
    </Card>

  } else if (link === 'PROJ_MANAGE') {
    return <Card size='small' title='工点管理' style={{ ...basicStyle, height: '70vh', width: '70vw', top: '15vh', left: '15vw' }} >
      <X linkTo={linkTo} />
      <ProjGrid action={action} />
    </Card>

  }
  return null
}
function X({ linkTo }) {
  const closeButtonStyle = {
    border: 'none',
    position: 'absolute',
    top: '2px',
    right: '2px',
    zIndex: 22222223

  }
  return <Button
    onClick={() => linkTo(null)}
    ghost
    style={closeButtonStyle}
    icon={<CloseCircleFilled />} />

}
