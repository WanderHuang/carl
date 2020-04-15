import React from 'react';
import { flow, Dispatch } from 'carl-flow';
import { Observable } from 'rxjs';
import { tap, pluck } from 'rxjs/operators';

type ConfigProps = {
  userId: number;
  dispatch: Dispatch;
}

const Config: React.FC<ConfigProps> = (props) => {
  const { userId } = props;

  const onRandom = () => {
    const { dispatch } = props;
    dispatch({
      type: 'config/updateUserId',
      payload: Math.random() * 100 | 0
    })
  }

  return (
    <div>
      <button onClick={onRandom}>Config随机ID</button>
      <div>{userId}</div>
    </div>
  )
}

export default flow(
  (stream$: Observable<any>) => {
    return stream$.pipe(
      tap(next => console.log('Tap Config >', next)),
      pluck('config')
    )
  }
)(Config);