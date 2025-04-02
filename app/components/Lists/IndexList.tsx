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
  const [tableState, setTableState] = useState<TableContextInterface>({
    page: 1,
    rowsPerPage: 15,
    filterCompanyName: '',
    statusFilter: 'all',
    visibleColumns: 'all',
    selectedRows: '',
  });
  const tableContextValue = {
    page: tableState.page,
    filterCompanyName: tableState.filterCompanyName,
    rowsPerPage: tableState.rowsPerPage,
    visibleColumns: tableState.visibleColumns,
    statusFilter: tableState.statusFilter,
    selectedRows: tableState.selectedRows,
  };
  const hasSearchFilter = Boolean(tableState.filterCompanyName);
  const iconWidth = '15px';
  const windowSize = useWindowSize();
  const setTableSession = (args: { key: string; value: any }) => {
    const { key, value } = args;
    sessionStorage.setItem(key, value);
  };
  const updateTableState = (args: { key: string; value: any }[]) => {
    const updates = args;
    updates.forEach((update) => {
      const { key, value } = update;
      setTableState((previousState) => ({
        ...previousState,
        key: value.toString(),
      }));
      setTableSession({
        key,
        value,
      });
    });
  };
  const getTableSession = () => {
    const tableContextProperties = Object.keys(tableContextValue);
    tableContextProperties.forEach((property) => {
      const sessionValue = sessionStorage.getItem(property);
      if (!sessionValue) return;
      if (property === 'visibleColumns' || property === 'statusFilter') {
        const value = new Set(JSON.parse(sessionValue));
        setTableState((prevState) => ({
          ...prevState,
          [property]: value,
          page: parseInt(sessionStorage.getItem('page') || '1'),
        }));
      } else if (property === 'page') {
        updateTableState([{ key: property, value: parseInt(sessionValue) }]);
      } else {
        updateTableState([{ key: property, value: sessionValue }]);
      }
    });
  };
  useEffect(() => {
    getTableSession();
  }, []);
  useEffect(() => {
    if (!sessionStorage.getItem('visibleColumns')) {
      let columns;
      if (windowSize.width < 769) {
        columns = new Set(INITIAL_VISIBLE_COLUMNS_MOBILE);
      } else {
        columns = new Set(INITIAL_VISIBLE_COLUMNS_DESKTOP);
      }
      setTableState((prevState) => ({
        ...prevState,
        visibleColumns: columns,
      }));
      setTableSession({
        key: 'visibleColumns',
        value: JSON.stringify([...columns]),
      });
    }
  }, [windowSize.width]);
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      updateTableState([
        { key: 'filterCompanyName', value },
        { key: 'page', value: 1 },
      ]);
    } else {
      updateTableState([{ key: 'filterCompanyName', value: '' }]);
    }
  }, []);
  const filteredItems = useMemo(() => {
    let filteredItems = items || [];
    if (tableState.filterCompanyName) {
      filteredItems = filteredItems.filter((item) =>
        item.company_name
          .toLowerCase()
          .includes(tableState.filterCompanyName.toLowerCase())
      );
    }
    if (
      tableState.statusFilter !== 'all' &&
      Array.from(tableState.statusFilter).length !== statusOptions.length
    ) {
      filteredItems = filteredItems.filter((item) =>
        Array.from(tableState.statusFilter).includes(item.stage || '')
      );
    }
    return filteredItems;
  }, [items, tableState.filterCompanyName, tableState.statusFilter]);
  const pages = Math.ceil(filteredItems.length / tableState.rowsPerPage);
  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      updateTableState([
        { key: 'page', value: 1 },
        { key: 'rowsPerPage', value: Number(e.target.value) },
      ]);
    },
    []
  );
  const onClear = useCallback(() => {
    updateTableState([
      {
        key: 'filterCompanyName',
        value: '',
      },
      { key: 'page', value: 1 },
    ]);
  }, []);
  const jobs = useMemo(() => {
    const start = (tableState.page - 1) * tableState.rowsPerPage;
    const end = start + tableState.rowsPerPage;
    return filteredItems.slice(start, end);
  }, [tableState.page, filteredItems, tableState.rowsPerPage]);
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
            value={tableState.filterCompanyName}
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
                selectedKeys={tableState.statusFilter}
                selectionMode='multiple'
                onSelectionChange={(v) => {
                  setTableState((prev) => ({ ...prev, statusFilter: v }));
                  setTableSession({
                    key: 'statusFilter',
                    value: JSON.stringify([...v]),
                  });
                }}
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
                selectedKeys={tableState.visibleColumns}
                selectionMode='multiple'
                onSelectionChange={(v) => {
                  setTableState((prev) => ({ ...prev, visibleColumns: v }));
                  setTableSession({
                    key: 'visibleColumns',
                    value: JSON.stringify([...v]),
                  });
                }}
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
    tableState.filterCompanyName,
    tableState.statusFilter,
    tableState.visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    items?.length,
    hasSearchFilter,
  ]);
  const bottomContent = useMemo(() => {
    const sessionPage = parseInt(
      JSON.parse(sessionStorage.getItem('page') || '1')
    );
    return (
      <div className='py-2 px-2 flex flex-col gap-2 items-center'>
        <span className='text-small text-default-400'>
          {tableState.selectedRows === 'all'
            ? 'All items selected'
            : `${tableState.selectedRows.size || 0} of ${
                filteredItems && filteredItems.length
              } selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          initialPage={sessionPage ? sessionPage : 1}
          total={pages}
          onChange={(value) => {
            setTableState((prevState) => ({
              ...prevState,
              page: value,
            }));
            setTableSession({ key: 'page', value });
            console.log(tableState.page, value, sessionStorage.getItem('page'));
          }}
        />
      </div>
    );
  }, [
    tableState.selectedRows,
    jobs?.length,
    tableState.page,
    pages,
    hasSearchFilter,
  ]);
  return (
    <TableContext.Provider value={tableContextValue}>
      {loading ? (
        <SkeletonList />
      ) : (
        <>
          <MobileList
            jobs={jobs}
            columns={columns}
            selectedKeys={tableState.selectedRows}
            setSelectedKeys={(v) =>
              setTableState((prevState) => ({
                ...prevState,
                selectedRows: v,
              }))
            }
            bottomContent={bottomContent}
            actionButtons={renderMobileActionButtons}
            topContent={topContent}
          />
          <DesktopList
            jobs={jobs}
            columns={columns}
            selectedKeys={tableState.selectedRows}
            setSelectedKeys={(v) =>
              setTableState((prevState) => ({
                ...prevState,
                selectedRows: v,
              }))
            }
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
