import React from 'react';
import { flow, Dispatch } from 'carl-flow';
import { Observable } from 'rxjs';
import { tap, pluck } from 'rxjs/operators';

type HomeProps = {
  userId: number;
  dispatch: Dispatch;
}

const Home: React.FC<HomeProps> = (props) => {
  const { userId } = props;

  const onRandom = () => {
    const { dispatch } = props;
    dispatch({
      type: 'home/updateUserId',
      payload: Math.random() * 100 | 0
    })
  }

  return (
    <div>
      <button onClick={onRandom}>Home随机ID</button>
      <div>{userId}</div>
    </div>
  )
}

export default flow(
  (stream$: Observable<any>) => {
    return stream$.pipe(
      tap(next => console.log('Tap Home >', next)),
      pluck('home')
    )
  }
)(Home);