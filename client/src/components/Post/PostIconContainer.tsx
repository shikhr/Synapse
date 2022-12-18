import React from 'react';

const PostIiconContainer = ({
  color,
  children,
  onClick,
}: {
  color: string;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => any;
}) => {
  return (
    <div
      onClick={onClick}
      className={`${color} flex gap-2 items-center transition-all`}
    >
      {children}
    </div>
  );
};
export default PostIiconContainer;
