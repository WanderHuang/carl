import React from 'react';

import getContext from './context';
import { Store } from './store';


const Provider = getContext().Provider;

type CarlFlowStore = {
  store: Store
}

export default (props: React.PropsWithChildren<CarlFlowStore>) => (
<Provider value={props.store}>{props.children}</Provider>
)