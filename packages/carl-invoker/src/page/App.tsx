import React from 'react';
import { flow, Dispatch } from 'carl-flow';
import { Observable } from 'rxjs';
import { tap, pluck } from 'rxjs/operators';
import { RouterDom } from 'carl-router';
const { withRouter } = RouterDom;

type AppProps = {
  userId: number;
  dispatch: Dispatch;
}

const App: React.FC<AppProps> = (props) => {
  const { userId } = props;

  const onRandom = () => {
    const { dispatch } = props;
    dispatch({
      type: 'app/updateUserId',
      payload: Math.random() * 100 | 0
    })
  }

  return (
    <div>
      <button onClick={onRandom}>App随机ID</button>
      <div>{userId}</div>
      <div>{props.children}</div>
    </div>
  )
}

export default withRouter(flow(
  (stream$: Observable<any>) => {
    return stream$.pipe(
      tap(next => console.log('Tap App >', next)),
      pluck('app')
    )
  }
)(App));