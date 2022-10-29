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
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
  }
};

export default reducer;
