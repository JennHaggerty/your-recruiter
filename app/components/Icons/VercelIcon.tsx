import React from 'react';
export const VercelIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => {
  const height = props.height || '25px';
  const width = props.width || '25px';
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 -17 256 256'
      version='1.1'
      preserveAspectRatio='xMidYMid'
      {...props}
    >
      <g>
        <polygon
          fill='currentColor'
          points='128 0 256 221.705007 0 221.705007'
        ></polygon>
      </g>
    </svg>
  );
};
