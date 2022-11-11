import { IAppContext } from './AppContext';
import { ActionKind } from './actions';

interface Action {
  type: ActionKind;
  payload?: any;
}

const reducer = (state: IAppContext, action: Action): IAppContext => {
  switch (action.type) {
    case ActionKind.REGISTER_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isLoggedIn: true,
      };
    case ActionKind.LOGOUT_USER:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
  }
};

export default reducer;
