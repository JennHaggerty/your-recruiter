import React from 'react';
import { Inter } from 'next/font/google';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { addToast, useDisclosure } from '@heroui/react';
import { useState, useEffect } from 'react';
import { automatedCoverLetter } from '@/lib/openai';
import client from '@/lib/mongodb';
import JobInterface from '@/interfaces/JobInterface';
import Footer from '@/app/components/Footer/Footer';
import Nav from '@/app/components/Nav/Nav';
import SkeletonList from '@/app/components/Lists/SkeletonList';
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
import Loading from '@/app/components/Loading/Loading';
import ListJumbotron from '@/app/components/ListJumbotron/ListJumbotron';
import AddModal from '@/app/components/Modals/AddModal';
import EditModal from '@/app/components/Modals/EditModal';
import ViewCoverLetterModal from '@/app/components/Modals/ViewCoverLetterModal';
import DetailsModal from '@/app/components/Modals/DetailsModal';
import List from '@/app/components/Lists/List';
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
  // table actions
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
        {isOpen && showEditModal && activeApplication && (
          <EditModal
            item={activeApplication}
            isOpen={isOpen}
            onClose={() => setShowEditModal(false)}
            onOpenChange={onOpenChange}
            onSubmit={(e) => {
              handleUpdate(e).then(() => refreshApplications());
            }}
          />
        )}
        {isOpen && showAddModal && (
          <AddModal
            isOpen={isOpen}
            onClose={() => setShowAddModal(false)}
            onOpenChange={onOpenChange}
            onSubmit={(e) => {
              handleAdd(e).then(() => refreshApplications());
            }}
          />
        )}
        {isOpen && showCoverLetterModal && activeApplication && (
          <ViewCoverLetterModal
            item={activeApplication}
            isOpen={isOpen}
            onClose={() => setShowCoverLetterModal(false)}
            onOpenChange={onOpenChange}
            onSubmit={(e) => {
              handleAutoWriteCoverLetter(activeApplication?._id);
            }}
          />
        )}
        {isOpen && showDetails && activeApplication && (
          <DetailsModal
            item={activeApplication}
            handleDelete={() => handleDelete(activeApplication._id)}
            handleListEditClick={() =>
              handleListEditClick(activeApplication._id)
            }
            handleAutoCollect={() => handleAutoCollect(activeApplication._id)}
            handleAutoWriteCoverLetter={() =>
              handleAutoWriteCoverLetter(activeApplication._id)
            }
            handleViewCoverLetter={() =>
              handleViewCoverLetter(activeApplication._id)
            }
            onClose={() => setShowDetails(false)}
            onOpenChange={onOpenChange}
            isOpen={isOpen}
          />
        )}
        <section className='w-full mt-8'>
          <ListJumbotron
            onSubmit={async (e) => {
              setLoading(true);
              handleAiAdd({ e, apiKey: firecrawl_key!, user_id }).then(() => {
                refreshApplications();
                setLoading(false);
              });
            }}
            onManualAdd={() => {
              onOpen();
              setShowAddModal(true);
            }}
          />
        </section>
        <section className='mt-8 p-0 w-full'>
          {showSkeletonList ? (
            <SkeletonList />
          ) : (
            <>
              <List
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
                loading={showSkeletonList}
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
