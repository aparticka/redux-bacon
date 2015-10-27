import createBaconConnector from '../src/createBaconConnector';
import { createStore, combineReducers } from 'redux';
import Bacon from 'baconjs';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';

const actionCreators = {
  incrementBy: amount => ({ type: 'INCREMENT_BY', payload: amount })
};

function amountReducer(state = 0, action = {}) {
  return action.type === 'INCREMENT_BY' ?
    state + action.payload :
    state;
}

function getRenderedComponentInContainer(Component, Container, store) {
  const rendered = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <Container pass='through'/>
    </Provider>
  );
  return TestUtils.findRenderedComponentWithType(rendered, Component);
}

describe('createBaconConnector', () => {
  const store = createStore(combineReducers({ amount: amountReducer }));

  const Amount = React.createClass({ render: () => <div /> });

  const selectState = (propsP, stateP, dispatchP) => {
    const incrementByP = dispatchP
      .map(dispatch => amount => dispatch(actionCreators.incrementBy(amount)));
    const amountP = stateP
      .map('.amount');
    return Bacon.combineTemplate({
      amount: amountP,
      incrementBy: incrementByP
    });
  };

  const render = props => <Amount {...props} />;

  it('creates a Connector-like component using Bacon.js', () => {
    const AmountContainer = createBaconConnector(selectState, render);
    const component = getRenderedComponentInContainer(Amount, AmountContainer, store);
    expect(component.props.amount).to.equal(0);
    component.props.incrementBy(20);
    expect(component.props.amount).to.equal(20);
    component.props.incrementBy(4);
    expect(component.props.amount).to.equal(24);
    component.props.incrementBy(-10);
    expect(component.props.amount).to.equal(14);
  });
  it('passes props through if shouldPassThroughProps set to true', () => {
    const AmountContainer = createBaconConnector(selectState, render, true);
    const component = getRenderedComponentInContainer(Amount, AmountContainer, store);
    expect(component.props.pass).to.equal('through');
  });
  it('does not pass props through if shouldPassThroughProps set to false', () => {
    const AmountContainer = createBaconConnector(selectState, render);
    const component = getRenderedComponentInContainer(Amount, AmountContainer, store);
    expect(component.props.pass).to.equal(undefined);
  });
});
