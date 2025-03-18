import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@heroui/react";
import { FormEvent } from "react";
import SignupForm from "../Forms/SignupForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const SignupDrawer = (props: Props) => {
  const { isOpen, onClose, handleSubmit } = props;
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="dark text-white p-5"
    >
      <DrawerContent>
        <DrawerHeader className="text-2xl">Signup</DrawerHeader>

        <DrawerBody>
          <SignupForm handleSubmit={handleSubmit} />
        </DrawerBody>

        <DrawerFooter>
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SignupDrawer;
