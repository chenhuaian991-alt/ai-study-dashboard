# 对话上下文存档
> 上次更新：2026-06-13 21:10（Asia/Shanghai）

## 当前任务
v0.3.1「AI 协作复盘增强体验修正」已完成阶段收尾，待提交前整理。

## 已完成
- 修复摘要换行、日志筛选隔离、来源日志绑定、首页跳转、AI 日志页锚点导航。
- `AiReviewSummary` 增加 `sourceLogIds`，备份导入/导出兼容旧摘要。
- Codex review 通过，Chrome 自动验收通过，`npm run build` 通过。

## 待办
- 如需要，清理浏览器 localStorage 中自动验收测试数据。
- 提交 v0.3.1 到 GitHub，然后再规划 v0.4。

## 关键决策
- 不接入 AI API，不引入第三方库，不做侧边栏或路由重构。
- 页内定位改用原生锚点，避免 `scrollIntoView` 点击不稳定。

## 问题记录
- Vite 在沙箱内常因 spawn EPERM 失败，提升权限后 build/dev 可运行。

## 关键文件
- src/features/logs/LogPanel.tsx - 日志页筛选、复盘材料、锚点导航
- src/features/logs/reviewSummaryStorage.ts - AI 复盘摘要 normalize 与 storage
- src/utils/backup.ts - JSON 备份导入导出兼容
