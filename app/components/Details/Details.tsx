import JobInterface from '@/interfaces/JobInterface';
import { Chip, Divider } from '@heroui/react';
import ApplicationActionButtons from '../ActionButtons/ApplicationActionButtons';
import { getBadgeColor } from '@/functions/functions';
import { useUserContext } from '@/contexts/UserContext';
interface Props {
  item: JobInterface;
  onAutoCollect: (id: string) => void;
  onAutoCoverLetter?: (id: string) => void;
  onViewCoverLetter?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}
const Details = (props: Props) => {
  const {
    item,
    onAutoCollect,
    onAutoCoverLetter,
    onViewCoverLetter,
    onDelete,
    onEdit,
  } = props;
  const { firecrawl_key, openai_key } = useUserContext();
  const renderNotes = (item: JobInterface) => {
    if (!item.notes) return;
    item.notes.sort((a, b) => {
      return new Date(a._date).getTime() - new Date(b._date).getTime();
    });
    return (
      <div className='flex'>
        <div className='flex flex-col w-full'>
          {item.notes
            .sort((a, b) => {
              return new Date(a._date).getTime() - new Date(b._date).getTime();
            })
            .map((note, i) => {
              return (
                <div key={`notes-${i}`} className='flex flex-col'>
                  {note.content}
                  <span className='w-full text-right text-default-500 italic mt-1'>
                    {new Date(note._date).toDateString()}
                  </span>
                  {item.notes!.length > 1 && <Divider className='my-1' />}
                </div>
              );
            })}
        </div>
      </div>
    );
  };
  return (
    <dl className='flex flex-col gap-3'>
      {Object.keys(item).map((key) => {
        if (key === 'tools' && item.tools) {
          return (
            <div key={key}>
              <dt className='font-bold'>{key.toUpperCase()}</dt>
              <dd className='flex flex-wrap gap-2 justify-content mb-2'>
                {item[key]?.split(',').map((_item, index) => {
                  return (
                    <Chip key={index} variant='flat' radius='none'>
                      {_item}
                    </Chip>
                  );
                })}
              </dd>
              <Divider className='my-1' />
            </div>
          );
        } else if (key === 'notes') {
          return (
            <div key={key}>
              <div className='card-info flex justify-between'>
                <dt className='font-bold'>{key.toUpperCase()}</dt>
                <dd>{renderNotes(item)}</dd>
              </div>
            </div>
          );
        } else if (key === 'stage') {
          return (
            <div key={key}>
              <div className='flex justify-between'>
                <dt className='font-bold'>{key.toUpperCase()}</dt>
                <dd className='flex flex-wrap gap-2 justify-content mb-2'>
                  {item[key]?.split(',').map((_item, index) => {
                    return (
                      <Chip
                        key={index}
                        className='capitalize'
                        color={getBadgeColor(item.stage)}
                        size='sm'
                        variant='flat'
                      >
                        {_item}
                      </Chip>
                    );
                  })}
                </dd>
              </div>
              <Divider className='my-1' />
            </div>
          );
        } else if (
          !key.startsWith('_') &&
          key !== 'posting_url' &&
          key !== 'company_name' &&
          key !== 'company_url' &&
          key !== 'automated_cover_letter' &&
          item[key]
        ) {
          return (
            <div key={key}>
              <div className='card-info flex justify-between'>
                <dt className='font-bold'>
                  {key.replaceAll('_', ' ').toUpperCase()}
                </dt>
                <dd className=''>{item[key]}</dd>
              </div>
              <Divider className='my-1' />
            </div>
          );
        }
      })}
      <div className='flex flex-col gap-2 justify-center w-full'>
        <ApplicationActionButtons
          item={item}
          onAutoCollect={onAutoCollect}
          onAutoCoverLetter={onAutoCoverLetter}
          onViewCoverLetter={onViewCoverLetter}
          onDelete={onDelete}
          onEdit={onEdit}
          disableFirecrawl={!firecrawl_key}
          disableOpenAi={!openai_key}
          variant='solid'
        />
        {item._date_modified ? (
          <span className='text-default-500 italic text-center'>
            Last updated {new Date(item._date_modified).toDateString()}
          </span>
        ) : item._date_added ? (
          <span className='text-default-500 italic text-center'>
            Added on {new Date(item._date_added).toDateString()}
          </span>
        ) : (
          ''
        )}
      </div>
    </dl>
  );
};
export default Details;
