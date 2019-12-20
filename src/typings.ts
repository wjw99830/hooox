import { SetStateAction, Dispatch } from 'react';

export type StoreHook<T> = () => T;
export type Flag = boolean;
export type Updater = Dispatch<SetStateAction<Flag>>;
export type UseStore<T> = () => T;
export type Nullable<T> = T | undefined | null;
