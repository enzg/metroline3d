import { useEffect } from 'react'
import { useThree } from 'react-three-fiber'
import { Vector3 } from 'three'
export default () => {
  const { camera, gl } = useThree()
  camera.fov = 45
  camera.aspect = window.innerWidth / window.innerHeight
  camera.far = 4 * 200000
  camera.near = 20
  camera.position.lerp(new Vector3(0, 30, 1000), 0.3)
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
