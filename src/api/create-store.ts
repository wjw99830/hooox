import { useState, useEffect } from 'react';
import { UseStore, StoreHook, Nullable } from '../typings';
import { server } from '../server';
import { ServerSideStore } from '../store/server';
import { ClientSideStore } from '../store/client';
import { createWithStore } from './with-store';

/**
 * 接收一个hook，创建并返回一个新的hook，这个hook会在使用的组件里返回全局状态并订阅更新
 * @param hook 返回一个包含状态和action的对象
 */
export function createStore<
  T,
  Lazy extends Nullable<boolean> = undefined,
>(
  hook: StoreHook<T>,
  lazy?: Lazy
): UseStore<Lazy extends true ? Nullable<T> : T> {
  return (
    server ? createServerStore : createClientStore
  )(hook, lazy);
}

function createClientStore<
  T,
  Lazy extends Nullable<boolean> = undefined,
>(hook: StoreHook<T>, lazy?: Lazy): UseStore<Lazy extends true ? Nullable<T> : T> {
  const store = new ClientSideStore(hook);
  if (!lazy) {
    store.mount();
  }
  let mounted = false;
  const useStore = () => {
    if (lazy && !mounted) {
      store.mount();
      mounted = true;
    }
    const [, updater] = useState(false);
    useEffect(() => {
      store.subscribe(updater);
      return () => {
        store.unsubscribe(updater);
      };
    }, []);
    return store.state as Lazy extends true ? Nullable<T> : T;
  };
  return createWithStore(useStore as UseStore<Lazy extends true ? Nullable<T> : T>);
}

function createServerStore<
  T,
  Lazy extends Nullable<boolean> = undefined,
>(hook: StoreHook<T>, lazy?: Lazy) {
  const store = new ServerSideStore<T>();
  const useStore = () => {
    const [, updater] = useState(false);
    if (!store.host) {
      store.host = updater;
    }
    if (store.isHost(updater)) {
      const freshState = hook();
      store.state = freshState;
    }
    return (lazy ? undefined : store.state) as Lazy extends true ? undefined : T;
  };
  return createWithStore(useStore as UseStore<Lazy extends true ? Nullable<T> : T>);
}
