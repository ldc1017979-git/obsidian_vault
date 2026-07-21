---
name: dianjian-yhl-skills
description: Generate YHL market-activity上线点检表 from activity rules, requirements, Excel templates, or knowledge-base notes. Use when the user asks to create, upgrade, validate, print, or reorganize a market activity checklist, especially for 前端/后端分板块, 活动上线验收, 系统配置点检, 活动规则覆盖验证, or avoiding遗漏.
---

# dianjian-yhl-skills

## Overview

Use this skill to turn market activity documents into a printable, execution-ready上线点检表. The expected result is not a generic checklist: it must be activity-specific, grouped by how people actually verify it, and validated for missing or duplicated items.

Default to the YHL standard unless the user explicitly overrides it:

- Output both Markdown preview and Excel workbook when practical.
- The delivered print/execution workbook should expose only one practical tab by default: `打印填写版`. Risk, basis, detail, coverage, and validation sheets may be generated for QA, but must be hidden or delivered separately so the executor does not see a crowded workbook.
- Use a detailed version by default.
- Use only these execution owners: 后端配置人员 and 前端业务验证. 后端配置人员只负责后台配置、码批次、奖池、商户号、流水/导出等系统配置确认；其他页面、扫码、实物标识、确认记录、规则一致性都归入前端业务验证.
- Use `测试` as the default environment label; this is an environment value, not an execution owner.
- Keep the printable result column blank for handwritten `√`, `×`, or `-`.
- Keep the remarks column blank unless the user asks for prompts.
- Never replace detail rows with a single merged summary row.
- Do not add a standalone test-data preparation sheet by default; only add one if the user asks for it.

## Workflow

1. Gather sources.
   - Use attached files first.
   - If the user says 知识库, Obsidian, vault, or asks to use local notes, invoke the knowledge-base skill and search the vault.
   - Read activity rules, development requirements, field summaries, previous checklist templates, and any user screenshots that define formatting.
   - Resolve conflicts by priority: user's latest confirmation > current activity rules > development requirements > annual activity summaries/field notes > historical templates.

2. Extract the activity口径.
   Capture at minimum: activity name, activity type, environment, code-entry-specific start/end time, coupon validity, exchange deadline, regions, excluded regions, product/SKU, code types, code prefixes, merchant scope, 核销商户号, 支付商户号, prize/coupon pools, winning rate, scan limits, authorization requirements, payment/核销 flow, reward type, red packet/withdrawal rules, scan exception states, data exports, dashboards, alerts, customer service/risk/compliance text, and stop/archive rules.
   Treat time fields as serving a specific code/reward path, not as free-floating global rows. In checklist item rows, time and validity checks must bind to a concrete `码入口` such as 箱内码, 拉环内码, 拉环外码, 产品券, 1元换购券, 商户核销, or 消费者扫码. Do not use `全局` for time rows unless the row is only metadata in `活动基础口径`, not a formal checklist item.
   Treat reward types as activity-specific but from a stable family: 红包, 产品券, 1元换购券, 积分额度/能量额度, and high-value prizes. Always use the exact activity rule for amount, validity, threshold, and usage scope.

3. Identify confirmation risks.
   Make a short list of conflicting, missing, or customer/business-confirmed口径. Do not block the checklist if the user says 客户/业务 will confirm one final口径 before验收; instead add these to a risk/confirmation sheet.

4. Build detailed checklist rows.
   Every source rule that can cause a production issue should become a check item unless it is truly duplicate wording. Preserve detail rows even when several rows can be verified in one operation.
   The printable checklist has only one job: let the responsible person mark each numbered item as pass, fail, or not applicable after executing it. Numbered rows must not be explanations, testing guidance, reminders, coverage summaries, or "how this checklist should be used" notes. If a row cannot be judged with `√ / × / -`, remove it from the printable table or rewrite it into one or more concrete check items.
   Each row must be clear enough for the assigned executor to act without guessing. A row must answer: what object/path to check, what exact field or scenario to check, what the expected result is, and how to verify it. Avoid broad labels such as 配置预览校验, 真实性校验, 合规文案, 后台流水, 数据看板, 数据导出 unless the standard names the exact fields or the row is split into specific child rows.
   Pure metadata that is already shown in the workbook title/header or 活动基础口径 sheet, such as 后台活动名称/项目名称, should not become a numbered checklist row unless the activity name itself controls a system route, consumer-visible page selection, or another production-risk configuration.

   Separate system responsibility from page/rule verification:
   - If a rule describes an offline action, physical object, legal statement, prize market value, or business explanation that is not performed by the system, do not turn it into a system functional test.
   - If that same information appears on an activity page, rule page, popup, or scan result page, add a 页面文案核对 / 规则一致性核对 item to verify that the displayed content matches the rule.
   - If the platform/template has fields that are not used by this activity, add a `不涉及/确认未配置` item when residue could cause a production issue.
   - Time checks must be split or explicitly attributed by code/reward path. For example, write 箱内码活动开始时间, 箱内码活动结束时间, 拉环外码促销扫码截止日, 产品券有效期, or 商户核销截止日. If the same date applies to several paths, prefer separate rows; if combining is truly clearer, set `码入口` to the explicit list such as `箱内码、拉环码`, never `全局`.
   - Keep this checklist scoped to consumer and merchant-facing activity responsibilities. Do not automatically include tertiary customer, secondary customer, distributor, or other upstream reward/deadline fields unless the current activity rule explicitly makes them part of the consumer/merchant flow or the user asks for that separate project checklist.
   - High-value prizes are mandatory checks when present, including identity collection, claim deadline, tax/withholding text or configuration, value cap, delivery/sign-off status, and page copy.
   - 集能量 / 再抽奖 must be generated as an independent checklist when requested or when the activity is primarily that engine. It may reference the source consumer promotion, but it must not be merged into a normal 红包/1元换购 checklist.

   For any activity involving 箱内码扫码 or 消费者参与扫码, explicitly evaluate the scan exception scene library in `references/checklist-standard.md`: 二维码未激活, 超活动范围, 重复扫码, 已被他人扫码, 单日活动上限, 单月活动上限, 活动已结束. Use the scan limits from the current activity rules; if limits are absent from the rule but appear in screenshots, requirements, or platform configuration, mark them as 客户/业务确认项 instead of guessing. Add only the scenes supported by the activity rules or known platform behavior, but do not forget to consider them.

5. Reorder the checklist by execution path.
   The main detail table must be divided into two large blocks:
   - 后端配置确认: for 后端配置人员 to verify admin configuration, code types, merchants, payment, awards, data, and system capabilities.
   - 前端业务验证: for front-end/business verification staff to verify pages, scan paths, business copy, physical/confirmation records, rule consistency, win/not win, limit, repeat scan, region,核销, red packet, and exception scenarios.

   Under each block, group consecutive detail rows by a one-time verification scene, for example `箱内码红包活动配置`, `商户号、支付与奖励配置`, or `拉环中奖 / 未中奖领券流程`. The group row is a divider only; the detail items below it remain separate rows.

6. Produce the outputs.
   - Markdown preview: show structure, key rows, risks, and assumptions.
   - Excel workbook: printable first sheet as the only visible execution tab by default. Keep internal supporting sheets hidden or separate.
   - Coverage validation report: list source coverage and row-count checks.

7. Validate before final response.
   Confirm item count, unique IDs, no duplicate IDs, no ungrouped rows, no filled result/remarks cells in the printable sheet, no time items with `码入口=全局`, no non-check explanatory rows, no content clarity risks, and that the main table is grouped by execution path instead of using a separate summary-only index.

## Printable Sheet Standard

Read `references/checklist-standard.md` before creating, validating, or revising any checklist. It contains the business boundary rules, scenario libraries, workbook format, supporting sheets, and validation requirements. Core rules:

- First visible sheet name: `打印填写版`.
- Recommended columns: `编号 / 模块 / 码入口 / 检查项 / 检查标准 / 本次口径 / 验证动作 / 结果 / 备注`. If space is tight, combine `检查标准 / 本次口径`.
- Add divider rows for `大板块：后端配置确认` and `大板块：前端业务验证`.
- Add group rows like `一次性验证分组：箱内码红包活动配置`.
- Put the result legend on divider/group rows: `结果填写：√通过 / ×不通过 / -不涉及`.
- Result cells in item rows stay blank.
- Remarks cells in item rows stay blank.
- Keep visible tabs realistic for execution: normally only `打印填写版`. Hide `上线前风险确认`, `活动基础口径`, `上线点检表`, `资料覆盖验证`, and `生成校验` in the delivered workbook unless the user explicitly asks to inspect them.

## Excel Generation

Prefer adapting an existing project script if one already exists in the working directory. For a fresh workbook, use or patch `scripts/generate_checklist_workbook.py`, which accepts normalized JSON items and writes a grouped workbook.

Do not treat the bundled script as a substitute for reasoning. First extract and normalize the activity口径, source coverage, risks, and clean checklist rows, then feed them into the script.

## Final Response Checklist

In the final answer, report:

- Output file paths.
- Number of checklist items and whether IDs are unique.
- Number of backend/front-end business verification groups.
- Any unresolved口径 that must be confirmed.
- Any validation that could not be completed.
