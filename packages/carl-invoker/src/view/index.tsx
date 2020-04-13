import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Auth from '@/components/Auth';
import { logger, createStore, Provider } from 'carl-flow';
import App from '@/page/App';

const store = createStore(
  [{
    namespace: 'app',
    state: {
      userId: 0
    },
    services: {
      updateUserId(userId, { put }) {
        return Promise.resolve(put({ userId }))
      }
    }
  }],
  [logger]
)

const Home = () => {
  const [visible, setVisible] = useState(true);

  return (
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
          <App />
        </div>
      </div>
    </Provider>
  )
}

ReactDOM.render(<Home />, document.querySelector('#root'))
