import { useEffect, useRef, useState, createContext } from 'react'
import { LoadingManager, Cache, Object3D } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { AppConfig } from './Config'
import axios from 'axios'
Cache.enabled = true
export const AppCtx = createContext('sunny')
export function useMods({ pathList }) {
  const modList = useRef([])
  const loadingManager = useRef()
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (count >= pathList.length) return
    // find in cache.
    let cacheKey = getFileExt(pathList[count])
    let mod = Cache.get(cacheKey)
    if (mod) {
      let dolly = new Object3D().copy(mod)
      modList.current.push(dolly)
      setCount(count + 1)
    } else {
      loadingManager.current = new LoadingManager()
      new Promise((ok, fail) => {
        new FBXLoader(loadingManager.current).load(
          pathList[count],
          (mod) => ok(mod),
          (evt) => { },
          (err) => fail(err)
        )
      }).then((mod) => {
        console.log(mod)
        mod.name = `${mod.uuid}.${getFileExt(pathList[count])}`
        modList.current.push(mod.clone())
        Cache.add(cacheKey, mod)
        setCount(count + 1)
      })
    }
  }, [count, pathList])
  return { modList }
}
export function getFileExt(path) {
  return path.substring(path.lastIndexOf('/') + 1)
}
export const post = async function ({ url, data }) {
  return axios({
    method: 'POST',
    url: `${AppConfig.url.HOST}${url}`,
    data
  }).then((res) => {
    if (res.status === 200) {
      return res.data
    } else {
      throw new Error('network error')
    }
  })
}
export const get = async function ({ url }) {
  return axios({ method: 'GET', url: `${AppConfig.url.HOST}${url}` }).then(
    (res) => {
      if (res.status === 200) {
        return res.data
      } else {
        throw new Error('network error')
      }
    }
  )
}
