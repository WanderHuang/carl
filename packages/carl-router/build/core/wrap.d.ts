import { RouteConfig } from 'react-router-config';
export declare type WrapType = (routes: RouteConfig[]) => RouteConfig[];
/**
 * 包裹外部传入的路由，生成路由页面
 * @param routes [RouteConfig[]] 符合react-router-config的路由
 */
declare const wrap: WrapType;
export default wrap;
