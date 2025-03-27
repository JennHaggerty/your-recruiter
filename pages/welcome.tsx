import React from 'react';
import { Inter } from 'next/font/google';
import Footer from '@/app/components/Footer/Footer';
import Nav from '@/app/components/Nav/Nav';
import { Card, CardBody, LinkIcon } from '@heroui/react';
import { MagicWandIcon } from '@/app/components/Icons/MagicWantIcon';
import { UserBlurbIcon } from '@/app/components/Icons/UserBlurbIcon';
import { CodeIcon } from '@/app/components/Icons/CodeIcon';
import { LightningBoltIcon } from '@/app/components/Icons/LightningBoltIcon';
import { AiIcon } from '@/app/components/Icons/AiIcon';
import { EditIcon } from '@/app/components/Icons/EditIcon';
import { StarIcon } from '@/app/components/Icons/StarIcon';
import { MoneyIcon } from '@/app/components/Icons/MoneyIcon';
import { ErrorIcon } from '@/app/components/Icons/ErrorIcon';
import { WarningIcon } from '@/app/components/Icons/WarningIcon';
const inter = Inter({ subsets: ['latin'] });
const Welcome = () => {
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
        <div id='features' className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
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
  const renderColorBlocks = () => {
    const items = [
      {
        icon: <EditIcon />,
        color: 'primary',
        title: `Blue is the Action Color`,
        content: `Blue buttons open drawers and modals, submit forms, and represent links.`,
      },
      {
        icon: <AiIcon />,
        color: 'secondary',
        title: `Purple is AI`,
        content: `Purple buttons will perform AI actions. If there is a green currency symbol it means that is a paid AI action.`,
      },
      {
        icon: <StarIcon />,
        color: 'default',
        title: `Gray is Neutral`,
        content: `Gray buttons close modals, clear and reset forms, and will be used when side-by-side elements
        are the same color to help distinguish them apart.`,
      },
      {
        icon: <MoneyIcon />,
        color: 'success',
        title: `Green is Success or Cash Money!`,
        content: `Green buttons indicate a financial transaction. Green text or boxes is a success message.`,
      },
      {
        icon: <ErrorIcon />,
        color: 'danger',
        title: `Red is an Error`,
        content: `Red buttons represent a delete action, use with caution. Red text or boxes indicate an error.`,
      },
      {
        icon: <WarningIcon />,
        color: 'warning',
        title: `Yellow is a Warning`,
        content: `Yellow is converying a warning.`,
      },
    ];
    return (
      <>
        <div className='flex flex-col gap-2 justify-center w-full items-center pb-5'>
          <div>
            <h2 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
              The&nbsp;
            </h2>
            <h2 className='tracking-tight font-semibold from-[#FF1CF7] to-[#b249f8] text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b inline'>
              Color&nbsp;
            </h2>
            <h2 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
              Code
            </h2>
          </div>
        </div>
        <div id='features' className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
          {items.map((item, i) => {
            return (
              <div
                key={`color-${i}`}
                className='p-5 flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]'
              >
                <div className='flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
                  <div className='flex py-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
                    <div
                      className={`flex justify-center p-2 rounded-full items-center bg-${item.color}-100/80 text-${item.color}-500`}
                    >
                      {item.icon}
                    </div>
                    <p className='text-base font-semibold'>{item.title}</p>
                  </div>
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
            <h2 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
              Responsiveness
            </h2>
            <div>
              <h2 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
                is&nbsp;
              </h2>
              <h2 className='tracking-tight inline font-semibold from-[#5EA2EF] to-[#0072F5] text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b'>
                effortless.
              </h2>
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
              <div className='max-h-[500px] items-center justify-center mx-auto mobile-only'>
                <video controls autoPlay loop muted>
                  <source
                    src='./your-recruiter-mobile-view.mp4'
                    type='video/mp4'
                  />
                  This browser does not display the video tag.
                </video>
              </div>{' '}
              <div className='max-h-[500px] items-center justify-center mx-auto desktop-only'>
                <video controls autoPlay loop muted>
                  <source
                    src='./your-recruiter-desktop-view.mp4'
                    type='video/mp4'
                  />
                  This browser does not display the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderJumbotron = () => (
    <div className='flex flex-col gap-3 justify-center mx-auto'>
      <div className='flex justify-center mb-10'>
        <h1 className='tracking-tight inline font-semibold text-4xl lg:text-6xl'>
          Welcome to your&nbsp;
        </h1>
        <h1 className='tracking-tight inline font-semibold from-[#6FEE8D] to-[#17c964] text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b'>
          next adventure.
        </h1>
      </div>
      <div className='flex flex-col gap-5'>
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
              className='m-auto'
            ></iframe>
          </CardBody>
        </Card>
      </div>
    </div>
  );
  const renderAiVsManual = () => (
    <section className="relative z-10 flex-col gap-2 bg-transparent dark:bg-transparent before:bg-background/10 before:content-[''] before:block before:z-[-1] before:absolute before:inset-0 before:backdrop-blur-md before:backdrop-saturate-200 border-t border-b border-divider  flex justify-center items-center">
      <div className='py-10 grid grid-cols-12 gap-6 z-20'>
        <div className='flex flex-col gap-2 col-span-12 md:col-span-6'>
          <div className='flex flex-col'>
            <h2 className='tracking-tight font-semibold text-[clamp(1rem,10vw,2rem)] sm:text-[clamp(1rem,10vw,3rem)] lg:text-5xl inline'>
              Let's make the
            </h2>
            <div>
              <h2 className='tracking-tight inline font-semibold text-[clamp(1rem,10vw,2rem)] sm:text-[clamp(1rem,10vw,3rem)] lg:text-5xl'>
                Process&nbsp;
              </h2>
              <h2 className='tracking-tight font-semibold from-[#FF1CF7] to-[#b249f8] text-[clamp(1rem,10vw,2rem)] sm:text-[clamp(1rem,10vw,3rem)] lg:text-5xl bg-clip-text text-transparent bg-gradient-to-b inline'>
                Easier
              </h2>
            </div>
          </div>
          <p className='w-full my-2 font-normal text-default-500 block max-w-full md:w-full text-base lg:text-lg'>
            Save time and headaches with AI data fetching or, if you're anti-AI
            (no judgement here!) enter the information manually.
          </p>
        </div>
        <div className='col-span-12 md:col-span-6'>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-2'>
            <div className='flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none data-[pressed=true]:scale-[0.97] tap-highlight-transparent border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]'>
              <div className='flex p-3 z-10 w-full justify-center items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
                <div className='w-[56px] h-[56px] flex justify-center p-2 rounded-full items-center bg-primary-100/80 text-primary-500'>
                  <EditIcon />
                </div>
                <p className='text-base font-semibold'>DIY</p>
              </div>
              <div className='relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased'>
                <p className='font-normal text-medium text-default-500'>
                  You can add applications, edit them, and gather the
                  information on your own without AI.
                </p>
              </div>
            </div>
            <div className='flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-largetransition-transform-background motion-reduce:transition-none data-[pressed=true]:scale-[0.97] tap-highlight-transparent border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]'>
              <div className='flex p-3 z-10 w-full justify-center items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0'>
                <div className='w-[56px] h-[56px] flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500'>
                  <AiIcon />
                </div>
                <p className='text-base font-semibold'>AI</p>
              </div>
              <div className='relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased'>
                <p className='font-normal text-medium text-default-500'>
                  We use AI to fetch the listing data from a url as well as for
                  writing cover letter templates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='' data-mounted='true'></div>
    </section>
  );
  return (
    <>
      <Nav />
      <main className={`${inter.className} relative px-12 lg:px-8  max-w-7xl`}>
        <section className='my-8 md:my-20'>{renderJumbotron()}</section>
        <section className='my-8 md:my-20'>{renderAiVsManual()}</section>
        <section className='my-8 md:my-20'>{renderFeatureBlocks()}</section>
        <section className='my-8 md:my-20'>{renderMobileDetails()}</section>
        <section className='my-8 md:my-20'>{renderColorBlocks()}</section>
      </main>
      <Footer />
    </>
  );
};
export default Welcome;
