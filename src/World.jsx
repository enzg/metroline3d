import { Html, softShadows } from '@react-three/drei'
import React, { Suspense, useContext, useEffect, useRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import Cam from './components/Cam'
import Env from './components/Env'
import Ground from './components/Ground'
import Config from './Config'
import { MathUtils } from 'three'
import Mod, { DynamicModel } from './components/Model'
import { AppCtx } from './Helper'
softShadows()
export default ({ action }) => {
  const modelTree = useRef([])
  const planeTree = useRef([])
  const { weather } = useContext(AppCtx)
  const [skyPath, setSkyPath] = useState('models/SKY2.FBX')
  const resourceList = [
    'models/DX2.FBX',
    'models/DM.FBX',
    'models/DJ1.FBX',
    'models/DJ2.FBX',
    'models/DJ3.FBX',
    'models/DJ6.FBX',
  ]
  // useEffect(() => {
  //   setSkyPath(weather === 'sunny' ? 'models/SKY2.FBX' : 'models/SKY2.FBX')
  // }, [weather])

  return (
    <Canvas {...Config}>
      <Suspense fallback={<Loader />}>
        <Assets pathList={resourceList} mt={modelTree} pt={planeTree} />
        <Mod key={MathUtils.generateUUID()} path={skyPath} />
      </Suspense>
      <Ground mt={modelTree} action={action} pt={planeTree} />
      <Env />
      <Cam />
    </Canvas>
  )
}

const Assets = ({ pathList, mt,pt }) => {
  return <>{
    pathList.map((path) => {
      return <Mod key={MathUtils.generateUUID()} path={path} mt={mt} pt={pt} />
    })
  }</>
}

function Loader() {
  return (
    <Html className="loading" center>
      <div className="center-box">资源加载中...</div>
    </Html>
  )

}

