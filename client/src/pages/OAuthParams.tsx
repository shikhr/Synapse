import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const OAuthParams = () => {
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    if (window.opener) {
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');
      const username = params.get('username');
      const displayName = params.get('displayName');
      const avatarId = params.get('avatarId');
      const email = params.get('email');
      const _id = params.get('_id');
      if (!refreshToken) {
        window.close();
        return;
      }
      window.opener.postMessage({
        accessToken,
        refreshToken,
        user: { username, email, _id, displayName, avatarId },
      });
      window.close();
    }
  });
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
};
export default OAuthParams;
