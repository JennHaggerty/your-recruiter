import React from 'react';
export const LightningBoltIcon = (
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
      {...props}
    >
      <path
        d='M6.09 13.28h3.09v7.2c0 1.68.91 2.02 2.02.76l7.57-8.6c.93-1.05.54-1.92-.87-1.92h-3.09v-7.2c0-1.68-.91-2.02-2.02-.76l-7.57 8.6c-.92 1.06-.53 1.92.87 1.92Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit='10'
        strokeWidth='1.5'
      ></path>
    </svg>
  );
};
