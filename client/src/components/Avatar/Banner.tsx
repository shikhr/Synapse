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
    <div className="w-full h-full overflow-hidden flex justify-center items-center">
      {defaultBanner && (
        <div className="absolute w-full h-full bg-gray-800"></div>
      )}
      {!defaultBanner && (
        <img
          onError={errorHandler}
          className="absolute inset-0 w-full h-full object-cover select-none"
          src={`/api/v1/users/avatar/${sourceId}`}
          alt=""
        />
      )}
      <div className="absolute backdrop-blur-2xl inset-0"></div>
      {children}
    </div>
  );
};

export default Banner;
