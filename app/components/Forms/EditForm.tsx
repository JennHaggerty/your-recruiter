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
  Divider,
} from '@heroui/react';
import { today, getLocalTimeZone } from '@internationalized/date';
import Job from '@/interfaces/Job';
import ActionButtons from '../ActionButtons/ActionButtons';
const stages = [
  { key: 'interested', label: 'Interested' },
  { key: 'applied', label: 'Applied' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'closed', label: 'Closed' },
  { key: 'interviewing', label: 'Interviewing' },
];
interface Props {
  item: Job;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleCancel?: () => void;
  loading?: boolean;
}
const EditForm = (props: Props) => {
  const { item, handleSubmit, handleCancel, loading } = props;
  const [addCustomStage, setAddCustomStage] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [followupDate, setFollowUpDate] = useState(
    today(getLocalTimeZone()).toString()
  );
  return (
    <Form
      className='form'
      validationBehavior='native'
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className='flex flex-col gap-4 w-full mb-3'>
        <span>Required Fields</span>
        <Input
          className='hidden'
          isRequired
          label='Application Id'
          name='_id'
          defaultValue={item._id}
        />
        <Input
          isDisabled={!!item.posting_url}
          variant={'underlined'}
          errorMessage='Please enter a valid url.'
          label='Posting Url'
          labelPlacement={'outside'}
          name='postingUrl'
          placeholder={`Enter posting url "http://example.com"`}
          type='url'
          defaultValue={item.posting_url}
        />
        <Textarea
          isDisabled={!!item._markdown}
          variant={'underlined'}
          isClearable
          label='Job Description'
          labelPlacement={'outside'}
          name='_markdown'
          placeholder='Paste the job description or use AI to collect it. The job description is needed for AI functions to work accurately.'
          defaultValue={item._markdown ? 'Description was added' : ''}
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
          errorMessage='Please enter a valid name.'
          label='Company Name'
          labelPlacement={'outside'}
          name='company_name'
          placeholder='Enter company name'
          type='text'
          defaultValue={item.company_name}
        />
        <Input
          variant={'underlined'}
          errorMessage='Please enter a valid url.'
          label='Company Url'
          labelPlacement={'outside'}
          name='company_url'
          placeholder={`Enter hiring company's url "http://example.com"`}
          type='url'
          defaultValue={item.company_url}
        />
        <Input
          variant={'underlined'}
          label='Location'
          labelPlacement={'outside'}
          name='location'
          placeholder={'Enter job location'}
          type='text'
          defaultValue={item.location}
        />
        <Input
          variant={'underlined'}
          label='Salary Range'
          labelPlacement={'outside'}
          name='salary'
          placeholder={'Enter as a number or range'}
          type='text'
          defaultValue={item.salary}
        />
        <Input
          variant={'underlined'}
          label='Tools'
          labelPlacement={'outside'}
          name='tools'
          placeholder={'"React, TypeScript, Next.js"'}
          type='text'
          defaultValue={item.tools}
        />
        <Input
          variant={'underlined'}
          label='Remote'
          labelPlacement={'outside'}
          name='remote'
          placeholder='Remote, hybrid, other'
          type='text'
          defaultValue={item.remote}
        />
        <Input
          variant={'underlined'}
          label='Cover letter'
          labelPlacement={'outside'}
          name='cover_letter_requirements'
          placeholder='Cover letter requirements'
          type='text'
          defaultValue={item.cover_letter_requirements}
        />
        <Select
          variant={'underlined'}
          label='Stage'
          labelPlacement={'outside'}
          name='stage'
          placeholder='At what stage in the application process are you?'
          defaultSelectedKeys={[item.stage || '']}
        >
          {stages.map((option) => (
            <SelectItem key={option.key} isSelected={option.key === item.stage}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
        <Textarea
          variant={'underlined'}
          isClearable
          label='Note'
          labelPlacement={'outside'}
          name='note'
          placeholder='Write a note'
          defaultValue={''}
        />
        {item.notes &&
          item.notes.map((note, i) => (
            <div key={`notes-${i}`} className='flex flex-col'>
              {note.content}
              <span className='w-full text-right text-default-500 italic mt-1'>
                {new Date(note._date).toDateString()}
              </span>
              {item.notes!.length > 1 && <Divider />}
            </div>
          ))}
        {item.followup_date && <span>Follow-up: {item.followup_date}</span>}
        <Checkbox
          aria-label='Schedule a new follow-up reminder'
          isSelected={followUp}
          onValueChange={setFollowUp}
        >
          Follow-up Date
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
export default EditForm;
