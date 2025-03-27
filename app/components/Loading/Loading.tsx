import React from 'react';
import { Spinner } from '@heroui/react';
interface Props {}
const Loading = (props: Props) => {
  return (
    <div className='w-full h-full bg-default-50/20 absolute'>
      <div className='w-full h-full relative z-10'>
        <div className='absolute top-[30%] left-[50%] z-20'>
          <Spinner size='lg' color='secondary' />
        </div>
      </div>
    </div>
  );
};
export default Loading;
