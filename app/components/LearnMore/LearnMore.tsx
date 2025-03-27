import React from 'react';
import { LinkIcon } from '@heroui/react';
import { EditIcon } from '@/app/components/Icons/EditIcon';
import { GithubIcon } from '../Icons/GithubIcon';
const LearnMore = () => {
  const renderOpenSource = () => (
    <>
      <section className="relative  z-10 flex-col gap-2 bg-transparent dark:bg-transparent before:bg-background/10 before:content-[''] before:block before:z-[-1] before:absolute before:inset-0 before:backdrop-blur-md before:backdrop-saturate-200 border-t border-b border-divider  flex justify-center items-center py-8">
        <div className='px-12 lg:px-10 flex flex-col gap-8 md:max-w-7xl'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='flex flex-col gap-2 justify-center w-full mb-4'>
              <div className='inline-flex items-center'>
                <h2 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
                  Learn More
                </h2>
              </div>
              <p className='w-full my-2 text-left font-normal text-default-500 block max-w-full md:w-full text-base lg:text-lg'>
                Jennifer began this project while searching for employment and
                wanting a "source of truth" to where she applied, when and with
                whom, she created Your Recruiter. Her goal for this project is
                to share with local libraries and improve employment rates
                within the community.
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <button
                className='flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large cursor-pointer transition-transform-background motion-reduce:transition-none data-[pressed=true]:scale-[0.97] tap-highlight-transparent border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]'
                type='button'
                role='button'
                onClick={() => {
                  location.href = 'mailto:thejenniferhaggerty@gmail.com';
                }}
              >
                <div className='flex p-3 mb-2 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
                  <div className='flex justify-center p-2 rounded-full items-center bg-transparent'>
                    <EditIcon className='h-[25px]' />
                  </div>
                  <p className='text-base font-semibold'>Email</p>
                  <LinkIcon />
                </div>
                <div className='relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased pt-0'>
                  <p className='font-normal text-medium text-default-500'>
                    Feel free to reach out to me with questions, comments, or to
                    request a demo.
                  </p>
                </div>
              </button>
              <button
                className='flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large cursor-pointer transition-transform-background motion-reduce:transition-none data-[pressed=true]:scale-[0.97] tap-highlight-transparent border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]'
                type='button'
                role='button'
                onClick={() => {
                  location.href =
                    'https://github.com/JennHaggerty/your-recruiter';
                }}
              >
                <div className='flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
                  <div className='flex justify-center p-2 rounded-full items-center text-default-500 bg-transparent'>
                    <GithubIcon />
                  </div>
                  <p className='text-base font-semibold'>Github</p>
                  <LinkIcon />
                </div>
                <div className='relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased pt-0'>
                  <p className='font-normal text-medium text-default-500'>
                    To report bugs, request features and contribute to the
                    project.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
  return renderOpenSource();
};
export default LearnMore;
