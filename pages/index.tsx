import React from 'react';
import { Inter } from 'next/font/google';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import {
  addToast,
  Button,
  Card,
  CardBody,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useState, useEffect, FormEvent } from 'react';
import { automatedCoverLetter } from '@/lib/openai';
import client from '@/lib/mongodb';
import JobInterface from '@/interfaces/JobInterface';
import AddForm from '@/app/components/Forms/AddForm';
import EditForm from '@/app/components/Forms/EditForm';
import Details from '@/app/components/Details/Details';
import Footer from '@/app/components/Footer/Footer';
import Nav from '@/app/components/Nav/Nav';
import SkeletonList from '@/app/components/List/SkeletonList';
import {
  deleteApplication,
  fetchApplications,
  getListingData,
  handleAdd,
  handleAiAdd,
  handleEmailChange,
  handleFirecrawl,
  handleOpenAi,
  handlePasswordChange,
  handleUpdate,
  updateApplication,
} from '@/functions/functions';
import { useUserContext } from '@/contexts/UserContext';
import DesktopList from '@/app/components/List/DesktopList';
import MobileList from '@/app/components/List/MobileList';
import Loading from '@/app/components/Loading/Loading';
type ConnectionStatus = {
  isConnected: boolean;
};
const inter = Inter({ subsets: ['latin'] });
const Home = ({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { user_id, resume, firecrawl_key, openai_key } = useUserContext();
  if (!user_id) return;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>();
  const [applications, setApplications] = useState<JobInterface[]>();
  const [activeApplication, setActiveApplication] = useState<JobInterface>();
  const [showEditModal, setShowEditModal] = useState<boolean>();
  const [showAddModal, setShowAddModal] = useState<boolean>();
  const [showCoverLetterModal, setShowCoverLetterModal] = useState<boolean>();
  const [showDetails, setShowDetails] = useState<boolean>();
  const [showSkeletonList, setShowSkeletonList] = useState<boolean>(true);
  const disableOpenAi = !openai_key || loading;
  const disableFirecrawl = !firecrawl_key || loading;
  const refreshApplications = async () => {
    setShowSkeletonList(true);
    const applications = await fetchApplications({ user_id })
      .then((data) => {
        return data;
      })
      .catch(() => {
        addToast({
          color: 'danger',
          title: 'There was an error refreshing applications.',
        });
        return;
      });
    setApplications(applications);
    setShowSkeletonList(false);
  };
  useEffect(function fetchApplicationsOnPageLoad() {
    refreshApplications();
  }, []);
  const handleDelete = async (id: string) => {
    await deleteApplication({ id })
      .then(() => refreshApplications())
      .catch(() =>
        addToast({
          color: 'danger',
          title: 'There was an error deleting application.',
        })
      );
  };
  const handleListEditClick = async (id: string) => {
    const target = applications?.find((application) => application._id === id);
    setActiveApplication(target);
    setShowEditModal(true);
    onOpen();
  };
  const handleViewCoverLetter = async (id: string) => {
    const target = applications?.find((application) => application._id === id);
    setActiveApplication(target);
    setShowCoverLetterModal(true);
    onOpen();
  };
  const handleViewCard = (id: string) => {
    const target =
      applications &&
      applications.find((application) => application._id === id);
    setActiveApplication(target);
    setShowDetails(true);
    onOpen();
  };
  const handleAutoCollect = async (id: string) => {
    if (!firecrawl_key) return;
    const applicationToUpdate =
      applications &&
      applications.find((application) => application._id === id);
    if (!applicationToUpdate) return;
    setLoading(true);
    await getListingData({
      url: applicationToUpdate.posting_url,
      apiKey: firecrawl_key,
    })
      .then(async (data) => {
        const scrapedData = data;
        const updatedApplication = { ...applicationToUpdate, ...scrapedData };
        const body = JSON.stringify(updatedApplication);
        await updateApplication({ id: updatedApplication._id!, body })
          .then(() => refreshApplications())
          .catch(() =>
            addToast({
              color: 'danger',
              title:
                'There was an error updating the application with the listing data.',
            })
          );
      })
      .catch((e) => {
        addToast({
          color: 'danger',
          title: `There was an error with the AI collection process, ${e}`,
        });
      });
    setLoading(false);
  };
  const handleAutoWriteCoverLetter = async (id: string) => {
    const application =
      applications && applications.find((item) => item._id === id);
    if (!application) return;
    if (!application._resume && resume) {
      application._resume = resume;
    }
    if (!openai_key) {
      return addToast({
        color: 'danger',
        title: 'Missing OpenAI key, please add it to your Settings.',
      });
    }
    setLoading(true);
    await automatedCoverLetter({ job: application, openAiKey: openai_key })
      .then(async (res) => {
        application.automated_cover_letter = res;
        const body = JSON.stringify(application);
        await updateApplication({ id: application._id, body })
          .then(() => refreshApplications())
          .catch(() =>
            addToast({
              color: 'danger',
              title:
                'There was an error updating the application with the automated cover letter.',
            })
          );
      })
      .catch((e) => {
        addToast({
          color: 'danger',
          title: `There was an error, ${e}`,
        });
      });
    setLoading(false);
  };
  const renderDetailsModal = () => {
    if (!activeApplication) return;
    const onClose = () => setShowDetails(false);
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        scrollBehavior='outside'
        size='3xl'
      >
        <ModalContent>
          <ModalHeader>{activeApplication.company_name}</ModalHeader>
          <ModalBody>
            <Details
              item={activeApplication}
              onDelete={handleDelete}
              onEdit={handleListEditClick}
              onAutoCollect={handleAutoCollect}
              onAutoCoverLetter={handleAutoWriteCoverLetter}
              onViewCoverLetter={handleViewCoverLetter}
              disableOpenAi={disableOpenAi}
              disableFirecrawl={disableFirecrawl}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  const renderViewCoverLetterModal = () => {
    if (!activeApplication || !activeApplication.automated_cover_letter) return;
    const onClose = () => setShowCoverLetterModal(false);
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        scrollBehavior='outside'
        size='3xl'
      >
        <ModalContent>
          <ModalHeader>
            {activeApplication.company_name} Cover Letter
          </ModalHeader>
          <ModalBody>{activeApplication.automated_cover_letter}</ModalBody>
          <ModalFooter>
            <Button
              onPress={() => handleAutoWriteCoverLetter(activeApplication?._id)}
              color='secondary'
              isDisabled={
                activeApplication.stage?.toLocaleLowerCase() === 'closed'
              }
            >
              <span
                className='text-success'
                aria-label='This action requires a financial transaction'
              >
                $
              </span>
              Rewrite
            </Button>
            <Button onPress={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  const renderEditModal = () => {
    if (!activeApplication) return null;
    const onClose = () => setShowEditModal(false);
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        scrollBehavior='outside'
        placement='center'
        size='3xl'
      >
        <ModalContent>
          <ModalHeader>Edit Application Information</ModalHeader>
          <ModalBody>
            <EditForm
              item={activeApplication}
              handleSubmit={(e) => {
                handleUpdate(e).then(() => refreshApplications());
              }}
              handleCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  const renderAddModal = () => {
    const onClose = () => setShowAddModal(false);
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        scrollBehavior='outside'
        placement='center'
        size='3xl'
      >
        <ModalContent>
          <ModalHeader>Add Application Information</ModalHeader>
          <ModalBody>
            <AddForm
              handleSubmit={(e) => {
                handleAdd(e).then(() => refreshApplications());
              }}
              handleCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  const renderWelcome = () => {
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
              onSubmit={async (e) => {
                setLoading(true);
                handleAiAdd({ e, apiKey: firecrawl_key!, user_id }).then(() => {
                  refreshApplications();
                  setLoading(false);
                });
              }}
            >
              <Input
                className='hidden'
                name='_user_id'
                defaultValue={user_id}
              />
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
                  onPress={() => {
                    onOpen();
                    setShowAddModal(true);
                  }}
                  className='w-full'
                >
                  Add Manually
                </Button>
                <Button
                  color='secondary'
                  type='submit'
                  isDisabled={loading || !firecrawl_key}
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
  return (
    <>
      <Nav
        isConnected={isConnected}
        handleOpenAi={async (e) => {
          setLoading(true);
          handleOpenAi({ e, user_id })
            .then(() => setLoading(false))
            .catch(() => {});
        }}
        handleFirecrawl={async (e) => {
          setLoading(true);
          handleFirecrawl({ e, user_id })
            .then(() => setLoading(false))
            .catch(() => {});
        }}
        handleEmailChange={async (e) => {
          setLoading(true);
          await handleEmailChange(e);
          setLoading(false);
        }}
        handlePasswordChange={async (e) => {
          setLoading(true);
          await handlePasswordChange(e);
          setLoading(false);
        }}
      />
      <main className={`${inter.className} dark relative md:max-w-7xl`}>
        {loading && <Loading />}
        {isOpen && showEditModal && renderEditModal()}
        {isOpen && showAddModal && renderAddModal()}
        {isOpen && showCoverLetterModal && renderViewCoverLetterModal()}
        {isOpen && showDetails && renderDetailsModal()}
        {renderWelcome()}
        <section className='mt-8 p-0 w-full'>
          {showSkeletonList ? (
            <SkeletonList />
          ) : (
            <>
              <MobileList
                items={applications}
                onAdd={() => {
                  onOpen();
                  setShowAddModal(true);
                }}
                onDelete={handleDelete}
                onEdit={handleListEditClick}
                onAutoCollect={handleAutoCollect}
                onAutoCoverLetter={handleAutoWriteCoverLetter}
                onViewCoverLetter={handleViewCoverLetter}
                onViewCard={handleViewCard}
                disableOpenAi={disableOpenAi}
                disableFirecrawl={disableFirecrawl}
              />
              <DesktopList
                items={applications}
                onAdd={() => {
                  onOpen();
                  setShowAddModal(true);
                }}
                onDelete={handleDelete}
                onEdit={handleListEditClick}
                onAutoCollect={handleAutoCollect}
                onAutoCoverLetter={handleAutoWriteCoverLetter}
                onViewCoverLetter={handleViewCoverLetter}
                onViewCard={handleViewCard}
                disableOpenAi={disableOpenAi}
                disableFirecrawl={disableFirecrawl}
              />
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};
export default Home;
export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await client.connect();
    return {
      props: {
        isConnected: true,
      },
    };
  } catch (e) {
    addToast({
      color: 'danger',
      title: `There was an error getting the MongoDB connection status, ${e}`,
    });
    return {
      props: {
        isConnected: false,
      },
    };
  }
};
