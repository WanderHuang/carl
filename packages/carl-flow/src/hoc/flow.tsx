import React from 'react';
import getContext from 'src/core/context';
import { Store, Tree } from 'src/core/store';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

export type MapTreeStreamToProps = (stream$: BehaviorSubject<Tree>) => Observable<{ [key: string]: any }>


const Context = getContext();

/**
 * 组合流与高阶组件
 * @param mapTreeStreamToProps 把树的流变化映射为值
 */
const Flow = (mapTreeStreamToProps?: MapTreeStreamToProps) =>
  <P extends React.ComponentProps<any>, C extends React.ComponentType<P>>(InnerComp: C & React.ComponentType<P>) => {
    const Consumer = (props: React.ComponentProps<P>) => (
      <Context.Consumer>
        {(context: Store | null) => (
          <Stream {...props} __store={context}>{props.children}</Stream>
        )}
      </Context.Consumer>
    )

    class Stream extends React.Component<P & { __store: Store | null }> {
      // 内部流
      stream$: BehaviorSubject<Tree>;

      // 订阅
      subscription: Subscription;

      stateSubscription: Subscription;

      state = {};

      constructor(props: any) {
        super(props);

        const { __store } = this.props;
        
        if (__store) {
          const store = __store as Store;
          
          this.stream$ = new BehaviorSubject(store.getCurrentTree());
          
          // 订阅store
          this.subscription = store.subscribe(next => this.stream$.next(next));
    
          // 映射
          if (mapTreeStreamToProps) {
            let init = true;
            this.stateSubscription = mapTreeStreamToProps(this.stream$).subscribe(next => {
              // constructor内初始化不能调用setState
              if (init) {
                this.state = next;
                init = false;
              } else {
                this.setState(next)
              }
            })
          }
        }
      }


      componentWillUnmount() {
        // 资源释放
        this.subscription.unsubscribe();
        this.stateSubscription.unsubscribe();
      }


      render() {

        const { __store, ...props } = this.props;
        return (
          <InnerComp {...props as P} {...this.state} dispatch={(__store as Store).dispatch.bind(__store)} />
        )
      }
    }

    // 实际返回一个Store.Provider的消费者
    // 高阶组件被他包裹
    return Consumer;
  }


export default Flow;