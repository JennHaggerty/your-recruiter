import React from 'react';
export const ChevronDownIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => {
  const height = props.height || '25px';
  const width = props.width || '25px';
  return (
    <svg
      aria-hidden='true'
      fill='none'
      focusable='false'
      role='presentation'
      viewBox='0 0 24 24'
      width={width}
      height={height}
      {...props}
    >
      <path
        d='m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit={10}
        strokeWidth={props.strokeWidth}
      />
    </svg>
  );
};
