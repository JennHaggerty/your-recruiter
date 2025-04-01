import JobInterface from '@/interfaces/JobInterface';
import DesktopList from './DesktopList';
import MobileList from './MobileList';
import SkeletonList from './SkeletonList';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  Tooltip,
} from '@heroui/react';
import { AiIcon } from '../Icons/AiIcon';
import { DeleteIcon } from '../Icons/DeleteIcon';
import { EditIcon } from '../Icons/EditIcon';
import { useUserContext } from '@/contexts/UserContext';
import { VerticalDotsIcon } from '../Icons/VerticalDotsIcon';
import { TableContext, TableContextInterface } from '@/contexts/TableContext';
import { capitalize, useWindowSize } from '@/functions/functions';
import { ChevronDownIcon } from '../Icons/ChevronDownIcon';
import { PlusIcon } from '../Icons/PlusIcon';
import { SearchIcon } from '../Icons/SearchIcon';
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
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>();
  const [state, setState] = useState<TableContextInterface>({
    page: 1,
    rowsPerPage: 15,
    filterCompanyName: '',
    statusFilter: 'all',
  });
  const hasSearchFilter = Boolean(state.filterCompanyName);
  const windowSize = useWindowSize();
  const iconWidth = '15px';
  const updateState = (args: { key: string; value: any }[]) => {
    const updates = args;
    updates.forEach((update) => {
      const { key, value } = update;
      setState((previousState) => ({
        ...previousState,
        [key]: value.toString(),
      }));
    });
  };
  /*
  const setTableSession = (args: { key: string; value: any }) => {
    const { key, value } = args;
    sessionStorage.setItem(key, value);
  };
  const getTableSession = () => {
    const tableContextProperties = Object.keys(tableContextValue);
    tableContextProperties.forEach((property) => {
      const sessionValue = sessionStorage.getItem(property);
      // if (sessionValue) {
      //   updateState([{ key: property, value: sessionValue }]);
      // }
      console.log('sessionValue', sessionValue);
    });
  };
  useEffect(() => {
    getTableSession();
  }, []);
  */
  useEffect(() => {
    if (windowSize.width < 769) {
      setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS_MOBILE));
    } else {
      setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS_DESKTOP));
    }
  }, [windowSize.width]);
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      updateState([
        { key: 'filterCompanyName', value },
        { key: 'page', value: 1 },
      ]);
    } else {
      updateState([{ key: 'filterCompanyName', value: '' }]);
    }
  }, []);
  const filteredItems = useMemo(() => {
    let filteredItems = items || [];
    if (state.filterCompanyName) {
      filteredItems = filteredItems.filter((item) =>
        item.company_name
          .toLowerCase()
          .includes(state.filterCompanyName.toLowerCase())
      );
    }
    if (
      state.statusFilter !== 'all' &&
      Array.from(state.statusFilter).length !== statusOptions.length
    ) {
      filteredItems = filteredItems.filter((item) =>
        Array.from(state.statusFilter).includes(item.stage || '')
      );
    }
    return filteredItems;
  }, [items, state.filterCompanyName, state.statusFilter]);
  const pages = Math.ceil(filteredItems.length / state.rowsPerPage);
  const onNextPage = useCallback(() => {
    if (state.page < pages) {
      updateState([{ key: 'page', value: state.page + 1 }]);
    }
  }, [state.page, pages]);
  const onPreviousPage = useCallback(() => {
    if (state.page > 1) {
      updateState([{ key: 'page', value: state.page - 1 }]);
    }
  }, [state.page]);
  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      updateState([
        { key: 'page', value: 1 },
        { key: 'rowsPerPage', value: Number(e.target.value) },
      ]);
    },
    []
  );
  const onClear = useCallback(() => {
    updateState([
      {
        key: 'filterCompanyName',
        value: '',
      },
      { key: 'page', value: 1 },
    ]);
  }, []);
  const jobs = useMemo(() => {
    const start = (state.page - 1) * state.rowsPerPage;
    const end = start + state.rowsPerPage;
    return filteredItems.slice(start, end);
  }, [state.page, filteredItems, state.rowsPerPage]);
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
  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full md:max-w-[44%] text-default-400'
            placeholder='Search by company name...'
            startContent={<SearchIcon />}
            value={state.filterCompanyName}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className='flex w-full md:w-auto gap-3'>
            <Dropdown>
              <DropdownTrigger className='w-full'>
                <Button
                  endContent={<ChevronDownIcon className='text-small' />}
                  variant='flat'
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={state.statusFilter}
                selectionMode='multiple'
                onSelectionChange={(v) =>
                  setState((prev) => ({ ...prev, statusFilter: v }))
                }
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className='capitalize'>
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className='w-full'>
                <Button
                  endContent={<ChevronDownIcon className='text-small' />}
                  variant='flat'
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode='multiple'
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className='capitalize'>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className='w-full'
              color='primary'
              onPress={onAdd}
              endContent={<PlusIcon />}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total of {items?.length} applications
          </span>
          <label className='flex items-center text-default-400 text-small'>
            Rows per page:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
              onChange={onRowsPerPageChange}
            >
              <option value='15'>15</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    state.filterCompanyName,
    state.statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    items?.length,
    hasSearchFilter,
  ]);
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
          page={state.page}
          total={pages}
          onChange={(value) => {
            updateState([{ key: 'page', value }]);
          }}
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
  }, [selectedKeys, jobs?.length, state.page, pages, hasSearchFilter]);
  const tableContextValue: TableContextInterface = {
    page: state.page,
    filterCompanyName: state.filterCompanyName,
    rowsPerPage: state.rowsPerPage,
    visibleColumns: visibleColumns,
    statusFilter: state.statusFilter,
  };
  return (
    <TableContext.Provider value={tableContextValue}>
      {loading ? (
        <SkeletonList />
      ) : (
        <>
          <MobileList
            jobs={jobs}
            columns={columns}
            selectedKeys={'all'}
            setSelectedKeys={setSelectedKeys}
            bottomContent={bottomContent}
            actionButtons={renderMobileActionButtons}
            topContent={topContent}
          />
          <DesktopList
            jobs={jobs}
            columns={columns}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            topContent={topContent}
            bottomContent={bottomContent}
            actionButtons={renderDesktopActionButtons}
            onAutoCoverLetter={onAutoCoverLetter}
            onViewCoverLetter={onViewCoverLetter}
            onViewCard={onViewCard}
            iconWidth={iconWidth}
          />
        </>
      )}
    </TableContext.Provider>
  );
};
export default IndexList;
