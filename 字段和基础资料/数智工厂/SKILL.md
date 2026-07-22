---
name: "表单字段提取"
description: "使用Chrome DevTools MCP提取网页表单字段信息。适用于用户需要提取页面字段、分析表单结构或生成表单文档时调用。"
---

# 表单字段提取

该技能使用 Chrome DevTools 的 MCP (Memory Control Protocol) 功能，对网页表单进行全量字段识别、结构化提取和文档生成。

## 适用场景

- 用户需要提取某个网页的表单字段信息
- 用户要求分析表单结构并生成文档
- 用户需要提取按钮、下拉框、输入框等交互元素信息
- 用户要求对详情页面或弹窗内容进行字段提取
- 用户提供系统地址并要求提取功能模块的字段信息

## 使用限制

- 仅支持配置了 Chrome DevTools MCP 的浏览器环境
- 需要目标页面可访问且已登录（如需登录）
- 仅支持标准的 HTML 表单元素提取

## 执行流程

### 第一步：系统访问与登录

1. 使用 `mcp_Chrome_DevTools_MCP_new_page` 访问目标地址
2. 如需登录，执行登录操作
3. 使用 `mcp_Chrome_DevTools_MCP_take_snapshot` 确认页面加载状态

### 第二步：模块导航

1. 使用 `mcp_Chrome_DevTools_MCP_take_snapshot` 获取当前页面结构
2. 根据导航菜单结构，依次点击目标模块（如：仓储管理 → 采购管理 → 需求计划单）
3. 使用 `mcp_Chrome_DevTools_MCP_click` 执行点击操作
4. 每次点击后使用快照确认导航结果

### 第三步：字段提取与交互

1. 使用 `mcp_Chrome_DevTools_MCP_take_snapshot` 获取完整页面快照
2. 识别所有表单字段，提取以下信息：
   - 字段名称（LabelText）
   - 输入类型（textbox/combobox/checkbox/radio/button等）
   - 默认值
   - 约束条件（必填/可选/只读）
3. 对每个可交互元素执行点击操作，记录交互前后的状态变化

### 第四步：页面内容完整提取

1. 使用 `mcp_Chrome_DevTools_MCP_evaluate_script` 执行滚动操作：
   ```javascript
   window.scrollTo(0, document.body.scrollHeight)  // 滚动到底部
   window.scrollTo(0, 0)  // 滚动到顶部
   ```
2. 对展开/折叠区域执行展开操作
3. 识别分页控件并执行翻页操作

### 第五步：详情页面处理

1. 识别页面中的"详情"、"查看"等入口按钮
2. 依次点击进入详情页面
3. 对详情页面重复第三步的字段提取操作

### 第六步：截图保存

1. 使用 `mcp_Chrome_DevTools_MCP_take_screenshot` 保存页面截图
   ```javascript
   // 参数配置
   {
     "fullPage": true,  // 是否截取完整页面
     "format": "png",   // 图片格式
     "quality": 100     // 图片质量
   }
   ```
2. 截图文件命名规范：`{功能名称}_{页面类型}_{序号}.png`
   - 例如：`需求计划单_主页面.png`、`需求计划单_新建页面_1.png`

### 第七步：文档生成

生成 Markdown 格式的字段提取文档，包含以下内容：

1. **页面概述**：功能说明和 URL
2. **截图引用**：使用 Markdown 图片引用语法
3. **字段信息表**：

| 序号 | 字段名称 | 输入类型 | 默认值 | 约束条件 | 说明 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 单号 | 文本框 | 空 | 可选 | 支持模糊搜索 |

4. **操作按钮表**：

| 序号 | 按钮名称 | 功能描述 |
| :--- | :--- | :--- |
| 1 | 重置 | 清空所有筛选条件 |

5. **交互说明**：描述操作流程和注意事项

## 常用 MCP 工具清单

| 工具名称 | 功能 | 常用参数 |
| :--- | :--- | :--- |
| `mcp_Chrome_DevTools_MCP_new_page` | 打开新标签页 | url |
| `mcp_Chrome_DevTools_MCP_select_page` | 选择页面 | pageId, bringToFront |
| `mcp_Chrome_DevTools_MCP_take_snapshot` | 获取页面快照 | verbose(true) |
| `mcp_Chrome_DevTools_MCP_take_screenshot` | 页面截图 | filePath, fullPage, format, quality |
| `mcp_Chrome_DevTools_MCP_click` | 点击元素 | uid |
| `mcp_Chrome_DevTools_MCP_fill` | 填写表单 | uid, value |
| `mcp_Chrome_DevTools_MCP_fill_form` | 批量填写表单 | elements[{uid, value}] |
| `mcp_Chrome_DevTools_MCP_evaluate_script` | 执行JS脚本 | function |
| `mcp_Chrome_DevTools_MCP_navigate_page` | 页面导航 | type(url/back/forward/reload), url |
| `mcp_Chrome_DevTools_MCP_wait_for` | 等待页面元素 | text, timeout |

## 字段类型识别

| 快照中的类型 | 实际控件 | 说明 |
| :--- | :--- | :--- |
| textbox | 文本框/输入框 | 支持文本输入 |
| combobox | 下拉框 | 支持单选/多选 |
| checkbox | 复选框 | 支持多选 |
| radio | 单选框 | 支持单选 |
| button | 按钮 | 触发操作 |
| link | 链接 | 页面跳转 |

## 约束条件识别

| 标识 | 含义 |
| :--- | :--- |
| * | 必填字段 |
| 只读/readonly | 只读字段 |
| 可选/空 | 非必填 |
| 自动填充 | 根据其他字段自动计算 |

## 输出文件结构

```
{目标目录}/
├── {功能名称}.md          # 字段提取文档
├── {功能名称}_主页面.png   # 主页面截图
├── {功能名称}_详情页_1.png # 详情页面截图
└── ...
```

## 注意事项

1. 每次页面跳转或重要操作后都应获取新快照确认状态
2. 截图建议使用 `fullPage: true` 获取完整页面内容
3. 对于弹窗或模态框，需先触发显示再进行快照和截图
4. 滚动操作后应等待页面渲染完成再进行下一步
5. 复杂的表格字段可能需要展开所有行才能完整提取

## 示例调用

当用户提供系统地址和要求提取字段时，按以下格式响应：

```
我将使用表单字段提取技能对该页面进行全量字段识别和提取。
预计步骤：
1. 访问目标页面并确认登录状态
2. 导航到目标功能模块
3. 提取所有表单字段和交互元素
4. 执行页面滚动和展开操作确保完整提取
5. 进入详情页面提取详情字段
6. 生成 Markdown 文档并保存截图
```

## 错误处理

- 页面加载延迟：使用 `wait_for` 等待元素出现
- 交互无响应：等待 3-5 秒后重试
- 元素定位失败：检查 uid 是否正确，尝试使用更稳定的选择器
