import React from 'react';
export const PlusIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => {
  const height = props.height || '25px';
  const width = props.width || '25px';
  return (
    <svg
      width={width}
      height={height}
      aria-hidden='true'
      fill='none'
      focusable='false'
      role='presentation'
      viewBox='0 0 24 24'
    >
      <g
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
      >
        <path d='M6 12h12' />
        <path d='M12 18V6' />
      </g>
    </svg>
  );
};
