import produce from "immer";
import React from "react";
import { AppConfig } from "./Config";
import { post } from "./Helper";
let template = {
  key: "", // id
  detial: {},
  position: [], // pos
  rotate: [],
  scale: [],
  url: "", // fbx path
};
let map = JSON.parse(localStorage.getItem("Map") || "[]");

export function all() {
  return map;
}

export function add(item) {
  map = produce(map, (d) => {
    d.push(item);
  });
  setItem(map).then((ret) => {
    //console.log('added:', ret, map)
  });
}

export function remove({ key }) {
  map = produce(map, (d) => {
    let index = d.findIndex((i) => i.key === key);
    if (index !== -1) {
      d.splice(index, 1);
    }
  });
  setItem(map).then((ret) => {
    console.log("remove:", ret, map);
  });
}
export function update(item) {
  map = produce(map, (d) => {
    let index = d.findIndex((i) => i.key === item.key);
    if (index !== -1) d.splice(index, 1, item);
  });
  setItem(map).then((ret) => {
    console.log("update:", ret, map);
  });
}
export async function save(guid) {
  if (guid === "0") return;
  console.log("start saving:", guid);
  let buildingData = await formatBuildingStore(guid);
  return post({
    url: AppConfig.url.saveBuildings,
    data: { BuildingPointList: buildingData },
  });
}
export function clean() {
  map = produce(map, (d) => {
    d.splice(0, d.length);
  });
  return setItem(map).then((ret) => {
    console.log("clean all");
  });
}
/*


{
      "guid": "string",
      "buildingType": 0,
      "buildingName": "string",
      "buildingPosition": "string",
      "buildingDirection": "string",
      "buildingZoom": "string",
      "childType": 0,
      "mainColor": "string"
    }


    {
        detail: {name: "公交车", color: ""}
        key: "B0D162FC-5635-47CF-9A58-BE1E9E74859E"
        position: (3) [-25850, 0, 17550]
        rotation: (4) [0, 0, 0, "XYZ"]
        scale: (3) [1, 1, 1]
        url: "models/car/gongjiaoche.FBX"
    }

*/
const formatBuildingStore = async function (guid) {
  return new Promise((ok, err) => {
    let localDataMap = JSON.parse(localStorage.getItem("Map") || "[]");
    let ret = localDataMap.map((item) => {
      return {
        guid,
        buildingType: 0,
        buildingName: `${item.detail.name}:${item.key}:${item.url}`,
        buildingPosition: JSON.stringify(item.position),
        buildingDirection: JSON.stringify(item.rotation),
        buildingZoom: JSON.stringify(item.scale),
        mainColor: `${item.detail.color}`,
      };
    });
    console.log(ret);
    ok(ret);
  });
};
const setItem = async function (jsonData) {
  return new Promise((ok, err) => {
    localStorage.setItem("Map", JSON.stringify(jsonData));
    ok({ status: 200 });
  });
};

