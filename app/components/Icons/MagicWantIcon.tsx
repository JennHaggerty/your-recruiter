import React from 'react';
export const MagicWandIcon = (
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
        d='M3.5 20.5c.83.83 2.17.83 3 0l13-13c.83-.83.83-2.17 0-3-.83-.83-2.17-.83-3 0l-13 13c-.83.83-.83 2.17 0 3ZM18.01 8.99l-3-3'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
      ></path>
      <path
        d='M8.5 2.44 10 2l-.44 1.5L10 5l-1.5-.44L7 5l.44-1.5L7 2l1.5.44ZM4.5 8.44 6 8l-.44 1.5L6 11l-1.5-.44L3 11l.44-1.5L3 8l1.5.44ZM19.5 13.44 21 13l-.44 1.5L21 16l-1.5-.44L18 16l.44-1.5L18 13l1.5.44Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
    </svg>
  );
};
