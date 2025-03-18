import Job from '@/app/interfaces/Job';
import { Button, Tooltip } from '@heroui/react';
import { DeleteIcon } from '../Icons/DeleteIcon';
import { EditIcon } from '../Icons/EditIcon';
interface Props {
  item: Job;
  loading?: boolean;
  loadingAI?: boolean;
  onAutoCollect?: (id: string) => void;
  onAutoCoverLetter?: (id: string) => void;
  onViewCoverLetter?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  disableOpenAi?: boolean;
  disableFirecrawl?: boolean;
  variant?:
    | 'flat'
    | 'solid'
    | 'bordered'
    | 'light'
    | 'faded'
    | 'shadow'
    | 'ghost'
    | undefined;
}
const ApplicationActionButtons = (props: Props) => {
  const {
    item,
    loading,
    loadingAI,
    onAutoCollect,
    onAutoCoverLetter,
    onViewCoverLetter,
    onDelete,
    onEdit,
    disableOpenAi,
    disableFirecrawl,
    variant,
  } = props;
  return (
    <div className='flex gap-2 w-full'>
      {onAutoCollect && (
        <Button
          variant={variant ? variant : 'flat'}
          color='secondary'
          onPress={() => onAutoCollect(item._id)}
          className='w-full'
          isLoading={loadingAI}
          isDisabled={
            !!item._markdown ||
            item.stage?.toLocaleLowerCase() === 'closed' ||
            disableFirecrawl
          }
        >
          Get Information
        </Button>
      )}
      {onViewCoverLetter && item.automated_cover_letter && (
        <Button
          variant={variant ? variant : 'flat'}
          color='default'
          onPress={() => onViewCoverLetter(item._id)}
          className='w-full'
          isLoading={loading}
          isDisabled={!item.automated_cover_letter}
        >
          View cover letter
        </Button>
      )}
      {onAutoCoverLetter && !item.automated_cover_letter && (
        <Button
          variant={variant ? variant : 'flat'}
          color='secondary'
          onPress={() => onAutoCoverLetter(item._id)}
          className='w-full'
          isLoading={loadingAI}
          isDisabled={
            !!item.automated_cover_letter ||
            !item._markdown ||
            item.stage?.toLocaleLowerCase() === 'closed' ||
            disableOpenAi
          }
        >
          <span
            className='text-success'
            aria-label='This action requires a financial transaction'
          >
            $
          </span>
          Write Cover Letter
        </Button>
      )}
      {onEdit && (
        <>
          <Tooltip content='Edit' className='desktop-only'>
            <Button
              variant={variant ? variant : 'flat'}
              color='primary'
              onPress={() => onEdit(item._id)}
              isLoading={loading}
              aria-label='Edit'
              className='desktop-only'
              isIconOnly={true}
            >
              <EditIcon />
            </Button>
          </Tooltip>
          <Button
            variant={variant ? variant : 'flat'}
            color='primary'
            onPress={() => onEdit(item._id)}
            className='w-full mobile-only'
            isLoading={loading}
          >
            Edit
          </Button>
        </>
      )}
      {onDelete && (
        <>
          <Tooltip
            color='danger'
            content='Delete application'
            className='desktop-only'
          >
            <Button
              variant={variant ? variant : 'flat'}
              color='danger'
              onPress={() => onDelete(item._id)}
              isLoading={loading}
              aria-label='Delete'
              className='desktop-only'
              isIconOnly={true}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
          <Button
            variant={variant ? variant : 'flat'}
            color='danger'
            onPress={() => onDelete(item._id)}
            className='w-full mobile-only'
            isLoading={loading}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  );
};
export default ApplicationActionButtons;
