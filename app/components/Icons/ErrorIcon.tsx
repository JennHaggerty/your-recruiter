import React from 'react';
export const ErrorIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => {
  const height = props.height || '25px';
  const width = props.width || '25px';
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='currentColor'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.5-5.009c0-.867.659-1.491 1.491-1.491.85 0 1.509.624 1.509 1.491 0 .867-.659 1.509-1.509 1.509-.832 0-1.491-.642-1.491-1.509zM11.172 6a.5.5 0 0 0-.499.522l.306 7a.5.5 0 0 0 .5.478h1.043a.5.5 0 0 0 .5-.478l.305-7a.5.5 0 0 0-.5-.522h-1.655z'
        fill='currentColor'
      />
    </svg>
  );
};
