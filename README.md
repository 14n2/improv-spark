# Improv Spark

一个轻量的中文即兴戏剧地点提示工具。打开网页，点击「抽取地点」，用一个地点开始故事。

## 本地开发

需要 Node.js 24 和 npm，CI 同样使用 Node.js 24。

```sh
npm ci
npm run dev
```

开发页面：`http://localhost:5173/improv-spark/`。

```sh
npm test          # Vitest：词库与 shuffle bag 测试
npm run test:watch
npm run lint
npm run build    # 严格 TypeScript 检查 + Vite 生产构建
npm run preview
```

构建输出为 `dist/`；preview 默认页面为 `http://localhost:4173/improv-spark/`。

## 抽取规则

- 本地 JSON 内置恰好 40 个中文地点，每次抽取一个。
- Fisher–Yates shuffle bag 保证每轮无重复；第 41 次自动进入新一轮，且不重复上一轮末项。
- 先确定真实结果，再播放约 1.5 秒的文字切换；动画期间锁定按钮，临时文字不消耗抽取结果。
- 开启系统减少动画偏好时，直接显示结果。
- 结果保持到下次抽取；刷新或重新打开后重置。不保存或展示历史。
- 使用 `Math.random()` 满足娱乐性抽取，不用于公平竞赛或安全用途。

## 维护地点词库

修改 `src/data/locations.json`，保留以下结构：

```json
{
  "locations": ["中文地点一", "中文地点二"]
}
```

以上仅表示格式，正式数据必须恰好 40 条。校验会去除首尾空格，要求每条为非空中文文本，且去空格后无完全重复。提交前人工审查近义重复、移动端长度与内容适宜性，再执行测试、lint 和 build。配置非法时页面显示错误并禁用抽取。

## 结构

- `src/utils/`：独立于 React / DOM 的数据校验和 shuffle bag。
- `src/hooks/usePromptDraw.ts`：内存状态、抽取锁及动画 timer。
- `src/components/PromptCard.tsx`：卡片展示。
- `src/index.css`：Tailwind CSS v4 入口、设计 tokens 和基础样式。
- `tests/`：确定性随机逻辑及数据测试。
- `docs/improv-spark-PRD.md`：批准的需求基线。
- `docs/acceptance.md`：验证记录与待完成的真机、试用验收。

## GitHub Pages

`vite.config.ts` 的 `base` 为 `/improv-spark/`。仓库标准地址对应的预期 URL 是 `https://14n2.github.io/improv-spark/`，实际可用性须在部署后验证。

`.github/workflows/deploy.yml` 在以下场景运行：

- 面向 `master` 的 PR：`npm ci`、测试、lint、build。
- 推送到 `master` 或在 `master` 手动运行：验证成功后上传 `dist/` 并部署 Pages。
- 其他分支的手动运行只执行验证。

首次发布前需确认仓库为 Public、默认分支为 `master`，并在 Settings → Pages 将 Source 设为 GitHub Actions。合并或推送此 workflow 到 `master` 会触发部署，执行前须取得明确授权。当前实现不代表已部署。

发布测试版后，完成真实 iPhone / Android 微信浏览器检查和 3 位团员试用，记录反馈并修复 Blocker。PRD 的 12 项 DoD 全部通过后，才可在单独授权下发布 `v1.0.0`。不在本任务中执行 commit、push、tag、release 或 deploy。
