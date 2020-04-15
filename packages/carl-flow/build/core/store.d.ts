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
import { Observable, Subscription } from 'rxjs';
export declare type State = {
    [key: string]: any;
};
export declare type Tree = {
    [key: string]: State;
};
export declare type Model = {
    namespace: string;
    state: State;
    services: {
        [key: string]: Service;
    };
};
export declare type Action = {
    type: string;
    payload: any;
};
export declare type AsyncAction = Action | Observable<Action>;
export declare type Dispatch = (action: AsyncAction) => Promise<any>;
export declare type Select = (state: Tree) => any;
export declare type Put = (payload: any) => void;
export declare type Helper = {
    select: (fn: Select) => any;
    next: Dispatch;
    put: Put;
};
export declare type Service = (payload: any, helper: Helper) => Promise<any>;
export declare type ServiceTree = {
    [key: string]: Service;
};
export declare type TreeChangeEvent = (current: Tree, next: Dispatch) => void;
export declare type Middleware = (api: Store, next?: Tree, prev?: Tree) => Promise<Tree>;
export declare type Watcher = (tree: Tree) => void;
export declare class Store {
    private tree$;
    private currentTree;
    private serivces;
    private subscription;
    private watchers;
    private alive;
    constructor(models: Model[], middlewares: Middleware[]);
    dispatch(action: AsyncAction): Promise<any>;
    dispath$(action$: Observable<Action>): Promise<unknown>;
    select(fn: Select): any;
    put(namespace: string, payload: Object): void;
    watch(onChange: TreeChangeEvent): void;
    getCurrentTree(): Tree;
    subscribe(watcher: Watcher, namespace?: string): Subscription;
    unsubscribe(subscription: Subscription): void;
    destory(): void;
}
export declare const createStore: (models: Model[], middlewares?: Middleware[] | undefined) => Store;
