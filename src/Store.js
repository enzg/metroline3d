import produce from 'immer'
import React from 'react'
let template = {
    key: '',// id
    detial: {},
    position: [], // pos
    rotate: [],
    scale: [],
    url: ''// fbx path
}
let map = JSON.parse(localStorage.getItem('Map') || '[]')

export function all() {
    return map
}

export function add(item) {
    map = produce(map, d => {
        d.push(item)
    })
    setItem(map).then(ret => {
        console.log('added:', ret, map)
    })
}

export function remove({ key }) {
    map = produce(map, d => {
        let index = d.findIndex(i => i.key === key)
        if (index !== -1) {
            d.splice(index, 1)
        }
    })
    setItem(map).then(ret => {
        console.log('remove:', ret, map)
    })
}
export function update(item) {
    map = produce(map, d => {
        let index = d.findIndex(i => i.key === item.key)
        if (index !== -1)
            d.splice(index, 1, item)
    })
    setItem(map).then(ret => {
        console.log('update:', ret, map)
    })
}

const setItem = async function (jsonData) {
    return new Promise((ok, err) => {
        localStorage.setItem('Map', JSON.stringify(jsonData))
        ok({ status: 200 })
    })
}