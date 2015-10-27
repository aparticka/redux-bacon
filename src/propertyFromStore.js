import Bacon from 'baconjs';

export default store =>
  Bacon.fromBinder(sink => store.subscribe(() => sink(store.getState()))).toProperty();
