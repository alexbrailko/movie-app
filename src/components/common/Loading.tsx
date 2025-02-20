import React from 'react';
import '../../styles/Loading.scss';

interface LoadingProps {
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ className }) => {
  return <div className={`loading ${className || ''}`}>Loading...</div>;
};
