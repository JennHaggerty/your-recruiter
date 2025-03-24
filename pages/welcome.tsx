import React from 'react';
import { Inter } from 'next/font/google';
import Footer from '@/app/components/Footer/Footer';
import Nav from '@/app/components/Nav/Nav';
import { Card, CardBody } from '@heroui/react';
const inter = Inter({ subsets: ['latin'] });
const Home = () => {
  return (
    <>
      <Nav />
      <main className={`${inter.className} relative`}>
        <div className='mt-5'>
          <h1 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
            Welcome to your&nbsp;
          </h1>
          <h1 className='tracking-tight inline font-semibold from-[#6FEE8D] to-[#17c964] text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b'>
            next adventure
          </h1>
          <h1 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
            .
          </h1>
        </div>
        <p className='w-4/5 md:w-5/6 my-2 text-medium lg:text-large font-normal text-default-500 block max-w-full'>
          Finding your next position can be overwhelming after sending out tens
          of applications a day, hundreds of applications a week, to thousands
          by the end of the month! Keep all of your application information and
          their timelines in one place tracking where you found the position,
          when you applied and with what resume and cover letter, and the
          various notes and stages using the power of AI to rapidly speed up
          your cover letter and resume writing and get back to what is
          important, preparing for your next adventure.
        </p>
        <Card
          isBlurred
          className='border-none bg-background/60 dark:bg-default-100/50 max-w-[990px]'
          shadow='sm'
        >
          <CardBody>
            <iframe
              width='900'
              height='615'
              src=''
              title='Your Recruiter video introduction and tutorial'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen
            ></iframe>
          </CardBody>
        </Card>
        <div
          id='features'
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
        >
          <div className='flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]'>
            <div className='flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
              <div className='flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500'>
                <svg
                  aria-hidden='true'
                  fill='none'
                  focusable='false'
                  height='24'
                  role='presentation'
                  viewBox='0 0 24 24'
                  width='24'
                  className='text-pink-500'
                >
                  <path
                    d='M3.5 20.5c.83.83 2.17.83 3 0l13-13c.83-.83.83-2.17 0-3-.83-.83-2.17-.83-3 0l-13 13c-.83.83-.83 2.17 0 3ZM18.01 8.99l-3-3'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='1.5'
                  ></path>
                  <path
                    d='M8.5 2.44 10 2l-.44 1.5L10 5l-1.5-.44L7 5l.44-1.5L7 2l1.5.44ZM4.5 8.44 6 8l-.44 1.5L6 11l-1.5-.44L3 11l.44-1.5L3 8l1.5.44ZM19.5 13.44 21 13l-.44 1.5L21 16l-1.5-.44L18 16l.44-1.5L18 13l1.5.44Z'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  ></path>
                </svg>
              </div>
              <p className='text-base font-semibold'>AI vs. AI</p>
            </div>
            <div className='relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased'>
              <p className='font-normal text-medium text-default-500'>
                Hiring teams use AI to sift through thousands of applications
                and generate applicant data. That power at your fingertips
                reverse-engineered so you have the best fighting chance against
                the ATS systems.
              </p>
            </div>
          </div>
          <div className='flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]'>
            <div className='flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
              <div className='flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500'>
                <svg
                  aria-hidden='true'
                  fill='none'
                  focusable='false'
                  height='24'
                  role='presentation'
                  viewBox='0 0 24 24'
                  width='24'
                  className='text-pink-500'
                >
                  <path
                    d='M18 18.86h-.76c-.8 0-1.56.31-2.12.87l-1.71 1.69c-.78.77-2.05.77-2.83 0l-1.71-1.69c-.56-.56-1.33-.87-2.12-.87H6c-1.66 0-3-1.33-3-2.97V4.98c0-1.64 1.34-2.97 3-2.97h12c1.66 0 3 1.33 3 2.97v10.91c0 1.63-1.34 2.97-3 2.97Z'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-miterlimit='10'
                    stroke-width='1.5'
                  ></path>
                  <path
                    d='M12 10a2.33 2.33 0 1 0 0-4.66A2.33 2.33 0 0 0 12 10ZM16 15.66c0-1.8-1.79-3.26-4-3.26s-4 1.46-4 3.26'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='1.5'
                  ></path>
                </svg>
              </div>
              <p className='text-base font-semibold'>Accessible first</p>
            </div>
            <div className='relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased'>
              <p className='font-normal text-medium text-default-500'>
                We've worked hard to make this site as accessible to as many
                users as possible. If something isn't working we want to know
                and get you up and running ASAP!
              </p>
            </div>
          </div>
          <div className='flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]'>
            <div className='flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
              <div className='flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500'>
                <svg
                  aria-hidden='true'
                  fill='none'
                  focusable='false'
                  height='24'
                  role='presentation'
                  viewBox='0 0 24 24'
                  width='24'
                  className='text-pink-500'
                >
                  <path
                    d='M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-miterlimit='10'
                    stroke-width='1.5'
                  ></path>
                  <path
                    d='M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-miterlimit='10'
                    stroke-width='1.5'
                  ></path>
                  <path
                    d='M10 13L8 15L10 17'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-miterlimit='10'
                    stroke-width='1.5'
                  ></path>
                  <path
                    d='M14 13L16 15L14 17'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-miterlimit='10'
                    stroke-width='1.5'
                  ></path>
                </svg>
              </div>
              <p className='text-base font-semibold'>Open-source</p>
            </div>
            <div className='relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased'>
              <p className='font-normal text-medium text-default-500'>
                This is an open-source project and we welcome collaboration,
                check out the repo on Github.
              </p>
            </div>
          </div>
          <div className='flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]'>
            <div className='flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
              <div className='flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500'>
                <svg
                  aria-hidden='true'
                  fill='none'
                  focusable='false'
                  height='24'
                  role='presentation'
                  viewBox='0 0 24 24'
                  width='24'
                  className='text-pink-500'
                >
                  <path
                    d='M6.09 13.28h3.09v7.2c0 1.68.91 2.02 2.02.76l7.57-8.6c.93-1.05.54-1.92-.87-1.92h-3.09v-7.2c0-1.68-.91-2.02-2.02-.76l-7.57 8.6c-.92 1.06-.53 1.92.87 1.92Z'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-miterlimit='10'
                    stroke-width='1.5'
                  ></path>
                </svg>
              </div>
              <p className='text-base font-semibold'>AI assisted</p>
            </div>
            <div className='relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased'>
              <p className='font-normal text-medium text-default-500'>
                AI helps speed up your application-to-hiring by templating
                resumes and cover letters you can fine tune to perfection.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
export default Home;
