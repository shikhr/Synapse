import { FaGoogle } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';
import Button from '../UI/Button';

const OAuthButton = () => {
  const { registerUserSuccess } = useAppContext();
  const receiveMessage = (e: MessageEvent) => {
    const { data } = e;
    const { user, accessToken, refreshToken } = data;
    if (
      e.origin !== window.location.origin ||
      !user ||
      !accessToken ||
      !refreshToken
    ) {
      return;
    }
    registerUserSuccess({ user, accessToken, refreshToken });
  };

  return (
    <div className="w-full">
      <Button
        variant="standard"
        onClick={() => {
          window.open(
            '/api/v1/auth/google',
            'google',
            'toolbar=no, menubar=no, width=600, height=700, top=50, left=450'
          );
          window.addEventListener('message', (e) => receiveMessage(e), false);
        }}
      >
        <div className="flex justify-start items-center px-2">
          <FaGoogle />
          <p className="mx-auto">continue with google</p>
        </div>
      </Button>
    </div>
  );
};

export default OAuthButton;
