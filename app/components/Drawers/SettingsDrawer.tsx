import {
  Button,
  Accordion,
  AccordionItem,
  Badge,
  Form,
  Input,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Link,
} from '@heroui/react';
import React, { FormEvent } from 'react';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  isConnected?: boolean;
  handleOpenAi?: (e: FormEvent<HTMLFormElement>) => void;
  handleFirecrawl?: (e: FormEvent<HTMLFormElement>) => void;
  firecrawlKey?: string;
  openAiKey?: string;
}
export const Settings = (props: Props) => {
  const {
    isOpen,
    onClose,
    isConnected,
    handleOpenAi,
    handleFirecrawl,
    firecrawlKey,
    openAiKey,
  } = props;
  const userSettings = [
    {
      name: isConnected,
      title: 'MongoDB',
      success: 'You are connected to MongoDB!',
      error: 'You are NOT connected to MongoDB.',
    },
    {
      name: openAiKey,
      title: 'OpenAI Key',
      success: 'Open AI Key successfully added.',
      error: (
        <>
          Open AI is required to use AI features,{' '}
          <Link href='https://platform.openai.com/api-keys' className='inline'>
            get a key on the Open AI website.
          </Link>
        </>
      ),
      form: {
        id: 'add-openai',
        required: true,
        name: 'openAi',
        placeholder: 'sk-proj-***************',
        error: 'Please enter your Open AI key.',
        value: openAiKey,
        handleSubmit: handleOpenAi,
      },
    },
    {
      name: firecrawlKey,
      title: 'Firecrawl Key',
      success: 'Firecrawl Key successfully added.',
      error: (
        <>
          Firecrawl is required to use AI features,{' '}
          <Link href='https://www.firecrawl.dev' className='inline'>
            get a key on the Firecrawl website.
          </Link>
        </>
      ),
      form: {
        id: 'add-firecrawl',
        required: true,
        name: 'firecrawl',
        placeholder: 'fc-***************',
        error: 'Please enter your Firecrawl key.',
        value: firecrawlKey,
        handleSubmit: handleFirecrawl,
      },
    },
  ];
  const renderAccordionItems = () =>
    userSettings.map((setting, i) => (
      <AccordionItem
        key={i}
        aria-label={setting.title}
        title={
          !setting.name ? (
            <Badge color='danger' content='1' shape='circle'>
              <div className='pr-8'>{setting.title}</div>
            </Badge>
          ) : (
            setting.title
          )
        }
      >
        <div className='mb-3'>
          {setting.name ? (
            <span className='text-success'>{setting.success}</span>
          ) : (
            <span className='text-warning'>{setting.error}</span>
          )}
        </div>
        {setting.form && (
          <Form
            id={setting.form.id}
            className='flex flex-col gap-3'
            validationBehavior='native'
            onSubmit={setting.form.handleSubmit}
          >
            <div className='w-full flex flex-col gap-3 mb-5'>
              <Input
                isRequired={setting.form.required}
                variant={'underlined'}
                errorMessage={setting.form.error}
                label={setting.title}
                labelPlacement={'outside'}
                name={setting.form.name}
                placeholder={setting.form.placeholder}
                defaultValue={setting.form.value}
              />
              <Button color='primary' type='submit' className='w-full'>
                {setting.name ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        )}
      </AccordionItem>
    ));
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size='lg'
      className='dark text-white p-5'
    >
      <DrawerContent>
        <DrawerHeader className='text-2xl'>Settings</DrawerHeader>
        <DrawerBody>
          <Accordion
            variant='bordered'
            selectionMode='multiple'
            defaultExpandedKeys={['0']}
          >
            {renderAccordionItems()}
          </Accordion>
        </DrawerBody>
        <DrawerFooter>
          <Button variant='flat' onPress={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
