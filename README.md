# Orange_Skills

一个面向 AI 编程助手（Claude Code、Codex、Cursor、Kimi Code 等）的 Agent Skills 集合仓库。

## 项目简介

Orange_Skills 收集并维护一系列实用的 Agent Skills，目标是让每个 skill 都像一位随身的高级工程师：专注于解决特定领域的问题，可以直接安装到 AI 编码助手中使用。

仓库采用多 skill 结构，每个 skill 独立存放在 `skills/<skill-name>/` 目录下，遵循 [Agent Skills 规范](https://agentskills.io/)。你可以单独安装某个 skill，也可以一次性安装全部。

## 当前可用的 Skills

| Skill | 描述 |
|-------|------|
| [`skills-trending`](./skills/skills-trending) | 聚合多个排行榜的热门 Agent Skills，支持分类筛选、关键词搜索和 JSON 输出 |

## 安装方法

使用 [skills.sh](https://skills.sh/) CLI 安装指定 skill：

```bash
npx skills add xiehuacheng/Orange_Skills --skill skills-trending
```

或者一次性安装仓库中的所有 skills：

```bash
npx skills add xiehuacheng/Orange_Skills
```

本地测试时也可以直接指定路径：

```bash
npx skills add /path/to/Orange_Skills --skill skills-trending
```

## 使用示例

以 `skills-trending` 为例：

```bash
# 查看 Top 20 热门 skill
node skills/skills-trending/scripts/fetch-trends.js

# 查看 Top 10 前端相关 skill
node skills/skills-trending/scripts/fetch-trends.js --category frontend --top 10

# 搜索 testing 相关 skill
node skills/skills-trending/scripts/fetch-trends.js --search testing

# 强制刷新数据并以 JSON 输出
node skills/skills-trending/scripts/fetch-trends.js --refresh --json
```

## 项目特点

- **多 skill 仓库结构**：方便后续不断扩展新的 skills
- **即装即用**：通过 `npx skills add` 一键安装到常用 AI 编码助手
- **数据来源多元**：聚合 GitHub stars、安装量、排行榜等多种信号
- **结果去重合并**：按 `owner/repo@skill-name` 精确去重，合并多源指标

## 贡献

欢迎提交新的 skill 或改进现有 skill。每个 skill 请单独放在 `skills/<skill-name>/` 目录下，并包含 `SKILL.md` 说明文件。

## 许可证

[MIT](./LICENSE)
