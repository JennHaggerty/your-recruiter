import React from 'react';
import { Inter } from 'next/font/google';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { addToast } from '@heroui/react';
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
import CoverLetterModal from '@/app/components/Modals/CoverLetterModal';
import DetailsModal from '@/app/components/Modals/DetailsModal';
import List from '@/app/components/Lists/List';
import ResumeModal from '@/app/components/Modals/ResumeModal';
import EditResumeModal from '@/app/components/Modals/EditResumeModal';
import EditCoverLetterModal from '@/app/components/Modals/EditCoverLetterModal';
type ConnectionStatus = {
  isConnected: boolean;
};
const inter = Inter({ subsets: ['latin'] });
const Home = ({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { user_id, resume, firecrawl_key, openai_key } = useUserContext();
  if (!user_id) return;
  const [loading, setLoading] = useState<boolean>();
  const [applications, setApplications] = useState<JobInterface[]>();
  const [activeApplication, setActiveApplication] = useState<JobInterface>();
  const [showEditModal, setShowEditModal] = useState<boolean>();
  const [showAddModal, setShowAddModal] = useState<boolean>();
  const [showCoverLetterModal, setShowCoverLetterModal] = useState<boolean>();
  const [showEditCoverLetterModal, setShowEditCoverLetterModal] =
    useState<boolean>();
  const [showResume, setShowResume] = useState<boolean>();
  const [showEditResumeModal, setShowEditResumeModal] = useState<boolean>();
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
  };
  const handleViewCoverLetter = async (id: string) => {
    const target = applications?.find((application) => application._id === id);
    setActiveApplication(target);
    setShowCoverLetterModal(true);
  };
  const handleEditCoverLetter = async (id: string) => {
    const target = applications?.find((application) => application._id === id);
    setActiveApplication(target);
    setShowEditCoverLetterModal(true);
  };
  const handleViewResume = async (id: string) => {
    const target = applications?.find((application) => application._id === id);
    setActiveApplication(target);
    setShowResume(true);
  };
  const handleEditResume = async (id: string) => {
    const target = applications?.find((application) => application._id === id);
    setActiveApplication(target);
    setShowEditResumeModal(true);
  };
  const handleViewCard = (id: string) => {
    const target =
      applications &&
      applications.find((application) => application._id === id);
    setActiveApplication(target);
    setShowDetails(true);
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
    if (!application.resume && resume) {
      application.resume = resume;
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
        application.cover_letter = res;
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
        {showAddModal && (
          <AddModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={(e) => {
              handleAdd(e).then(() => refreshApplications());
            }}
          />
        )}
        {activeApplication && (
          <>
            {showEditModal && (
              <EditModal
                item={activeApplication}
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={(e) =>
                  handleUpdate(e).then(() => refreshApplications())
                }
              />
            )}
            {showEditCoverLetterModal && (
              <EditCoverLetterModal
                item={activeApplication}
                isOpen={showEditCoverLetterModal}
                onClose={() => setShowEditCoverLetterModal(false)}
                onSubmit={(e) =>
                  handleUpdate(e).then(() => refreshApplications())
                }
              />
            )}
            {showCoverLetterModal && (
              <CoverLetterModal
                item={activeApplication}
                isOpen={showCoverLetterModal}
                onClose={() => setShowCoverLetterModal(false)}
                onAutoWrite={(e) =>
                  handleAutoWriteCoverLetter(activeApplication?._id)
                }
                onEdit={(e) =>
                  handleUpdate(e).then(() => refreshApplications())
                }
              />
            )}
            {showEditResumeModal && (
              <EditResumeModal
                item={activeApplication}
                isOpen={showEditResumeModal}
                onClose={() => setShowEditResumeModal(false)}
                onEdit={(e) =>
                  handleUpdate(e).then(() => refreshApplications())
                }
              />
            )}
            {showResume && (
              <ResumeModal
                item={activeApplication}
                isOpen={showResume}
                onClose={() => setShowResume(false)}
                onEdit={(e) =>
                  handleUpdate(e).then(() => refreshApplications())
                }
              />
            )}
            {showDetails && (
              <DetailsModal
                item={activeApplication}
                isOpen={showDetails}
                handleDelete={() => handleDelete(activeApplication._id)}
                handleListEditClick={() =>
                  handleListEditClick(activeApplication._id)
                }
                handleAutoCollect={() =>
                  handleAutoCollect(activeApplication._id)
                }
                handleAutoWriteCoverLetter={() =>
                  handleAutoWriteCoverLetter(activeApplication._id)
                }
                handleViewCoverLetter={() =>
                  handleViewCoverLetter(activeApplication._id)
                }
                onClose={() => setShowDetails(false)}
              />
            )}
          </>
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
                  setShowAddModal(true);
                }}
                onDelete={handleDelete}
                onEdit={handleListEditClick}
                onViewResume={handleViewResume}
                onEditResume={handleEditResume}
                onAutoCollect={handleAutoCollect}
                onAutoCoverLetter={handleAutoWriteCoverLetter}
                onViewCoverLetter={handleViewCoverLetter}
                onEditCoverLetter={handleEditCoverLetter}
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
