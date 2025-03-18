'use client';
import { ChangeEvent, FormEvent, useState } from 'react';
import {
  Form,
  Input,
  Select,
  SelectItem,
  Textarea,
  Calendar,
  Checkbox,
} from '@heroui/react';
import { today, getLocalTimeZone } from '@internationalized/date';
import ActionButtons from '../ActionButtons/ActionButtons';
import { label } from 'framer-motion/client';
const stages = [
  { key: 'interested', label: 'Interested' },
  { key: 'applied', label: 'Applied' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'closed', label: 'Closed' },
  { key: 'interviewing', label: 'Interviewing' },
];
interface Props {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleCancel?: () => void;
  loading?: boolean;
}
const AddForm = (props: Props) => {
  const { handleSubmit, handleCancel, loading } = props;
  const [addCustomStage, setAddCustomStage] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [followupDate, setFollowUpDate] = useState(
    today(getLocalTimeZone()).toString()
  );
  return (
    <Form className='form' validationBehavior='native' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4 w-full mb-3'>
        <span>Required Fields</span>
        <Input
          isRequired
          variant={'underlined'}
          errorMessage='Please enter a valid url.'
          label='Posting Url'
          labelPlacement={'outside'}
          name='posting_url'
          placeholder='Enter posting url "http://example.com"'
          type='url'
          fullWidth={true}
        />
        <Textarea
          variant={'underlined'}
          isClearable
          label='Job Descriptions'
          labelPlacement={'outside'}
          name='_markdown'
          placeholder='Paste the job description or use AI to collect it. The job description is needed for AI functions to work accurately.'
        />
      </div>
      <div className='flex flex-col gap-4 w-full mb-3'>
        <span>Optional Fields</span>
        <Input
          variant={'underlined'}
          label='Role / Position'
          labelPlacement={'outside'}
          name='role'
          placeholder='What is the role?'
          type='text'
        />
        <Input
          variant={'underlined'}
          label='Company Name'
          labelPlacement={'outside'}
          name='company_name'
          placeholder='Enter company name'
          type='text'
        />
        <Input
          variant={'underlined'}
          errorMessage='Please enter a valid url.'
          label='Company Url'
          labelPlacement={'outside'}
          name='company_url'
          placeholder={`Enter hiring company's url "http://example.com"`}
          type='url'
        />
        <Input
          variant={'underlined'}
          label='Location'
          labelPlacement={'outside'}
          name='location'
          placeholder={'Enter job location'}
          type='text'
        />
        <Input
          variant={'underlined'}
          label='Salary Range'
          labelPlacement={'outside'}
          name='salary'
          placeholder={'Enter as a number or range'}
          type='text'
        />
        <Input
          variant={'underlined'}
          label='Tools'
          labelPlacement={'outside'}
          name='tools'
          placeholder={'"React, TypeScript, Next.js"'}
          type='text'
        />
        <Input
          variant={'underlined'}
          label='Cover letter'
          labelPlacement={'outside'}
          name='cover_letter_requirements'
          placeholder='Cover letter requirements'
          type='text'
        />
        <Select
          variant={'underlined'}
          label='Stage'
          labelPlacement={'outside'}
          name='stage'
          placeholder='At what stage in the application process are you?'
        >
          {stages.map((option) => (
            <SelectItem key={option.key}>{option.label}</SelectItem>
          ))}
        </Select>
        <Textarea
          variant={'underlined'}
          isClearable
          label='Notes'
          labelPlacement={'outside'}
          name='note'
          placeholder='Write a note'
        />
        <Checkbox
          aria-label='Schedule a follow-up reminder'
          isSelected={followUp}
          onValueChange={setFollowUp}
        >
          Follow-up reminder?
        </Checkbox>
        {followUp && (
          <div className='m-auto'>
            <Calendar
              aria-label='Select date to follow-up'
              defaultValue={today(getLocalTimeZone())}
              onChange={(value) => setFollowUpDate(value.toString())}
            />
            <Input
              className='hidden'
              label='Follow-up date'
              name='followup_date'
              value={followupDate}
            />
          </div>
        )}
      </div>
      <ActionButtons handleCancel={handleCancel} loading={loading} />
    </Form>
  );
};
export default AddForm;
