import { IAppContext } from './AppContext';
import { ActionKind } from './actions';

interface Action {
  type: ActionKind;
  payload?: any;
}

const reducer = (state: IAppContext, action: Action) => {
  if (action.type === ActionKind.TEST) {
    console.log('first');
  }
  return state;
};

export default reducer;
