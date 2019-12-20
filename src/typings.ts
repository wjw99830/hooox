import { SetStateAction, Dispatch, FC } from 'react';
import { IWithStoreProps } from './api/with-store';

export type StoreHook<T> = () => T;
export type Flag = boolean;
export type Updater = Dispatch<SetStateAction<Flag>>;
export type UseStore<T> = (() => T) & {
  Provider: FC<IWithStoreProps<T>>;
};
export type Nullable<T> = T | undefined | null;
