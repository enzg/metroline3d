import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Html, OrbitControls, TransformControls } from '@react-three/drei'
import { useFrame, useThree } from 'react-three-fiber'
import { MathUtils, MeshPhongMaterial, MeshPhysicalMaterial, Vector3 } from 'three'
import { DynamicModel } from './Model'
import { Button, Card, Radio, Divider } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import Draggable from 'react-draggable'
import { CompactPicker } from 'react-color'
const player = {
  height: 100.0,
  speed: 4.0,
  turnSpeed: Math.PI * 0.02
}
const closeButtonStyle = {
  border: 'none',
  position: 'absolute',
  top: '2px',
  right: '2px',
  zIndex: 22222223
}
export default ({ mt, action, pt, toggle }) => {
  const { camera, mouse, raycaster } = useThree()
  const rollOverRef = useRef()
  const keyboard = useRef({})
  const trans = useRef()
  const htmlCtrl = useRef()
  const transMode = useRef('translate')
  const orb = useRef()
  const flagTree = useRef({})
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
    playerSetup(camera, orb)

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
    // playerMove(camera, keyboard)
    if (action && action.current[0]) {
      if (action.current[0].act === 'HIDE_FLAG' && flagTree.current && Object.values(flagTree.current)) {
        Object.values(flagTree.current).forEach(flag => {
          flag.current.visible = false
        })
        action.current.shift(0)
        return
      }
      if (action.current[0].act === 'SHOW_FLAG' && flagTree.current && Object.values(flagTree.current)) {
        Object.values(flagTree.current).forEach(flag => {
          flag.current.visible = true
        })
        action.current.shift(0)
        return
      }
      if (action.current[0].act === 'TRANSLATE') {
        trans.current.mode = 'translate'
        action.current.shift(0)
        trans.current.showY = false
        trans.current.showX = true
        trans.current.showZ = true
        return
      }
      if (action.current[0].act === 'ROTATE') {
        trans.current.mode = 'rotate'
        action.current.shift(0)
        trans.current.showX = false
        trans.current.showZ = false
        trans.current.showY = true
        return

      }
      if (action.current[0].act === 'SCALE') {
        trans.current.mode = 'scale'
        action.current.shift(0)
        trans.current.showX = true
        trans.current.showZ = true
        trans.current.showY = true

        return
      }
      if (action.current[0].act === 'CHANGE_COLOR') {

        if (trans.current.object) {
          trans.current.object.traverse(m => {
            if (m.type === 'Mesh' && m.material.color) {
              m.material.color.set(action.current[0].color)
            }
          })
        }
        action.current.shift(0)
        return
      }
      if (action.current[0].act === 'DETACH') {
        trans.current.detach()
        action.current.shift(0)
        return

      }
    }
  })
  return (
    <>
      <Html ref={htmlCtrl} className="mod-ctl-pan hide" style={{ height: '0', width: '0' }} prepend>
      </Html>
      <TransformControls ref={trans} position={[0, 3000000, 0]} />
      <Suspense fallback={null}>{modList}</Suspense>
      <mesh ref={rollOverRef} position={[0, 3000000, 0]} onDoubleClick={() => {
        if (action.current[0] && action.current[0]['act'] === 'FLAG_SELECT') {
          let pos = rollOverRef.current.position
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
          action.current.shift()
          return
        }
        if (action.current[0] && action.current[0]['act'] === 'MOD_SELECT') {
          let pos = rollOverRef.current.position.toArray()
          setModList(
            modList.concat(
              <DynamicModel
                position={[pos[0], 0, pos[2]]}
                pathList={[action.current[0]['url']]}
                ctrl={trans}
                htmlCtrl={htmlCtrl}
                key={MathUtils.generateUUID()}
                detail={action.current[0]['detail']}
              />
            )
          )
          action.current.shift()
          return
        }
      }}>
        <boxBufferGeometry attach="geometry" args={[50, 50, 50]} />
        <meshPhongMaterial
          attach="material"
          color="lightgreen"
          transparent
          opacity={0.5}
        />
      </mesh>
      <OrbitControls
        target={[-25000, 100, 10000]}
        center={new Vector3(-25000, 100, 10000)}
        ref={orb}
        enableDamping
        minPolarAngle={0}
        maxPolarAngle={0.48 * Math.PI}
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

function playerSetup(camera, orb) {
  camera.position.set(0, player.height, -5)
  camera.lookAt(new Vector3(0, player.height, 0))
  orb.current.target.set(camera.position.x, camera.position.y, camera.position.z)

}
function playerMove(camera, keyboard) {
  if (keyboard.current[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed
  }
  if (keyboard.current[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed
  }
  if (keyboard.current[65]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed
  }
  if (keyboard.current[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed
  }
}

function X({ toggle }) {
  return <Button onClick={() => { toggle(false) }} ghost style={closeButtonStyle} icon={<CloseCircleFilled />} />
}

