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
import EditCoverLetterForm from '../Forms/EditCoverLetterForm';
interface Props {
  item: JobInterface;
  onClose: () => void;
  isOpen: boolean;
  onAutoWrite: (id: string) => void;
  onEdit: (e: FormEvent<HTMLFormElement>) => void;
}
const ViewCoverLetterModal = (props: Props) => {
  const { item, onClose, isOpen, onAutoWrite, onEdit } = props;
  const [showForm, setShowForm] = useState<boolean>();
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
          {showForm ? (
            <EditCoverLetterForm
              item={item}
              handleSubmit={onEdit}
              handleCancel={() => setShowForm(false)}
            />
          ) : (
            item.cover_letter
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
            <Button
              onPress={() => onAutoWrite(item?._id)}
              color='secondary'
              isDisabled={item.stage?.toLocaleLowerCase() === 'closed'}
            >
              <span
                className='text-success'
                aria-label='This action requires a financial transaction'
              >
                $
              </span>
              Rewrite
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ViewCoverLetterModal;
