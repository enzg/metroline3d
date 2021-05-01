import "./Reset.css";
import "antd/dist/antd.dark.css";
import "antd/dist/antd.compact.css";
import "./App.css";
import "./Hud.css";
import React, { useEffect, useRef, useState } from "react";
import Hud from "./Hud";
import World from "./World";
import { AppCtx, post } from "./Helper";
import { ModDirConfig } from "./AssetsConfig";
function queryToObj() {
  let pairs = window.location.search.slice(1).split("&");

  let result = {};
  pairs.forEach(function (pair) {
    pair = pair.split("=");
    result[pair[0]] = decodeURIComponent(pair[1] || "");
  });
  return { guid: "!NULL", projName: "!NULL", ...result };
}
export default () => {
  const action = useRef([]);
  const [weather, setWeather] = useState("sunny");
  const [tf, setTf] = useState(false);
  const [flagDetail, toggle] = useState({ show: false, payload: {} });
  let guid = localStorage.getItem("guid");
  let projName = localStorage.getItem("projName");
  let modKey = localStorage.getItem("modKey");
  let viewParams = queryToObj();

  if (!guid) {
    localStorage.setItem("guid", "5fd7687f-3bf4-4e2a-a2d5-6b0050a54152");
    guid = "5fd7687f-3bf4-4e2a-a2d5-6b0050a54152";
  }
  if (!projName) {
    localStorage.setItem("projName", "清水河站~布吉站");
    projName = "清水河站~布吉站";
  }
  if (viewParams.guid != "!NULL" && viewParams.projName != "!NULL") {
    guid = viewParams.guid;
    projName = viewParams.projName;
    localStorage.setItem("guid", guid);
    localStorage.setItem("projName", projName);
  }
  if (!modKey) {
    localStorage.setItem("modKey", ModDirConfig[projName]);
    modKey = ModDirConfig[projName];
  }

  useEffect(() => {
    // 获取apitoken
    const login = async (params) => {
      let ret = await post({ url: "/api/common/login", data: params });
      if (ret.code === 1) {
        localStorage.setItem("token", ret.data);
        localStorage.setItem("exp", Date.now() + 12 * 3600 * 1000);
      }
    };
    let exp = localStorage.getItem("exp");
    if (Date.now() > exp) {
      login({
        accountId: "SWEGISBIM",
        password: "ztnf_swiBim344727",
      });
    }
  }, []);
  return (
    <div className="app-root">
      <AppCtx.Provider
        value={{ weather, setWeather, tf, setTf, flagDetail, toggle }}
      >
        <Hud action={action} view={viewParams.guid != "!NULL" ? true : false} />
        <World
          action={action}
          view={viewParams.guid != "!NULL" ? true : false}
        />
      </AppCtx.Provider>
    </div>
  );
};
