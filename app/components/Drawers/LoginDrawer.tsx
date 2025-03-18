import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@heroui/react';
import LoginForm from '../Forms/LoginForm';
import { FormEvent } from 'react';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
const LoginDrawer = (props: Props) => {
  const { isOpen, onClose, handleSubmit } = props;
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size='md'
      className='dark text-white p-5'
    >
      <DrawerContent>
        <DrawerHeader className='text-2xl'>Login</DrawerHeader>
        <DrawerBody>
          <LoginForm handleSubmit={handleSubmit} />
        </DrawerBody>
        <DrawerFooter>
          <Button variant='flat' onPress={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default LoginDrawer;
