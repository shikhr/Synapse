import React, { useEffect, useState } from 'react';

import { FaUserCircle } from 'react-icons/fa';

const Avatar = ({ sourceId }: { sourceId: any }) => {
  const [defaultAvatar, setDefaultAvatar] = useState(true);

  useEffect(() => {
    if (sourceId && sourceId.length > 0) {
      setDefaultAvatar(false);
    }
  }, [sourceId]);

  const errorHandler = (e: React.SyntheticEvent) => {
    setDefaultAvatar(true);
  };

  return (
    <div className="w-full h-full rounded-full overflow-hidden bg-gray-700 flex justify-center items-center">
      {defaultAvatar && (
        <div className="text-gray-200">
          <FaUserCircle />
        </div>
      )}
      {!defaultAvatar && (
        <img
          onError={errorHandler}
          className="w-full h-full object-cover"
          src={`${import.meta.env.VITE_APP_API_URL}/api/v1/users/avatar/${sourceId}`}
          alt=""
        />
      )}
    </div>
  );
};

export default Avatar;
