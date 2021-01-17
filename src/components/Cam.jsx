import { useEffect, useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Vector3 } from 'three'
export default () => {
  const { camera, gl } = useThree()
  camera.fov = 45
  camera.aspect = window.innerWidth / window.innerHeight
  camera.far = 3 * 200000
  camera.near = 20
  camera.updateProjectionMatrix()
  camera.position.set(-26000, 500, 11000)
  camera.lookAt(0, 100, 0)
  useFrame(() => {
  })
  useEffect(() => {
    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      gl.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [camera, gl])
  return null
}
