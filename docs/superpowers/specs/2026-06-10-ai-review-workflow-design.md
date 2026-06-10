# v0.3 AI 协作复盘增强设计

## 背景

AI Study Dashboard v0.1 已完成任务看板、AI 编程日志、每日复盘和 JSON 备份，v0.2 已完成首页概览和任务筛选。当前 AI 编程日志可以记录提示词、结果和经验，但还偏向流水账，不方便直接交给 Codex 或 Claude 总结。

v0.3 的目标是让 AI 编程日志可以被筛选、整理，生成一份适合复制给 AI 做复盘的 Markdown 材料，并把 AI 返回的总结保存回应用中。

## 目标

- 让用户可以按工具、状态和关键词筛选 AI 编程日志
- 让筛选后的日志自动生成 Markdown 复盘材料预览
- 让用户可以一键复制复盘材料给 Codex 或 Claude 总结
- 让用户可以把 AI 总结结果保存为 AI 复盘摘要
- 让用户可以查看和删除已保存的 AI 复盘摘要
- 不改变现有日志存储结构和 CRUD 基础逻辑

## 非目标

- 不接入 AI API
- 不自动调用模型生成总结
- 不导出 `.md` 文件
- 不做手动多选日志
- 不做标签系统
- 不做 Prompt Library 独立页面
- 不做复杂统计图表
- 不自动把复盘摘要写入 DEVLOG.md 或 CONTEXT.md

## 功能设计

### 日志筛选

在 AI 编程日志区域增加筛选控件：

- 关键词搜索：匹配 `title`、`prompt`、`result`、`lesson`
- 工具筛选：全部、Claude、Codex、Other
- 状态筛选：全部、成功、部分成功、失败
- 重置筛选：清空关键词，并恢复工具和状态为全部

筛选只影响当前页面展示和复盘材料生成，不写入 localStorage。

### 复盘材料预览

根据当前筛选结果生成 Markdown 预览。预览应包含：

- 标题：`AI 协作复盘材料`
- 范围说明：日志数量、工具筛选、状态筛选、关键词
- 每条日志的标题、工具、状态、创建时间
- 每条日志的 Prompt、Result、Lesson
- 给 AI 的总结请求，包括：
  - 做得好的地方
  - 问题和低效点
  - 可复用 prompt 模式
  - 下次开发建议

### 复制复盘材料

提供“复制复盘材料”按钮：

- 优先使用 `navigator.clipboard.writeText`
- 复制成功后显示成功提示
- 复制失败时保留预览文本，让用户可以手动复制

### 保存 AI 复盘摘要

在复盘材料预览下方增加 AI 复盘摘要保存区。用户把 Codex 或 Claude 返回的总结粘贴回来后，可以保存为一条结构化摘要。

复盘摘要字段：

- `id`
- `title`
- `sourceLogCount`
- `summary`
- `actionItems`
- `createdAt`
- `updatedAt`

保存区字段：

- 标题：必填，例如“v0.3 AI 协作复盘”
- AI 总结：必填，粘贴 Codex 或 Claude 的总结正文
- 下次行动：可选，记录下一轮改进建议

保存后在 AI 日志区域展示最近的复盘摘要，并支持删除摘要。

## 组件设计

新增组件：

- `src/features/logs/LogFilter.tsx`
- `src/features/logs/LogReviewDraft.tsx`
- `src/features/logs/ReviewSummaryForm.tsx`
- `src/features/logs/ReviewSummaryCard.tsx`
- `src/features/logs/ReviewSummaryList.tsx`

新增数据层：

- `src/features/logs/reviewSummaryStorage.ts`

修改组件：

- `src/features/logs/LogPanel.tsx`
- `src/types/index.ts`
- `src/utils/storageKeys.ts`
- `src/App.css`

目标结构：

```text
LogPanel
├── LogForm
├── LogFilter
├── LogReviewDraft
├── ReviewSummaryForm
├── ReviewSummaryList
└── LogCard 列表
```

## 数据流

```text
getAiLogs()
↓
LogPanel 保存 logs
↓
LogPanel 保存 filter 状态
↓
根据 logs + filters 计算 filteredLogs
↓
LogCard 列表展示 filteredLogs
↓
LogReviewDraft 根据 filteredLogs 生成 Markdown
↓
用户复制 Markdown 给 Codex 或 Claude
↓
用户把 AI 返回的总结粘贴到 ReviewSummaryForm
↓
reviewSummaryStorage 保存 AI 复盘摘要
```

筛选和 Markdown 生成都是 UI 层派生数据，不改变 `logStorage.ts`。复盘摘要作为新的本地数据类型保存到 localStorage。

## 空状态和错误处理

- 没有任何日志时，显示“暂无 AI 日志可生成复盘材料”
- 筛选结果为空时，显示“当前筛选条件下没有日志”
- 复制成功时，显示“复盘材料已复制”
- 复制失败时，显示“复制失败，请手动复制预览内容”
- 保存摘要时，如果标题或 AI 总结为空，显示字段错误
- 删除摘要前使用 `window.confirm` 二次确认

## 验收标准

- 可以按工具筛选日志
- 可以按状态筛选日志
- 可以用关键词搜索日志
- 日志列表会跟随筛选结果变化
- 复盘材料预览会跟随筛选结果变化
- 点击复制后可以复制 Markdown
- 复制失败时仍可手动复制预览内容
- 可以粘贴 AI 总结并保存为复盘摘要
- 可以查看已保存的复盘摘要
- 可以删除复盘摘要
- 不影响日志新增功能
- 不影响日志删除功能
- 不影响 localStorage 持久化
- 刷新页面后原有日志仍然存在
- `npm run build` 通过

## 实现约束

- 不引入第三方库
- 不新增路由
- 不修改现有 `AiLog` 数据结构，除非实现时发现类型缺口并先说明原因
- 可以新增 `AiReviewSummary` 类型和对应 storage key
- 不改动任务看板和每日复盘模块的业务逻辑
- 样式继续使用普通 CSS
