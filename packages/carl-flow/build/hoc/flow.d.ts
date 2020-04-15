import React from 'react';
import { Tree } from 'src/core/store';
import { BehaviorSubject, Observable } from 'rxjs';
export declare type MapTreeStreamToProps = (stream$: BehaviorSubject<Tree>) => Observable<{
    [key: string]: any;
}>;
/**
 * 组合流与高阶组件
 * @param mapTreeStreamToProps 把树的流变化映射为值
 */
declare const Flow: (mapTreeStreamToProps?: MapTreeStreamToProps | undefined) => <P extends any, C extends React.ComponentType<P>>(InnerComp: (C & React.ComponentClass<P, any>) | (C & React.FunctionComponent<P>)) => (props: React.ComponentProps<P>) => JSX.Element;
export default Flow;
