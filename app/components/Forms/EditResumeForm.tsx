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
const EditResumeForm = (props: Props) => {
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
          label='Write or edit your resume'
          labelPlacement={'outside'}
          name='resume'
          placeholder={`Write your resume`}
          type='textarea'
          defaultValue={item.resume}
        />
      </div>
      <ActionButtons handleCancel={handleCancel} />
    </Form>
  );
};
export default EditResumeForm;
