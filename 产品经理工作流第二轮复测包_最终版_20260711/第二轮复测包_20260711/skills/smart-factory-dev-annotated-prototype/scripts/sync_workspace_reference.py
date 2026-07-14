from __future__ import annotations

import argparse
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Iterable


BASELINE_FILES = [
    "数智工厂系统信息架构与原型生成准则.md",
    "数智工厂系统设计风格与交互规范基线.md",
    "工厂端原型生成检查清单.md",
    "系统菜单可见结构总览.md",
    "动作权限与隐藏路由字典.md",
]

STATUS_KEYWORDS = [
    "待提交",
    "待审批",
    "待员工确认",
    "已完成",
    "已申诉",
    "已驳回",
    "草稿",
]

PAGE_KEYWORDS = [
    "积分申请管理",
    "新增积分申请",
    "积分核销管理",
    "新增积分核销",
    "积分设置",
    "积分明细台账",
    "福利核销申请",
    "我的积分申请",
    "我的核销单",
    "待我确认",
]

ACTION_KEYWORDS = [
    "审批",
    "确认",
    "申诉",
    "编辑重提",
    "取消关联",
    "查看单据",
    "发起积分申请",
    "发起核销",
]


def read_text(path: Path) -> str:
    for encoding in ("utf-8-sig", "utf-8", "gb18030"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    return path.read_text(encoding="utf-8", errors="ignore")


def find_first(workspace: Path, patterns: Iterable[str]) -> Path | None:
    for pattern in patterns:
        matches = [p for p in workspace.rglob(pattern) if "99_过程文件" not in p.parts and "已废弃" not in p.name]
        matches = sorted(matches, key=lambda p: p.stat().st_mtime, reverse=True)
        if matches:
            return matches[0]
    return None


def find_named(workspace: Path, name: str) -> Path | None:
    matches = [p for p in workspace.rglob(name) if "99_过程文件" not in p.parts]
    return sorted(matches, key=lambda p: p.stat().st_mtime, reverse=True)[0] if matches else None


def extract_headings(markdown: str, limit: int = 40) -> list[str]:
    lines = []
    for raw in markdown.splitlines():
        line = raw.strip()
        if re.match(r"^#{1,6}\s+", line):
            lines.append(line)
        if len(lines) >= limit:
            break
    return lines


def extract_rule_lines(markdown: str, limit: int = 50) -> list[str]:
    results: list[str] = []
    for raw in markdown.splitlines():
        line = raw.strip()
        if not line:
            continue
        if re.match(r"^[-*]\s+", line) or re.match(r"^[0-9]+\.\s+", line):
            normalized = re.sub(r"^[-*]\s+", "", line)
            results.append(normalized)
        if len(results) >= limit:
            break
    return results


def html_plain_text(html: str) -> str:
    text = re.sub(r"(?is)<script.*?>.*?</script>", " ", html)
    text = re.sub(r"(?is)<style.*?>.*?</style>", " ", text)
    text = re.sub(r"(?s)<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def extract_keywords(text: str, keywords: list[str]) -> list[str]:
    found: list[str] = []
    for item in keywords:
        if item in text and item not in found:
            found.append(item)
    return found


def fmt_time(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")


def build_markdown(
    workspace: Path,
    module_keyword: str,
    source_files: dict[str, Path | None],
    baseline_files: list[Path],
) -> str:
    prd_path = source_files.get("prd")
    review_path = source_files.get("review")
    html_path = source_files.get("html")

    prd_headings = extract_headings(read_text(prd_path)) if prd_path else []
    review_rules = extract_rule_lines(read_text(review_path)) if review_path else []

    html_statuses: list[str] = []
    html_pages: list[str] = []
    html_actions: list[str] = []
    if html_path:
        html_text = html_plain_text(read_text(html_path))
        html_statuses = extract_keywords(html_text, STATUS_KEYWORDS)
        html_pages = extract_keywords(html_text, PAGE_KEYWORDS)
        html_actions = extract_keywords(html_text, ACTION_KEYWORDS)

    sync_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines: list[str] = []
    lines.append("# 工作区最新同步快照")
    lines.append("")
    lines.append(f"- 同步时间：{sync_time}")
    lines.append(f"- 工作区：`{workspace}`")
    lines.append(f"- 模块关键词：`{module_keyword}`")
    lines.append("")
    lines.append("## 一、当前同步源")
    lines.append("")
    for label in ("prd", "html", "review"):
        path = source_files.get(label)
        if path:
            label_name = {"prd": "最新 PRD", "html": "最新业务逻辑标注版 HTML", "review": "最新复盘/能力提升报告"}[label]
            lines.append(f"- {label_name}：`{path.name}`（{fmt_time(path)}）")
    if baseline_files:
        lines.append("- 系统基线文件：")
        for path in baseline_files:
            lines.append(f"  - `{path.name}`（{fmt_time(path)}）")
    lines.append("")
    lines.append("## 二、当前工作区应优先遵守的口径")
    lines.append("")
    lines.append("1. 业务规则只以本轮原始资料、产品确认和当前有效 PRD 为依据。")
    lines.append("2. 当前工作区若已有更新后的 PRD、HTML、复盘报告，则以这些文件中的最新约束覆盖旧印象。")
    lines.append("3. 页面标注和原型修正时，必须先校对页面业务目的、状态流转、按钮结果、配置反向影响，再去看字段。")
    lines.append("")
    lines.append("## 三、最新 PRD 结构快照")
    lines.append("")
    if prd_headings:
        for item in prd_headings:
            lines.append(f"- {item}")
    else:
        lines.append("- 未找到可读取的 PRD。")
    lines.append("")
    lines.append("## 四、最新复盘/修正规则快照")
    lines.append("")
    if review_rules:
        for item in review_rules:
            lines.append(f"- {item}")
    else:
        lines.append("- 未找到可读取的复盘/能力提升报告。")
    lines.append("")
    lines.append("## 五、最新 HTML 原型快照")
    lines.append("")
    if html_path:
        lines.append(f"- HTML 文件：`{html_path.name}`")
        lines.append(f"- 检测到的关键页面：{('、'.join(html_pages) if html_pages else '未识别')}")
        lines.append(f"- 检测到的关键状态：{('、'.join(html_statuses) if html_statuses else '未识别')}")
        lines.append(f"- 检测到的关键动作：{('、'.join(html_actions) if html_actions else '未识别')}")
    else:
        lines.append("- 未找到业务逻辑标注版 HTML。")
    lines.append("")
    lines.append("## 六、本次生成/修正时的直接使用方式")
    lines.append("")
    lines.append("执行开发标注任务前，默认按以下顺序：")
    lines.append("")
    lines.append("1. 先读本轮原始资料和当前有效 PRD，确认业务边界。")
    lines.append("2. 再读本文件，确认当前工作区的新修正、新命名和新限制。")
    lines.append("3. 如果 PRD、HTML、复盘里出现更细的新口径，则优先按最新文件落地。")
    lines.append("4. 生成原型或标注后，回到当前工作区页面逐页核对是否与这些最新约束一致。")
    lines.append("")
    lines.append("## 七、需要重点复核的典型区域")
    lines.append("")
    lines.append("- 积分申请：单人/多人申请、积分类型、分值标准、关联单据、状态与操作关系。")
    lines.append("- 积分核销：福利名称、扣减积分、审批与员工确认去留、员工入口是否隐藏。")
    lines.append("- 积分设置：积分类型与积分福利设置的命名、列表字段、弹窗字段是否同步。")
    lines.append("- 积分明细台账：事由来源是否真实、变动积分是否颜色区分。")
    lines.append("- 审批详情：操作日志、审批流程、审批弹窗样式是否按正式系统表达。")
    lines.append("")
    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="同步数智工厂开发标注原型 skill 的工作区参考快照")
    parser.add_argument("workspace", help="当前项目工作区根目录")
    parser.add_argument("--module-keyword", default="积分管理", help="模块关键词，默认：积分管理")
    args = parser.parse_args()

    workspace = Path(args.workspace).expanduser().resolve()
    if not workspace.exists():
        raise SystemExit(f"workspace not found: {workspace}")

    skill_dir = Path(__file__).resolve().parents[1]
    refs_dir = skill_dir / "references"
    output_md = refs_dir / "workspace-sync.md"
    output_meta = refs_dir / "workspace-sync-meta.json"

    source_files = {
        "prd": find_first(
            workspace,
            [
                f"*{args.module_keyword}*PRD*.md",
            ],
        ),
        "html": find_first(
            workspace,
            [
                f"*{args.module_keyword}*业务逻辑标注版*.html",
                f"*{args.module_keyword}*标注版*.html",
                f"*{args.module_keyword}*.html",
            ],
        ),
        "review": find_first(
            workspace,
            [
                f"*{args.module_keyword}*复盘*.md",
                f"*{args.module_keyword}*能力提升报告*.md",
                "*复盘*.md",
                "*能力提升报告*.md",
            ],
        ),
    }

    baseline_files = [path for name in BASELINE_FILES if (path := find_named(workspace, name))]
    markdown = build_markdown(workspace, args.module_keyword, source_files, baseline_files)
    output_md.write_text(markdown, encoding="utf-8")

    meta = {
        "synced_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "workspace": str(workspace),
        "module_keyword": args.module_keyword,
        "sources": {
            key: (
                {
                    "path": str(path),
                    "name": path.name,
                    "mtime": fmt_time(path),
                }
                if path
                else None
            )
            for key, path in source_files.items()
        },
        "baseline_files": [
            {
                "path": str(path),
                "name": path.name,
                "mtime": fmt_time(path),
            }
            for path in baseline_files
        ],
        "output": str(output_md),
    }
    output_meta.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Synced workspace reference: {output_md}")
    print(f"Metadata written: {output_meta}")


if __name__ == "__main__":
    main()
