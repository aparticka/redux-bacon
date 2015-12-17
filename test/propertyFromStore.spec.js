import { propertyFromStore } from '../src/index';
import { expect } from 'chai';
import { spy } from 'sinon';
import { isProperty } from 'react-bacon-component';

function createStore() {
  let state;
  let subscribers = [];

  return {
    getState: () => state,
    dispatch: action => {
      state = action;
      subscribers.forEach(subscriber => subscriber());
    },
    subscribe: subscriber => {
      subscribers.push(subscriber);
    }
  };
}

describe('propertyFromStore', () => {
  it('should return a `Property` from a store', () => {
    const store = createStore();
    const property = propertyFromStore(store);

    expect(isProperty(property)).to.equal(true);

    const onValue = spy();
    property.onValue(onValue);

    store.dispatch('a');
    store.dispatch('b');

    expect(onValue.callCount).to.equal(2);
    expect(onValue.args.map(arg => arg[0])).to.deep.equal(['a', 'b']);
  });
});
