import React from 'react';
import './Loading.css';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

/**
 * Loading component
 * Global loading spinner with cosmic theme
 */
export const Loading: React.FC<LoadingProps> = ({
  message = 'Consultando os astros...',
  fullScreen = true,
}) => {
  const containerClass = fullScreen ? 'loading loading--fullscreen' : 'loading';

  return (
    <div className={containerClass}>
      <div className="loading__content">
        <div className="loading__orbit">
          <div className="loading__planet loading__planet--1" />
          <div className="loading__planet loading__planet--2" />
          <div className="loading__planet loading__planet--3" />
        </div>
        <div className="loading__sun" />
        <span className="loading__text">{message}</span>
      </div>
    </div>
  );
};

export default Loading;
