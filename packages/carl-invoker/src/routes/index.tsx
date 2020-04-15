import { render } from 'carl-router';
import Home from '@/page/Home';
import Config from '@/page/Config';
import NotFound from '@/page/404';
import App from '@/page/App';

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
        // routes: [
        //   {
        //     path: '/menu1/sub1',
        //     component: () => (<div>sub1</div>)
        //   },
        //   {
        //     path: '/menu1/sub2',
        //     component: () => (<div>sub2</div>)
        //   },
        //   {
        //     component: () => (<div>aaa not found</div>)
        //   }
        // ]
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