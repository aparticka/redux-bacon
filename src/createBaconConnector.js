import { createBaconComponent } from 'react-bacon-component';
import { propertyFromStore } from './';
import { PropTypes } from 'react';

export default (selectState, render, shouldPassThroughProps = false) => {
  const Connector = createBaconComponent(
    (propsP, contextP, componentHasMountedP, addSubscription) => selectState(
      propsP,
      contextP.flatMap(
        c => propertyFromStore(c.store).startWith(c.store.getState())
      ),
      contextP.map(c => c.store.dispatch),
      contextP,
      componentHasMountedP,
      addSubscription
    ),
    render, shouldPassThroughProps
  );
  Connector.displayName = 'Connector';
  Connector.contextTypes = { store: PropTypes.object };
  return Connector;
}
