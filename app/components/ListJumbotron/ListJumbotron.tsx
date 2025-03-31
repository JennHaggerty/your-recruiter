import { useUserContext } from '@/contexts/UserContext';
import { Card, CardBody, Form, Button, Input } from '@heroui/react';
import { FormEvent } from 'react';
interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onManualAdd: () => void;
}
const ListJumbotron = (props: Props) => {
  const { onSubmit, onManualAdd } = props;
  const { user_id, firecrawl_key } = useUserContext();
  return (
    <div className='w-full flex flex-col md:flex-row mb-8'>
      <div className=' w-full md:w-1/2 flex flex-col gap-2 items-center md:items-start justify-center mb-12 lg:mb-0'>
        <h1 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
          Begin your next&nbsp;
        </h1>
        <h1 className='tracking-tight inline font-semibold from-[#6FEE8D] to-[#17c964] text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b'>
          adventure.
        </h1>
      </div>
      <Card className='w-full md:w-1/2 flex flex-col p-3 md:p-5 items-start justify-center'>
        <CardBody>
          <Form
            id='quick-add'
            className='flex flex-col'
            validationBehavior='native'
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(e);
            }}
          >
            <Input className='hidden' name='_user_id' defaultValue={user_id} />
            <Input
              isRequired
              variant={'underlined'}
              errorMessage='Please enter a valid url.'
              label='Posting Url'
              labelPlacement={'outside'}
              name='posting_url'
              placeholder='Enter a posting url, http://example.com'
              type='url'
            />
            <div className='flex flex-row w-full gap-2'>
              <Button
                variant='flat'
                color='primary'
                type='button'
                onPress={onManualAdd}
                className='w-full'
              >
                Add Manually
              </Button>
              <Button
                color='secondary'
                type='submit'
                isDisabled={!firecrawl_key}
                className='w-full'
              >
                Add with AI
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};
export default ListJumbotron;
