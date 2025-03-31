import JobInterface from '@/interfaces/JobInterface';
import DesktopList from './DesktopList';
import MobileList from './MobileList';
import SkeletonList from './SkeletonList';
import { useUserContext } from '@/contexts/UserContext';
interface Props {
  items?: JobInterface[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onAutoCollect: (id: string) => void;
  onAutoCoverLetter: (id: string) => void;
  onViewCoverLetter: (id: string) => void;
  onViewCard: (id: string) => void;
  loading: boolean;
}
const IndexList = (props: Props) => {
  const {
    items,
    onAdd,
    onDelete,
    onEdit,
    onAutoCollect,
    onAutoCoverLetter,
    onViewCoverLetter,
    onViewCard,
    loading,
  } = props;
  const { firecrawl_key, openai_key } = useUserContext();
  const columns = [
    { name: 'Details', uid: 'name', sortable: true },
    { name: 'Location', uid: 'location', sortable: true },
    { name: 'Role', uid: 'role', sortable: true },
    { name: 'Salary', uid: 'salary', sortable: true },
    { name: 'Stage', uid: 'stage', sortable: true },
    { name: 'Cover Letter', uid: 'coverLetter' },
    { name: 'Actions', uid: 'actions' },
  ];
  const statusOptions = [
    { name: 'Interested', uid: 'interested' },
    { name: 'Applied', uid: 'applied' },
    { name: 'Rejected', uid: 'rejected' },
    { name: 'Closed', uid: 'closed' },
    { name: 'Interviewing', uid: 'interviewing' },
  ];
  const INITIAL_VISIBLE_COLUMNS_MOBILE = ['name', 'stage', 'actions'];
  const INITIAL_VISIBLE_COLUMNS_DESKTOP = [
    'name',
    'role',
    'salary',
    'stage',
    'coverLetter',
    'actions',
  ];
  return (
    <>
      {loading ? (
        <SkeletonList />
      ) : (
        <>
          <MobileList
            items={items}
            columns={columns}
            initialVisibleColumns={INITIAL_VISIBLE_COLUMNS_MOBILE}
            statusOptions={statusOptions}
            onAdd={onAdd}
            onDelete={onDelete}
            onEdit={onEdit}
            onAutoCollect={onAutoCollect}
            onAutoCoverLetter={onAutoCoverLetter}
            onViewCoverLetter={onViewCoverLetter}
            onViewCard={onViewCard}
          />
          <DesktopList
            items={items}
            columns={columns}
            initialVisibleColumns={INITIAL_VISIBLE_COLUMNS_DESKTOP}
            statusOptions={statusOptions}
            onAdd={onAdd}
            onDelete={onDelete}
            onEdit={onEdit}
            onAutoCollect={onAutoCollect}
            onAutoCoverLetter={onAutoCoverLetter}
            onViewCoverLetter={onViewCoverLetter}
            onViewCard={onViewCard}
          />
        </>
      )}
    </>
  );
};
export default IndexList;
