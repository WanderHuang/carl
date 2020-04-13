import { Store, Tree } from 'src/core/store';

export default (_api: Store, next: Tree, prev: Tree) => {
  console.log('Tree mutation> ', prev, '=>', next);
  return Promise.resolve(prev);
}