import React from 'react';
export const CodeIcon = (
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
        d='M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit='10'
        strokeWidth='1.5'
      ></path>
      <path
        d='M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit='10'
        strokeWidth='1.5'
      ></path>
      <path
        d='M10 13L8 15L10 17'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit='10'
        strokeWidth='1.5'
      ></path>
      <path
        d='M14 13L16 15L14 17'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit='10'
        strokeWidth='1.5'
      ></path>
    </svg>
  );
};
