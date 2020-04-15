import React from 'react';
import { Switch } from 'react-router-dom';
import { renderRoutes, RouteConfig } from 'react-router-config';

export type WrapType = (routes: RouteConfig[]) => RouteConfig[];

/**
 * 包裹外部传入的路由，生成路由页面
 * @param routes [RouteConfig[]] 符合react-router-config的路由
 */
const wrap: WrapType = (routes: RouteConfig[]) => routes.map<RouteConfig>(route => {
  const Comp = route.component;
  if (Comp) {
    return {
      ...route,
      routes: wrap(route.routes || []),
      component: (props: any) => {
        return (
          <Comp {...props}>
            <Switch>
              {renderRoutes(props.route.routes)}
            </Switch>
          </Comp>
        )
      }
    }
  } else {
    return route
  }
})

export default wrap;