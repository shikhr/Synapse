import React from 'react';
import { motion } from 'framer-motion';

const FadeInView = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => any;
}) => {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
export default FadeInView;
