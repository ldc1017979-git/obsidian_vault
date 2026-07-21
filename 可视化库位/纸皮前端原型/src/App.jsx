import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars, faBell, faChartColumn, faCheck, faChevronLeft, faChevronRight,
  faClockRotateLeft, faCompress, faExpand, faFileLines, faHouse, faTruck,
  faImage, faMagnifyingGlass, faMapLocationDot, faRotateRight, faTag,
  faTimes, faTriangleExclamation, faUser, faWarehouse,
} from "@fortawesome/free-solid-svg-icons";

const zones = [
  "成品A1区", "成品A2区", "成品B1区", "成品B2区", "成品C1区", "成品C2区",
  "成品D1区", "成品D2区", "白坯E区", "白坯F区", "纸皮G区", "顶盖H区",
  "外箱I区", "M1区", "M2区", "M3区", "M4区", "1线成品临托", "2线成品临托",
  "3线成品临托", "4线成品临托", "L1线工区", "L2线工区", "L3线工区", "L4线工区",
];

const menuItems = [
  [faHouse, "首页"], [faWarehouse, "库区管理"], [faTag, "标签记录"],
  [faChartColumn, "设备状态"], [faExpand, "条码检测"], [faBell, "报警记录"],
  [faFileLines, "操作记录"], [faMapLocationDot, "车辆地图"],
];

const photos = [
  "/assets/cargo-cardboard-01.png",
  "/assets/cargo-cardboard-02.png",
  "/assets/cargo-cardboard-03.png",
];

const records = [
  { id: "003", operator: "王建国", time: "2026-07-20 10:21:35", photos, latest: true },
  { id: "002", operator: "李明", time: "2026-07-20 09:46:12", photos: [photos[1], photos[2]] },
  { id: "001", operator: "周海峰", time: "2026-07-19 17:38:06", photos: [photos[2]] },
];

function PhotoModal({ record, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const count = record.photos.length;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") setIndex((value) => (value - 1 + count) % count);
      if (event.key === "ArrowRight") setIndex((value) => (value + 1) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, onClose]);

  return (
    <div className="photo-modal" role="dialog" aria-modal="true" aria-label="货物照片预览" onMouseDown={onClose}>
      <div className="photo-dialog" onMouseDown={(event) => event.stopPropagation()}>
        <div className="photo-dialog__header">
          <div>
            <strong>货物照片</strong>
            <span>{record.operator} · {record.time}</span>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="关闭"><FontAwesomeIcon icon={faTimes} /></button>
        </div>
        <div className="photo-stage">
          {count > 1 && (
            <button className="photo-nav photo-nav--left" onClick={() => setIndex((index - 1 + count) % count)} aria-label="上一张">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
          <img src={record.photos[index]} alt={`货物照片 ${index + 1}`} />
          {count > 1 && (
            <button className="photo-nav photo-nav--right" onClick={() => setIndex((index + 1) % count)} aria-label="下一张">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
          <span className="photo-count">{index + 1} / {count}</span>
        </div>
        <div className="photo-strip">
          {record.photos.map((photo, photoIndex) => (
            <button key={photo} className={photoIndex === index ? "is-selected" : ""} onClick={() => setIndex(photoIndex)}>
              <img src={photo} alt={`缩略图 ${photoIndex + 1}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecordCard({ record, onPreview }) {
  return (
    <article className={`record-card ${record.latest ? "record-card--latest" : ""}`}>
      <span className="timeline-dot" />
      <div className="record-heading">
        <time>{record.time}</time>
        {record.latest && <span className="latest-tag">最新</span>}
      </div>
      <div className="operator">
        <span className="operator-icon"><FontAwesomeIcon icon={faUser} /></span>
        <span>叉车员</span><strong>{record.operator}</strong>
      </div>
      <div className="record-photos">
        {record.photos.map((photo, index) => (
          <button key={photo} onClick={() => onPreview(record, index)} aria-label={`查看第 ${index + 1} 张货物照片`}>
            <img src={photo} alt={`货物照片 ${index + 1}`} />
            <span className="zoom-hint"><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
          </button>
        ))}
      </div>
    </article>
  );
}

export function App() {
  const [activeMenu, setActiveMenu] = useState("库区管理");
  const [activeZone, setActiveZone] = useState("纸皮G区");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const currentLocation = { code: "2-2", status: "occupied" };
  const latestRecord = records[0];

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="menu-button" aria-label="菜单"><FontAwesomeIcon icon={faBars} /></button>
        <div className="brand">
          <div className="brand-mark"><FontAwesomeIcon icon={faWarehouse} /></div>
          <div>
            <h1>可视化库位 · 江苏1车间</h1>
            <p>Visualization Storage System <span>Copyright © ds · Version 3.0</span></p>
          </div>
        </div>
        <div className="top-actions">
          <button className="warning-button" onClick={() => notify("当前无未处理报警")}>
            <FontAwesomeIcon icon={faTriangleExclamation} /> 清除所有报警
          </button>
          <button className="top-icon" aria-label="全屏"><FontAwesomeIcon icon={faCompress} /></button>
          <div className="user-chip"><FontAwesomeIcon icon={faTruck} /> 王师傅 <span>⌄</span></div>
        </div>
      </header>

      <aside className="sidebar">
        {menuItems.map(([icon, label]) => (
          <button key={label} className={activeMenu === label ? "active" : ""} onClick={() => setActiveMenu(label)}>
            <FontAwesomeIcon icon={icon} /><span>{label}</span>
          </button>
        ))}
      </aside>

      <main className="workspace">
        <div className="page-tabs">
          <button>首页 <span>×</span></button>
          <button className="active"><FontAwesomeIcon icon={faWarehouse} /> 库区管理 <span>×</span></button>
        </div>

        <div className="zone-tabs">
          <div className="zone-tabs__scroll">
            {zones.map((zone) => (
              <button key={zone} className={activeZone === zone ? "active" : ""} onClick={() => setActiveZone(zone)}>{zone}</button>
            ))}
          </div>
          <button className="zone-config" onClick={() => notify("库区配置为演示功能")}>库区配置</button>
        </div>

        <div className="toolbar">
          <div className="legend">
            <span className="legend-title">库位图</span>
            <span><i className="swatch occupied" />占用</span>
            <span><i className="swatch full" />全栈板</span>
            <span><i className="swatch empty" />空闲</span>
            <span><i className="swatch reserved" />预留</span>
            <span><i className="swatch locked" />锁闭</span>
            <span><i className="swatch lock-point" />锁点</span>
            <span><i className="swatch selected" />选中</span>
            <span><i className="swatch source" />源件位 <b>?</b></span>
          </div>
          <div className="search-bar">
            <label>搜索</label>
            <select defaultValue="托盘标签"><option>托盘标签</option><option>库位编号</option></select>
            <input placeholder="内容" />
            <button onClick={() => notify("已完成模拟搜索")}>搜索</button>
          </div>
        </div>

        <section className="content-area">
          <div className="map-panel">
            <div className="map-actions">
              <span>（按住Ctrl可进行加选 / 减选）</span>
              <button className="batch" onClick={() => notify("批量操作为演示功能")}>＋ 批量操作</button>
              <button className="reset" onClick={() => notify("库位状态已重置")}><FontAwesomeIcon icon={faRotateRight} /> 重置库位</button>
              <button className="refresh" onClick={() => notify("页面数据已刷新")}><FontAwesomeIcon icon={faRotateRight} /> 刷新</button>
            </div>
            <div className="rack-map" aria-label="纸皮G区库位图">
              <div className="rack-row">
                <span className="row-label">1</span>
                <button className="slot empty" /><button className="slot empty" />
                <button className="slot empty" /><button className="slot empty" />
              </div>
              <div className="rack-row">
                <span className="row-label">2</span>
                <button className="slot occupied" />
                <button className="slot occupied selected-slot"><FontAwesomeIcon icon={faCheck} /></button>
                <button className="slot empty" /><button className="slot empty" />
              </div>
              <p className="selected-note"><span /> 当前选中：{currentLocation.code}（占用）</p>
            </div>
          </div>

          <aside className="detail-panel">
            <section className="utilization">
              <div className="meter">
                <strong>25.00%</strong><span>库位使用率</span><progress max="100" value="25" />
              </div>
              <div className="stats">
                <span>库位容量：<b>8 个</b></span><span>可用库位：<b>6 个</b></span>
                <span>库位使用：<b>2 个</b></span><span>合批次数：<b>0 批</b></span>
              </div>
              <div className="action-grid">
                <button className="blue">修改库位类型</button><button className="gray">修改库位状态</button>
                <button className="green">呼叫叉车送料</button><button className="amber">呼叫叉车退料</button>
                <button className="slate">数据再位操作</button>
              </div>
            </section>

            {currentLocation.status === "occupied" && (
            <section className="history-panel">
              <div className="history-header">
                <div><span className="eyebrow">当前库位 · 占用</span><h2>{currentLocation.code}</h2></div>
                <div className="history-title">
                  <FontAwesomeIcon icon={faClockRotateLeft} />
                  <div><strong>最新作业详情</strong><span>展示 1 条</span></div>
                </div>
              </div>
              <div className="timeline">
                {[latestRecord].map((record) => (
                  <RecordCard key={record.id} record={record} onPreview={(currentRecord, index) => setModal({ record: currentRecord, index })} />
                ))}
              </div>
              <div className="history-footnote"><FontAwesomeIcon icon={faImage} /> 点击照片可放大查看</div>
            </section>
            )}
          </aside>
        </section>
      </main>

      {modal && <PhotoModal record={modal.record} startIndex={modal.index} onClose={() => setModal(null)} />}
      {toast && <div className="toast"><FontAwesomeIcon icon={faCheck} /> {toast}</div>}
    </div>
  );
}
