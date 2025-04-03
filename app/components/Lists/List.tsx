import JobInterface from '@/interfaces/JobInterface';
import SkeletonList from './SkeletonList';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react';
import { AiIcon } from '../Icons/AiIcon';
import { DeleteIcon } from '../Icons/DeleteIcon';
import { EditIcon } from '../Icons/EditIcon';
import { useUserContext } from '@/contexts/UserContext';
import { VerticalDotsIcon } from '../Icons/VerticalDotsIcon';
import { TableContext, TableContextInterface } from '@/contexts/TableContext';
import {
  capitalize,
  getBadgeColor,
  useWindowSize,
} from '@/functions/functions';
import { ChevronDownIcon } from '../Icons/ChevronDownIcon';
import { PlusIcon } from '../Icons/PlusIcon';
import { SearchIcon } from '../Icons/SearchIcon';
import { EyeIcon } from '../Icons/EyeIcon';
export interface TableInterface {
  page: number;
  rowsPerPage: number;
  filterCompanyName: string;
  statusFilter: Selection;
  visibleColumns: Selection;
  selectedRows: Selection;
}
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
const List = (props: Props) => {
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
  // updates table and saves values to sessionStorage
  const updateTableState = (args: { key: string; value: any }[]) => {
    const updates = args;
    updates.forEach((update: { key: string; value: any }) => {
      const { key, value } = update;
      setTableState((prevState) => ({
        ...prevState,
        [key]: value,
      }));
      if (
        key === 'visibleColumns' ||
        key === 'statusFilter' ||
        key === 'selectedRows'
      ) {
        setTableSession({ key, value: JSON.stringify([...value]) });
      } else {
        setTableSession({ key, value });
      }
    });
  };
  const setTableSession = (args: { key: string; value: any }) => {
    const { key, value } = args;
    sessionStorage.setItem(key, value);
  };
  // retrieve table info from sessionStorage
  const getTableSession = () => {
    const tableContextProperties = Object.keys(tableContextValue);
    tableContextProperties.forEach((key) => {
      const sessionValue = sessionStorage.getItem(key);
      if (!sessionValue) return;
      if (
        key === 'visibleColumns' ||
        key === 'statusFilter' ||
        key === 'selectedRows'
      ) {
        const value = new Set(JSON.parse(sessionValue));
        setTableState((prevState) => ({
          ...prevState,
          [key]: value,
          page: parseInt(sessionStorage.getItem('page') || '1'),
        }));
      } else if (key === 'page') {
        setTableState((prevState) => ({
          ...prevState,
          key: parseInt(sessionValue),
        }));
      } else {
        setTableState((prevState) => ({
          ...prevState,
          key: sessionValue,
        }));
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
      updateTableState([{ key: 'visibleColumns', value: columns }]);
    }
  }, [windowSize.width]);
  // table functions
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      updateTableState([
        {
          key: 'filterCompanyName',
          value: value,
        },
        { key: 'page', value: 1 },
      ]);
    } else {
      updateTableState([
        {
          key: 'filterCompanyName',
          value: '',
        },
        { key: 'page', value: 1 },
      ]);
    }
  }, []);
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
      { key: 'filterCompanyName', value: '' },
      { key: 'page', value: 1 },
    ]);
  }, []);
  // table variables
  const headerColumns = useMemo(() => {
    if (tableState.visibleColumns === 'all' || !tableState.visibleColumns)
      return columns;
    return columns.filter((column) =>
      Array.from(tableState.visibleColumns).includes(column.uid)
    );
  }, [tableState.visibleColumns]);
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
  const jobs = useMemo(() => {
    const start = (tableState.page - 1) * tableState.rowsPerPage;
    const end = start + tableState.rowsPerPage;
    return filteredItems.slice(start, end);
  }, [tableState.page, filteredItems, tableState.rowsPerPage]);
  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full md:max-w-[44%] text-default-400'
            placeholder='Search by company name...'
            startContent={<SearchIcon />}
            defaultValue={tableState.filterCompanyName}
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
                onSelectionChange={(value) =>
                  updateTableState([{ key: 'statusFilter', value }])
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
                selectedKeys={tableState.visibleColumns}
                selectionMode='multiple'
                onSelectionChange={(value) =>
                  updateTableState([{ key: 'visibleColumns', value }])
                }
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
            updateTableState([{ key: 'page', value }]);
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
  const renderHeader = (item: JobInterface) => (
    <>
      <div className='desktop-only flex flex-row gap-3'>
        <div className='flex gap-2 h-full my-auto'>
          {onViewCard && (
            <Tooltip color='primary' content='View all listing information.'>
              <Button
                variant='flat'
                color='primary'
                onPress={() => onViewCard(item._id)}
                aria-label='View your cover letter.'
                isIconOnly={true}
                className='m-auto'
              >
                <EyeIcon width={iconWidth} />
              </Button>
            </Tooltip>
          )}
        </div>
        <div className='flex flex-col my-auto grow'>
          {item.company_name ? (
            item.company_url ? (
              <h3>
                <Link href={item.company_url} isExternal className='text-lg'>
                  {item.company_name}
                </Link>
              </h3>
            ) : (
              <h3 className='text-lg'>{item.company_name}</h3>
            )
          ) : (
            ''
          )}
          {!item.company_name ? (
            <>
              <h3>
                <Link href={item.posting_url} isExternal showAnchorIcon>
                  Posting url{' '}
                </Link>
              </h3>
              <div className='text-default-400'>{item.location}</div>
            </>
          ) : (
            <div className='mt-1'>
              <span className='text-sm text-default-400'>{item.location}</span>
            </div>
          )}
        </div>
        <div className='my-auto'>
          {item.posting_url && (
            <Tooltip color='primary' content={'Go to the posting'}>
              <Link
                href={item.posting_url}
                isExternal
                showAnchorIcon
                aria-label='Go to the original post'
              />
            </Tooltip>
          )}
        </div>
      </div>
      <div className='mobile-only flex flex-row gap-3'>
        <div className='flex flex-col my-auto grow'>
          {item.company_name ? (
            item.company_url ? (
              <h3>
                <Link href={item.company_url} isExternal className='text-lg'>
                  {item.company_name}
                </Link>
              </h3>
            ) : (
              <h3 className='text-lg'>{item.company_name}</h3>
            )
          ) : (
            ''
          )}
          {!item.company_name ? (
            <>
              <h3>
                <Link href={item.posting_url} isExternal showAnchorIcon>
                  Posting url{' '}
                </Link>
              </h3>
              <div className='text-default-400'>{item.location}</div>
            </>
          ) : (
            <div className='mt-1'>
              <span className='text-sm text-default-400'>{item.location}</span>
            </div>
          )}
          <div className='text-default-400'>{item.role}</div>
          <div className='text-default-500'>{item.salary}</div>
        </div>
        <div className='my-auto'>
          {item.posting_url && (
            <Tooltip color='primary' content={'Go to the posting'}>
              <Link
                href={item.posting_url}
                isExternal
                showAnchorIcon
                aria-label='Go to the original post'
              />
            </Tooltip>
          )}
        </div>
      </div>
    </>
  );
  const renderCoverLetterActions = (item: JobInterface) => (
    <div className='flex flex-row gap-3 justify-center'>
      {onAutoCoverLetter && !item.automated_cover_letter && (
        <Tooltip
          color='secondary'
          content='Write cover letter. This is a paid AI action'
        >
          <Button
            variant='flat'
            color='secondary'
            onPress={() => onAutoCoverLetter(item._id)}
            isDisabled={
              !!item.automated_cover_letter ||
              !item._markdown ||
              item.stage?.toLocaleLowerCase() === 'closed' ||
              !openai_key
            }
            aria-label='Write cover letter with AI. This is a paid transaction.'
            isIconOnly={true}
          >
            <span
              className='text-success'
              aria-label='This action requires a financial transaction'
            >
              $
            </span>
            <EditIcon width={iconWidth} />
          </Button>
        </Tooltip>
      )}
      {onViewCoverLetter && item.automated_cover_letter && (
        <Tooltip color='primary' content='View your cover letter.'>
          <Button
            variant='flat'
            color='primary'
            onPress={() => onViewCoverLetter(item._id)}
            isDisabled={!item.automated_cover_letter}
            aria-label='View your cover letter.'
            isIconOnly={true}
          >
            <EyeIcon width={iconWidth} />
          </Button>
        </Tooltip>
      )}
    </div>
  );
  const renderActionButtons = (item: JobInterface) => (
    <>
      <div className='mobile-only relative flex justify-end items-center gap-2'>
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
                !onAutoCoverLetter ||
                !!item.automated_cover_letter ||
                !openai_key
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
      <div className='desktop-only flex flex-row gap-3 justify-end'>
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
    </>
  );
  const renderCell = useCallback((item: JobInterface, columnKey: string) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'name':
        return renderHeader(item);
      case 'stage':
        return (
          item.stage && (
            <Chip
              className='capitalize'
              color={getBadgeColor(item.stage)}
              size='sm'
              variant='flat'
            >
              {item.stage}
            </Chip>
          )
        );
      case 'coverLetter':
        return renderCoverLetterActions(item);
      case 'actions':
        return renderActionButtons(item);
      default:
        return cellValue;
    }
  }, []);
  return (
    <TableContext.Provider value={tableContextValue}>
      {loading ? (
        <SkeletonList />
      ) : (
        <>
          <Table
            isHeaderSticky
            isStriped
            // selectionMode='multiple' // enable with enhancement#2
            aria-label='List of your applications'
            selectedKeys={tableState.selectedRows}
            onSelectionChange={(value) =>
              updateTableState([{ key: 'selectedRows', value }])
            }
            topContent={topContent}
            topContentPlacement='outside'
            bottomContent={bottomContent}
            bottomContentPlacement='outside'
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={jobs}
              emptyContent={'No applications to display.'}
            >
              {(item) => (
                <TableRow key={item._id}>
                  {(columnKey) => (
                    <TableCell className='text-bold text-sm capitalize text-default-400'>
                      {renderCell(item, columnKey as string)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}
    </TableContext.Provider>
  );
};
export default List;
