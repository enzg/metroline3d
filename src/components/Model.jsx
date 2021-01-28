import React, { useEffect, useRef } from 'react'
import { Html, useFBX } from '@react-three/drei'
import { DoubleSide, Euler, MathUtils } from 'three'
import { getFileExt, useMods } from '../Helper'
export default ({ path, position, mt, pt }) => {
  let mod = useFBX(path)
  mod.name = getFileExt(path)
  mod.traverse((m) => {
    if (m.type === 'Mesh') {
      m.castShadow = true
      m.receiveShadow = true
      if (mt && ['DJ1.FBX', 'DJ2.FBX', 'DJ3.FBX', 'DJ6.FBX', 'DX2.FBX', 'DM.FBX'].includes(mod.name)) {
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
export const ModInstance = ({ pathList, detail, ctrl, position, toggle, ft, indexKey, rotation, scale }) => {
  const { modList } = useMods({ pathList })
  if (modList.current.length) {
    return modList.current.map((mod) => {
      console.log(mod.name)
      mod.traverse((m) => {
        if (m.type === 'Mesh') {
          m.castShadow = true
          m.receiveShadow = true
          if (m.material.length) {
            m.material.forEach((mat) => {
              mat.side = DoubleSide
              if (mod.name.indexOf('che') === -1)
                mat.alphaTest = 0.5
              if (mat.map) mat.map.anisotropy = 8
            })
          }
        }
      })
      if (ctrl) {
        return <InteractMod mod={mod} detail={detail} ctrl={ctrl} position={position || [0, 0, 0]} key={mod.uuid} indexKey={indexKey} pathList={pathList} rotation={rotation} scale={scale} />
      } else if (detail && position) {
        return <DetailMod mod={mod} detail={detail} position={position} key={mod.uuid} toggle={toggle} ft={ft} indexKey={indexKey} pathList={pathList} />
      } else {
        return <primitive object={mod} position={position || [0, 0, 0]} key={mod.uuid} />
      }
    })
  }
  return null
}
function DetailMod({ mod, detail, position, ft, toggle: toggleDetail, indexKey, pathList }) {
  const modGroup = useRef()
  const flagStyle = { padding: '2px 6px', textAlign: 'center', minWidth: '85px', backgroundColor: 'rgba(0,0,0,0.35)', color: `${detail.color}`, fontSize: '8px', fontWeight: 700 }
  useEffect(() => {
    ft.current[mod.name] = modGroup
  }, [])
  return (
    <group
      castShadow
      receiveShadow
      ref={modGroup}
      position={position}
      key={mod.uuid}
      userData={{ key: indexKey, detail, pathList }}
      onClick={() => {
        if (detail) {
          toggleDetail({ show: true, payload: { bimId: detail.bimId, type: detail.type, name: detail.name } })
        }
      }}>
      {mod.children.map((m) => {
        if (m.type === 'Mesh' && detail.color !== '') {
          return <mesh {...m} position={[0, 0, 0]} key={m.uuid}>
            <meshPhongMaterial color={detail.color} attach='material' />
          </mesh>
        }
        return <primitive object={m} attachArray="children" key={m.uuid} />

      })}
      <Html className="flag" style={{ transform: 'translate(0,-50px)' }}>
        <div style={flagStyle}>
          {detail.name}
        </div>
      </Html>
    </group>
  )

}

function InteractMod({ mod, ctrl, position, detail, indexKey, pathList, rotation, scale }) {
  const modGroup = useRef()
  const modNameFlag = useRef()
  const modNameStyle = { padding: '2px 6px', textAlign: 'center', minWidth: '85px', backgroundColor: 'rgba(0,0,0,0.35)', color: '#00ff00', fontSize: '8px', fontWeight: 700 }
  return (
    <group
      ref={modGroup}
      userData={{ key: indexKey, detail, pathList }}
      position={position}
      scale={scale || [1, 1, 1]}
      rotation={rotation ? new Euler(rotation[0], rotation[1], rotation[2], rotation[3].toUpperCase()) : new Euler(0, 0, 0, 'XYZ')}
      key={mod.uuid}
      onClick={() => {
        if (ctrl && ctrl.current) {
          ctrl.current.detach()
          ctrl.current.attach(modGroup.current)
          if (ctrl.current.mode === 'translate' && ctrl.current.showY) {
            ctrl.current.showY = false
          }
        }
        document.querySelector('.ctrl-panel').classList.remove('hide')
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
