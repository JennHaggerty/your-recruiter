import { useUserContext } from '@/contexts/UserContext';
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
import React, { FormEvent, useState } from 'react';
import { EyeFilledIcon } from '../Icons/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../Icons/EyeSlashFilledIcon';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  isConnected?: boolean;
  handleOpenAi?: (e: FormEvent<HTMLFormElement>) => void;
  handleFirecrawl?: (e: FormEvent<HTMLFormElement>) => void;
  handleEmailChange?: (e: FormEvent<HTMLFormElement>) => void;
  handlePasswordChange?: (e: FormEvent<HTMLFormElement>) => void;
}
export const Settings = (props: Props) => {
  const {
    isOpen,
    onClose,
    isConnected,
    handleOpenAi,
    handleFirecrawl,
    handleEmailChange,
    handlePasswordChange,
  } = props;
  const { user_id, email, firecrawl_key, openai_key } = useUserContext();
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState<boolean>();
  const toggleCurrentPasswordVisibility = () =>
    setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState<boolean>();
  const toggleNewPasswordVisibility = () =>
    setIsNewPasswordVisible(!isNewPasswordVisible);
  const appSettings = [
    {
      name: isConnected,
      title: 'MongoDB',
      success: 'You are connected to MongoDB!',
      error: 'You are NOT connected to MongoDB.',
    },
    {
      name: openai_key,
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
        type: 'text',
        value: openai_key,
        handleSubmit: handleOpenAi,
      },
    },
    {
      name: firecrawl_key,
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
        type: 'text',
        value: firecrawl_key,
        handleSubmit: handleFirecrawl,
      },
    },
  ];
  const renderAppSettings = () => {
    return (
      <Accordion
        variant='bordered'
        selectionMode='multiple'
        defaultExpandedKeys={['0']}
      >
        {appSettings.map((setting, i) => (
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
                    type={setting.form.type}
                    placeholder={setting.form.placeholder}
                    defaultValue={setting.form.value}
                  />
                  <Button color='primary' type='submit' className='w-full'>
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    );
  };
  const userSettings = [
    {
      name: 'email-change',
      title: 'Email',
      form: {
        id: 'user-email',
        inputs: [
          {
            required: true,
            label: 'Email',
            name: 'email',
            placeholder: 'youremail@service.com',
            error: 'Please enter a valid email',
            type: 'email',
            value: email,
            endContent: null,
          },
        ],
        handleSubmit: handleEmailChange,
      },
    },
    {
      name: 'password-change',
      title: 'Password',
      form: {
        id: 'user-password',
        inputs: [
          {
            name: 'new-password',
            label: 'New Password',
            required: true,
            placeholder: 'Enter your new password.',
            type: isNewPasswordVisible ? 'text' : 'password',
            error: 'Please enter a new password.',
            value: '',
            endContent: (
              <Button
                aria-label='toggle password visibility'
                className='focus:outline-none w-auto mb-3'
                type='button'
                onPress={toggleNewPasswordVisibility}
                isIconOnly
              >
                {isNewPasswordVisible ? (
                  <EyeSlashFilledIcon className='pointer-events-none' />
                ) : (
                  <EyeFilledIcon className='pointer-events-none' />
                )}
              </Button>
            ),
          },
          {
            name: 'current-password',
            label: 'Current Password',
            required: true,
            placeholder: 'Enter your current password.',
            type: isCurrentPasswordVisible ? 'text' : 'password',
            error: 'Please enter your current password.',
            value: '',
            endContent: (
              <Button
                aria-label='toggle password visibility'
                className='focus:outline-none w-auto mb-3'
                type='button'
                onPress={toggleCurrentPasswordVisibility}
                isIconOnly
              >
                {isCurrentPasswordVisible ? (
                  <EyeSlashFilledIcon className='pointer-events-none' />
                ) : (
                  <EyeFilledIcon className='pointer-events-none' />
                )}
              </Button>
            ),
          },
        ],
        handleSubmit: handlePasswordChange,
      },
    },
  ];
  const renderUserSettings = () => {
    return (
      <Accordion variant='bordered' selectionMode='multiple'>
        {userSettings.map((setting, i) => (
          <AccordionItem
            key={i}
            aria-label={setting.title}
            title={setting.title}
          >
            {setting.form && (
              <Form
                id={setting.form.id}
                className='flex flex-col gap-3'
                validationBehavior='native'
                onSubmit={setting.form.handleSubmit}
              >
                <div className='w-full flex flex-col gap-3 mb-5'>
                  <Input
                    className='hidden'
                    isRequired
                    name='user_id'
                    defaultValue={user_id}
                  />
                  {setting.form.inputs.map((input, i) => (
                    <Input
                      key={`input-${i}`}
                      isRequired={input.required}
                      variant={'underlined'}
                      errorMessage={input.error}
                      label={input.label}
                      labelPlacement={'outside'}
                      name={input.name}
                      type={input.type}
                      placeholder={input.placeholder}
                      defaultValue={input.value}
                      endContent={input.endContent}
                    />
                  ))}
                  <Button color='primary' type='submit' className='w-full'>
                    {setting.name ? 'Update' : 'Add'}
                  </Button>
                </div>
              </Form>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    );
  };
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size='lg'
      className='dark text-white p-5'
    >
      <DrawerContent>
        <DrawerHeader className='text-2xl'>Settings</DrawerHeader>
        <DrawerBody className='gap-10'>
          {renderUserSettings()}
          {renderAppSettings()}
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
