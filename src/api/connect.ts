import { ComponentType, createElement, FC } from 'react';
import { UseStore } from '../typings';

export function connect<Stores extends UseStores>(stores: Stores) {
  const keys = Object.keys(stores);
  const len = keys.length;

  return function<Props extends {}>(component: ComponentType<Props>) {

    type PropsWithoutStores = Omit<Props, keyof $GetStates<Stores>>;

    return (props => {
      const states: $GetStates<Stores> = {} as $GetStates<Stores>;

      for (let i = 0; i < len; i++) {
        const key = keys[i];
        const useStore = stores[key];
        (<{ [key: string]: any }>states)[key] = useStore();
      }

      return createElement(
        component,
        { ...props, ...states } as Props,
      );

    }) as FC<PropsWithoutStores>;
  }
}

type UseStores = {
  [index: string]: UseStore<any>;
}

type $GetStates<Stores extends UseStores> = {
  [K in keyof Stores]: Stores[K] extends UseStore<infer S> ? S : never;
};
