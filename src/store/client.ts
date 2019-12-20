import { render } from 'react-dom';
import { StoreHook, Updater } from '../typings';
import { useEffect, createElement } from 'react';
import { Store } from './base';

let SID = 1;
const CONTAINER_ID = '__hooox_store_container__';

export class ClientSideStore<T> extends Store<T> {

  private subscribers: Set<Updater> = new Set();

  constructor(private hook: StoreHook<T>) {
    super();
  }

  public mount() {
    const hook = this.hook;
    const Wrapper = () => {
      this.state = hook();
      useEffect(() => {
        for (const updater of this.subscribers) {
          updater(flag => !flag);
        }
      });
      return null;
    };

    render(
      createElement(Wrapper),
      this.initContainer()
    );
  }

  public subscribe(updater: Updater) {
    this.subscribers.add(updater);
  }

  public unsubscribe(updater: Updater) {
    this.subscribers.delete(updater);
  }

  private initContainer() {
    const container = document.createElement('div');
    container.id = CONTAINER_ID + SID++;
    document.body.appendChild(container);
    return container;
  }
}
