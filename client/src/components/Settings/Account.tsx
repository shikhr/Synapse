import { BsKey } from 'react-icons/bs';
import { IoLogOutOutline, IoMailOutline } from 'react-icons/io5';
import { RiDeleteBinLine, RiUserLine } from 'react-icons/ri';
import DynamicNavTitle from '../UI/DynamicNavTitle';
import SettingsItem from './SettingsItem';

const Account = () => {
  return (
    <>
      <DynamicNavTitle title="Your Account" />
      <div className="flex flex-col justify-center items-center">
        <SettingsItem to="" Icon={IoMailOutline}>
          <h4>Change your email</h4>
        </SettingsItem>
        <SettingsItem to="" Icon={RiUserLine}>
          <h4>Change your username</h4>
        </SettingsItem>
        <SettingsItem to="password" Icon={BsKey}>
          <h4>Change your password</h4>
        </SettingsItem>
        <SettingsItem to="" Icon={IoLogOutOutline}>
          <h4>Log out of all devices</h4>
        </SettingsItem>
        <SettingsItem to="delete-account" Icon={RiDeleteBinLine}>
          <h4>Delete your account</h4>
        </SettingsItem>
      </div>
    </>
  );
};
export default Account;
