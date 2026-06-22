/**
 * 智链 SCM 可交互原型 — 逻辑与模拟数据
 * 依据《供应链.md》PRD 页面与交互说明实现
 */

(function () {
  "use strict";

  // ---------- 工具 ----------
  function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDate(str) {
    const parts = str.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function showToast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.remove("is-hidden");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      el.classList.add("is-hidden");
    }, 2600);
  }

  const today = new Date();
  const todayStr = formatDateLocal(today);

  // ---------- 模拟数据：供应商 ----------
  const supplierCatalog = [
    { id: "S001", name: "华东精密制造", region: "上海" },
    { id: "S002", name: "华南贸易行", region: "广州" },
    { id: "S003", name: "北方原料集团", region: "天津" },
    { id: "S004", name: "联创服务商", region: "杭州" },
  ];

  const suppliers = [
    {
      code: "V2026001",
      name: "华东精密制造",
      type: "生产",
      status: "正式",
      contact: "张敏",
      region: "上海",
      creditCode: "91310000MA1K2XXXX",
      address: "上海市浦东新区张江路 88 号",
      paymentTerms: "月结30天",
      currency: "CNY",
      invoiceTitle: "华东精密制造有限公司",
      phone: "021-55550101",
      email: "zhang@example.com",
      billingContact: "李会计",
      bankAccount: "6222021234567890123",
      startDate: "2024-01-10",
      rating: "A",
      remark: "战略供应商",
      updatedAt: "2026-04-18",
    },
    {
      code: "V2026002",
      name: "华南贸易行",
      type: "贸易",
      status: "试用",
      contact: "王强",
      region: "广州",
      creditCode: "91440000MA5Y3XXXX",
      address: "广州市天河区体育东路 100 号",
      paymentTerms: "货到付款",
      currency: "CNY",
      invoiceTitle: "华南贸易行有限公司",
      phone: "020-88880001",
      email: "wang@example.com",
      billingContact: "陈对账",
      bankAccount: "6217001234567890456",
      startDate: "2026-02-01",
      rating: "B",
      remark: "",
      updatedAt: "2026-04-19",
    },
    {
      code: "V2026003",
      name: "北方原料集团",
      type: "生产",
      status: "冻结",
      contact: "赵磊",
      region: "天津",
      creditCode: "91120000MA07NXXXX",
      address: "天津市滨海新区临港路 66 号",
      paymentTerms: "预付30%",
      currency: "CNY",
      invoiceTitle: "北方原料集团有限公司",
      phone: "022-66660002",
      email: "zhao@example.com",
      billingContact: "钱财务",
      bankAccount: "6228481234567890789",
      startDate: "2023-06-15",
      rating: "C",
      remark: "质量争议冻结",
      updatedAt: "2026-03-28",
    },
  ];

  // ---------- 模拟数据：采购订单 ----------
  const purchaseOrders = [
    {
      id: "PO20260415001",
      supplierId: "S001",
      supplierName: "华东精密制造",
      orderDate: "2026-04-15",
      dueDate: "2026-04-25",
      status: "已提交",
      amount: 128000,
      lineSummary: "钢材/螺栓 共 3 行",
      exception: false,
      lines: [
        { lineNo: 10, material: "GC-SS304 板材", qty: 200, price: 420 },
        { lineNo: 20, material: "螺栓 M8", qty: 5000, price: 0.35 },
        { lineNo: 30, material: "垫片", qty: 5000, price: 0.12 },
      ],
      comments: ["供应商已回复交期无异议", "请尽快确认以便下推仓库"],
    },
    {
      id: "PO20260410002",
      supplierId: "S002",
      supplierName: "华南贸易行",
      orderDate: "2026-04-10",
      dueDate: "2026-04-12",
      status: "已确认",
      amount: 45200,
      lineSummary: "电子元件 共 2 行",
      exception: true,
      exceptionReason: "物流延误",
      lines: [
        { lineNo: 10, material: "MCU 芯片", qty: 2000, price: 18 },
        { lineNo: 20, material: "电容 0603", qty: 10000, price: 0.08 },
      ],
      comments: ["承运商反馈高速封路"],
    },
    {
      id: "PO20260408003",
      supplierId: "S001",
      supplierName: "华东精密制造",
      orderDate: "2026-04-08",
      dueDate: "2026-04-18",
      status: "部分到货",
      amount: 96000,
      lineSummary: "钣金件 共 2 行",
      exception: false,
      lines: [
        { lineNo: 10, material: "钣金外壳 A", qty: 100, price: 800 },
        { lineNo: 20, material: "钣金外壳 B", qty: 80, price: 700 },
      ],
      comments: ["第一批已收货", "第二批在途"],
    },
    {
      id: "PO20260320004",
      supplierId: "S003",
      supplierName: "北方原料集团",
      orderDate: "2026-03-20",
      dueDate: "2026-04-01",
      status: "已确认",
      amount: 210000,
      lineSummary: "化工原料 共 1 行",
      exception: true,
      exceptionReason: "质检拒收",
      lines: [{ lineNo: 10, material: "原料 X-200", qty: 10, price: 21000 }],
      comments: ["质检不合格，待退货协商"],
    },
    {
      id: "PO20260419005",
      supplierId: "S004",
      supplierName: "联创服务商",
      orderDate: "2026-04-19",
      dueDate: "2026-05-10",
      status: "草稿",
      amount: 12000,
      lineSummary: "外包服务 1 行",
      exception: false,
      lines: [{ lineNo: 10, material: "检测服务", qty: 1, price: 12000 }],
      comments: [],
    },
    {
      id: "PO20260401006",
      supplierId: "S002",
      supplierName: "华南贸易行",
      orderDate: "2026-04-01",
      dueDate: "2026-04-20",
      status: "已关闭",
      amount: 8800,
      lineSummary: "辅料 共 1 行",
      exception: false,
      lines: [{ lineNo: 10, material: "包装膜", qty: 100, price: 88 }],
      comments: ["已完结"],
    },
  ];

  // ---------- 模拟数据：库存 ----------
  const warehouseTree = [
    {
      id: "wh-east",
      name: "华东中心仓",
      children: [
        { id: "zone-east-norm", name: "常温区", warehouseId: "wh-east" },
        { id: "zone-east-cold", name: "冷藏区", warehouseId: "wh-east" },
      ],
    },
    {
      id: "wh-south",
      name: "华南前置仓",
      children: [{ id: "zone-south-norm", name: "常温区", warehouseId: "wh-south" }],
    },
  ];

  const inventoryRows = [
    {
      warehouseId: "wh-east",
      zoneId: "zone-east-norm",
      materialCode: "M-10001",
      name: "GC-SS304 板材",
      spec: "2mm",
      batch: "B20260410",
      available: 120,
      frozen: 0,
      location: "A-01-03",
      safety: 100,
      category: "金属",
      abc: "A",
      state: "可用",
    },
    {
      warehouseId: "wh-east",
      zoneId: "zone-east-norm",
      materialCode: "M-10002",
      name: "螺栓 M8",
      spec: "不锈钢",
      batch: "B20260408",
      available: 45,
      frozen: 10,
      location: "B-02-01",
      safety: 200,
      category: "标准件",
      abc: "B",
      state: "可用",
    },
    {
      warehouseId: "wh-east",
      zoneId: "zone-east-cold",
      materialCode: "M-20001",
      name: "试剂 R-9",
      spec: "500ml",
      batch: "C20260412",
      available: 8,
      frozen: 0,
      location: "C-01-01",
      safety: 20,
      category: "化工",
      abc: "C",
      state: "待检",
    },
    {
      warehouseId: "wh-south",
      zoneId: "zone-south-norm",
      materialCode: "M-30055",
      name: "MCU 芯片",
      spec: "STM32",
      batch: "D20260415",
      available: 500,
      frozen: 0,
      location: "S-01-05",
      safety: 300,
      category: "电子",
      abc: "A",
      state: "可用",
    },
  ];

  // ---------- 模拟数据：物流 ----------
  const shipments = [
    {
      waybill: "YD20260420001",
      route: "上海 → 广州",
      carrier: "顺丰快运",
      region: "华南",
      eta: "2026-04-20 18:00",
      status: "运输中",
      exception: false,
      outboundRef: "OUT-88901",
      timeline: [
        { node: "已揽收", time: "2026-04-19 09:00", place: "上海浦东", source: "承运商回传" },
        { node: "在途", time: "2026-04-19 20:00", place: "浙江金华分拨", source: "承运商回传" },
        { node: "派送中", time: "", place: "", source: "" },
        { node: "签收", time: "", place: "", source: "" },
      ],
    },
    {
      waybill: "YD20260420002",
      route: "天津 → 上海",
      carrier: "德邦物流",
      region: "华东",
      eta: "2026-04-20 14:00",
      status: "派送中",
      exception: false,
      outboundRef: "OUT-88902",
      timeline: [
        { node: "已揽收", time: "2026-04-18 14:00", place: "天津滨海", source: "承运商回传" },
        { node: "在途", time: "2026-04-19 08:00", place: "江苏南京", source: "承运商回传" },
        { node: "派送中", time: "2026-04-20 10:00", place: "上海浦东", source: "承运商回传" },
        { node: "签收", time: "", place: "", source: "" },
      ],
    },
    {
      waybill: "YD20260418003",
      route: "广州 → 深圳",
      carrier: "顺丰快运",
      region: "华南",
      eta: "2026-04-18 12:00",
      status: "异常",
      exception: true,
      exceptionText: "车辆故障延误",
      outboundRef: "OUT-88771",
      timeline: [
        { node: "已揽收", time: "2026-04-17 16:00", place: "广州白云", source: "承运商回传" },
        { node: "在途", time: "2026-04-18 09:00", place: "东莞", source: "承运商回传" },
        { node: "异常", time: "2026-04-18 11:00", place: "东莞", source: "手工补录" },
      ],
    },
    {
      waybill: "YD20260415004",
      route: "北京 → 天津",
      carrier: "京东物流",
      region: "华北",
      eta: "2026-04-15 17:00",
      status: "已签收",
      exception: false,
      outboundRef: "OUT-88001",
      timeline: [
        { node: "已揽收", time: "2026-04-14 10:00", place: "北京通州", source: "承运商回传" },
        { node: "在途", time: "2026-04-14 18:00", place: "廊坊", source: "承运商回传" },
        { node: "派送中", time: "2026-04-15 14:00", place: "天津", source: "承运商回传" },
        { node: "签收", time: "2026-04-15 16:42", place: "天津滨海仓", source: "签收扫描" },
      ],
    },
  ];

  // ---------- 状态 ----------
  const procurementState = {
    tab: "mine",
    page: 0,
    pageSize: 20,
    kpiFilter: null,
    dateStart: "",
    dateEnd: "",
    supplier: "",
    status: "",
    keyword: "",
  };

  let selectedTreeNodeId = "root";
  const inventoryFilter = {
    warehouses: [],
    category: "",
    abc: "",
    stockState: "",
  };

  let logisticsState = {
    tab: "transit",
    carrier: "",
    region: "",
    status: "",
    exceptionOnly: false,
    selectedWaybill: null,
    mapRegion: null,
  };

  let editingSupplierIndex = -1;
  let pendingConfirmOrderId = null;
  let pendingDeliveryOrderId = null;
  let pendingExceptionWaybill = null;

  // ---------- 采购：计算 KPI ----------
  function computeProcurementKpis() {
    const pendingConfirm = purchaseOrders.filter(function (order) {
      return order.status === "已提交" || order.status === "草稿";
    }).length;

    const todayReceive = 2;

    const overdue = purchaseOrders.filter(function (order) {
      if (order.status === "已关闭" || order.status === "已取消") return false;
      return parseDate(order.dueDate) < today && order.status !== "部分到货";
    }).length;

    const exceptionCount = purchaseOrders.filter(function (order) {
      return order.exception === true;
    }).length;

    document.getElementById("kpiPendingConfirm").textContent = String(pendingConfirm);
    document.getElementById("kpiTodayReceive").textContent = String(todayReceive);
    document.getElementById("kpiOverdue").textContent = String(overdue);
    document.getElementById("kpiException").textContent = String(exceptionCount);
  }

  function orderMatchesFilters(order) {
    if (procurementState.supplier && order.supplierId !== procurementState.supplier) {
      return false;
    }
    if (procurementState.status && order.status !== procurementState.status) {
      return false;
    }
    if (procurementState.keyword) {
      const keywordLower = procurementState.keyword.toLowerCase();
      const inText =
        order.id.toLowerCase().includes(keywordLower) ||
        order.lineSummary.toLowerCase().includes(keywordLower) ||
        order.supplierName.toLowerCase().includes(keywordLower);
      if (!inText) return false;
    }
    if (procurementState.dateStart && order.orderDate < procurementState.dateStart) {
      return false;
    }
    if (procurementState.dateEnd && order.orderDate > procurementState.dateEnd) {
      return false;
    }
    if (procurementState.kpiFilter === "pendingConfirm") {
      if (order.status !== "已提交" && order.status !== "草稿") return false;
    } else if (procurementState.kpiFilter === "overdue") {
      if (order.status === "已关闭" || order.status === "已取消") return false;
      if (!(parseDate(order.dueDate) < today && order.status !== "部分到货")) return false;
    } else if (procurementState.kpiFilter === "exception") {
      if (!order.exception) return false;
    } else if (procurementState.kpiFilter === "todayReceive") {
      return order.dueDate === todayStr || order.status === "部分到货";
    }

    if (procurementState.tab === "mine") {
      const mineStatuses = ["已提交", "草稿", "部分到货"];
      if (mineStatuses.indexOf(order.status) === -1) return false;
    } else if (procurementState.tab === "alert") {
      if (!order.exception) return false;
    }

    return true;
  }

  function renderProcurementTable() {
    const filtered = purchaseOrders.filter(orderMatchesFilters);
    const start = procurementState.page * procurementState.pageSize;
    const pageRows = filtered.slice(start, start + procurementState.pageSize);

    const tbody = document.getElementById("poTableBody");
    tbody.innerHTML = "";

    pageRows.forEach(function (order) {
      const tr = document.createElement("tr");
      if (order.exception) {
        tr.classList.add("row-danger");
      }

      const ops = [];
      ops.push('<button type="button" class="link" data-action="view" data-id="' + order.id + '">查看</button>');
      if (order.status === "已提交" || order.status === "草稿") {
        ops.push(
          '<button type="button" class="link" data-action="confirm" data-id="' + order.id + '">确认</button>'
        );
      }
      if (order.status === "已确认" || order.status === "部分到货") {
        ops.push(
          '<button type="button" class="link" data-action="delivery" data-id="' + order.id + '">变更交期</button>'
        );
      }

      tr.innerHTML =
        "<td>" +
        order.id +
        "</td>" +
        "<td>" +
        order.supplierName +
        "</td>" +
        "<td>" +
        order.orderDate +
        "</td>" +
        "<td>" +
        order.dueDate +
        "</td>" +
        "<td>" +
        order.status +
        "</td>" +
        "<td>" +
        order.amount.toLocaleString() +
        "</td>" +
        "<td>" +
        order.lineSummary +
        (order.exception ? ' <span class="badge-warn">异常</span>' : "") +
        "</td>" +
        "<td>" +
        ops.join(" ") +
        "</td>";

      tr.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");
        if (button) {
          event.stopPropagation();
          const action = button.getAttribute("data-action");
          const orderId = button.getAttribute("data-id");
          if (action === "view") {
            openOrderDrawer(orderId);
          } else if (action === "confirm") {
            openConfirmModal(orderId);
          } else if (action === "delivery") {
            openDeliveryModal(orderId);
          }
          return;
        }
        openOrderDrawer(order.id);
      });

      tbody.appendChild(tr);
    });

    document.getElementById("poPagerInfo").textContent =
      "共 " + filtered.length + " 条，第 " + (procurementState.page + 1) + " 页";

    const maxPage = Math.max(0, Math.ceil(filtered.length / procurementState.pageSize) - 1);
    document.getElementById("poPrev").disabled = procurementState.page <= 0;
    document.getElementById("poNext").disabled = procurementState.page >= maxPage;

    computeProcurementKpis();
  }

  function openOrderDrawer(orderId) {
    const order = purchaseOrders.find(function (item) {
      return item.id === orderId;
    });
    if (!order) return;

    document.getElementById("drawerOrderTitle").textContent = order.id;
    document.getElementById("drawerOrderMeta").textContent =
      order.supplierName +
      " ｜ 下单 " +
      order.orderDate +
      " ｜ 交期 " +
      order.dueDate +
      " ｜ 状态 " +
      order.status;

    const linesBody = document.getElementById("drawerLines");
    linesBody.innerHTML = "";
    order.lines.forEach(function (line) {
      const row = document.createElement("tr");
      row.innerHTML =
        "<td>" +
        line.lineNo +
        "</td><td>" +
        line.material +
        "</td><td>" +
        line.qty +
        "</td><td>" +
        line.price +
        "</td>";
      linesBody.appendChild(row);
    });

    const commentsEl = document.getElementById("drawerComments");
    commentsEl.innerHTML = "";
    if (order.comments.length === 0) {
      commentsEl.innerHTML = "<li>暂无留言</li>";
    } else {
      order.comments.forEach(function (text) {
        const li = document.createElement("li");
        li.textContent = text;
        commentsEl.appendChild(li);
      });
    }

    document.getElementById("orderDrawer").classList.remove("is-hidden");
    document.getElementById("drawerOverlay").classList.remove("is-hidden");
  }

  function closeOrderDrawer() {
    document.getElementById("orderDrawer").classList.add("is-hidden");
    document.getElementById("drawerOverlay").classList.add("is-hidden");
  }

  function openConfirmModal(orderId) {
    pendingConfirmOrderId = orderId;
    const order = purchaseOrders.find(function (item) {
      return item.id === orderId;
    });
    document.getElementById("modalConfirmText").textContent =
      "确认后将订单 " + orderId + " 置为「已确认」，并记录操作日志（原型模拟）。是否继续？";
    document.getElementById("modalConfirm").classList.remove("is-hidden");
  }

  function openDeliveryModal(orderId) {
    pendingDeliveryOrderId = orderId;
    document.getElementById("modalDeliveryDate").value = todayStr;
    document.getElementById("modalDeliveryReason").value = "";
    document.getElementById("modalDelivery").classList.remove("is-hidden");
  }

  function closeModals() {
    document.querySelectorAll(".modal").forEach(function (modal) {
      modal.classList.add("is-hidden");
    });
    pendingConfirmOrderId = null;
    pendingDeliveryOrderId = null;
    pendingExceptionWaybill = null;
  }

  // ---------- 库存 ----------
  function renderWarehouseChecks() {
    const container = document.getElementById("invWarehouseChecks");
    container.innerHTML = "";
    const allId = "wh-all";
    const allLabel = document.createElement("label");
    allLabel.innerHTML = '<input type="checkbox" id="' + allId + '" checked /> 全部';
    container.appendChild(allLabel);

    warehouseTree.forEach(function (node) {
      const label = document.createElement("label");
      const checkboxId = "wh-" + node.id;
      label.innerHTML =
        '<input type="checkbox" class="wh-check" data-wh="' + node.id + '" id="' + checkboxId + '" /> ' + node.name;
      container.appendChild(label);
    });

    container.querySelector("#" + allId).addEventListener("change", function (event) {
      if (event.target.checked) {
        container.querySelectorAll(".wh-check").forEach(function (checkbox) {
          checkbox.checked = false;
        });
        inventoryFilter.warehouses = [];
        renderInventory();
      }
    });

    container.querySelectorAll(".wh-check").forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        const rootCheck = container.querySelector("#" + allId);
        rootCheck.checked = false;
        inventoryFilter.warehouses = Array.prototype.slice
          .call(container.querySelectorAll(".wh-check:checked"))
          .map(function (element) {
            return element.getAttribute("data-wh");
          });
        renderInventory();
      });
    });
  }

  function renderWarehouseTree() {
    const root = document.getElementById("invTree");
    root.innerHTML = "";

    const rootLi = document.createElement("li");
    const rootNode = document.createElement("div");
    rootNode.className = "tree__node" + (selectedTreeNodeId === "root" ? " tree__node--active" : "");
    rootNode.textContent = "全部仓库";
    rootNode.dataset.nodeId = "root";
    rootLi.appendChild(rootNode);
    root.appendChild(rootLi);

    warehouseTree.forEach(function (wh) {
      const li = document.createElement("li");
      const node = document.createElement("div");
      node.className = "tree__node" + (selectedTreeNodeId === wh.id ? " tree__node--active" : "");
      node.textContent = wh.name;
      node.dataset.nodeId = wh.id;
      li.appendChild(node);

      const ul = document.createElement("ul");
      wh.children.forEach(function (zone) {
        const zli = document.createElement("li");
        const znode = document.createElement("div");
        znode.className =
          "tree__node" + (selectedTreeNodeId === zone.id ? " tree__node--active" : "");
        znode.textContent = zone.name;
        znode.dataset.nodeId = zone.id;
        zli.appendChild(znode);
        ul.appendChild(zli);
      });
      li.appendChild(ul);
      root.appendChild(li);
    });

    root.querySelectorAll(".tree__node").forEach(function (node) {
      node.addEventListener("click", function (event) {
        event.stopPropagation();
        selectedTreeNodeId = node.dataset.nodeId;
        renderWarehouseTree();
        renderInventory();
      });
    });
  }

  function inventoryMatches(row) {
    if (inventoryFilter.warehouses.length > 0 && inventoryFilter.warehouses.indexOf(row.warehouseId) === -1) {
      return false;
    }
    if (inventoryFilter.category && row.category !== inventoryFilter.category) {
      return false;
    }
    if (inventoryFilter.abc && row.abc !== inventoryFilter.abc) {
      return false;
    }
    if (inventoryFilter.stockState && row.state !== inventoryFilter.stockState) {
      return false;
    }

    if (selectedTreeNodeId === "root") {
      return true;
    }
    if (selectedTreeNodeId === row.warehouseId || selectedTreeNodeId === row.zoneId) {
      return true;
    }
    return false;
  }

  function renderInventory() {
    const rows = inventoryRows.filter(inventoryMatches);

    let breadcrumb = "全部仓库";
    if (selectedTreeNodeId === "root") {
      breadcrumb = "全部仓库";
    } else {
      warehouseTree.forEach(function (wh) {
        if (wh.id === selectedTreeNodeId) {
          breadcrumb = wh.name;
        }
        wh.children.forEach(function (zone) {
          if (zone.id === selectedTreeNodeId) {
            breadcrumb = wh.name + " > " + zone.name;
          }
        });
      });
    }
    document.getElementById("invBreadcrumb").textContent = breadcrumb;

    const skuSet = {};
    let amountWan = 0;
    rows.forEach(function (row) {
      skuSet[row.materialCode] = true;
      amountWan += row.available * 10;
    });
    document.getElementById("invMetricSku").textContent = String(Object.keys(skuSet).length);
    document.getElementById("invMetricAmt").textContent = (amountWan / 10000).toFixed(2);
    document.getElementById("invMetricTurn").textContent = rows.length ? "28" : "0";

    const barChart = document.getElementById("invBarChart");
    barChart.innerHTML = "";
    const categories = ["金属", "标准件", "化工", "电子"];
    const maxVal = 100;
    categories.forEach(function (categoryName) {
      const value =
        rows.filter(function (row) {
          return row.category === categoryName;
        }).length * 25 || 15;
      const item = document.createElement("div");
      item.className = "bar-chart__item";
      const bar = document.createElement("div");
      bar.className = "bar-chart__bar";
      bar.style.height = Math.min(value, maxVal) + "%";
      item.appendChild(bar);
      item.appendChild(document.createTextNode(categoryName));
      barChart.appendChild(item);
    });

    const lineChart = document.getElementById("invLineChart");
    lineChart.innerHTML = "";
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const point = document.createElement("div");
      point.className = "line-chart__pt";
      point.style.setProperty("--h", 25 + dayIndex * 10 + "%");
      point.title = "D-" + (6 - dayIndex);
      lineChart.appendChild(point);
    }

    const tbody = document.getElementById("invTableBody");
    tbody.innerHTML = "";
    rows.forEach(function (row) {
      const tr = document.createElement("tr");
      const low = row.available < row.safety;
      if (low) {
        tr.classList.add("row-warn");
      }
      const batchButton =
        '<button type="button" class="link" data-batch="' + row.batch + '">' + row.batch + "</button>";
      const warnCell = low
        ? '<span class="badge-warn">低于安全库存</span> <button type="button" class="link" data-replenish="' +
          row.materialCode +
          '">补货建议</button>'
        : "—";

      tr.innerHTML =
        "<td>" +
        row.materialCode +
        "</td>" +
        "<td>" +
        row.name +
        "</td>" +
        "<td>" +
        row.spec +
        "</td>" +
        "<td>" +
        batchButton +
        "</td>" +
        "<td>" +
        row.available +
        "</td>" +
        "<td>" +
        row.frozen +
        (row.frozen > 0
          ? ' <abbr title="质检/盘点锁定等原因" class="hint">ⓘ</abbr>'
          : "") +
        "</td>" +
        "<td>" +
        row.location +
        "</td>" +
        "<td>" +
        row.safety +
        "</td>" +
        "<td>" +
        warnCell +
        "</td>";

      tr.querySelectorAll("[data-batch]").forEach(function (button) {
        button.addEventListener("click", function (event) {
          event.stopPropagation();
          openTraceModal(button.getAttribute("data-batch"));
        });
      });
      tr.querySelectorAll("[data-replenish]").forEach(function (button) {
        button.addEventListener("click", function (event) {
          event.stopPropagation();
          showToast("已跳转采购草稿（原型占位）：物料 " + button.getAttribute("data-replenish"));
        });
      });

      tbody.appendChild(tr);
    });
  }

  function openTraceModal(batchId) {
    document.getElementById("traceBatchId").textContent = batchId;
    const list = document.getElementById("traceList");
    list.innerHTML = "";
    [
      "采购单行：PO20260408003 / 行 10",
      "入库单：GR-20260412-008",
      "出库单：OUT-88901（部分）",
    ].forEach(function (text) {
      const li = document.createElement("li");
      li.textContent = text;
      list.appendChild(li);
    });
    document.getElementById("modalTrace").classList.remove("is-hidden");
  }

  // ---------- 物流 ----------
  const mapRegions = [
    { key: "华东", label: "华东", left: "72%", top: "42%", count: 0 },
    { key: "华南", label: "华南", left: "68%", top: "68%", count: 0 },
    { key: "华北", label: "华北", left: "58%", top: "28%", count: 0 },
  ];

  function renderLogisticsMap() {
    mapRegions.forEach(function (region) {
      region.count = shipments.filter(function (shipment) {
        return shipment.region === region.key && shipment.status !== "已签收";
      }).length;
    });

    const mapEl = document.getElementById("logMap");
    mapEl.innerHTML = "";
    const hint = document.createElement("div");
    hint.className = "fake-map__hint";
    hint.textContent = "点击气泡按区域筛选在途运单";
    mapEl.appendChild(hint);

    mapRegions.forEach(function (region) {
      const bubble = document.createElement("button");
      bubble.type = "button";
      bubble.className = "map-bubble";
      bubble.textContent = String(region.count);
      bubble.style.left = region.left;
      bubble.style.top = region.top;
      bubble.title = region.label;
      if (logisticsState.mapRegion === region.key) {
        bubble.classList.add("map-bubble--active");
      }
      bubble.addEventListener("click", function () {
        logisticsState.mapRegion = logisticsState.mapRegion === region.key ? null : region.key;
        logisticsState.selectedWaybill = null;
        document.getElementById("logTimelinePanel").classList.add("is-hidden");
        renderLogisticsTable();
        renderLogisticsMap();
      });
      mapEl.appendChild(bubble);
    });
  }

  function shipmentMatches(shipment) {
    if (logisticsState.carrier && shipment.carrier !== logisticsState.carrier) {
      return false;
    }
    if (logisticsState.region && shipment.region !== logisticsState.region) {
      return false;
    }
    if (logisticsState.status && shipment.status !== logisticsState.status) {
      return false;
    }
    if (logisticsState.exceptionOnly && !shipment.exception) {
      return false;
    }
    if (logisticsState.mapRegion && shipment.region !== logisticsState.mapRegion) {
      return false;
    }

    if (logisticsState.tab === "transit") {
      return shipment.status === "运输中" || shipment.status === "派送中" || shipment.status === "已揽收";
    }
    if (logisticsState.tab === "today") {
      return shipment.eta.indexOf(todayStr) !== -1;
    }
    if (logisticsState.tab === "exc") {
      return shipment.exception === true;
    }
    return true;
  }

  function renderLogisticsTable() {
    const filtered = shipments.filter(shipmentMatches);
    const tbody = document.getElementById("logTableBody");
    tbody.innerHTML = "";

    filtered.forEach(function (shipment) {
      const tr = document.createElement("tr");
      if (shipment.exception) {
        tr.classList.add("row-danger");
      }
      if (logisticsState.selectedWaybill === shipment.waybill) {
        tr.classList.add("is-selected");
      }

      const exceptionCell = shipment.exception ? shipment.exceptionText || "异常" : "—";
      const ops = shipment.exception
        ? '<button type="button" class="link" data-log-action="exc" data-waybill="' +
          shipment.waybill +
          '">处理</button>'
        : "—";

      tr.innerHTML =
        "<td>" +
        shipment.waybill +
        "</td>" +
        "<td>" +
        shipment.route +
        "</td>" +
        "<td>" +
        shipment.carrier +
        "</td>" +
        "<td>" +
        shipment.eta +
        "</td>" +
        "<td>" +
        shipment.status +
        "</td>" +
        "<td>" +
        exceptionCell +
        "</td>" +
        "<td>" +
        ops +
        "</td>";

      tr.addEventListener("click", function (event) {
        const button = event.target.closest("[data-log-action]");
        if (button && button.getAttribute("data-log-action") === "exc") {
          event.stopPropagation();
          openLogExceptionModal(button.getAttribute("data-waybill"));
          return;
        }
        logisticsState.selectedWaybill = shipment.waybill;
        renderLogisticsTable();
        showTimeline(shipment);
      });

      tbody.appendChild(tr);
    });
  }

  function showTimeline(shipment) {
    const panel = document.getElementById("logTimelinePanel");
    panel.classList.remove("is-hidden");
    document.getElementById("logTimelineWaybill").textContent = shipment.waybill;
    const list = document.getElementById("logTimeline");
    list.innerHTML = "";
    shipment.timeline.forEach(function (step) {
      const li = document.createElement("li");
      const title = document.createElement("div");
      title.textContent = step.node + (step.time ? " — " + step.time : "");
      const meta = document.createElement("div");
      meta.className = "time";
      meta.textContent = (step.place || "—") + " ｜ " + (step.source || "");
      li.appendChild(title);
      li.appendChild(meta);
      list.appendChild(li);
    });
  }

  function openLogExceptionModal(waybill) {
    pendingExceptionWaybill = waybill;
    document.getElementById("modalLogExcWaybill").textContent = "运单 " + waybill;
    document.getElementById("modalLogExcNote").value = "";
    document.getElementById("modalLogExcEta").value = "";
    document.getElementById("modalLogExc").classList.remove("is-hidden");
  }

  // ---------- 供应商 ----------
  function renderSupplierTable() {
    const typeFilter = document.getElementById("supType").value;
    const coopFilter = document.getElementById("supCoop").value;
    const regionFilter = document.getElementById("supRegion").value;
    const keyword = document.getElementById("supKeyword").value.trim().toLowerCase();

    const filtered = suppliers.filter(function (supplier) {
      if (typeFilter && supplier.type !== typeFilter) return false;
      if (coopFilter && supplier.status !== coopFilter) return false;
      if (regionFilter && supplier.region !== regionFilter) return false;
      if (keyword) {
        const blob = (supplier.code + supplier.name + supplier.contact).toLowerCase();
        if (!blob.includes(keyword)) return false;
      }
      return true;
    });

    const tbody = document.getElementById("supTableBody");
    tbody.innerHTML = "";
    filtered.forEach(function (supplier, index) {
      const originalIndex = suppliers.indexOf(supplier);
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" +
        supplier.code +
        "</td>" +
        "<td>" +
        supplier.name +
        "</td>" +
        "<td>" +
        supplier.type +
        "</td>" +
        "<td>" +
        supplier.status +
        "</td>" +
        "<td>" +
        supplier.contact +
        "</td>" +
        "<td>" +
        supplier.updatedAt +
        "</td>" +
        "<td>" +
        '<button type="button" class="link" data-sup-open="' +
        originalIndex +
        '">查看/编辑</button> ' +
        (supplier.status === "冻结"
          ? '<button type="button" class="link" data-sup-unfreeze="' + originalIndex + '">解冻</button>'
          : '<button type="button" class="link" data-sup-freeze="' + originalIndex + '">冻结</button>') +
        "</td>";

      tr.querySelectorAll("[data-sup-open]").forEach(function (button) {
        button.addEventListener("click", function () {
          openSupplierDrawer(Number(button.getAttribute("data-sup-open")));
        });
      });
      tr.querySelectorAll("[data-sup-freeze]").forEach(function (button) {
        button.addEventListener("click", function () {
          const supplierIndex = Number(button.getAttribute("data-sup-freeze"));
          suppliers[supplierIndex].status = "冻结";
          showToast("已冻结：" + suppliers[supplierIndex].name + "（新单将不可选）");
          renderSupplierTable();
        });
      });
      tr.querySelectorAll("[data-sup-unfreeze]").forEach(function (button) {
        button.addEventListener("click", function () {
          const supplierIndex = Number(button.getAttribute("data-sup-unfreeze"));
          suppliers[supplierIndex].status = "正式";
          showToast("已解冻：" + suppliers[supplierIndex].name);
          renderSupplierTable();
        });
      });

      tbody.appendChild(tr);
    });
  }

  function openSupplierDrawer(index) {
    editingSupplierIndex = index;
    const supplier = index === -1 ? {} : suppliers[index];
    const isNew = index === -1;

    document.getElementById("supDrawerTitle").textContent = isNew ? "新建供应商" : "供应商详情";
    const form = document.getElementById("supForm");
    form.reset();
    if (!isNew) {
      form.name.value = supplier.name;
      form.creditCode.value = supplier.creditCode;
      form.address.value = supplier.address;
      form.paymentTerms.value = supplier.paymentTerms;
      form.currency.value = supplier.currency;
      form.invoiceTitle.value = supplier.invoiceTitle;
      form.contact.value = supplier.contact;
      form.phone.value = supplier.phone;
      form.email.value = supplier.email;
      form.billingContact.value = supplier.billingContact;
      form.bankAccount.value = maskBank(supplier.bankAccount);
      form.type.value = supplier.type;
      form.status.value = supplier.status;
      form.startDate.value = supplier.startDate;
      form.rating.value = supplier.rating;
      form.remark.value = supplier.remark;
    }

    document.getElementById("supBankAccount").dataset.full = isNew ? "" : supplier.bankAccount;
    document.getElementById("supDrawer").classList.remove("is-hidden");
    document.getElementById("supDrawerOverlay").classList.remove("is-hidden");
  }

  function maskBank(account) {
    if (!account || account.length < 8) return "****";
    return account.slice(0, 4) + " **** **** " + account.slice(-4);
  }

  function closeSupplierDrawer() {
    document.getElementById("supDrawer").classList.add("is-hidden");
    document.getElementById("supDrawerOverlay").classList.add("is-hidden");
    editingSupplierIndex = -1;
  }

  // ---------- 导航 ----------
  function showPage(pageId) {
    document.querySelectorAll(".page").forEach(function (section) {
      section.classList.remove("page--active");
    });
    document.querySelectorAll(".nav__item").forEach(function (button) {
      button.classList.remove("nav__item--active");
    });

    const map = {
      procurement: "pageProcurement",
      inventory: "pageInventory",
      logistics: "pageLogistics",
      supplier: "pageSupplier",
      flow: "pageFlow",
    };
    const section = document.getElementById(map[pageId]);
    if (section) {
      section.classList.add("page--active");
    }
  }

  function initNavigation() {
    document.querySelectorAll(".nav__item").forEach(function (button) {
      button.addEventListener("click", function () {
        const pageId = button.getAttribute("data-page");
        const title = button.getAttribute("data-title");
        document.getElementById("topbarPageTitle").textContent = title;
        showPage(pageId);
        document.querySelectorAll(".nav__item").forEach(function (item) {
          item.classList.toggle("nav__item--active", item === button);
        });

        if (pageId === "inventory") {
          renderInventory();
        }
        if (pageId === "logistics") {
          renderLogisticsMap();
          renderLogisticsTable();
        }
        if (pageId === "supplier") {
          renderSupplierTable();
        }
      });
    });
  }

  function initProcurement() {
    const start = new Date(today);
    start.setDate(start.getDate() - 30);
    procurementState.dateStart = formatDateLocal(start);
    procurementState.dateEnd = todayStr;

    document.getElementById("poDateStart").value = procurementState.dateStart;
    document.getElementById("poDateEnd").value = procurementState.dateEnd;

    const supplierSelect = document.getElementById("poSupplier");
    supplierSelect.innerHTML = '<option value="">全部</option>';
    supplierCatalog.forEach(function (supplier) {
      const option = document.createElement("option");
      option.value = supplier.id;
      option.textContent = supplier.name;
      supplierSelect.appendChild(option);
    });

    document.getElementById("poSearch").addEventListener("click", function () {
      procurementState.dateStart = document.getElementById("poDateStart").value;
      procurementState.dateEnd = document.getElementById("poDateEnd").value;
      procurementState.supplier = document.getElementById("poSupplier").value;
      procurementState.status = document.getElementById("poStatus").value;
      procurementState.keyword = document.getElementById("poKeyword").value.trim();
      procurementState.page = 0;
      renderProcurementTable();
    });

    document.getElementById("poReset").addEventListener("click", function () {
      document.getElementById("poDateStart").value = procurementState.dateStart;
      document.getElementById("poDateEnd").value = procurementState.dateEnd;
      document.getElementById("poSupplier").value = "";
      document.getElementById("poStatus").value = "";
      document.getElementById("poKeyword").value = "";
      procurementState.supplier = "";
      procurementState.status = "";
      procurementState.keyword = "";
      procurementState.kpiFilter = null;
      procurementState.page = 0;
      renderProcurementTable();
    });

    document.getElementById("poKpiRow").querySelectorAll(".kpi").forEach(function (button) {
      button.addEventListener("click", function () {
        procurementState.kpiFilter = button.getAttribute("data-kpi");
        procurementState.page = 0;
        renderProcurementTable();
        showToast("已按 KPI 条件筛选列表（原型）");
      });
    });

    document.querySelectorAll("[data-po-tab]").forEach(function (tabButton) {
      tabButton.addEventListener("click", function () {
        procurementState.tab = tabButton.getAttribute("data-po-tab");
        procurementState.page = 0;
        document.querySelectorAll("[data-po-tab]").forEach(function (item) {
          item.classList.toggle("tabs__btn--active", item === tabButton);
          item.setAttribute("aria-selected", item === tabButton ? "true" : "false");
        });
        renderProcurementTable();
      });
    });

    document.getElementById("poPrev").addEventListener("click", function () {
      procurementState.page = Math.max(0, procurementState.page - 1);
      renderProcurementTable();
    });

    document.getElementById("poNext").addEventListener("click", function () {
      procurementState.page += 1;
      renderProcurementTable();
    });

    document.getElementById("drawerClose").addEventListener("click", closeOrderDrawer);
    document.getElementById("drawerOverlay").addEventListener("click", closeOrderDrawer);

    document.getElementById("modalConfirmOk").addEventListener("click", function () {
      if (!pendingConfirmOrderId) return;
      const order = purchaseOrders.find(function (item) {
        return item.id === pendingConfirmOrderId;
      });
      if (order) {
        order.status = "已确认";
        order.comments.push("【系统】" + todayStr + " 订单已确认（原型）");
      }
      closeModals();
      closeOrderDrawer();
      renderProcurementTable();
      showToast("订单已确认，已记录日志（原型）");
    });

    document.getElementById("modalDeliveryOk").addEventListener("click", function () {
      if (!pendingDeliveryOrderId) return;
      const newDate = document.getElementById("modalDeliveryDate").value;
      const reason = document.getElementById("modalDeliveryReason").value.trim();
      const order = purchaseOrders.find(function (item) {
        return item.id === pendingDeliveryOrderId;
      });
      if (order && newDate) {
        order.dueDate = newDate;
        order.comments.push("【交期变更】" + reason + " → 新交期 " + newDate);
      }
      closeModals();
      renderProcurementTable();
      showToast("交期变更已保存（原型）");
    });

    document.querySelectorAll("[data-close-modal]").forEach(function (element) {
      element.addEventListener("click", closeModals);
    });

    renderProcurementTable();
  }

  function initInventory() {
    const categorySelect = document.getElementById("invCategory");
    categorySelect.innerHTML = '<option value="">全部</option>';
    ["金属", "标准件", "化工", "电子"].forEach(function (categoryName) {
      const option = document.createElement("option");
      option.value = categoryName;
      option.textContent = categoryName;
      categorySelect.appendChild(option);
    });

    renderWarehouseChecks();
    renderWarehouseTree();
    renderInventory();

    document.getElementById("invSearch").addEventListener("click", function () {
      inventoryFilter.category = document.getElementById("invCategory").value;
      inventoryFilter.abc = document.getElementById("invAbc").value;
      inventoryFilter.stockState = document.getElementById("invStockState").value;
      renderInventory();
    });

    document.getElementById("invRefresh").addEventListener("click", function () {
      showToast("数据已刷新（原型）");
      renderInventory();
    });

    document.getElementById("invExport").addEventListener("click", function () {
      showToast("已导出当前筛选结果（原型占位）");
    });
  }

  function initLogistics() {
    const carrierSelect = document.getElementById("logCarrier");
    carrierSelect.innerHTML = '<option value="">全部</option>';
    ["顺丰快运", "德邦物流", "京东物流"].forEach(function (name) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      carrierSelect.appendChild(option);
    });

    const regionSelect = document.getElementById("logRegion");
    regionSelect.innerHTML = '<option value="">全部</option>';
    ["华东", "华南", "华北"].forEach(function (name) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      regionSelect.appendChild(option);
    });

    document.getElementById("logSearch").addEventListener("click", function () {
      logisticsState.carrier = document.getElementById("logCarrier").value;
      logisticsState.region = document.getElementById("logRegion").value;
      logisticsState.status = document.getElementById("logStatus").value;
      logisticsState.exceptionOnly = document.getElementById("logExceptionOnly").checked;
      logisticsState.selectedWaybill = null;
      document.getElementById("logTimelinePanel").classList.add("is-hidden");
      renderLogisticsTable();
      renderLogisticsMap();
    });

    document.getElementById("logExport").addEventListener("click", function () {
      showToast("已导出运单列表（原型占位）");
    });

    document.querySelectorAll("[data-log-tab]").forEach(function (tabButton) {
      tabButton.addEventListener("click", function () {
        logisticsState.tab = tabButton.getAttribute("data-log-tab");
        logisticsState.selectedWaybill = null;
        document.getElementById("logTimelinePanel").classList.add("is-hidden");
        document.querySelectorAll("[data-log-tab]").forEach(function (item) {
          item.classList.toggle("tabs__btn--active", item === tabButton);
        });
        renderLogisticsTable();
      });
    });
  }

  function initSupplier() {
    const regionSelect = document.getElementById("supRegion");
    regionSelect.innerHTML = '<option value="">全部</option>';
    ["上海", "广州", "天津", "杭州"].forEach(function (name) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      regionSelect.appendChild(option);
    });

    document.getElementById("supSearch").addEventListener("click", function () {
      renderSupplierTable();
    });

    document.getElementById("supReset").addEventListener("click", function () {
      document.getElementById("supType").value = "";
      document.getElementById("supCoop").value = "";
      document.getElementById("supRegion").value = "";
      document.getElementById("supKeyword").value = "";
      renderSupplierTable();
    });

    document.getElementById("supNew").addEventListener("click", function () {
      openSupplierDrawer(-1);
    });

    document.getElementById("supDrawerClose").addEventListener("click", closeSupplierDrawer);
    document.getElementById("supDrawerOverlay").addEventListener("click", closeSupplierDrawer);

    document.getElementById("supRevealBank").addEventListener("click", function () {
      const input = document.getElementById("supBankAccount");
      const full = input.dataset.full;
      if (!full) {
        showToast("新建时请直接填写账号，保存后默认脱敏");
        return;
      }
      if (window.confirm("确认查看完整银行账号？（原型：二次确认）")) {
        input.value = full;
      }
    });

    document.getElementById("supForm").addEventListener("submit", function (event) {
      event.preventDefault();
      const form = event.target;
      if (editingSupplierIndex === -1) {
        const newCode = "V" + String(Date.now()).slice(-8);
        suppliers.push({
          code: newCode,
          name: form.name.value,
          type: form.type.value,
          status: form.status.value,
          contact: form.contact.value,
          region: form.address.value.indexOf("广州") !== -1 ? "广州" : "上海",
          creditCode: form.creditCode.value,
          address: form.address.value,
          paymentTerms: form.paymentTerms.value,
          currency: form.currency.value,
          invoiceTitle: form.invoiceTitle.value,
          phone: form.phone.value,
          email: form.email.value,
          billingContact: form.billingContact.value,
          bankAccount: form.bankAccount.value.replace(/\s/g, ""),
          startDate: form.startDate.value || todayStr,
          rating: form.rating.value,
          remark: form.remark.value,
          updatedAt: todayStr,
        });
        showToast("已新建供应商 " + newCode);
      } else {
        const supplier = suppliers[editingSupplierIndex];
        supplier.name = form.name.value;
        supplier.type = form.type.value;
        supplier.status = form.status.value;
        supplier.contact = form.contact.value;
        supplier.creditCode = form.creditCode.value;
        supplier.address = form.address.value;
        supplier.paymentTerms = form.paymentTerms.value;
        supplier.currency = form.currency.value;
        supplier.invoiceTitle = form.invoiceTitle.value;
        supplier.phone = form.phone.value;
        supplier.email = form.email.value;
        supplier.billingContact = form.billingContact.value;
        supplier.bankAccount = form.bankAccount.value.replace(/\s/g, "");
        supplier.startDate = form.startDate.value;
        supplier.rating = form.rating.value;
        supplier.remark = form.remark.value;
        supplier.updatedAt = todayStr;
        document.getElementById("supBankAccount").dataset.full = supplier.bankAccount;
        showToast("已保存供应商 " + supplier.code);
      }
      closeSupplierDrawer();
      renderSupplierTable();
    });

    document.getElementById("supFormCancel").addEventListener("click", closeSupplierDrawer);
  }

  function initModalLogExc() {
    document.getElementById("modalLogExcOk").addEventListener("click", function () {
      const note = document.getElementById("modalLogExcNote").value.trim();
      const eta = document.getElementById("modalLogExcEta").value;
      const shipment = shipments.find(function (item) {
        return item.waybill === pendingExceptionWaybill;
      });
      if (shipment) {
        shipment.timeline.push({
          node: "处理记录",
          time: todayStr + " " + new Date().toTimeString().slice(0, 5),
          place: note || "—",
          source: "调度录入" + (eta ? " 预计解决 " + eta : ""),
        });
      }
      closeModals();
      renderLogisticsTable();
      showToast("异常处理意见已记录（原型）");
    });
  }

  function init() {
    initNavigation();
    initProcurement();
    initInventory();
    initLogistics();
    initSupplier();
    initModalLogExc();
  }

  init();
})();
