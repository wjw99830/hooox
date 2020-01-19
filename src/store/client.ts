import { render } from 'react-dom';
import { StoreHook, Updater } from '../typings';
import { useEffect, createElement } from 'react';
import { Store } from './base';

let SID = 1;
const CONTAINER_ID = '__hooox_store_container__';

export class ClientSideStore<T> extends Store<T> {
  private _subscribers: Set<Updater> = new Set();

  private _mapSubscriberToDepKeys: Map<Updater, Set<string>> = new Map();

  private _currentSubscriber?: Updater;

  constructor(private hook: StoreHook<T>) {
    super();
  }

  public mount() {
    const hook = this.hook;
    const Wrapper = () => {
      const prevState = this.state;
      const freshState = this.depTrace(hook());
      this.state = freshState;
      useEffect(() => {
        let dirtyKeys: string[] | undefined;
        if (isObject(prevState) && isObject(freshState)) {
          dirtyKeys = shallowEqual(prevState, freshState);
        }
        for (const updater of this._subscribers) {
          const depKeys = this._mapSubscriberToDepKeys.get(updater);
          if (
            !dirtyKeys ||
            dirtyKeys.some(dirtyKey => depKeys?.has(dirtyKey))
          ) {
            updater(flag => !flag);
          }
        }
      });
      return null;
    };

    render(createElement(Wrapper), this.initContainer());
  }

  public subscribe(updater: Updater) {
    this._subscribers.add(updater);
  }

  public unsubscribe(updater: Updater) {
    this._subscribers.delete(updater);
  }

  public setCurrentSubscriber(updater: Updater) {
    this._currentSubscriber = updater;
  }

  private initContainer() {
    const container = document.createElement('div');
    container.id = CONTAINER_ID + SID++;
    document.body.appendChild(container);
    return container;
  }

  private depTrace(state: T) {
    if (isObject(state)) {
      const keys = Object.keys(state);
      let i = keys.length - 1;
      while (i >= 0) {
        const key = keys[i];
        const value = state[key];
        if (typeof value !== 'function') {
          Object.defineProperty(state, key, {
            get: () => {
              const { _currentSubscriber, _mapSubscriberToDepKeys } = this;
              if (_currentSubscriber) {
                const depKeys = _mapSubscriberToDepKeys.get(_currentSubscriber);
                if (depKeys) {
                  depKeys.add(key);
                } else {
                  _mapSubscriberToDepKeys.set(
                    _currentSubscriber,
                    new Set([key])
                  );
                }
              }
              return value;
            }
          });
        }
        i--;
      }
    }
    return state;
  }
}

function isObject(val: unknown): val is Record<string, unknown> {
  return val && typeof val === 'object';
}

function shallowEqual(
  prev: Record<string, unknown>,
  fresh: Record<string, unknown>
) {
  const dirtyKeys: string[] = [];
  const keys = Object.keys(fresh);
  let i = keys.length - 1;
  while (i >= 0) {
    const key = keys[i];
    if (prev[key] !== fresh[key]) {
      dirtyKeys.push(key);
    }
    i--;
  }
  return dirtyKeys;
}
