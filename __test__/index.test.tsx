import React, { useState } from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createStore } from '../src';

configure({ adapter: new Adapter() });

describe('createStore', () => {
  it('should dispatch update if actions called', async () => {
    const useCount = createStore(() => {
      const [count, setCount] = useState(0);
      return {
        count,
        setCount
      };
    });
    function Consumer() {
      const { count } = useCount();
      return <div className="consumer">{count}</div>;
    }

    function Producer({ mockFn }: { mockFn(): void }) {
      const { setCount } = useCount();
      mockFn();
      return (
        <div
          className="producer"
          onClick={() => setCount(prev => ++prev)}
        ></div>
      );
    }
    const mockFn = jest.fn(() => {});
    const producer = mount(<Producer mockFn={mockFn}></Producer>);
    const consumer = mount(<Consumer></Consumer>);
    const consumerDom = consumer.find('.consumer');
    const producerDom = producer.find('.producer');
    producerDom.simulate('click');
    await sleep(1000);
    expect(consumerDom.text()).toBe('1');
  });
  describe('returned useStore', () => {
    it('should not update if component use actions only', async () => {
      const useCount = createStore(() => {
        const [count, setCount] = useState(0);
        return {
          count,
          setCount
        };
      });
      function Consumer() {
        const { count } = useCount();
        return <div className="consumer">{count}</div>;
      }

      function Producer({ mockFn }: { mockFn(): void }) {
        const { setCount } = useCount();
        mockFn();
        return (
          <div
            className="producer"
            onClick={() => setCount(prev => ++prev)}
          ></div>
        );
      }
      const mockFn = jest.fn(() => {});
      const producer = mount(<Producer mockFn={mockFn}></Producer>);
      const consumer = mount(<Consumer></Consumer>);
      const consumerDom = consumer.find('.consumer');
      const producerDom = producer.find('.producer');
      producerDom.simulate('click');
      await sleep(1000);
      expect(consumerDom.text()).toBe('1');
      expect(mockFn).toBeCalledTimes(1);
    });
  });
});

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
