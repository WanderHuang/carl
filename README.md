# carl [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

一个基于ts和react的页面解决方案。

`carl`是`dota2`里面的一个英雄，也是自带技能最多的英雄。前端开发中的应用打包构建、状态管理、路由管理好像是`carl`所需要的火、雷、冰三样元素，通过组合这些元素，我们可以创造出一个令人满意的网站。

`carl`是我第一个工程化实践项目，自己的项目会有更多的用carl来做。希望不断地完善。

核心的`pack`功能有借鉴`create-react-app`，`flow`有借鉴`react-redux`。致敬。

## 把玩

1. `yarn global add lerna` 安装lerna
2. `yarn` 安装依赖
3. `lerna bootstrap` 安装
4. `lerna run build` 构建
5. `lerna run start` 本地跑`carl-invoker`

## 特性

- 基于`ts`开发
- 基于`rxjs`做开发
- 多页应用
- 良好的工程目录划分
- 减少模板代码编写

## 展望

- lint支持
- 完善的api
- 基于node做更多的预处理操作，如路由、状态文件的生成。
- 熟悉更多的前端开发技术，如pwa、微服务等

## license

MIT
