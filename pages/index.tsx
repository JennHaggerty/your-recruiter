import React from 'react';
import { Inter } from 'next/font/google';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
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
import List from '@/app/components/List/List';
import {
  createApplication,
  deleteApplication,
  fetchApplications,
  getListingData,
  updateApplication,
} from '@/functions/functions';
import { useUserContext } from '@/contexts/UserContext';
type ConnectionStatus = {
  isConnected: boolean;
};
const inter = Inter({ subsets: ['latin'] });
const Home = ({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { id, resume, openai_key, firecrawl_key, login, logout } =
    useUserContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>();
  const [loadingAI, setLoadingAI] = useState<boolean>();
  const [applications, setApplications] = useState<JobInterface[]>();
  const [activeApplication, setActiveApplication] = useState<JobInterface>();
  const [showEditModal, setShowEditModal] = useState<boolean>();
  const [showAddModal, setShowAddModal] = useState<boolean>();
  const [showCoverLetterModal, setShowCoverLetterModal] = useState<boolean>();
  const [showDetails, setShowDetails] = useState<boolean>();
  const [openAiKey, setOpenAiKey] = useState<string>();
  const [firecrawlKey, setFirecrawlKey] = useState<string>();
  const [width, setWidth] = useState<number>();
  const [showSkeletonList, setShowSkeletonList] = useState<boolean>(true);
  const disableOpenAi = !openAiKey || loadingAI;
  const disableFirecrawl = !firecrawlKey || loadingAI;
  const isMobile = width && width < 600;
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  const refreshApplications = async () => {
    const applications = await fetchApplications()
      .then((data) => {
        return data;
      })
      .catch(() =>
        addToast({
          color: 'danger',
          title: 'There was an error refreshing applications.',
        })
      );
    setApplications(applications);
  };
  useEffect(function detectWindowResize() {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);
  useEffect(function fetchApplicationsOnPageLoad() {
    refreshApplications()
      .then(() => setShowSkeletonList(false))
      .catch(() =>
        addToast({
          color: 'danger',
          title: 'There was an error fetching applications on page load.',
        })
      );
  }, []);
  useEffect(function checkForAPIKeysOnPageLoad() {
    if (!firecrawlKey && process.env.NEXT_PUBLIC_FIRECRAWL_KEY) {
      setFirecrawlKey(process.env.NEXT_PUBLIC_FIRECRAWL_KEY);
    }
    if (!openAiKey && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      setOpenAiKey(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
    }
  }, []);
  const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setShowSkeletonList(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const body = JSON.stringify(data);
    await createApplication({ body })
      .then(async () => await refreshApplications())
      .catch(() =>
        addToast({
          color: 'danger',
          title: 'There was an error adding application.',
        })
      );
    setLoading(false);
    setShowSkeletonList(false);
  };
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const id = JSON.stringify(data.id);
    const body = JSON.stringify(data);
    setLoading(true);
    await updateApplication({ id, body })
      .then(() => refreshApplications())
      .catch(() =>
        addToast({
          color: 'danger',
          title: 'There was an error updating application.',
        })
      );
    setLoading(false);
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    await deleteApplication({ id })
      .then(() => refreshApplications())
      .catch(() =>
        addToast({
          color: 'danger',
          title: 'There was an error deleting application.',
        })
      );
    setLoading(false);
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
    if (!firecrawlKey) return;
    const applicationToUpdate =
      applications &&
      applications.find((application) => application._id === id);
    if (!applicationToUpdate) return;
    setLoadingAI(true);
    setShowSkeletonList(true);
    await getListingData({
      url: applicationToUpdate.posting_url,
      apiKey: firecrawlKey,
    })
      .then(async (data) => {
        const scrapedData = data;
        const updatedApplication = { ...applicationToUpdate, scrapedData };
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
    setShowSkeletonList(false);
    setLoadingAI(false);
  };
  const handleOpenAi = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    setOpenAiKey(data.openAiKey.toString());
  };
  const handleFirecrawl = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    setFirecrawlKey(data.firecrawlKey.toString());
  };
  const handleAutoWriteCoverLetter = async (id: string) => {
    const application =
      applications && applications.find((item) => item._id === id);
    if (!application) return;
    if (!application._resume && resume) {
      application.resume = resume;
    }
    const key = openAiKey ? openAiKey : '';
    setLoadingAI(true);
    await automatedCoverLetter({ job: application, openAiKey: key })
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
              loading={loading}
              loadingAI={loadingAI}
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
              isLoading={loadingAI}
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
              handleSubmit={handleUpdate}
              handleCancel={onClose}
              loading={loading}
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
              handleSubmit={handleAdd}
              handleCancel={onClose}
              loading={loading}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  const renderWelcome = () => {
    const quickAdd = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoadingAI(true);
      const formData = new FormData(e.currentTarget);
      const url = formData.get('posting_url') as string;
      await getListingData({ url, apiKey: firecrawlKey! })
        .then(async (data) => {
          const scrapedData = data;
          const body = JSON.stringify(scrapedData);
          await createApplication({ body })
            .then(() => refreshApplications())
            .finally(() => setLoadingAI(false))
            .catch(() =>
              addToast({
                color: 'danger',
                title:
                  'There was an error creating application with the listing data.',
              })
            );
        })
        .catch((e) => {
          addToast({
            color: 'danger',
            title: `There was an error with quickly adding the application, ${e}`,
          });
          setLoadingAI(false);
        });
    };
    return (
      <Card className='w-full flex flex-col lg:w-full p-3 md:p-5 mb-8'>
        <CardHeader className='flex flex-col'>
          <h1 className='text-xl mb-3'>Welcome to the Recruiter</h1>
          The CMS that logs job listings and writes cover letter templates.
        </CardHeader>
        <CardBody>
          <Form
            id='quick-add'
            className='flex flex-col mt-5'
            validationBehavior='native'
            onSubmit={quickAdd}
          >
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
                color='secondary'
                type='submit'
                isLoading={loading || loadingAI}
                isDisabled={loadingAI || !openAiKey}
                className='w-full'
              >
                Add with AI
              </Button>
              <Button
                variant='flat'
                color='primary'
                type='button'
                onPress={() => {
                  onOpen();
                  setShowAddModal(true);
                }}
                isLoading={loading}
                className='w-full'
              >
                Add Manually
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    );
  };
  return (
    <>
      <Nav
        isConnected={isConnected}
        handleOpenAi={handleOpenAi}
        handleFirecrawl={handleFirecrawl}
        openAiKey={openAiKey}
        firecrawlKey={firecrawlKey}
      />
      <main className={`${inter.className} relative`}>
        {isOpen && showEditModal && renderEditModal()}
        {isOpen && showAddModal && renderAddModal()}
        {isOpen && showCoverLetterModal && renderViewCoverLetterModal()}
        {isOpen && showDetails && renderDetailsModal()}
        <div className='lg:w-full'>{renderWelcome()}</div>
        {showSkeletonList ? (
          <SkeletonList />
        ) : (
          <List
            items={applications}
            onDelete={handleDelete}
            onEdit={handleListEditClick}
            onAutoCollect={handleAutoCollect}
            onAutoCoverLetter={handleAutoWriteCoverLetter}
            onViewCoverLetter={handleViewCoverLetter}
            onViewCard={handleViewCard}
            loading={loading}
            loadingAI={loadingAI}
            disableOpenAi={disableOpenAi}
            disableFirecrawl={disableFirecrawl}
          />
        )}
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
