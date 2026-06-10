# CONTEXT.md

当前任务：v0.2 已完成开发并通过手动验收，待提交 GitHub。

已完成：
- 首页概览 Dashboard（今日到期、逾期、进行中、最近日志/复盘）
- 日期工具稳定化（YYYY-MM-DD 字典序比较、ISO datetime 本地日期、本地 todayStr）
- 任务搜索与筛选（关键词 AND 逻辑、状态、优先级、课程、清空筛选、无匹配提示）
- 搜索范围优化（仅匹配标题和课程，不匹配 resourceLink）
- 课程筛选悬空修复
- 文档更新（README、DEVLOG、MANUAL_TEST_CHECKLIST）

待办：
- 提交 v0.2 到 GitHub
- 后续可考虑 v0.3 规划

关键决策：
- 不做后端/数据库/云同步/AI API
- v0.2 控制在本地体验增强，不引入新依赖
- 搜索不匹配 resourceLink，避免数字误命中

问题记录：
- JSON 导入字段校验不足（异常 status 可通过）
- 筛选逻辑缺少自动测试

关键文件：
- src/features/dashboard/Dashboard.tsx
- src/utils/date.ts
- src/features/tasks/TaskBoard.tsx
- src/features/tasks/TaskFilter.tsx
- src/features/reviews/ReviewForm.tsx
