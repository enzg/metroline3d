import { softShadows } from '@react-three/drei'
import React, { useRef } from 'react'
softShadows()
export default () => {
  return (
    <>
      <ambientLight intensity={0.5} color='#ffffff' />
      <directionalLight
        castShadow
        position={[-3000, -850, 0]}
        intensity={0.7}
        shadow-bias={-0.01}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20000}
        shadow-camera-near={50}
        shadow-camera-left={50}
        shadow-camera-right={-50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight
        castShadow
        position={[-500, 70000, 0]}
        intensity={1.0}
        shadow-bias={-0.001}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={800000}
        shadow-camera-near={50}
        shadow-camera-left={50}
        shadow-camera-right={-50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      {/* <gridHelper args={[500000, 50]} />
      <axesHelper args={[1000]} /> */}
    </>
  )
}
