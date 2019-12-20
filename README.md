# Hooox
Simple react state management based on hooks inspired by [umijs/hox](https://github.com/umijs/hox). Support **SSR** and **Lazy Load**.

## API
- `createStore: <S>(hook: StoreHook<S>, lazy = false) => UseStore<S>`

## Example
```tsx
// store.ts
export const useCounter = createStore(() => {
  const [count, setCount] = useState(0);
  const inc = useCallback(() => setCount(prev => ++prev), []);
  const dec = useCallback(() => setCount(prev => --prev), []);

  return useMemo(() => ({
    count,
    inc,
    dec,
  }), []);
});

// MyComponent.tsx
import { useCounter } from './store.js';

export const MyComponent: FC = () => {
  const counter = useCounter();

  return (
    <>
      <div>{counter.count}</div>
      <button onClick={counter.inc}>Inc</button>
      <button onClick={counter.dec}>Dec</button>
    </>
  )
}
```
