import React, { useCallback, useState, useMemo, FC } from "react";
import { createStore, connect } from "./src/api";

const useCounter = createStore(() => {
  const [count, setCount] = useState(0);
  const inc = useCallback(() => setCount(prev => ++prev), []);
  const dec = useCallback(() => setCount(prev => --prev), []);

  return useMemo(() => ({
    count,
    inc,
    dec,
  }), []);
});

const MyComponent1: FC = () => {
  const counter = useCounter();

  return (
    <>
      <div>{counter.count}</div>
      <button onClick={counter.inc}>Inc</button>
      <button onClick={counter.dec}>Dec</button>
    </>
  );
}

const MyComponent2: FC = () => {
  return (
    <useCounter.Provider>
      {counter => (
        <>
          <div>{counter.count}</div>
          <button onClick={counter.inc}>Inc</button>
          <button onClick={counter.dec}>Dec</button>
        </>
      )}
    </useCounter.Provider>
  );
}

const _MyComponent3: FC<{ originalProp: boolean, counter: ReturnType<typeof useCounter> }> = ({ counter }) => {
  return (
    <>
      <div>{counter.count}</div>
      <button onClick={counter.inc}>Inc</button>
      <button onClick={counter.dec}>Dec</button>
    </>
  );
}
const MyComponent3 = connect({
  counter: useCounter,
})(_MyComponent3);


console.log(
  <>
    <MyComponent1 />
    <MyComponent2 />
    <MyComponent3 originalProp />
  </>
)
