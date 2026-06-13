# AI Study Dashboard 开发日志

## 项目目标

做一个本地运行的 AI 学习任务管家，帮助大一学生管理课程任务、AI 编程日志和每日复盘。核心原则是"能长期用的本地工具"，不追求复杂架构。

## 已完成功能

### 任务看板
- 新增任务（表单验证：标题、课程必填）
- 编辑任务（表单自动回填，支持取消）
- 删除任务（二次确认）
- 状态切换（待做 → 进行中 → 已完成，支持退回）
- 三列看板布局，桌面横向、小屏纵向

### AI 编程日志
- 新增日志（标题、工具、提示词、结果、状态、经验教训）
- 删除日志（二次确认）
- 日志卡片展示（工具标签、状态标签、内容摘要）

### 每日复盘
- 新增复盘（日期、完成内容、延期事项、明日计划、备注）
- 删除复盘（二次确认）
- 日期格式化显示（中文星期+日期）

### 数据层
- localStorage 持久化（刷新不丢数据）
- JSON 导入导出备份（三种导出方式：下载、复制、显示）
- 导入前验证结构，失败不破坏当前数据

## 技术栈

- Vite 8
- React 19
- TypeScript 6
- 普通 CSS（CSS 变量 + 响应式）
- localStorage
- 零第三方依赖

## 开发分工

**Claude Code 负责**：
- 项目骨架搭建
- 全部功能实现
- UI 设计与样式
- 类型检查与构建验证

**Codex 负责**：
- 文档审查
- 验收清单制定

## 开发顺序

1. 阶段 0：项目文档与协作规则（AGENTS.md、CLAUDE.md、PROJECT_PLAN.md、README.md）
2. 阶段 1：初始化 Vite + React + TypeScript 项目
3. 数据基础层：storage.ts、storageKeys.ts、ids.ts
4. 任务数据层：taskStorage.ts
5. 任务看板 UI（mock 数据）→ 接入真实 localStorage → 新增表单 → 状态切换 → 删除 → 编辑
6. AI 日志数据层：logStorage.ts → UI（表单+卡片）→ 删除
7. 每日复盘数据层：reviewStorage.ts → UI（表单+卡片）→ 删除
8. JSON 导入导出备份

## 遇到的问题

1. **Vite 初始化目录非空**：`npm create vite` 在已有文件的目录下会取消操作，需要先在子目录创建再移动文件
2. **GateGuard 拦截**：每次创建文件前需要先陈述事实才能通过 hook 检查
3. **TypeScript 类型错误**：`Record<string, string>` 的 setState 回调返回 `undefined` 值时类型不兼容，改为 `Record<string, string | undefined>`
4. **导出 JSON 为空**：操作顺序问题，先导出后添加数据导致，非代码 bug
5. **Codex 内置浏览器无法下载文件**：新增 clipboard 复制和 textarea 显示作为替代方案
6. **关键词搜索空格问题**：用户输入"高数 作业"时应拆分为多个关键词 AND 匹配，原逻辑将空格视为普通字符
7. **数字搜索误命中**：resourceLink 中的数字导致搜索纯数字时匹配不相关任务，从搜索范围中移除 resourceLink

## 学到的经验

1. **先数据层后 UI**：先定义类型和 storage 函数，再搭 UI，开发更顺畅
2. **每步都跑类型检查**：及早发现类型错误，避免累积
3. **mock → 真实数据**：先用 mock 数据把 UI 搭好，再接入 localStorage，降低调试难度
4. **统一 CRUD 模式**：三个 storage 模块结构完全一致，代码可预测、易维护
5. **导出要兼容多种环境**：浏览器下载不总是可用，clipboard + textarea 是可靠的备选

## v0.2 完成内容

### 首页概览 Dashboard
- 新增 tab 导航（首页概览 / 任务管理），默认显示首页
- 今日到期任务（deadline = 今天且未完成）
- 已逾期任务（deadline < 今天且未完成）
- 进行中任务
- 最近 AI 编程日志（最近 3 条）
- 最近每日复盘（最近 3 条）
- 空状态提示

### 日期工具修复
- YYYY-MM-DD 字符串直接字典序比较，避免 `new Date('YYYY-MM-DD')` 的 UTC 解析时区风险
- 非法日期返回 false 或 "无日期"

### 任务搜索与筛选
- 关键词搜索（标题、课程，大小写不敏感，多关键词 AND 逻辑）
- 状态筛选（全部 / 待做 / 进行中 / 已完成）
- 优先级筛选（全部 / 高 / 中 / 低）
- 课程筛选（从任务数据自动提取去重）
- 清空筛选按钮
- 结果计数（显示 N / M 个任务）
- 课程筛选悬空修复（课程选项消失时自动重置为全部）
- 筛选无结果时显示"没有符合当前筛选条件的任务"提示

### 验证结果
- npm run build 通过
- 待最终手动验收

### 已知遗留问题
- JSON 导入仍可能接受字段异常的数据（如异常 status），后续可增强导入校验
- 筛选逻辑目前靠手动验收，暂未补自动测试

## v0.3 完成内容

### AI 协作复盘增强
- 日志筛选：关键词搜索（匹配 title/prompt/result/lesson）、工具筛选（全部/Claude/Codex/Other）、状态筛选（全部/成功/部分成功/失败）、重置筛选、结果计数
- 复盘材料预览：根据筛选结果自动生成 Markdown，包含范围说明、每条日志详情、给 AI 的总结请求
- 一键复制复盘材料：navigator.clipboard.writeText，失败时保留预览供手动复制
- AI 复盘摘要保存：标题+AI 总结必填，下次行动可选，localStorage 持久化
- 摘要查看与删除：卡片展示，删除前二次确认
- JSON 备份兼容：导出/导入包含 aiReviewSummaries，旧备份导入兼容（缺失字段按空数组处理）
- 无日志时已保存摘要仍可见

### 新增文件
- src/features/logs/reviewSummaryStorage.ts（摘要 CRUD）
- src/features/logs/LogFilter.tsx（日志筛选组件）
- src/features/logs/LogReviewDraft.tsx（Markdown 复盘材料预览+复制）
- src/features/logs/ReviewSummaryForm.tsx（摘要保存表单）
- src/features/logs/ReviewSummaryCard.tsx（摘要卡片）
- src/features/logs/ReviewSummaryList.tsx（摘要列表）

### 修改文件
- src/types/index.ts（新增 AiReviewSummary 接口）
- src/utils/storageKeys.ts（新增 AI_REVIEW_SUMMARIES key）
- src/features/logs/LogPanel.tsx（接入筛选、复盘材料、摘要表单和列表）
- src/utils/backup.ts（备份包含 aiReviewSummaries，导入兼容旧格式）
- src/features/backup/BackupPanel.tsx（确认文案补充 AI 复盘摘要）
- src/App.css（新增筛选、复盘材料、摘要样式）

### Codex 审查结论
- 未发现阻断问题
- P1 已修复：JSON 备份包含 AI 复盘摘要
- P2 已修复：无日志时摘要仍可见
- P3 已补充：MANUAL_TEST_CHECKLIST.md 增加 v0.3 手动测试说明

### 验证结果
- npm run build 通过
- 手动测试待执行

### 经验
- 筛选和 Markdown 生成都是 UI 层派生数据，不改底层 storage，保持数据层稳定
- 新增数据类型用独立 storage 模块，与现有 AiLog 解耦
- 备份兼容需要考虑旧格式缺失字段的情况

## 下一版可以考虑的功能

- 任务拖拽排序
- 日志和复盘的编辑功能
- 数据统计图表
- 复习提醒
- 周报/月报
- 暗色模式
- 移动端适配优化

## v0.3.1 阶段收尾

### 完成内容
- 修复 AI 复盘摘要显示：摘要和下次行动使用保留换行的展示方式，适合粘贴多段 AI 回复。
- 调整日志筛选用途：筛选结果只影响复盘材料和摘要来源，不再干扰正常日志列表查看。
- 增强 AI 复盘摘要关联：`AiReviewSummary` 增加 `sourceLogIds`，摘要卡片可显示来源日志；旧数据缺失字段时按空数组兼容。
- 优化页面动线：首页概览增加任务、日志、复盘跳转入口；AI 日志页增加新增日志、复盘材料、日志列表、已保存复盘的页内锚点导航。
- 完善备份兼容：导入和导出都会 normalize AI 复盘摘要，保证旧摘要导出时也补齐 `sourceLogIds`。

### 验证结果
- `npm run build` 通过。
- Codex review 两轮通过，最后一轮未发现 P0/P1/P2/P3 问题。
- Chrome 自动验收通过：快捷锚点定位、日志筛选隔离、多段摘要换行、来源日志展示、备份 JSON 中 `sourceLogIds` 均正常。

### 经验
- 小版本修正应优先围绕用户验收暴露的问题闭环，不急着进入大重构。
- 页内定位这类轻量交互优先使用原生锚点，比自写 `scrollIntoView` 按钮更稳定。
- localStorage 数据结构演进要同时考虑读取、导入、导出三条路径的兼容一致性。
