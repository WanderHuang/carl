import { Store, AsyncAction } from './store';

/** 允许对外分发 */
export default <T>(store: Store) => (action: AsyncAction) => {
  return store.dispatch(action).then((data: T) => data);
}