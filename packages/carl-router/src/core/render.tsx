import React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import wrap from './wrap';
import { renderRoutes, RouteConfig } from 'react-router-config';


export default (routes: RouteConfig[]) => withRouter(() => (
  <Switch>
    {renderRoutes(wrap(routes))}
  </Switch>
));