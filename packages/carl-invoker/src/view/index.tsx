import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Auth from '@/components/Auth';
import { Provider } from 'carl-flow';
import { RouterDom } from 'carl-router';
import store from '@/models';
import Routes from '@/routes';
import styles from './index.module.less';

console.log(styles)

const { BrowserRouter: Router, Link } = RouterDom;


const Home = () => {
  const [visible, setVisible] = useState(true);

  return (
    <Router>
      <Provider store={store}>
        <div>
          <h1>正常页面</h1>
          <div>
            <button onClick={() => setVisible(!visible)}>控制可见</button>
            <Auth auth={visible}>
              <div>可见</div>
            </Auth>
          </div>
          <div>
            <p>路由控制</p>
            <div className={styles.line}></div>
            <p>
              <Link to="home">Home</Link>
              <span className={styles.gap}></span>
              <Link to="config">Config</Link>
            </p>
          </div>
          <div>
            <Routes />
          </div>
        </div>
      </Provider>
    </Router>
  )
}

ReactDOM.render(<Home />, document.querySelector('#root'))
