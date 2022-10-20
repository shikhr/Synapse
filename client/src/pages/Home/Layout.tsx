import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default Layout;
