import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Auth from '@/components/Auth';

const App = () => {
  const [visible, setVisible] = useState(true);
  return (
    <div>
      <h1>正常页面</h1>
      <div>
        <button onClick={() => setVisible(!visible)}>控制可见</button>
      </div>
      <Auth auth={visible}>
        <div>可见</div>
      </Auth>
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
