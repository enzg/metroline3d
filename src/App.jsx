import "./Reset.css"
import "antd/dist/antd.dark.css"
import "antd/dist/antd.compact.css"
import "./App.css"
import "./Hud.css"
import React, { useRef, useState } from 'react'
import Hud from './Hud'
import World from './World'
import { AppCtx } from "./Helper"
import { ModDirConfig } from './AssetsConfig'


export default () => {
  const action = useRef([])
  const [weather, setWeather] = useState('sunny')
  const [tf, setTf] = useState(false)
  const [flagDetail, toggle] = useState({ show: false, payload: {} })
  let guid = localStorage.getItem('guid')
  let projName = localStorage.getItem('projName')
  let modKey = localStorage.getItem('modKey')
  if (!guid) {
    localStorage.setItem('guid', '5fd7687f-3bf4-4e2a-a2d5-6b0050a54152')
    guid = '5fd7687f-3bf4-4e2a-a2d5-6b0050a54152'
  }
  if (!projName) {
    localStorage.setItem('projName', '清水河站~布吉站')
    projName = '清水河站~布吉站'
  }
  if(!modKey){
    localStorage.setItem('modKey',ModDirConfig[projName])
    modKey = ModDirConfig[projName]
  }
  return <div className="app-root">
    <AppCtx.Provider value={{ weather, setWeather, tf, setTf, flagDetail, toggle }}>
      <Hud action={action} />
      <World action={action} />
    </AppCtx.Provider>
  </div>
}
