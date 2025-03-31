import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import AddForm from '../Forms/AddForm';
import { FormEvent } from 'react';
interface Props {
  onClose: () => void;
  onOpenChange: () => void;
  isOpen: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
const AddModal = (props: Props) => {
  const { onClose, onOpenChange, isOpen, onSubmit } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      scrollBehavior='outside'
      placement='center'
      size='3xl'
    >
      <ModalContent>
        <ModalHeader>Add Application Information</ModalHeader>
        <ModalBody>
          <AddForm handleSubmit={onSubmit} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default AddModal;
