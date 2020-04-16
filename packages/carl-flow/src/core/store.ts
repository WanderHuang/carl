/**
 * ================================================================
 * ===================== 基于流的状态管理方案 ========================
 * ================================================================
 * 核心概念
 * model 数据模型
 *  - namespace 数据模型核心域
 *  - state 数据
 *  - services 数据服务
 * action 与command模式的command是一个意思，用于触发一次服务(或多次，支持传入Observable)
 * dispatch 分发一个action或action$
 * dispatch$ 分发一个action$
 * select 同步获取当前树中的数据
 * put 更新当前数据
 */
import { BehaviorSubject, Observable, isObservable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';

export type State = { [key: string]: any };

export type Tree = { [key: string]: State };

export type Model = {
  namespace: string;
  state: State;
  services: { [key: string]: Service };
};

export type Action = {
  type: string;
  payload: any;
};

export type AsyncAction = Action | Observable<Action>;

export type Dispatch = (action: AsyncAction) => Promise<any>;

export type Select = (state: Tree) => any;

export type Put = (payload: any) => void;

export type Helper = {
  // 从树中选择数据
  select: (fn: Select) => any;
  // 分发一个action
  next: Dispatch;
  // 更新数据
  put: Put;
};

export type Service = (payload: any, helper: Helper) => Promise<any>;

export type ServiceTree = {
  [key: string]: Service;
};

export type TreeChangeEvent = (current: Tree, next: Dispatch) => void;

// 插件暴露机制 是一个难点
// 暂时暴露所有值
// api 是当前store对象
// next 为真实值
// prev 为上一个插件计算返回值
export type Middleware = (
  api: Store,
  next?: Tree,
  prev?: Tree
) => Promise<Tree>;

export type Watcher = (tree: Tree) => void;

export class Store {
  // 内部数据源
  private tree$: BehaviorSubject<any>;

  // 树快照
  private currentTree: Tree;

  // 所有的服务
  private serivces: ServiceTree;

  // 内部订阅
  private subscription: Subscription;

  // 外部监听器
  private watchers: TreeChangeEvent[] = [];

  // 生命标记
  private alive: boolean;

  constructor(models: Model[], middlewares: Middleware[]) {
    // 快照构建
    this.currentTree = models.reduce((prev: any, { namespace, state }) => {
      prev[namespace] = state;
      return prev;
    }, {});

    // 缓存服务
    // 这里可能会有较大的内存耗费，有没有更好的方法🤔
    this.serivces = models.reduce((prev: any, { namespace, services }) => {
      return Object.entries(services).reduce((tree, [key, serivce]) => {
        tree[`${namespace}/${key}`] = serivce;
        return tree;
      }, prev);
    }, {});

    this.tree$ = new BehaviorSubject(this.currentTree);

    this.subscription = this.tree$.subscribe((next) => {
      // 事件监听
      this.watchers.forEach((watcher) => {
        watcher(this.currentTree, next);
      });

      // 这种严格来讲不算插件机制，暂时先这么处理
      if (middlewares.length > 0) {
        const firstMiddleware = middlewares[0] as Middleware;
        const firstPromise = firstMiddleware(this, next, this.currentTree);
        if (middlewares.length > 0) {
          const Promised = middlewares.slice(1).reduce(
            (wrap, fn) => wrap.then((tree) => fn(this, next, tree)),
            firstPromise
          );
  
          Promised.then(tree => this.currentTree = tree);
        } else {
          firstPromise.then(tree => this.currentTree = tree)
        }
      } else {
        this.currentTree = next;
      }

    });

    this.alive = true;

    this.dispatch = this.dispatch.bind(this);
    this.select = this.select.bind(this);
  }

  dispatch(action: AsyncAction) {
    if (!this.alive) {
      throw new Error('Store is destoryed, never call this function againt');
    }
    if (isObservable(action)) {
      return this.dispath$(action);
    } else {
      const { type, payload } = action;
      const [currentNamespace] = type.split('/');
      const service: Service | undefined = this.serivces[type];
      if (service) {
        return service(payload, {
          next: this.dispatch,
          select: this.select,
          put: (payload: any, namespace?: string) =>
            this.put(namespace || currentNamespace, payload),
        });
      }
      return Promise.reject(new Error(`No service named ${type} found`));
    }
  }

  dispath$(action$: Observable<Action>) {
    if (!this.alive) {
      throw new Error('Store is destoryed, never call this function againt');
    }
    return new Promise((resolve, reject) => {
      const caches: any[] = [];
      const subscription = action$.subscribe(
        (action) => {
          this.dispatch(action)
            .then((data) => caches.push(data))
            .catch(reject);
        },
        (err) => {
          reject(new Error(`Observable action accurs wrong ${err.message}`));
          subscription.unsubscribe();
        },
        () => {
          resolve(caches);
          subscription.unsubscribe();
        }
      );
    });
  }

  select(fn: Select) {
    if (!this.alive) {
      throw new Error('Store is destoryed, never call this function againt');
    }
    return fn(this.currentTree);
  }

  put(namespace: string, payload: Object) {
    if (!this.alive) {
      throw new Error('Store is destoryed, never call this function againt');
    }
    // TODO 树的刷新，这里会重新构造一个树，可能会有性能问题
    const nextTree = Object.entries(this.currentTree).reduce(
      (tree: any, [key, state]) => {
        if (key === namespace) {
          tree[key] = Object.entries(payload).reduce((prev, [key, value]) => {
            prev[key] = value;
            return state;
          }, state);
        } else {
          tree[key] = state;
        }
        return tree;
      },
      {}
    );
    this.tree$.next(nextTree);
  }

  // 监听
  watch(onChange: TreeChangeEvent) {
    if (!this.alive) {
      throw new Error('Store is destoryed, never call this function againt');
    }
    this.watchers.push(onChange);
  }

  getCurrentTree() {
    return this.currentTree;
  }

  // 订阅内部数据
  // 指定namespace时为特定命名空间，否则返回整个树
  subscribe(watcher: Watcher, namespace?: string) {
    if (!this.alive) {
      throw new Error('Store is destoryed, never call this function againt');
    }

    return namespace
      ? this.tree$.pipe(pluck(namespace)).subscribe(watcher)
      : this.tree$.subscribe(watcher);
  }

  // 取消订阅
  // 取消外部订阅
  unsubscribe(subscription: Subscription) {
    subscription.unsubscribe();
  }

  // 销毁内部订阅
  destory() {
    this.subscription.unsubscribe();
    this.tree$.unsubscribe();

    this.alive = false;
  }
}

export const createStore = (models: Model[], middlewares?: Middleware[]) =>
  new Store(models, middlewares || []);
