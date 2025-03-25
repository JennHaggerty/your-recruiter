import React from 'react';
import { Inter } from 'next/font/google';
import Footer from '@/app/components/Footer/Footer';
import Nav from '@/app/components/Nav/Nav';
import { Card, CardBody, Divider, Image } from '@heroui/react';
import { MagicWandIcon } from '@/app/components/Icons/MagicWantIcon';
import { UserBlurbIcon } from '@/app/components/Icons/UserBlurbIcon';
import { CodeIcon } from '@/app/components/Icons/CodeIcon';
import { LightningBoltIcon } from '@/app/components/Icons/LightningBoltIcon';
const inter = Inter({ subsets: ['latin'] });
const Home = () => {
  const renderFeatureBlocks = () => {
    const items = [
      {
        icon: <MagicWandIcon />,
        title: `AI vs. AI`,
        content: `Hiring teams use AI to sift through thousands of applications and generate applicant data. That power at your fingertips reverse-engineered so you have the best fighting chance against the ATS systems.`,
      },
      {
        icon: <UserBlurbIcon />,
        title: `Accessibility first`,
        content: `We've worked hard to make this site as accessible to as many
                users as possible. If something isn't working we want to know
                and get you up and running ASAP!`,
      },
      {
        icon: <CodeIcon />,
        title: `Open-source`,
        content: `This is an open-source project and we welcome collaboration,
                check out the repo on Github.`,
      },
      {
        icon: <LightningBoltIcon />,
        title: `AI assisted`,
        content: `AI helps speed up your application-to-hiring by templating
                resumes and cover letters you can fine tune to perfection.`,
      },
      {
        icon: <LightningBoltIcon />,
        title: `HeroUI & TailwindCSS`,
        content: `User accessible and stunning graphics with added customization by TailwindCSS`,
      },
      {
        icon: <LightningBoltIcon />,
        title: `OpenAI`,
        content: `Writes your cover letters for you so you can focus on reviewing and editing for the job specifics!`,
      },
      {
        icon: <LightningBoltIcon />,
        title: `Firecrawl`,
        content: `A free service that extracts the listing data so you don't have to write it all out.`,
      },
      {
        icon: <LightningBoltIcon />,
        title: `Vercel`,
        content: `Streamlines the deployment process so we can get the latest features and bugfixes to you ASAP.`,
      },
    ];
    return (
      <>
        <div className='flex flex-col gap-2 justify-center w-full items-center pb-5'>
          <div>
            <h1 className='tracking-tight inline font-semibold from-[#FF705B] to-[#FFB457] text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b'>
              Features&nbsp;
            </h1>
            <h1 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
              and deets.
            </h1>
          </div>
        </div>
        <div
          id='features'
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
        >
          {items.map((item, i) => {
            return (
              <div
                key={`feature-${i}`}
                className='flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]'
              >
                <div className='flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
                  <div className='flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500'>
                    {item.icon}
                  </div>
                  <p className='text-base font-semibold'>{item.title}</p>
                </div>
                <div className='relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased'>
                  <p className='font-normal text-medium text-default-500'>
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };
  const renderMobileDetails = () => {
    return (
      <div className='flex flex-col md:flex-row gap-8'>
        <div className='w-full my-auto'>
          <div className='flex flex-col gap-2 items-start justify-center w-full'>
            <h1 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
              Responsiveness
            </h1>
            <div>
              <h1 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
                is&nbsp;
              </h1>
              <h1 className='tracking-tight inline font-semibold from-[#5EA2EF] to-[#0072F5] text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b'>
                effortless.
              </h1>
            </div>
          </div>
          <p className='w-full my-2 text-medium lg:text-large font-normal text-default-500 block max-w-full'>
            We had cards and quickly realized it was too much with so many
            applications, so TABLES! The table view will show fewer columns on
            mobile devices and expand out when using larger screens.
          </p>
        </div>
        <div className='flex flex-col justify-center w-full md-:w-1/2'>
          <div className='flex relative w-full h-auto bg-gradient-to-tr from-[#5EA2EF] to-[#0072F5] rounded-2xl items-center justify-center py-4 px-4 lg:px-8'>
            <div className='relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased'>
              <div className='max-h-[500px] items-center justify-center mx-auto'>
                <Image
                  alt='Mobile view of Your Recruiter table.'
                  src='./mobile-view.png'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <Nav />
      <main className={`${inter.className} relative`}>
        <section className='my-20'>
          <div className='flex flex-col gap-3 justify-center mx-auto'>
            <div className='flex justify-center'>
              <h1 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
                Welcome to your&nbsp;
              </h1>
              <h1 className='tracking-tight inline font-semibold from-[#6FEE8D] to-[#17c964] text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b'>
                next adventure.
              </h1>
            </div>
            <div className='flex flex-col gap-5'>
              <p className='my-2 pb-10 text-medium lg:text-large font-normal text-default-500 block w-[85%] m-auto'>
                Finding your next position can be overwhelming after sending out
                tens of applications a day, hundreds of applications a week, to
                thousands by the end of the month! Keep all of your application
                information and their timelines in one place tracking where you
                found the position, when you applied and with what resume and
                cover letter, and the various notes and stages using the power
                of AI to rapidly speed up your cover letter and resume writing
                and get back to what is important, preparing for your next
                adventure.
              </p>
              <Card
                isBlurred
                className='border-none bg-background/60 dark:bg-default-100/50'
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
            </div>
          </div>
        </section>
        add section for ai vs. manual
        <section className='my-20'>{renderFeatureBlocks()}</section>
        <section className='my-20'>{renderMobileDetails()}</section>
        add color code with ping to legend?
      </main>
      <Footer />
    </>
  );
};
export default Home;
