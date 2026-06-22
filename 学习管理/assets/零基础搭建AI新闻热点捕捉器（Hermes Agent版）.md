# 一、Hermes Agent 介绍

## Hermes Agent 是什么？

Hermes Agent 是 Nous Research（著名 LLM 实验室，Hermes/Nomos/Psyche 模型的创建者）于 2026 年 2 月发布的开源 AI Agent 框架，定位为"与用户共同成长的代理"

## Hermes Agent 核心亮点

1. 经验提取 — 完成复杂任务后，Agent 自动识别可复用模式
    
2. 技能自动生成 — 写入 Markdown 格式的技能文件（兼容 agentskills.io 开放标准）
    
3. 使用中自我改进 — 技能在后续调用中持续精炼，无需人工干预
    
4. 周期性知识复盘 — Agent 主动 复盘并更新自身知识库
    

## Hermes Agent 接入飞书

第一步：进入飞书开放平台：[点击这里](https://open.feishu.cn/app?lang=zh-CN)

第二步：创建企业自建应用 ➡️ 添加机器人 ➡️ 权限管理配置 ➡️ 事件与回调 ➡️ 版本管理与发布

第三步：拷贝并保存应用凭证（包括App ID 和 App Secret）

第四步：终端输入 hermes setup 进行 飞书接入配置

第五步：打开飞书进行对话使用

# 二、AI新闻热点捕捉器搭建方案

## 第一阶段：环境部署

#### 步骤1：检查并安装依赖

打开 Terminal，依次执行：

```Bash
# 检查 Homebrew（macOS 包管理器）
brew --version
# 如未安装，执行：
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 检查 Python 版本（需要 3.11+）
python3 --version
# 如需升级：
brew install python@3.11

# 检查 Node.js（Hermes 部分工具依赖）
node --version
# 如未安装：
brew install node
```

#### 步骤2：安装 Hermes Agent

```Bash
# 验证安装
hermes --version
# 预期输出：v0.8.x 或更高版本

# macOS 推荐方式
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 刷新环境变量
source ~/.bashrc
source ~/.zshrc

# 验证安装
hermes --version
# 预期输出：v0.8.x 或更高版本
```

#### 步骤3：选择并配置模型

```Bash
hermes model
```

进入交互式选择界面。**推荐提供商选择**：

minimax2.7

kimi k2.5

GLM5.1

opencode go套餐

GitHub Copilot套餐

|   |   |   |
|---|---|---|
|模型|获取 API Key 地址|备注|
|MiniMax 2.7|[https://platform.minimaxi.com](https://platform.minimaxi.com/)|注册后进入「接口密钥」页面创建 API Key|
|Kimi K2.5|[https://platform.kimi.com](https://platform.kimi.com/)|注册并完成组织认证后可创建 API Key|
|GLM 5.1|[https://www.bigmodel.cn](https://www.bigmodel.cn/)|智谱 AI 开放平台，新用户可通过活动链接获得优惠|

> **重要：** 所选模型必须支持 **≥64K tokens** 上下文窗口，Hermes Agent 强制要求。

```Bash
# 配置工具权限（确保以下工具已启用） 
hermes tools 
# 需要启用：web_search, browser, terminal, file_manager
```

---

## 第二阶段：创建项目上下文（核心配置）

#### 步骤4：创建工作目录和上下文文件

```Bash
mkdir -p ~/ai-news-catcher
cd ~/ai-news-catcher
```

#### 步骤5：创建 AGENTS.md（项目上下文文件）

Hermes 会在进入目录后自动加载 `AGENTS.md`，这是最重要的配置文件：

在目录下创建文件夹`~/ai-news-catcher/AGENTS.md`

```Markdown
# AI新闻热点捕捉器项目规范

## 项目目标
每日自动抓取高质量 AI 热点新闻，生成专业中文简报，输出为 Markdown 文档。

## 核心参数 
- 更新频率：每日 08:00 自动执行 
- 精选数量：10 条高质量新闻 
- 输出语言：中文 
- 输出格式：Markdown（~/ai-news-catcher/daily/AI日报_YYYYMMDD.md）
- 去重周期：30 天内已报道内容不重复 

## 关注领域
1. 基础模型研究：新架构、训练方法、论文发布 
2. 开源项目：重要开源发布、重大版本更新 
3. AI 产品落地：具体产品能力更新（非泛泛报道） 
4. 权威观点：LeCun、Karpathy 等研究者的最新观点 
5. 政策监管：重要 AI 政策、监管动向 
6. **低优先级（尽量过滤）**：纯融资新闻、营销软文、未经证实的 rumors

## 数据源 

### 一级来源（直接 RSS / API） 
- 机器之心 RSS：https://www.jiqizhixin.com/rss 
- 量子位 RSS：https://www.qbitai.com/rss 
- Hacker News AI 相关：https://hnrss.org/newest?q=AI+LLM&count=20 
- arXiv cs.AI：http://arxiv.org/rss/cs.AI 
- The Gradient：https://thegradient.pub/rss/ #

## 二级来源（网页搜索） 
- Reddit r/MachineLearning（通过 web_search） 
- Hugging Face blog（通过 web_search） 
- OpenAI / Anthropic / Google DeepMind 官方博客 
  
### 三级来源（社交媒体，可靠性较低） 
- X/Twitter 关键账号：@ylecun, @karpathy, @sama 
- 仅在搜索到具体技术内容时引用，不引用纯观点推文 

## 质量评分标准（10 分制） 
- 技术创新性（0-4 分）：是否有新的技术突破或方法论 
- 行业影响力（0-3 分）：是否影响产业发展方向 
- 信息可信度（0-3 分）：来源是否权威、内容是否可验证 
- **阈值：≥7 分才纳入简报**

## 输出格式模板(每条新闻)

{序号}. {标题}
**核心洞察**：{50字内，说明技术/商业意义/对社会变革影响，不复述标题}
**内容摘要**：{150-200字，突出技术细节或事实数据}
**原文链接**：[查看原文]
**来源**：{平台} | **质量评分**：{score}/10 | **分类**：{大模型/AI应用/硬件/政策/研究/开源}

## 文件命名规则
AI日报_YYYYMMDD.md
存储路径：~/ai-news-catcher/daily/

## 去重规则
- 将已处理新闻的 URL 和标题的 MD5 哈希值存储在 ~/ai-news-catcher/dedup_cache.json 
- 每次执行前加载，执行后更新 
- 缓存保留最近 30 天的记录
  
## 执行完成后 在 terminal 中输出： 
- 抓取源数量 
- 原始新闻总数 
- 过滤后条数 
- 生成文件路径
```

Pasted image 20260416152053.png

#### 步骤6：创建用户偏好记忆文件（持久化偏好）

```Bash
# 创建用户记忆，让Agent记住你的偏好
mkdir -p ~/.hermes/memory
```

创建 `~/.hermes/memory/USER.md`：

```Markdown
## 用户背景
- 职业：AI 领域自媒体创作者，关注 AI 热点新闻
- 内容输出方向：面向中文用户的 AI 专业解读
- 技术水平：具备基础技术理解能力，但重点在内容价值而非复现细节

## 内容偏好
- **最高优先**：底层技术突破（新模型架构、训练范式、重要论文）
- **高优先**：重要开源发布、产品能力具体更新
- **中优先**：权威研究者的深度观点
- **低优先**：融资新闻、公司公关稿、重复性行业报告

## 质量判断
- 高价值信号：有数据支撑、有代码/演示、有可验证事实
- 低价值信号：仅有 PR 稿语气、无实质信息、来源单一

## 写作风格要求
- 摘要语气：专业严谨，避免营销腔
- 趋势洞察：直接指出技术/商业的本质意义，不要说"这很重要"这类空话
- 标题处理：保持原意，必要时补充背景括注

## 反馈记录
（Agent 在执行任务后可在此追加用户反馈，用于优化后续执行策略）
```

Pasted image 20260416152146.png

---

## 第三阶段：创建核心 Python 脚本

> **关键说明：** 这个 Python 脚本是**独立运行的工具脚本**，由 Hermes Agent 通过 terminal 工具调用执行，而非被注入 API 函数。脚本自身使用标准 Python 库，不依赖任何 Hermes 私有函数。

#### 步骤7：安装 Python 依赖

```Bash
pip3 install requests feedparser python-dateutil
```

#### 步骤8：创建新闻抓取脚本

```Plain
cat > ~/ai-news-catcher/scripts/fetch_news.py << 'PYEOF'
#!/usr/bin/env python3
"""
AI 新闻热点捕捉器 - 核心抓取脚本
独立运行，由 Hermes Agent 通过 terminal 工具调用
"""

import feedparser
import hashlib
import json
import os
import sys
import requests
from datetime import datetime, timedelta, timezone

# ─── 配置 ────────────────────────────────────────────────────────────────────

RSS_SOURCES = {
    "机器之心":      "https://www.jiqizhixin.com/rss",
    "量子位":        "https://www.qbitai.com/rss",
    "Hacker News AI": "https://hnrss.org/newest?q=AI+LLM+GPT+Claude&count=20",
    "arXiv cs.AI":   "http://arxiv.org/rss/cs.AI",
    "The Gradient":  "https://thegradient.pub/rss/",
}

OUTPUT_DIR   = os.path.expanduser("~/ai-news-catcher/daily")
DEDUP_FILE   = os.path.expanduser("~/ai-news-catcher/dedup_cache.json")
DEDUP_DAYS   = 30   # 去重缓存保留天数
MAX_PER_SOURCE = 8  # 每个 RSS 源最多抓取条数
REQUEST_TIMEOUT = 10

# ─── 去重缓存 ─────────────────────────────────────────────────────────────────

def load_dedup_cache() -> dict:
    """加载去重缓存，返回 {hash: timestamp} 字典"""
    if os.path.exists(DEDUP_FILE):
        with open(DEDUP_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_dedup_cache(cache: dict):
    """保存去重缓存，自动清理过期条目"""
    cutoff = (datetime.now() - timedelta(days=DEDUP_DAYS)).isoformat()
    cleaned = {k: v for k, v in cache.items() if v >= cutoff}
    os.makedirs(os.path.dirname(DEDUP_FILE), exist_ok=True)
    with open(DEDUP_FILE, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)

def make_hash(title: str, url: str) -> str:
    return hashlib.md5(f"{title.strip()}{url.strip()}".encode()).hexdigest()[:12]

# ─── RSS 抓取 ─────────────────────────────────────────────────────────────────

def fetch_rss(source_name: str, url: str) -> list[dict]:
    """解析单个 RSS 源，返回标准化新闻列表"""
    try:
        # feedparser 直接处理 HTTP 请求
        feed = feedparser.parse(url, request_headers={"User-Agent": "Mozilla/5.0"})
        items = []
        for entry in feed.entries[:MAX_PER_SOURCE]:
            title   = entry.get("title", "").strip()
            link    = entry.get("link", "").strip()
            summary = entry.get("summary", entry.get("description", "")).strip()
            # 清理 HTML 标签（简单处理）
            import re
            summary = re.sub(r"<[^>]+>", "", summary)[:800]

            if not title or not link:
                continue

            items.append({
                "hash":    make_hash(title, link),
                "title":   title,
                "url":     link,
                "summary": summary,
                "source":  source_name,
                "fetched_at": datetime.now().isoformat(),
            })
        print(f"  ✓ {source_name}: {len(items)} 条", flush=True)
        return items
    except Exception as e:
        print(f"  ✗ {source_name} 抓取失败: {e}", flush=True)
        return []

def fetch_all_sources() -> list[dict]:
    """并发抓取所有 RSS 源"""
    all_items = []
    for name, url in RSS_SOURCES.items():
        items = fetch_rss(name, url)
        all_items.extend(items)
    return all_items

# ─── 去重过滤 ─────────────────────────────────────────────────────────────────

def deduplicate(items: list[dict], cache: dict) -> tuple[list[dict], dict]:
    """过滤已见过的新闻，返回（新鲜新闻列表，更新后缓存）"""
    fresh = []
    for item in items:
        if item["hash"] not in cache:
            fresh.append(item)
            cache[item["hash"]] = datetime.now().isoformat()
    return fresh, cache

# ─── 输出到 JSON（供 Hermes Agent 分析用）─────────────────────────────────────

def export_for_analysis(items: list[dict]) -> str:
    """将新鲜新闻输出到临时 JSON 文件，路径返回给调用者"""
    tmp_path = os.path.expanduser("~/ai-news-catcher/pending_analysis.json")
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    return tmp_path

# ─── 主流程 ──────────────────────────────────────────────────────────────────

def main():
    print("=" * 50, flush=True)
    print(f"AI 新闻抓取器启动 | {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", flush=True)
    print("=" * 50, flush=True)

    # 1. 加载去重缓存
    cache = load_dedup_cache()
    print(f"去重缓存已加载：{len(cache)} 条历史记录", flush=True)

    # 2. 抓取所有来源
    print("\n正在抓取 RSS 源...", flush=True)
    all_items = fetch_all_sources()
    print(f"\n共抓取 {len(all_items)} 条原始新闻", flush=True)

    # 3. 去重
    fresh_items, updated_cache = deduplicate(all_items, cache)
    print(f"去重后剩余 {len(fresh_items)} 条新鲜新闻", flush=True)

    # 4. 保存更新的去重缓存
    save_dedup_cache(updated_cache)

    if not fresh_items:
        print("\n⚠️ 今日无新鲜新闻，跳过生成", flush=True)
        sys.exit(0)

    # 5. 导出 JSON 供 Hermes 分析
    json_path = export_for_analysis(fresh_items)
    print(f"\n✅ 新鲜新闻已导出至：{json_path}", flush=True)
    print(f"   共 {len(fresh_items)} 条待分析", flush=True)
    print("\n请让 Hermes Agent 读取上述文件，完成质量评分和简报生成。", flush=True)

if __name__ == "__main__":
    main()
PYEOF

chmod +x ~/ai-news-catcher/scripts/fetch_news.py
```

#### 步骤9：创建简报生成脚本

```Bash
cat > ~/ai-news-catcher/scripts/generate_report.py << 'PYEOF'
#!/usr/bin/env python3
"""
简报生成脚本
接收 Hermes Agent 分析后的 JSON 数据，生成 Markdown 简报
用法：python3 generate_report.py <analyzed_json_path>
"""

import json
import sys
import os
from datetime import datetime

def generate_markdown(news_list: list[dict]) -> str:
    today = datetime.now().strftime("%Y年%m月%d日")
    weekdays = ["周一","周二","周三","周四","周五","周六","周日"]
    weekday = weekdays[datetime.now().weekday()]

    md = f"""# 🤖 AI 热点日报 | {today}（{weekday}）

> 精选 {len(news_list)} 条高质量 AI 新闻 · 聚焦技术突破与行业趋势

---

"""
    for idx, news in enumerate(news_list, 1):
        score = news.get("quality_score", "N/A")
        category = news.get("category", "未分类")
        insight = news.get("trend_insight", "")
        summary = news.get("summary", news.get("raw_summary", ""))
        title = news.get("title", "")
        url = news.get("url", news.get("link", "#"))
        source = news.get("source", "未知来源")

        md += f"""### {idx}. {title}

**核心洞察**：{insight}

**内容摘要**：{summary}

**原文链接**：[查看原文]({url})

**来源**：{source} | **质量评分**：{score}/10 | **分类**：{category}

---

"""

    md += f"""
*本简报由 Hermes Agent 自动生成 · {datetime.now().strftime("%Y-%m-%d %H:%M")}*

*数据来源：机器之心、量子位、Hacker News、arXiv 等*
"""
    return md


def main():
    if len(sys.argv) < 2:
        print("用法：python3 generate_report.py <analyzed_json_path>")
        sys.exit(1)

    json_path = sys.argv[1]
    if not os.path.exists(json_path):
        print(f"错误：文件不存在 {json_path}")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        news_list = json.load(f)

    # 筛选质量达标的新闻（≥7分），按分数排序，取前10
    qualified = [n for n in news_list if n.get("quality_score", 0) >= 7]
    qualified.sort(key=lambda x: x.get("quality_score", 0), reverse=True)
    top10 = qualified[:10]

    if not top10:
        print("⚠️ 无质量达标（≥7分）的新闻")
        sys.exit(0)

    markdown = generate_markdown(top10)

    output_dir = os.path.expanduser("~/ai-news-catcher/daily")
    os.makedirs(output_dir, exist_ok=True)
    filename = f"AI日报_{datetime.now().strftime('%Y%m%d')}.md"
    filepath = os.path.join(output_dir, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(markdown)

    print(f"✅ 简报已生成：{filepath}")
    print(f"   共收录 {len(top10)} 条新闻（从 {len(news_list)} 条中筛选）")

if __name__ == "__main__":
    main()
PYEOF

chmod +x ~/ai-news-catcher/scripts/generate_report.py
```

---

## 第四阶段：创建 Hermes Skill 文件

#### 步骤10：创建符合 agentskills.io 标准的 Skill

Hermes 的 Skill 是 **Markdown 流程描述文件**，不是 Python 配置文件。

````Bash
mkdir -p ~/.hermes/skills/ai-news-catcher

cat > ~/.hermes/skills/ai-news-catcher/ai-news-catcher.md << 'EOF'
# Skill: AI 新闻热点捕捉器

## 描述
每日自动抓取多平台 AI 热点新闻，经过质量评分筛选后，生成专业中文简报。

## 触发条件
- 用户要求"生成今日 AI 日报"
- 用户要求"抓取 AI 新闻"
- 定时任务触发

## 执行流程

### Step 1：运行抓取脚本
在 terminal 中执行：
```bash
cd ~/ai-news-catcher && python3 scripts/fetch_news.py
```
观察输出，确认各 RSS 源的抓取状态。脚本会生成 `~/ai-news-catcher/pending_analysis.json`。

### Step 2：读取待分析新闻
读取 `~/ai-news-catcher/pending_analysis.json` 文件内容。
对每条新闻进行质量评估（参照 AGENTS.md 中的质量标准）：
- 依据标题、摘要内容判断是否有技术实质
- 过滤明显的营销软文和 rumors
- 为每条新闻添加字段：
  - `quality_score`（1-10整数）
  - `trend_insight`（50字内核心洞察）
  - `summary`（150-200字专业摘要）
  - `category`（大模型/AI应用/硬件/政策/研究/开源）

### Step 3：保存分析结果
将分析后的 JSON 数据写回 `~/ai-news-catcher/pending_analysis.json`（覆盖）。

### Step 4：生成简报
```bash
python3 ~/ai-news-catcher/scripts/generate_report.py ~/ai-news-catcher/pending_analysis.json
```

### Step 5：验证输出
检查 `~/ai-news-catcher/daily/` 目录，确认 Markdown 文件已生成并内容格式正确。

## 错误处理
- 若某个 RSS 源抓取失败，继续其他源，不中断整体流程
- 若今日无质量达标新闻（少于3条≥7分），告知用户并询问是否降低阈值
- 若脚本依赖缺失，提示用户执行：`pip3 install requests feedparser python-dateutil`

## 输出
成功时告知用户：
- 生成文件路径
- 收录新闻条数
- 最高质量评分
EOF
````

---

## 第五阶段：配置定时自动化

#### 步骤11：通过对话设置定时任务

进入 Hermes：

bash

```Bash
cd ~/ai-news-catcher hermes
```

在对话中输入（自然语言）：

```Plain
每天早上 8 点，进入 ~/ai-news-catcher 目录，加载 ai-news-catcher 技能，执行 AI 新闻抓取和简报生成任务。
```

Hermes 会自动：

1. 创建系统级 cron 任务
    
2. 确认调度配置
    
3. 给出任务 ID，方便后续管理
    

> 1. **验证定时任务：**
>     
> 2. `crontab -l # 查看系统 cron 中是否有对应条目`
>     

#### 步骤12：Telegram 推送配置（可选）

如需在简报生成后自动推送到 feishu：

bash

```Bash
hermes gateway setup
# 按提示选择 feishu
# 配置 Bot Token（从 @BotFather 获取）
hermes gateway start
```

然后在 Hermes 对话中告知：

```Plain
每次 AI 日报生成后，把文件内容通过 feishu 发送给我。
```

---

## 第六阶段：测试与验证

#### 步骤13：手动测试完整流程

bash

```Bash
# 1. 进入项目目录，启动 Hermes
cd ~/ai-news-catcher
hermes

# 2. 在对话中触发技能
```

在 Hermes 对话中输入：

```Plain
请现在执行一次 AI 新闻抓取，生成今日简报。
```

Agent 会按照 Skill 文件描述的流程逐步执行，你可以实时观察每一步的输出。

#### 步骤14：验证输出文件

```Bash
# 查看生成的简报
ls -la ~/ai-news-catcher/daily/
cat ~/ai-news-catcher/daily/AI日报_$(date +%Y%m%d).md

# 查看去重缓存
cat ~/ai-news-catcher/dedup_cache.json | python3 -m json.tool | head -30
```

---

## 第七阶段：反馈与自我优化

#### 步骤15：建立反馈循环

每次简报生成后，在 Hermes 对话中给出反馈：

```Plain
今天第3条关于 Llama 4 的新闻质量很好，下次优先关注 Meta AI 的相关动态。
第7条是营销软文，以后来自这个来源的内容质量评分默认降低。
```

Hermes 会将你的偏好写入记忆，下次执行时自动调整。

#### 步骤16：安装官方扩展 Skill（可选）

```Bash
`# 在 Hermes 中搜索相关技能 
hermes skills search news hermes skills search rss 
# 如有合适的官方 Skill，可直接安装并与自定义流程结合 
hermes skills install official/news/aggregator`
```

---

## 完整文件结构速查

```Plain
~/ai-news-catcher/
├── AGENTS.md                    # 项目规范（Hermes 自动加载）
├── dedup_cache.json             # 去重缓存（自动生成）
├── pending_analysis.json        # 待分析新闻（中间文件，自动生成）
├── scripts/
│   ├── fetch_news.py            # RSS 抓取脚本（独立运行）
│   └── generate_report.py       # 简报生成脚本（独立运行）
└── daily/
    ├── AI日报_20260416.md
    └── AI日报_20260417.md ...

~/.hermes/
├── memory/
│   └── USER.md                  # 用户偏好记忆
└── skills/
    └── ai-news-catcher/
        └── ai-news-catcher.md   # Skill 流程描述文件
```

---

## 关键命令速查表

|   |   |
|---|---|
|操作|命令|
|启动 Hermes|hermes|
|切换模型|hermes model|
|配置工具|hermes tools|
|配置记忆|hermes memory setup|
|配置消息推送|hermes gateway setup|
|恢复上次会话|hermes --continue 或 hermes -c|
|更新 Hermes|hermes update|
|诊断问题|hermes doctor|
|查看系统 cron|crontab -l|
|手动测试抓取|python3 ~/ai-news-catcher/scripts/[fetch_news.py](http://fetch_news.py)|

# 三、安装Claude code

本地安装Claude code ，同时安装cc switch。

```Bash
# 官方推荐指令
curl -fsSL https://claude.ai/install.sh | bash

# macos 推荐指令
brew install --cask claude-code

# cc switch 官方github : https://github.com/farion1231/cc-switch/releases
# macOS 安装指令
brew tap farion1231/ccswitch
brew install --cask cc-switch
brew upgrade --cask cc-switch
```

# 四、提示词

```Markdown
请读取文件 `AI新闻热点捕捉器搭建方案.md`，
这是一份完整的部署方案文档。

请按照文档中的步骤顺序，
从「第二阶段：创建项目上下文」开始，逐阶段在我的 macOS 上完成实际部署。

执行规则：
1. 每个步骤执行前告诉我你要做什么
2. 执行命令后等待结果再继续下一步
3. 遇到错误立即停下来告知我，不要跳过
4. 所有文件内容必须完整写入，不能用省略号代替
5. 全部完成后输出 tree ~/ai-news-catcher 验证目录结构
```