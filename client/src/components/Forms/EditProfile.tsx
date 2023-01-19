import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../UI/Modal';
import Overlay from '../UI/Overlay';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
import EditProfileForm from './EditProfileForm';
import useFetchProfile from '../../hooks/useFetchProfile';

const EditProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, authFetch, updateUser } = useAppContext();
  const location = useLocation();

  const prevPage = location.state?.pathname || '/';

  const closeFormHandler = () => {
    navigate(prevPage, { replace: true });
  };

  const updateProfileHandler = async (formData: FormData) => {
    return authFetch.patch('/users/profile', formData);
  };

  const { mutate: updateProfile } = useMutation(updateProfileHandler, {
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      queryClient.invalidateQueries(['post']);
      updateUser(data.data);
      closeFormHandler();
    },
  });

  const { data: profile, isLoading, isError, error } = useFetchProfile('me');

  return (
    <div>
      <Overlay closeModal={closeFormHandler} />
      <Modal>
        <>
          {!profile && (
            <div className="h-[80vh] flex justify-center items-center text-text-primary-dark">
              {isLoading && <div>loading</div>}
              {isError && <div>Something Went Wrong!</div>}
            </div>
          )}
          {profile && (
            <EditProfileForm
              profile={profile}
              closeHandler={closeFormHandler}
              updateProfile={updateProfile}
            />
          )}
        </>
      </Modal>
    </div>
  );
};

export default EditProfile;
