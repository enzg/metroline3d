import React, { useEffect, useRef } from 'react'
import { Html, useFBX } from '@react-three/drei'
import { DoubleSide, MathUtils, Vector3 } from 'three'
import { getFileExt, useMods } from '../Helper'
import { Card } from 'antd'
import { useFrame } from 'react-three-fiber'
export default ({ path, position, mt, pt }) => {
  let mod = useFBX(path)
  mod.name = getFileExt(path)
  mod.traverse((m) => {
    if (m.type === 'Mesh') {
      m.castShadow = true
      m.receiveShadow = true
      if (mt && ['DJ1.FBX', 'DJ2.FBX', 'DJ3.FBX', 'DJ6.FBX',].includes(mod.name)) {
        mt.current.push(m)
      }
      if (pt && ['DX2.FBX', 'DM.FBX'].includes(mod.name)) {
        pt.current.push(m)
      }
      if (m.material.length) {
        m.material.forEach((mat) => {
          mat.side = DoubleSide
          if (mat.map) mat.map.anisotropy = 8
        })
      }
    }
  })
  return <primitive object={mod} position={position || [0, 0, 0]} />
}
export const DynamicModel = ({ pathList, detail, ctrl, htmlCtrl, position, toggle, ft }) => {
  const { modList } = useMods({ pathList })
  if (modList.current.length) {
    return modList.current.map((mod) => {
      mod.traverse((m) => {
        if (m.type === 'Mesh') {
          m.castShadow = true
          m.receiveShadow = true
          if (m.material.length) {
            m.material.forEach((mat) => {
              mat.side = DoubleSide
              if (mat.map) mat.map.anisotropy = 8
            })
          }
        }
      })

      if (ctrl) {
        return <InteractMod mod={mod} detail={detail} ctrl={ctrl} htmlCtrl={htmlCtrl} position={position || [0, 0, 0]} key={MathUtils.generateUUID()} />
      } else if (detail && position) {
        return <DetailMod mod={mod} detail={detail} position={position} key={mod.uuid} toggle={toggle} ft={ft} />
      } else {
        return <primitive object={mod} position={position || [0, 0, 0]} key={mod.uuid} />
      }
    })
  }
  return null
}
function DetailMod({ mod, detail, position, ft, toggle: toggleDetail }) {
  const modGroup = useRef()
  const flagStyle = { padding: '2px 6px', textAlign: 'center', minWidth: '85px', backgroundColor: 'rgba(0,0,0,0.35)', color: `${detail.color}`, fontSize: '8px', fontWeight: 700 }
  useEffect(() => {
    ft.current.push(modGroup)
  }, [])
  return (
    <group
      ref={modGroup}
      position={position}
      key={MathUtils.generateUUID()}
      onClick={() => {
        if (detail) {
          toggleDetail(true);
          // document.querySelectorAll('.flag').forEach(flag => flag.classList.toggle('hide'))
        }
      }}>
      {mod.children.map((m) => {
        m.scale.multiplyScalar(0.3)
        if (m.type === 'Mesh') {
          return <mesh {...m} position={[0, 0, 0]} key={m.uuid}>
            <meshPhongMaterial color={detail.color} attach='material' />
          </mesh>
        }
        return <primitive object={m} attachArray="children" key={m.uuid} />

      })}
      <Html position className="flag" style={{ transform: 'translate(0,-50px)' }}>
        <div style={flagStyle}>
          {detail.name}
        </div>
      </Html>
    </group>
  )

}

function InteractMod({ mod, ctrl, htmlCtrl, position, detail }) {
  const modGroup = useRef()
  const modNameFlag = useRef()
  const modNameStyle = { padding: '2px 6px', textAlign: 'center', minWidth: '85px', backgroundColor: 'rgba(0,0,0,0.35)', color: '#00ff00', fontSize: '8px', fontWeight: 700 }
  return (
    <group
      ref={modGroup}
      position={position}
      key={MathUtils.generateUUID()}
      onClick={() => {
        if (ctrl && ctrl.current) {
          ctrl.current.detach()
          ctrl.current.attach(modGroup.current)
        }
        if (htmlCtrl && htmlCtrl.current) {
          htmlCtrl.current.classList.remove('hide')
        }
      }}>
      {mod.children.map((m) => (
        <primitive object={m} attachArray="children" key={m.uuid} />
      ))}
      <Html ref={modNameFlag} className="mod-name-flag" style={{ transform: 'translate(0,-50px)' }}>
        <div style={modNameStyle}>
          {detail.name}
        </div>
      </Html>
    </group>
  )
}
