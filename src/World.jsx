import { Html, softShadows } from '@react-three/drei'
import React, { Suspense, useContext, useEffect, useRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import Cam from './components/Cam'
import Env from './components/Env'
import Ground from './components/Ground'
import Config from './Config'
import { MathUtils } from 'three'
import Mod from './components/Model'
import { AppCtx } from './Helper'
import { ModDirConfig } from './AssetsConfig'
export default React.memo(
  ({ action }) => {
    const modelTree = useRef([])
    const planeTree = useRef([])
    const { weather, tf, flagDetail, toggle } = useContext(AppCtx)
    const assetPrefix = ModDirConfig[localStorage.getItem('projName')]
    const resourceList = [
      `private_models/${assetPrefix}/DX2.FBX`,
      `private_models/${assetPrefix}/DM.FBX`,
      `private_models/${assetPrefix}/DJ1.FBX`,
      `private_models/${assetPrefix}/DJ2.FBX`,
      `private_models/${assetPrefix}/DJ3.FBX`,
      `private_models/${assetPrefix}/DJ6.FBX`,
    ]
    return (
      <Canvas {...Config}>
        <Suspense fallback={<Loader />}>
          <Assets pathList={resourceList} mt={modelTree} pt={planeTree} />
          {weather === 'sunny' && <Mod key={MathUtils.generateUUID()} path={`private_models/${assetPrefix}/SKY2.FBX`} />}
          {weather === 'cloudy' && <Mod key={MathUtils.generateUUID()} path={`private_models/${assetPrefix}/SKY1.FBX`} />}
          {tf && <Mod key={MathUtils.generateUUID()} path={`models/event/tf.FBX`} />}
        </Suspense>
        <Ground mt={modelTree} action={action} pt={planeTree} toggle={toggle} />
        <Env />
        <Cam />
      </Canvas>
    )
  }

)
const Assets = React.memo(
  ({ pathList, mt, pt }) => {
    return <>{
      pathList.map((path) => {
        return <Mod key={MathUtils.generateUUID()} path={path} mt={mt} pt={pt} />
      })
    }</>
  }

)
function Loader() {
  return (
    <Html className="loading" center>
      <div className="center-box">资源加载中,请稍后...</div>
    </Html>
  )

}

