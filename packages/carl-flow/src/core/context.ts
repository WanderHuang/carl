import React from 'react';

export type ContextType<T> = React.Context<T | null>;


let context: any;

/** 只提供一个上下文变量 */
export default <T>() => {
  if (!context) {
    context = React.createContext<T | null>(null);
  }
  return context as ContextType<T>;
};
