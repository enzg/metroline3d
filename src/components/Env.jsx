import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
export default () => {
  const dlRef = useRef()
  useFrame(({ camera }) => {
    dlRef.current.position.set(
      camera.position.x,
      camera.position.y,
      camera.position.z
    )
  })
  return (
    <>
      <ambientLight />
      <directionalLight
        ref={dlRef}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* <gridHelper args={[500000, 50]} />
      <axesHelper args={[1000]} /> */}
    </>
  )
}
