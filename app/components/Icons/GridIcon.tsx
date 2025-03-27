import React from 'react';
export const GridIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => {
  const height = props.height || '25px';
  const width = props.width || '25px';
  return (
    <svg width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7 1H1V7H7V1ZM7 9H1V15H7V9ZM9 1H15V7H9V1ZM15 9H9V15H15V9Z'
        fill='currentColor'
      />
    </svg>
  );
};
