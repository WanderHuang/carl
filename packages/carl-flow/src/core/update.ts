import { Store } from './store';

/** 处理数据更新 */
export default (store: Store) => (namespace: string, payload: Object) => {
  return store.put(namespace, payload);
}