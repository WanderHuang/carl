# carl路由管理

- 底层技术
  - react-router
  - react-router-config
  - react-router-dom
  - typescript

通过封装一层`react-router-dom`，来实现一个可组合的项目路由管理方案。

## 使用方式

```tsx
// ===================
// routes配置
// ===================
import { render } from 'carl-router';
import Home from '@/page/Home';
import Config from '@/page/Config';
import NotFound from '@/page/404';
import App from '@/page/App';
// 设置路由
export default render([
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: App
      },
      {
        path: '/home',
        component: Home,
      },
      {
        path: '/config',
        component: Config,
      },
      {
        component: NotFound
      }
    ]
  },
])
// ===================
// index页面
// ===================
import Routes from '@/routes';
import { RouterDom } from 'carl-router';
const { BrowserRouter: Router, Link } = RouterDom;
export default () => (
  <Router>
    {/* 其他代码 */}

    {/* 菜单 */}
    <Link to="home">Home</Link>

    {/* 路由管理区域 */}
    <Routes />
  </Router>
)

// ===================
// 路由页面
// ===================

import React from 'react';
import { RouterDom } from 'carl-router';

// 使用withRouter来包裹路由，获取路由能力
const { withRouter } = RouterDom;

const App: React.FC<{}> = (props) => {
  return (
    {/* 子路由手动分发 */}
    <div>{props.children}</div>
  )
}

export default withRouter(App);
```
