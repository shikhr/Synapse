import { useMutation } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../UI/Button';
import CustomModal from '../UI/CustomModal';
import DynamicNavTitle from '../UI/DynamicNavTitle';
import Modal from '../UI/Modal';
import Overlay from '../UI/Overlay';

const DeleteAccount = () => {
  const [delConfirm, setDelConfirm] = useState(false);

  const { authFetch, logoutUser } = useAppContext();

  const deleteAccountHandler = async () => {
    await authFetch.delete('settings/delete-account');
  };

  const { mutate: deleteAccount, isPending } = useMutation({
    mutationFn: deleteAccountHandler,
  });

  return (
    <div>
      <DynamicNavTitle title="Delete Account" />
      <div className="flex h-full flex-col gap-8 justify-center items-center">
        <div className="text-text-primary-dark  text-lg text-center py-4 px-16">
          This action is permanent, and will delete your account with all the
          saved data! Proceed with caution.
        </div>
        <div className="w-44">
          <Button variant="danger" onClick={() => setDelConfirm(true)}>
            DELETE ACCOUNT
          </Button>
        </div>
      </div>
      {delConfirm && (
        <CustomModal>
          <>
            <Overlay closeModal={() => setDelConfirm(false)} />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log('delte');
                deleteAccount();
              }}
              className="absolute position-center bg-background-dark rounded-lg py-8 gap-12  w-full max-w-lg flex flex-col justify-center items-center"
            >
              <p className="text-xl text-text-primary-dark">
                Are you sure you want to delete your account?
              </p>
              <div className="w-44">
                <Button disabled={isPending} type="submit" variant="danger">
                  CONFIRM
                </Button>
              </div>
            </form>
          </>
        </CustomModal>
      )}
    </div>
  );
};
export default DeleteAccount;
