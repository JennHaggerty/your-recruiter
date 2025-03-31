import JobInterface from '@/interfaces/JobInterface';
import {
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Button,
  Tooltip,
  Input,
  Selection,
  Pagination,
  DropdownMenu,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
} from '@heroui/react';
import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { DeleteIcon } from '../Icons/DeleteIcon';
import { EditIcon } from '../Icons/EditIcon';
import { AiIcon } from '../Icons/AiIcon';
import { EyeIcon } from '../Icons/EyeIcon';
import { capitalize, getBadgeColor } from '@/functions/functions';
import { SearchIcon } from '../Icons/SearchIcon';
import { ChevronDownIcon } from '../Icons/ChevronDownIcon';
import { PlusIcon } from '../Icons/PlusIcon';
import { TableContext, useTableContext } from '@/contexts/TableContext';
import { useUserContext } from '@/contexts/UserContext';
interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}
interface Status {
  name: string;
  uid: string;
}
interface Props {
  columns: Column[];
  statusOptions: Status[];
  initialVisibleColumns: string[];
  items?: JobInterface[];
  selectedkeys?: string[];
  setSelectedKeys?: () => void;
  onAdd?: () => void;
  onAutoCollect?: (id: string) => void;
  onAutoCoverLetter?: (id: string) => void;
  onViewCoverLetter?: (id: string) => void;
  onViewCard?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  disableOpenAi?: boolean;
  disableFirecrawl?: boolean;
}
const DesktopList = (props: Props) => {
  const {
    columns,
    statusOptions,
    initialVisibleColumns,
    items,
    onAdd,
    onAutoCollect,
    onAutoCoverLetter,
    onViewCoverLetter,
    onViewCard,
    onDelete,
    onEdit,
  } = props;
  if (!items) return;
  const { firecrawl_key, openai_key } = useUserContext();
  const { rowsPerPage, setRowsPerPage } = useContext(TableContext);
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(initialVisibleColumns)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
  const [page, setPage] = useState(1);
  //const [rowsPerPage, setRowsPerPage] = useState(15);
  const iconWidth = '15px';
  const hasSearchFilter = Boolean(filterValue);
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
  const filteredItems = useMemo(() => {
    let filteredItems = items;
    if (hasSearchFilter) {
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
      //setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );
  const jobs = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);
  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);
  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full sm:max-w-[44%] text-default-400'
            placeholder='Search by company name...'
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className='flex gap-3'>
            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
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
                selectedKeys={statusFilter}
                selectionMode='multiple'
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className='capitalize'>
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
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
            <Button color='primary' onPress={onAdd} endContent={<PlusIcon />}>
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
    filterValue,
    statusFilter,
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
  const renderHeader = (item: JobInterface) => (
    <div className='flex flex-row gap-3'>
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
  const renderCell = useCallback((item: JobInterface, columnKey: string) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'name':
        return renderHeader(item);
      case 'role':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize text-default-400'>
              {item.role}
            </p>
          </div>
        );
      case 'location':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize text-default-400'>
              {item.location}
            </p>
          </div>
        );
      case 'salary':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize text-default-400'>
              {item.salary}
            </p>
          </div>
        );
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
    <Table
      isHeaderSticky
      isStriped
      aria-label='List of your applications'
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      topContent={topContent}
      topContentPlacement='outside'
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      className='desktop-only'
    >
      <TableHeader columns={headerColumns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={jobs} emptyContent={'No applications to display.'}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default DesktopList;
