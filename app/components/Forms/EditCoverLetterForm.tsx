'use client';
import { FormEvent } from 'react';
import { Form, Input, Textarea } from '@heroui/react';
import JobInterface from '@/interfaces/JobInterface';
import ActionButtons from '../ActionButtons/ActionButtons';
interface Props {
  item: JobInterface;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleCancel?: () => void;
}
const EditCoverLetterForm = (props: Props) => {
  const { item, handleSubmit, handleCancel } = props;
  return (
    <Form
      className='form'
      validationBehavior='native'
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className='flex flex-col gap-4 w-full mb-3'>
        <Input
          className='hidden'
          isRequired
          label='Application Id'
          name='_id'
          defaultValue={item._id}
        />
        <Textarea
          isClearable
          variant={'underlined'}
          label='Write or edit your cover letter'
          labelPlacement={'outside'}
          name='cover_letter'
          placeholder={`Write your cover letter`}
          type='textarea'
          defaultValue={item.cover_letter}
        />
      </div>
      <ActionButtons handleCancel={handleCancel} />
    </Form>
  );
};
export default EditCoverLetterForm;
