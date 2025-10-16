import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  tip,
  style,
  className,
}) => {
  return (
    <Spin
      size={size}
      tip={tip}
      style={style}
      className={className}
      indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
    />
  );
};
