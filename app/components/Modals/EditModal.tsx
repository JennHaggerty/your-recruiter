import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import EditForm from '../Forms/EditForm';
import { FormEvent } from 'react';
import JobInterface from '@/interfaces/JobInterface';
interface Props {
  item: JobInterface;
  onClose: () => void;
  onOpenChange: () => void;
  isOpen: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
const EditModal = (props: Props) => {
  const { item, onClose, onOpenChange, isOpen, onSubmit } = props;
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
        <ModalHeader>Edit Application Information</ModalHeader>
        <ModalBody>
          <EditForm
            item={item}
            handleSubmit={onSubmit}
            handleCancel={() => onClose()}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default EditModal;
