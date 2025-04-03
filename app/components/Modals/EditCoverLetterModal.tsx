import JobInterface from '@/interfaces/JobInterface';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { FormEvent } from 'react';
import EditCoverLetterForm from '../Forms/EditCoverLetterForm';
interface Props {
  item: JobInterface;
  onClose: () => void;
  isOpen: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
const EditCoverLetterModal = (props: Props) => {
  const { item, onClose, isOpen, onSubmit } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior='outside'
      size='3xl'
    >
      <ModalContent>
        <ModalHeader>{item.company_name} Cover Letter</ModalHeader>
        <ModalBody className='whitespace-break-spaces'>
          <EditCoverLetterForm
            item={item}
            handleSubmit={onSubmit}
            handleCancel={onClose}
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default EditCoverLetterModal;
