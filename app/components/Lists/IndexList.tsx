import JobInterface from '@/interfaces/JobInterface';
import DesktopList from './DesktopList';
import MobileList from './MobileList';
import SkeletonList from './SkeletonList';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Selection,
  Tooltip,
} from '@heroui/react';
import { AiIcon } from '../Icons/AiIcon';
import { DeleteIcon } from '../Icons/DeleteIcon';
import { EditIcon } from '../Icons/EditIcon';
import { useUserContext } from '@/contexts/UserContext';
import { VerticalDotsIcon } from '../Icons/VerticalDotsIcon';
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
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [filterValue, setFilterValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<Selection>('all');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const hasSearchFilter = Boolean(filterValue);
  const iconWidth = '15px';
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);
  const filteredItems = useMemo(() => {
    let filteredItems = items || [];
    if (filterValue) {
      filteredItems = filteredItems.filter((item) =>
        item.company_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredItems = filteredItems.filter((item) =>
        Array.from(statusFilter).includes(item.stage || '')
      );
    }
    return filteredItems;
  }, [items, filterValue, statusFilter]);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);
  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );
  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);
  const jobs = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  const bottomContent = useMemo(() => {
    return (
      <div className='py-2 px-2 flex justify-between items-center'>
        <span className='w-[30%] text-small text-default-400'>
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${
                filteredItems && filteredItems.length
              } selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className='hidden sm:flex w-[30%] justify-end gap-2'>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, jobs?.length, page, pages, hasSearchFilter]);
  const renderDesktopActionButtons = (item: JobInterface) => (
    <div className='flex flex-row gap-3 justify-end'>
      {onAutoCollect && !item._markdown && (
        <Tooltip color='secondary' content='Get listing data'>
          <Button
            variant='flat'
            color='secondary'
            onPress={() => onAutoCollect(item._id)}
            aria-label='Get Listing Data'
            isIconOnly={true}
            isDisabled={!!item._markdown || !firecrawl_key}
          >
            <AiIcon width={iconWidth} />
          </Button>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip color='primary' content='Edit application information'>
          <Button
            variant='flat'
            color='primary'
            onPress={() => onEdit(item._id)}
            aria-label='Edit'
            isIconOnly={true}
          >
            <EditIcon width={iconWidth} />
          </Button>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip color='danger' content='Delete application'>
          <Button
            variant='flat'
            color='danger'
            onPress={() => onDelete(item._id)}
            aria-label='Delete'
            isIconOnly={true}
          >
            <DeleteIcon width={iconWidth} />
          </Button>
        </Tooltip>
      )}
    </div>
  );
  const renderMobileActionButtons = (item: JobInterface) => (
    <div className='relative flex justify-end items-center gap-2'>
      <Dropdown className='bg-background border-1 border-default-200'>
        <DropdownTrigger>
          <Button isIconOnly radius='full' size='sm' variant='light'>
            <VerticalDotsIcon className='text-default-400' />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key='view'
            onPress={() => onViewCard && onViewCard(item._id)}
            isReadOnly={!onViewCard}
          >
            View Application
          </DropdownItem>
          <DropdownItem
            key='edit'
            onPress={() => onEdit && onEdit(item._id)}
            isReadOnly={!onEdit}
          >
            Edit Application
          </DropdownItem>
          <DropdownItem
            key='viewCoverLetter'
            onPress={() => onAutoCollect && onAutoCollect(item._id)}
            isReadOnly={!onAutoCollect || !!item._markdown || !firecrawl_key}
          >
            Collect listing with AI
          </DropdownItem>
          <DropdownItem
            key='viewCoverLetter'
            onPress={() => onAutoCoverLetter && onAutoCoverLetter(item._id)}
            isReadOnly={
              !onAutoCoverLetter || !!item.automated_cover_letter || !openai_key
            }
          >
            Write Cover Letter with AI
          </DropdownItem>
          <DropdownItem
            key='viewCoverLetter'
            onPress={() => onViewCoverLetter && onViewCoverLetter(item._id)}
            isReadOnly={!onViewCoverLetter || !item.automated_cover_letter}
          >
            View Cover Letter
          </DropdownItem>
          <DropdownItem
            key='delete'
            onPress={() => onDelete && onDelete(item._id)}
            isReadOnly={!onDelete}
          >
            Delete Application
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
  return (
    <>
      {loading ? (
        <SkeletonList />
      ) : (
        <>
          <MobileList
            columns={columns}
            initialVisibleColumns={INITIAL_VISIBLE_COLUMNS_MOBILE}
            onAdd={onAdd}
            filterValue={filterValue}
            onSearchChange={onSearchChange}
            onClear={onClear}
            statusFilter={statusFilter}
            onRowsPerPageChange={onRowsPerPageChange}
            selectedKeys={'all'}
            setSelectedKeys={setSelectedKeys}
            jobs={jobs}
            bottomContent={bottomContent}
            actionButtons={renderMobileActionButtons}
          />
          <DesktopList
            columns={columns}
            initialVisibleColumns={INITIAL_VISIBLE_COLUMNS_DESKTOP}
            statusOptions={statusOptions}
            onAdd={onAdd}
            onAutoCoverLetter={onAutoCoverLetter}
            onViewCoverLetter={onViewCoverLetter}
            onViewCard={onViewCard}
            iconWidth={iconWidth}
            filterValue={filterValue}
            onSearchChange={onSearchChange}
            onClear={onClear}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onRowsPerPageChange={onRowsPerPageChange}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            jobs={jobs}
            bottomContent={bottomContent}
            actionButtons={renderDesktopActionButtons}
          />
        </>
      )}
    </>
  );
};
export default IndexList;
