'use client';
import { FormEvent, useState } from 'react';
import { Button, Form, Input } from '@heroui/react';
import { EyeFilledIcon } from '../Icons/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../Icons/EyeSlashFilledIcon';
interface Props {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
}
const LoginForm = (props: Props) => {
  const { loading, handleSubmit } = props;
  const [isVisible, setIsVisible] = useState<boolean>();
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <Form
      className='form flex flex-col gap-4 w-full my-3'
      validationBehavior='native'
      onSubmit={(e) => handleSubmit(e)}
    >
      <Input
        isRequired
        type='email'
        variant={'underlined'}
        labelPlacement={'outside'}
        label='Email'
        name='email'
        placeholder='Enter your email'
        errorMessage='Please enter a valid email'
      />
      <Input
        isRequired
        variant={'underlined'}
        labelPlacement={'outside'}
        label='Password'
        name='password'
        placeholder='Enter your password'
        errorMessage='Enter your password.'
        type={isVisible ? 'text' : 'password'}
        endContent={
          <Button
            aria-label='toggle password visibility'
            className='focus:outline-none w-auto mb-3'
            type='button'
            onPress={toggleVisibility}
            isIconOnly
          >
            {isVisible ? (
              <EyeSlashFilledIcon className='pointer-events-none' />
            ) : (
              <EyeFilledIcon className='pointer-events-none' />
            )}
          </Button>
        }
      />
      <Button
        type='submit'
        color={'primary'}
        className='w-full'
        isLoading={loading}
      >
        Login
      </Button>
    </Form>
  );
};
export default LoginForm;
