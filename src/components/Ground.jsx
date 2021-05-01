import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  MapControls,
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import { useFrame, useThree } from "react-three-fiber";
import { MathUtils, Vector3 } from "three";
import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox";
// import { SelectionHelper } from 'three/examples/jsm/interactive/SelectionHelper'
import { ModInstance } from "./Model";
import * as Store from "../Store";
import { SelectionHelper } from "../SelectHelper";
import { get, post } from "../Helper";
import { AppConfig } from "../Config";
import { ModDirConfig } from "../AssetsConfig";
const player = {
  height: 100.0,
  speed: 4.0,
  turnSpeed: Math.PI * 0.02,
};
export default ({ mt, action, pt, toggle, view }) => {
  const { camera, mouse, raycaster, scene, gl } = useThree();
  const rollOverRef = useRef();
  const keyboard = useRef({});
  const trans = useRef();
  const orb = useRef();
  const flagTree = useRef({});
  const [modList, setModList] = useState([]);
  const [oldMods, setOldMods] = useState([]);
  const [oldFlags, setOldFlags] = useState([]);
  const modCount = useRef(0);
  const flagCount = useRef(0);
  let selectionBox = new SelectionBox(camera, scene);
  let selectHelper = null; //new SelectionHelper(selectionBox, gl, 'selectBox')
  const assetPrefix = ModDirConfig[localStorage.getItem("projName")];
  // select box
  const pointDown = (evt) => {
    if (evt.button === 0) {
      document.querySelectorAll(".selectBox").forEach((box) => {
        box.classList.remove("hide");
      });
    }
    selectionBox.startPoint.set(
      (evt.clientX / window.innerWidth) * 2 - 1,
      -(evt.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
  };
  const pointMove = (evt) => {
    if (selectHelper && selectHelper.isDown) {
      selectionBox.endPoint.set(
        (evt.clientX / window.innerWidth) * 2 - 1,
        -(evt.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
    }
  };
  const pointUp = (evt) => {
    selectionBox.endPoint.set(
      (evt.clientX / window.innerWidth) * 2 - 1,
      -(evt.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    document.querySelectorAll(".geo-panel").forEach((geo) => {
      geo.classList.remove("hide");
    });
  };
  useEffect(() => {
    const keyUp = (evt) => {
      keyboard.current[evt.keyCode] = false;
    };
    const keyDown = (evt) => {
      keyboard.current[evt.keyCode] = true;
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    console.log(view);
    if (trans.current) {
      trans.current.detach();
      trans.current.addEventListener("dragging-changed", (evt) => {
        if (orb.current) orb.current.enabled = !evt.value;
      });
      trans.current.mode = "translate";
    }

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);

      window.removeEventListener("pointerdown", pointDown);
      window.removeEventListener("pointermove", pointMove);
      window.removeEventListener("pointerup", pointUp);
    };
  }, [camera]);

  useEffect(() => {
    let guid = localStorage.getItem("guid");
    let exp = localStorage.getItem("exp");
    let token = localStorage.getItem("token");
    get({
      url: AppConfig.url.getBuildings,
      params: {
        "param.prjGuid": guid,
        "param.access_token": token,
      },
    }).then((data) => {
      if (!data.data) {
        return [];
      }
      let ret = data.data
        .filter((item) => item.buildingName.indexOf(":") !== -1)
        .map((item) => {
          let [name, key, url] = item.buildingName.split(":");
          let position = JSON.parse(item.buildingPosition || "[0,0,0]");
          let scale = JSON.parse(item.buildingZoom);
          let rotation = JSON.parse(item.buildingDirection);
          let color = item.mainColor;
          return {
            detail: { name, color },
            key,
            position,
            scale,
            rotation,
            url,
          };
        });
      Store.clean().then(() => {
        ret.forEach((item) => {
          Store.add(item);
        });
      });
      setOldMods(ret);
    });

    post({
      url: AppConfig.url.postMpsAndRiskAndBimPoint,
      data: { guid, access_token: localStorage.getItem("token") },
    }).then((data) => {
      if (!data.data) {
        return;
      }
      let { mpsList, riskList } = data.data;
      if (!mpsList) mpsList = [];
      if (!riskList) riskList = [];
      let ret = mpsList.concat(riskList).map((flag) => {
        let name = flag.name;
        let type = flag.type;
        let bimId = flag.bimId;
        let color = `${flag.type}` === "2" ? "#ff0000" : "#00ff00";
        return {
          pos: [flag.x, flag.y, flag.z],
          url: `models/basic/Box.FBX`,
          key: MathUtils.generateUUID(),
          detail: {
            name,
            color,
            bimId,
            type,
          },
        };
      });
      setOldFlags(ret);
    });
  }, []);
  useEffect(() => {
    let flag = oldFlags[flagCount.current];
    if (!flag) return;
    flagCount.current++;
    setModList(
      modList.concat(
        <ModInstance
          position={flag.pos}
          pathList={[flag.url]}
          key={flag.key}
          detail={flag.detail}
          toggle={toggle}
          ft={flagTree}
          indexKey={flag.key}
        />
      )
    );
  }, [modList, oldFlags.length]);
  useEffect(() => {
    let mod = oldMods[modCount.current];
    if (!mod) return;

    modCount.current++;
    setModList(
      modList.concat(
        <ModInstance
          position={[mod.position[0], 0, mod.position[2]]}
          pathList={[mod["url"]]}
          ctrl={trans}
          key={mod["key"]}
          detail={mod["detail"]}
          indexKey={mod["key"]}
          rotation={mod["rotation"]}
          scale={mod["scale"]}
        />
      )
    );
  }, [modList, oldMods.length]);
  useFrame(() => {
    raycastUpdate(rollOverRef, raycaster, mouse, camera, action, mt, pt);
    if (action && action.current[0]) {
      if (
        action.current[0].act === "HIDE_FLAG" &&
        flagTree.current &&
        Object.values(flagTree.current)
      ) {
        Object.values(flagTree.current).forEach((flag) => {
          flag.current.visible = false;
        });
        action.current.shift(0);
        return;
      }
      if (
        action.current[0].act === "SHOW_FLAG" &&
        flagTree.current &&
        Object.values(flagTree.current)
      ) {
        Object.values(flagTree.current).forEach((flag) => {
          flag.current.visible = true;
        });
        action.current.shift(0);
        return;
      }
      if (action.current[0].act === "TRANSLATE" && trans.current) {
        trans.current.mode = "translate";
        action.current.shift(0);
        trans.current.showY = false;
        trans.current.showX = true;
        trans.current.showZ = true;
        return;
      }
      if (action.current[0].act === "ROTATE" && trans.current) {
        trans.current.mode = "rotate";
        action.current.shift(0);
        trans.current.showX = false;
        trans.current.showZ = false;
        trans.current.showY = true;
        return;
      }
      if (action.current[0].act === "SCALE" && trans.current) {
        trans.current.mode = "scale";
        action.current.shift(0);
        trans.current.showX = true;
        trans.current.showZ = true;
        trans.current.showY = true;
        return;
      }
      if (action.current[0].act === "CHANGE_COLOR" && trans.current) {
        if (trans.current.object) {
          trans.current.object.traverse((m) => {
            if (m.type === "Mesh" && m.material.color) {
              m.material.color.set(action.current[0].color);
            }
          });
        }
        action.current.shift(0);
        return;
      }
      if (action.current[0].act === "DETACH" && trans.current) {
        trans.current.detach();
        action.current.shift(0);
        return;
      }
      if (action.current[0].act === "DELETE" && trans.current) {
        // 获取最后的pos rotate scale
        Store.remove(trans.current.object.userData);

        trans.current.object.visible = false;
        trans.current.object.position.setY(300000);
        trans.current.detach();
        action.current.shift(0);
        return;
      }
      if (action.current[0].act === "SAVE" && trans.current) {
        Store.update({
          key: trans.current.object.userData.key,
          detail: trans.current.object.userData.detail,
          url: trans.current.object.userData.pathList[0],
          position: trans.current.object.position.toArray(),
          rotation: trans.current.object.rotation.toArray(),
          scale: trans.current.object.scale.toArray(),
        });
        action.current.shift(0);
        return;
      }
      if (action.current[0].act === "GEO_SELECT") {
        orb.current.target = new Vector3(-25000, 300, -12000);
        orb.current.enableRotate = false;
        selectHelper = new SelectionHelper(selectionBox, gl, "selectBox");
        selectHelper.isActive = true;
        window.addEventListener("pointerdown", pointDown);
        window.addEventListener("pointermove", pointMove);
        window.addEventListener("pointerup", pointUp);
        action.current.shift(0);
        return;
      }
      if (action.current[0].act === "GEO_UNSELECT") {
        orb.current.enableRotate = true;
        window.removeEventListener("pointerdown", pointDown);
        window.removeEventListener("pointermove", pointMove);
        window.removeEventListener("pointerup", pointUp);
        if (selectHelper) {
          selectHelper.remove();
          selectHelper.isActive = false;
        }
        action.current.shift(0);
        return;
      }
      if (action.current[0].act === "FIND") {
        let searchKey = action.current[0].key;
        let flags = Object.values(flagTree.current);
        let match = flags.find(
          (f) =>
            f.current.name.toUpperCase().indexOf(searchKey.toUpperCase()) !== -1
        );
        if (match) {
          orb.current.target = match.current.position;
        }
        action.current.shift(0);
        return;
      }
    }
  });
  return (
    <>
      {!view && <TransformControls ref={trans} position={[0, 3000000, 0]} />}
      <Suspense fallback={null}>{modList}</Suspense>
      <mesh
        ref={rollOverRef}
        position={[0, 3000000, 0]}
        onDoubleClick={() => {
          if (
            action.current[0] &&
            action.current[0]["act"] === "FLAG_SELECT" &&
            !action.current[0]["lock"]
          ) {
            let pos = rollOverRef.current.position;
            pos.y += 50;
            let detail = action.current[0]["detail"];
            if (pos.y > 0) pos.y = 0;
            post({
              url: AppConfig.url.saveMpsAndRisk,
              data: {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                type: detail.type,
                pointId: detail.bimId,
                guid: localStorage.getItem("guid"),
                access_token: localStorage.getItem("token"),
              },
            });
            action.current[0]["lock"] = true;
            let indexKey = MathUtils.generateUUID();
            setModList(
              modList.concat(
                <ModInstance
                  position={pos}
                  pathList={[action.current[0]["url"]]}
                  key={indexKey}
                  detail={action.current[0]["detail"]}
                  toggle={toggle}
                  ft={flagTree}
                  indexKey={indexKey}
                />
              )
            );
            action.current.shift();
            return;
          }
          if (
            action.current[0] &&
            action.current[0]["act"] === "MOD_SELECT" &&
            !action.current[0]["lock"]
          ) {
            let pos = rollOverRef.current.position.toArray();
            action.current[0]["lock"] = true;
            let indexKey = MathUtils.generateUUID();
            Store.add({
              key: indexKey,
              detail: action.current[0]["detail"],
              position: [pos[0], 0, pos[2]],
              rotation: [0, 0, 0, "XYZ"],
              scale: [1, 1, 1],
              url: action.current[0]["url"],
            });
            setModList(
              modList.concat(
                <ModInstance
                  position={[pos[0], 0, pos[2]]}
                  pathList={[action.current[0]["url"]]}
                  ctrl={trans}
                  key={indexKey}
                  detail={action.current[0]["detail"]}
                  indexKey={indexKey}
                />
              )
            );
            action.current.shift();
            return;
          }
        }}
      >
        <boxBufferGeometry attach="geometry" args={[100, 100, 100]} />
        <meshPhongMaterial
          attach="material"
          color="lightgreen"
          transparent
          opacity={0.3}
        />
      </mesh>
      <OrbitControls
        target={[-25000, 300, -12000]}
        ref={orb}
        enableDamping
        minPolarAngle={0}
        maxPolarAngle={0.48 * Math.PI}
      />
    </>
  );
};
// setup raycaster
function raycastUpdate(rollOverRef, raycaster, mouse, camera, action, mt, pt) {
  raycaster.setFromCamera(mouse, camera);
  if (
    action.current[0] &&
    action.current[0].act === "FLAG_SELECT" &&
    mt &&
    mt.current.length > 0
  ) {
    const intersects = raycaster.intersectObjects(mt.current);
    if (intersects.length > 0) {
      let intersect = intersects[0];
      let point = intersect.point;
      rollOverRef.current.position.copy(point).add(intersect.face.normal);
      rollOverRef.current.position
        .divideScalar(100)
        .floor()
        .multiplyScalar(100)
        .addScalar(50);
      // 工程地段基准高度 -825. 在此之上的检测将物体放在上表面
      // 低于这个高度则可以嵌入.
      if (rollOverRef.current.position.y >= -825) {
        rollOverRef.current.position.add(new Vector3(0, 0, 0));
      }
    }
  }
  if (
    action.current[0] &&
    action.current[0].act === "MOD_SELECT" &&
    pt &&
    pt.current.length > 0
  ) {
    // 当地面显示的时候, 地下部分不做检测.
    const intersects = raycaster.intersectObjects(pt.current);
    if (intersects.length > 0) {
      let intersect = intersects[0];
      let point = intersect.point;
      rollOverRef.current.position.copy(point).add(intersect.face.normal);
      rollOverRef.current.position
        .divideScalar(100)
        .floor()
        .multiplyScalar(100)
        .addScalar(50);
      //对于地上部分, 需要放在地面上表面
      if (rollOverRef.current.position.y < 0) {
        rollOverRef.current.position.add(new Vector3(0, 0, 0));
      }
    }
  }
}

function playerSetup(camera, orb) {
  camera.position.set(0, player.height, -5);
  camera.lookAt(new Vector3(0, player.height, 0));
  orb.current.target.set(new Vector3(0, player.height, 0));
}
function playerMove(camera, keyboard) {
  if (keyboard.current[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard.current[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard.current[65]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if (keyboard.current[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }
}
