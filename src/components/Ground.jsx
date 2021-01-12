import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Html, OrbitControls, TransformControls } from '@react-three/drei'
import { useFrame, useThree } from 'react-three-fiber'
import { MathUtils, Vector3 } from 'three'
import { DynamicModel } from './Model'
import { Button, Card } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
const player = {
  height: 100.0,
  speed: 4.0,
  turnSpeed: Math.PI * 0.02
}
export default ({ mt, action, pt }) => {
  const [flagDetail, toggle] = useState(false)
  const { camera, mouse, raycaster } = useThree()
  const rollOverRef = useRef()
  //const planeRef = useRef()
  const keyboard = useRef({})
  const trans = useRef()
  const orb = useRef()
  const flagTree = useRef([])
  const [modList, setModList] = useState([])
  useEffect(() => {
    const keyUp = (evt) => {
      keyboard.current[evt.keyCode] = false
    }
    const keyDown = (evt) => {
      keyboard.current[evt.keyCode] = true
    }
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    playerSetup(camera)

    trans.current.detach()
    trans.current.addEventListener('dragging-changed', (evt) => {
      orb.current.enabled = !evt.value
    })
    trans.current.mode = 'translate'

    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
    }
  }, [camera])
  useFrame(() => {
    raycastUpdate(rollOverRef, raycaster, mouse, camera, action, mt, pt)
    playerMove(camera, keyboard)
    if (action && action.current[0]) {
      if (action.current[0].act === 'HIDE_FLAG' && flagTree.current) {
        flagTree.current.forEach(flag => {
          flag.current.visible = false
        })
        action.current.shift(0)
      }
      if (action.current[0].act === 'SHOW_FLAG' && flagTree.current) {
        flagTree.current.forEach(flag => {
          flag.current.visible = true
        })
        action.current.shift(0)
      }
    }
  })
  return (
    <>
      {
        flagDetail && <Html center>
          <Card size='small' title='详情' bodyStyle={{ width: '70vh', height: '50vh' }}>
            <X toggle={toggle} />
          </Card>
        </Html>
      }
      <TransformControls ref={trans} position={[0, 3000000, 0]} />
      <Suspense fallback={null}>{modList}</Suspense>
      <mesh ref={rollOverRef} onDoubleClick={() => {
        if (action.current[0] && action.current[0]['act'] === 'FLAG_SELECT') {
          let pos = rollOverRef.current.position
          console.log(action.current[0]['url'])
          setModList(
            modList.concat(
              <DynamicModel
                position={pos}
                pathList={[action.current[0]['url']]}
                key={MathUtils.generateUUID()}
                detail={action.current[0]['detail']}
                toggle={toggle}
                ft={flagTree}
              />
            )
          )
        }
        if (action.current[0] && action.current[0]['act'] === 'MOD_SELECT') {
          let pos = rollOverRef.current.position.toArray()
          setModList(
            modList.concat(
              <DynamicModel
                position={[pos[0], 0, pos[2]]}
                pathList={[action.current[0]['url']]}
                ctrl={trans}
                key={MathUtils.generateUUID()}
              />
            )
          )
        }
      }}>
        <boxBufferGeometry attach="geometry" args={[50, 50, 50]} />
        <meshPhongMaterial
          attach="material"
          color="lightgreen"
          transparent
          opacity={0.75}
        />
      </mesh>
      {/*
      <mesh
        onDoubleClick={(evt) => {
          if (action.current[0] && action.current[0]['act'] === 'MOD_SELECT') {
            const pos = evt.point.toArray()
            setModList(
              modList.concat(
                <DynamicModel
                  position={[pos[0], 0, pos[2]]}
                  pathList={[action.current[0]['url']]}
                  ctrl={trans}
                  key={MathUtils.generateUUID()}
                />
              )
            )
          }
        }}
        ref={planeRef}
        name="plane"
        receiveShadow
        rotation={[-0.5 * Math.PI, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[800000, 800000]} />
        <meshPhongMaterial transparent opacity={0} attach="material" />
      </mesh>
    */}
      <OrbitControls
        ref={orb}
        enableDamping
        minPolarAngle={0}
        maxPolarAngle={0.51 * Math.PI}
      />
    </>
  )
}
// setup raycaster
function raycastUpdate(rollOverRef, raycaster, mouse, camera, action, mt, pt) {
  raycaster.setFromCamera(mouse, camera)
  if (action.current[0] && action.current[0].act === 'FLAG_SELECT' && mt && mt.current.length > 0) {
    const intersects = raycaster.intersectObjects(mt.current)
    if (intersects.length > 0) {
      let intersect = intersects[0]
      let point = intersect.point
      rollOverRef.current.position.copy(point).add(intersect.face.normal)
      rollOverRef.current.position
        .divideScalar(50)
        .floor()
        .multiplyScalar(50)
        .addScalar(25)
      // 工程地段基准高度 -825. 在此之上的检测将物体放在上表面
      // 低于这个高度则可以嵌入.
      if (rollOverRef.current.position.y >= -825) {
        rollOverRef.current.position.add(new Vector3(0, 25, 0))
      }
    }
  }
  if (action.current[0] && action.current[0].act === 'MOD_SELECT' && pt && pt.current.length > 0) {
    // 当地面显示的时候, 地下部分不做检测.
    const intersects = raycaster.intersectObjects(pt.current)
    if (intersects.length > 0) {
      let intersect = intersects[0]
      let point = intersect.point
      rollOverRef.current.position.copy(point).add(intersect.face.normal)
      rollOverRef.current.position
        .divideScalar(50)
        .floor()
        .multiplyScalar(50)
        .addScalar(25)
      //对于地上部分, 需要放在地面上表面
      if (rollOverRef.current.position.y < 0) {
        rollOverRef.current.position.add(new Vector3(0, 25, 0))
      }
    }
  }
}

function playerSetup(camera) {
  camera.position.set(0, player.height, -5)
  camera.lookAt(new Vector3(0, player.height, 0))
  camera.updateProjectionMatrix()
}
function playerMove(camera, keyboard) {
  if (keyboard.current[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed
    camera.updateProjectionMatrix()
  }
  if (keyboard.current[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed
    camera.updateProjectionMatrix()
  }
  if (keyboard.current[65]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed
    camera.updateProjectionMatrix()
  }
  if (keyboard.current[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed
    camera.updateProjectionMatrix()
  }
}

function X({ toggle }) {
  const closeButtonStyle = {
    border: 'none',
    position: 'absolute',
    top: '2px',
    right: '2px',
    zIndex: 22222223

  }
  return <Button
    onClick={() => {
      toggle(false)
      // document.querySelectorAll('.flag').forEach(flag => flag.classList.toggle('hide'))
    }}
    ghost
    style={closeButtonStyle}
    icon={<CloseCircleFilled />} />

}
