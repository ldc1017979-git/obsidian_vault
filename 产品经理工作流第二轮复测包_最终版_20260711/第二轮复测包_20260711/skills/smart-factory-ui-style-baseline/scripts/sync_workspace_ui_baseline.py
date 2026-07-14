from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path
from typing import Iterable


BASELINE_DOCS = [
    "数智工厂系统设计风格与交互规范基线.md",
    "数智工厂系统信息架构与原型生成准则.md",
    "工厂端原型生成检查清单.md",
    "系统菜单可见结构总览.md",
    "动作权限与隐藏路由字典.md",
]

HTML_PATTERNS = [
    "*基准校验版*.html",
    "*高保真开发原型*.html",
    "*标注版*.html",
]


def read_text(path: Path) -> str:
    for encoding in ("utf-8-sig", "utf-8", "gb18030"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    return path.read_text(encoding="utf-8", errors="ignore")


def fmt_time(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")


def find_first(workspace: Path, patterns: Iterable[str]) -> list[Path]:
    matches: list[Path] = []
    for pattern in patterns:
        matches.extend(p for p in workspace.rglob(pattern) if "99_过程文件" not in p.parts and "已废弃" not in p.name)
    dedup = sorted({p.resolve() for p in matches}, key=lambda p: p.stat().st_mtime, reverse=True)
    return dedup[:8]


def find_named(workspace: Path, name: str) -> Path | None:
    matches = [p for p in workspace.rglob(name) if "99_过程文件" not in p.parts]
    return sorted(matches, key=lambda p: p.stat().st_mtime, reverse=True)[0] if matches else None


def extract_headings(text: str, limit: int = 30) -> list[str]:
    lines: list[str] = []
    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("#"):
            lines.append(line)
        if len(lines) >= limit:
            break
    return lines


def build_markdown(workspace: Path, baseline_paths: list[Path], html_paths: list[Path]) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lines: list[str] = []
    lines.append("# 工作区 UI 基线同步快照")
    lines.append("")
    lines.append(f"- 同步时间：{now}")
    lines.append(f"- 工作区：`{workspace}`")
    lines.append("")
    lines.append("## 一、基线文档来源")
    lines.append("")
    for path in baseline_paths:
        lines.append(f"- `{path.name}`（{fmt_time(path)}）")
    lines.append("")
    lines.append("## 二、当前工作区可参考的 HTML 样本")
    lines.append("")
    if html_paths:
        for path in html_paths:
            lines.append(f"- `{path.name}`（{fmt_time(path)}）")
    else:
        lines.append("- 未发现可参考的 HTML 样本。")
    lines.append("")
    lines.append("## 三、当前 UI 基线应冻结的重点")
    lines.append("")
    lines.append("1. 固定后台外壳：左侧菜单 + 顶部业务域导航 + Tags-View。")
    lines.append("2. 保持浅灰背景、白色内容容器、Element Plus 风格组件。")
    lines.append("3. 颜色语义固定：蓝主流程、绿新增、黄编辑、红风险。")
    lines.append("4. 页面先判断类型，再决定骨架，不允许把所有页面做成同一种卡片布局。")
    lines.append("5. 表格仍然是后台系统主承载，不允许大量改成展示型卡片流。")
    lines.append("6. 看板页默认也保留后台壳和白底清爽图表风。")
    lines.append("7. 复杂单据和复杂流程页优先独立路由，不塞进小弹窗。")
    lines.append("")
    lines.append("## 四、文档结构快照")
    lines.append("")
    for path in baseline_paths[:3]:
        lines.append(f"### `{path.name}`")
        for heading in extract_headings(read_text(path)):
            lines.append(f"- {heading}")
        lines.append("")
    lines.append("## 五、后续生成页面时的使用方法")
    lines.append("")
    lines.append("1. 先读 `system-ui-style-rules.md`，确认固定 UI 规则。")
    lines.append("2. 再读本文件，确认当前工作区最新基线文档和 HTML 样本。")
    lines.append("3. 开始做页面前，先判断页面类型，再套对应骨架。")
    lines.append("4. 若本次更新了基线文档或代表性 HTML，交付前重新同步一次。")
    lines.append("")
    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="同步数智工厂系统 UI 基线 skill 的工作区快照")
    parser.add_argument("workspace", help="当前项目工作区根目录")
    args = parser.parse_args()

    workspace = Path(args.workspace).expanduser().resolve()
    if not workspace.exists():
        raise SystemExit(f"workspace not found: {workspace}")

    skill_dir = Path(__file__).resolve().parents[1]
    refs_dir = skill_dir / "references"
    output_md = refs_dir / "workspace-ui-baseline-sync.md"
    output_meta = refs_dir / "workspace-ui-baseline-sync-meta.json"

    baseline_paths = [path for name in BASELINE_DOCS if (path := find_named(workspace, name))]
    html_paths = find_first(workspace, HTML_PATTERNS)

    output_md.write_text(build_markdown(workspace, baseline_paths, html_paths), encoding="utf-8")

    meta = {
        "synced_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "workspace": str(workspace),
        "baseline_docs": [
            {"path": str(p), "name": p.name, "mtime": fmt_time(p)} for p in baseline_paths
        ],
        "html_samples": [
            {"path": str(p), "name": p.name, "mtime": fmt_time(p)} for p in html_paths
        ],
        "output": str(output_md),
    }
    output_meta.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Synced UI baseline reference: {output_md}")
    print(f"Metadata written: {output_meta}")


if __name__ == "__main__":
    main()
