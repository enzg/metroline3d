import "./Reset.css";
import "antd/dist/antd.dark.css";
import "antd/dist/antd.compact.css";
import "./App.css"
import "./Hud.css"
import React, { useRef, useState } from 'react'
import Hud from './Hud'
import World from './World'
import { AppCtx } from "./Helper";

export default () => {
  const action = useRef([])
  const [weather, setWeather] = useState('sunny')
  const [tf, setTf] = useState(false)
  const [flagDetail, toggle] = useState({ show: false, payload: {} })
  return <div className="app-root">
    <AppCtx.Provider value={{ weather, setWeather, tf, setTf, flagDetail, toggle }}>
      <Hud action={action} />
      <World action={action} />
    </AppCtx.Provider>
  </div>
}
