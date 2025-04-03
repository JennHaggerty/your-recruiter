import JobInterface from '@/interfaces/JobInterface';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { FormEvent } from 'react';
import EditResumeForm from '../Forms/EditResumeForm';
interface Props {
  item: JobInterface;
  onClose: () => void;
  isOpen: boolean;
  onEdit: (e: FormEvent<HTMLFormElement>) => void;
}
const EditResumeModal = (props: Props) => {
  const { item, onClose, isOpen, onEdit } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior='outside'
      size='3xl'
    >
      <ModalContent>
        <ModalHeader>Resume for {item.company_name}</ModalHeader>
        <ModalBody className='whitespace-break-spaces'>
          <EditResumeForm
            item={item}
            handleSubmit={onEdit}
            handleCancel={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default EditResumeModal;
