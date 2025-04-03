import JobInterface from '@/interfaces/JobInterface';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { FormEvent, useState } from 'react';
import EditResumeForm from '../Forms/EditResumeForm';
interface Props {
  item: JobInterface;
  onClose: () => void;
  isOpen: boolean;
  onEdit: (e: FormEvent<HTMLFormElement>) => void;
}
const ResumeModal = (props: Props) => {
  const { item, onClose, isOpen, onEdit } = props;
  const [showForm, setShowForm] = useState<boolean>();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior='outside'
      size='3xl'
    >
      <ModalContent>
        <ModalHeader>{item.company_name} Resume</ModalHeader>
        <ModalBody className='whitespace-break-spaces'>
          {showForm ? (
            <EditResumeForm
              item={item}
              handleSubmit={onEdit}
              handleCancel={() => setShowForm(false)}
            />
          ) : (
            item.resume
          )}
        </ModalBody>
        {!showForm && (
          <ModalFooter>
            <Button
              onPress={() => setShowForm(true)}
              color='default'
              isDisabled={item.stage?.toLocaleLowerCase() === 'closed'}
            >
              Edit
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ResumeModal;
