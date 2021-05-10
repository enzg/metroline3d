import React, { useContext, useState } from "react";
import { Button, Card, Col, Form, Input, Radio, Row, Switch, Tabs, Divider } from "antd";
import {
    CheckOutlined,
    CloseCircleFilled,
    CloseOutlined,
    GoldenFilled,
    SaveFilled,
    MinusCircleFilled,
} from "@ant-design/icons";
import {
    basicMenu,
    vehicleMenu,
    buildingMenu,
    plantMenu,
    bridgeMenu,
    eventMenu,
    Menus,
} from "./Config";
import {
    CardGrid,
    FlagDetail,
    MpsAndRisksList,
    ProjGrid,
    SceneSetting,
} from "./components/Page";
import Draggable from "react-draggable";
import StreamGraph from "./components/StreamGraph";
import { CompactPicker } from "react-color";
import { AppCtx } from "./Helper";
import { save } from "./Store";
const basicStyle = {
    width: "18vw",
    position: "absolute",
    top: "1vh",
    left: "1vw",
    zIndex: 22222222,
};
const closeButtonStyle = {
    border: "none",
    position: "absolute",
    top: "2px",
    right: "2px",
    zIndex: 22222223,
};
export default ({ action, view }) => {
    const [shield, showShield] = useState(false);
    const { flagDetail } = useContext(AppCtx);
    const [projName, setProjName] = useState(localStorage.getItem("projName"));
    return (
        <>
            <div
                style={{
                    background: "url(images/nav.png) center repeat-x",
                }}
                className="top-nav"
            >
                <span>中铁西南科学研究院有限公司三维地质模型</span>
                <div className="action">
                    <div>
                        <Button type="text">
                            {projName === "0" ? "未选择工点" : projName}
                        </Button>
                        <Button
                            onClick={() => {
                                save(localStorage.getItem("guid")).then((data) => {
                                    console.log(data);
                                });
                            }}
                            icon={<SaveFilled />}
                        >
                            保存
                        </Button>
                        <Button icon={<MinusCircleFilled />}>退出</Button>
                    </div>
                </div>
            </div>
            {!view && (
                <div className="top-hud">
                    <div className="card-position-wrap" style={basicStyle}>
                        <div className="card-title-wrap">模型库</div>
                        <div className="card-body-border">
                            <Card size="small" bordered={false}>
                                <Tabs
                                    tabPosition="left"
                                    size="small"
                                    style={{ height: "18vh" }}
                                >
                                    <Tabs.TabPane tab="基础类" key="1">
                                        <CardGrid
                                            dataSource={basicMenu}
                                            action={action}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="交通工具" key="2">
                                        <CardGrid
                                            dataSource={vehicleMenu}
                                            action={action}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="植物" key="3">
                                        <CardGrid
                                            dataSource={plantMenu}
                                            action={action}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="建筑" key="4">
                                        <CardGrid
                                            dataSource={buildingMenu}
                                            action={action}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="桥" key="5">
                                        <CardGrid
                                            dataSource={bridgeMenu}
                                            action={action}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="事件" key="6">
                                        <CardGrid
                                            dataSource={eventMenu}
                                            action={action}
                                        />
                                    </Tabs.TabPane>
                                </Tabs>
                            </Card>
                        </div>
                    </div>

                    <div
                        className="card-position-wrap"
                        style={{ ...basicStyle, top: "24vh" }}
                    >
                        <div className="card-title-wrap">场景设置</div>
                        <div className="card-body-border" style={{ height: "13vh" }}>
                            <SceneSetting action={action} />
                        </div>
                    </div>

                    <div
                        className="card-position-wrap"
                        style={{ ...basicStyle, top: "40.5vh" }}
                    >
                        <div className="card-title-wrap">添加标识</div>
                        <div className="card-body-border" style={{ height: "14vh" }}>
                            <MpsAndRisksList action={action} />
                        </div>
                    </div>
                    <div
                        className="card-position-wrap"
                        style={{ ...basicStyle, top: "58vh" }}
                    >
                        <div className="card-title-wrap">工点管理</div>
                        <div className="card-body-border" style={{ height: "18vh" }}>
                            <ProjGrid action={action} changeProj={setProjName} />
                        </div>
                    </div>
                    <div
                        className="card-position-wrap"
                        style={{ ...basicStyle, top: "80vh" }}
                    >
                        <div className="card-title-wrap" onClick={()=>{
                            showShield(true)
                            document.querySelector(".top-hud").classList.add("hide")
                            document.querySelector(".geo-panel").classList.remove('hide')
                        }}>盾构信息</div>
                    </div>
                    <div
                        className="card-position-wrap"
                        style={{ ...basicStyle, top: "83vh" }}
                    >
                        <div className="card-title-wrap" onClick={() =>{
                            action.current.unshift({ act: "GEO_SELECT" })
                            document.querySelector(".top-hud").classList.add("hide")
                        }}>地质显示</div>
                    </div>
                    <div
                        className="card-position-wrap"
                        style={{ ...basicStyle, top: "86vh" }}
                    >
                        <div className="card-title-wrap">
                <Input.Search
                    placeholder="查找BIM标识点"
                    onSearch={(evt) => {
                        action.current.unshift({ act: "FIND", key: `${evt}` });
                    }}
                    enterButton
                />
                        </div>

                    </div>
                </div>
            )}
            <Card
                className="geo-panel hide"
                size="small"
                style={{
                    position: "absolute",
                    height: "51vh",
                    width: "calc(100vw - 80px)",
                    bottom: "0.5vh",
                    left: "2vw",
                    zIndex: "22222222",
                }}
            >
                <X2 action={action} />
                <StreamGraph shield={shield} />
            </Card>
            <div
                style={{
                    position: "absolute",
                    right: "1vw",
                    bottom: "1vh",
                    zIndex: "33333333",
                }}
                className="ctrl-panel hide"
            >
                <Draggable>
                    <Card
                        title="控制面板"
                        size="small"
                        style={{ width: "50vh", transform: "translate(-50vw,0,0)" }}
                    >
                        <X0 action={action} />
                        <div style={{ marginBottom: "1vh" }}>
                            <Radio.Group
                                defaultValue={"translate"}
                                buttonStyle="solid"
                                onChange={(evt) => {
                                    action.current.unshift({
                                        act: evt.target.value.toUpperCase(),
                                    });
                                }}
                            >
                                <Radio.Button value="translate">平移</Radio.Button>
                                <Radio.Button value="rotate">旋转</Radio.Button>
                                <Radio.Button value="scale">缩放</Radio.Button>
                            </Radio.Group>
                        </div>
                        <CompactPicker
                            onChange={(evt) => {
                                action.current.unshift({
                                    act: "CHANGE_COLOR",
                                    color: evt.hex,
                                });
                            }}
                        />
                        <Divider />
                        <Button
                            onClick={() => {
                                // just save the store in local storage.
                                action.current.unshift({ act: "SAVE" });
                            }}
                        >
                            保存
                        </Button>
                        <Button
                            onClick={() => {
                                action.current.unshift({ act: "DELETE" });
                            }}
                        >
                            删除
                        </Button>
                    </Card>
                </Draggable>
            </div>
            {flagDetail.show && (
                <FlagDetail
                    action={action}
                    bimId={flagDetail.payload.bimId}
                    type={flagDetail.payload.type}
                    name={flagDetail.payload.name}
                />
            )}
        </>
    );
};
const X0 = ({ action }) => (
    <Button
        onClick={() => {
            action.current.unshift({ act: "DETACH" });
            document.querySelector(".ctrl-panel").classList.add("hide");
        }}
        ghost
        style={closeButtonStyle}
        icon={<CloseCircleFilled />}
    />
);

const X2 = ({ action }) => (
    <Button
        onClick={() => {
            action.current.unshift({ act: "GEO_UNSELECT" });
            document.querySelector(".geo-panel").classList.add("hide");
            document.querySelector(".top-hud").classList.remove("hide");
        }}
        ghost
        style={closeButtonStyle}
        icon={<CloseCircleFilled />}
    />
);

function Route({ link, linkTo, action, changeProj }) {
    if (link === "GEO_INFO") {
        action.current.unshift({ act: "GEO_SELECT" });
        return null;
    } else if (link === "FIND_FLAG") {
        document.querySelector(".top-hud").classList.remove("hide");
        return (
            <Card
                size="small"
                bodyStyle={{ padding: "6px" }}
                style={{ ...basicStyle, borderRadius: "8px", left: "30vh" }}
            >
                <Input.Search
                    placeholder="查找BIM标识点"
                    onSearch={(evt) => {
                        action.current.unshift({ act: "FIND", key: `${evt}` });
                    }}
                    enterButton
                />
            </Card>
        );
    } else if (link === "MOD_LIB") {
        return (
            <Card size="small" title="模型库" style={basicStyle}>
                <X linkTo={linkTo} />
                <Tabs tabPosition="left" size="small">
                    <Tabs.TabPane tab="基础类" key="1">
                        <CardGrid dataSource={basicMenu} action={action} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="交通工具" key="2">
                        <CardGrid dataSource={vehicleMenu} action={action} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="植物" key="3">
                        <CardGrid dataSource={plantMenu} action={action} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="建筑" key="4">
                        <CardGrid dataSource={buildingMenu} action={action} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="桥" key="5">
                        <CardGrid dataSource={bridgeMenu} action={action} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="事件" key="6">
                        <CardGrid dataSource={eventMenu} action={action} />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        );
    } else if (link === "ADD_FLAG") {
        return (
            <Card size="small" title="BIM标识" style={{ ...basicStyle, height: "70vh" }}>
                <X linkTo={linkTo} />
                <MpsAndRisksList action={action} />
            </Card>
        );
    } else if (link === "SCENE_SETTING") {
        return (
            <Card
                size="small"
                title="场景设置"
                style={{ ...basicStyle, minHeight: "50vh" }}
            >
                <X linkTo={linkTo} />
                <SceneSetting style={basicStyle} action={action} />
            </Card>
        );
    } else if (link === "PROJ_MANAGE") {
        return (
            <Card
                size="small"
                title="工点管理"
                style={{
                    ...basicStyle,
                    height: "35vh",
                    width: "25vw",
                    top: "5.5vh",
                    left: "1vw",
                }}
            >
                <X linkTo={linkTo} />
                <ProjGrid action={action} changeProj={changeProj} />
            </Card>
        );
    } else if (link === "SHOW_SHIELD") {
        console.log(link);
        return (
            <Card
                className="geo-panel"
                size="small"
                style={{
                    position: "absolute",
                    height: "51vh",
                    width: "calc(100vw - 80px)",
                    bottom: "0.5vh",
                    left: "2vw",
                    zIndex: "22222222",
                }}
            >
                <X2 action={action} />
                <StreamGraph shield={true} />
            </Card>
        );
    }
    return null;
}
function X({ linkTo }) {
    const closeButtonStyle = {
        border: "none",
        position: "absolute",
        top: "2px",
        right: "2px",
        zIndex: 22222223,
    };
    return (
        <Button
            onClick={() => {
                linkTo(null);
                document.querySelector(".top-hud").classList.remove("hide");
            }}
            ghost
            style={closeButtonStyle}
            icon={<CloseCircleFilled />}
        />
    );
}
