'use client';
import { Button } from '@heroui/react';
interface Props {
  handleSubmit?: () => void;
  handleReset?: () => void;
}
const ActionButtons = (props: Props) => {
  const { handleSubmit, handleReset } = props;
  return (
    <div className='flex gap-2 w-full'>
      <Button
        type='reset'
        variant='ghost'
        onPress={handleReset}
        className='w-full'
      >
        Reset
      </Button>
      <Button
        color='primary'
        type='submit'
        onPress={handleSubmit}
        className='w-full'
      >
        Submit
      </Button>
    </div>
  );
};
export default ActionButtons;
