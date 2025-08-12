import React, { useState, useEffect } from 'react';

const Banner = ({
  sourceId,
  children,
}: {
  sourceId: any;
  children: React.ReactNode;
}) => {
  const [defaultBanner, setDefaultBanner] = useState(true);

  useEffect(() => {
    if (sourceId && sourceId.length > 0) {
      setDefaultBanner(false);
    }
  }, [sourceId]);

  const errorHandler = (e: React.SyntheticEvent) => {
    setDefaultBanner(true);
  };

  return (
    <div className="w-full h-full flex items-center">
      {defaultBanner && (
        <div className="absolute w-full h-full bg-gray-800"></div>
      )}
      {!defaultBanner && (
        <img
          onError={errorHandler}
          className="w-full h-40 object-cover"
          src={`${import.meta.env.VITE_APP_API_URL}/api/v1/users/avatar/${sourceId}`}
          alt=""
        />
      )}
      <div className="absolute backdrop-filter backdrop-blur-xl backdrop-brightness-125 h-36 w-full"></div>
      {children}
    </div>
  );
};

export default Banner;
