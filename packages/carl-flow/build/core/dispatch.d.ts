import { Store, AsyncAction } from './store';
declare const _default: <T>(store: Store) => (action: AsyncAction) => Promise<T>;
/** 允许对外分发 */
export default _default;
