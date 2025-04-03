import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import Details from '../Details/Details';
import JobInterface from '@/interfaces/JobInterface';
interface Props {
  item: JobInterface;
  onClose: () => void;
  isOpen: boolean;
  handleDelete: () => void;
  handleListEditClick: () => void;
  handleAutoCollect: () => void;
  handleAutoWriteCoverLetter: () => void;
  handleViewCoverLetter: () => void;
}
const DetailsModal = (props: Props) => {
  const {
    item,
    onClose,
    isOpen,
    handleAutoCollect,
    handleAutoWriteCoverLetter,
    handleDelete,
    handleListEditClick,
    handleViewCoverLetter,
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior='outside'
      size='3xl'
    >
      <ModalContent>
        <ModalHeader>{item.company_name}</ModalHeader>
        <ModalBody>
          <Details
            item={item}
            onDelete={handleDelete}
            onEdit={handleListEditClick}
            onAutoCollect={handleAutoCollect}
            onAutoCoverLetter={handleAutoWriteCoverLetter}
            onViewCoverLetter={handleViewCoverLetter}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default DetailsModal;
