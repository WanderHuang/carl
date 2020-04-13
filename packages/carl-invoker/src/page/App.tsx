import React from 'react';
import { flow, Dispatch } from 'carl-flow';
import { Observable } from 'rxjs';
import { tap, pluck } from 'rxjs/operators';

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
      <button onClick={onRandom}>随机ID</button>
      <div>{userId}</div>
    </div>
  )
}

export default flow(
  (stream$: Observable<any>) => {
    return stream$.pipe(
      tap(next => console.log('Tap >', next)),
      pluck('app')
    )
  }
)(App);