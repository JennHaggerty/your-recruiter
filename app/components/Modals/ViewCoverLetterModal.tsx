import JobInterface from '@/interfaces/JobInterface';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
interface Props {
  item: JobInterface;
  onClose: () => void;
  onOpenChange: () => void;
  isOpen: boolean;
  onSubmit: (id: string) => void;
}
const ViewCoverLetterModal = (props: Props) => {
  const { item, onClose, onOpenChange, isOpen, onSubmit } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      scrollBehavior='outside'
      size='3xl'
    >
      <ModalContent>
        <ModalHeader>{item.company_name} Cover Letter</ModalHeader>
        <ModalBody>{item.automated_cover_letter}</ModalBody>
        <ModalFooter>
          <Button
            onPress={() => onSubmit(item?._id)}
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
      </ModalContent>
    </Modal>
  );
};
export default ViewCoverLetterModal;
