import { UseStore } from '../typings';

export interface IWithStoreProps<S> {
  children?: (store: S) => JSX.Element | null;
}

export function createWithStore<S>(useStore: UseStore<S>) {
  const WithStore = function({ children }: IWithStoreProps<S>) {
    const state = useStore();
    return children ? children(state) : null;
  }
  useStore.Provider = WithStore;
  return useStore;
}
