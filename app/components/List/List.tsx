import Job from '@/app/interfaces/Job';
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
} from '@heroui/react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { DeleteIcon } from '../Icons/DeleteIcon';
import { EditIcon } from '../Icons/EditIcon';
import { AiIcon } from '../Icons/AiIcon';
import { EyeIcon } from '../Icons/EyeIcon';
import { getBadgeColor } from '@/functions/functions';
import { SearchIcon } from '../Icons/SearchIcon';
interface Props {
  items?: Job[];
  selectedkeys?: string[];
  setSelectedKeys?: () => void;
  loading?: boolean;
  loadingAI?: boolean;
  disableAI?: boolean;
  onAutoCollect?: (id: string) => void;
  onAutoCoverLetter?: (id: string) => void;
  onViewCoverLetter?: (id: string) => void;
  onViewCard?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  disableOpenAi?: boolean;
  disableFirecrawl?: boolean;
}
const columns = [
  { name: 'Details', uid: 'name', sortable: true },
  { name: 'Role', uid: 'role', sortable: true },
  { name: 'Salary', uid: 'salary', sortable: true },
  { name: 'Stage', uid: 'stage', sortable: true },
  { name: 'Cover Letter', uid: 'coverLetter' },
  { name: 'Actions', uid: 'actions' },
];
export const statusOptions = [
  { name: 'Applied', uid: 'applied' },
  { name: 'Rejected', uid: 'rejected' },
  { name: 'Closed', uid: 'closed' },
];
const INITIAL_VISIBLE_COLUMNS = [
  'name',
  'role',
  'salary',
  'stage',
  'coverLetter',
  'actions',
];
type Item = Job;
const List = (props: Props) => {
  const {
    items,
    loading,
    loadingAI,
    disableAI,
    onAutoCollect,
    onAutoCoverLetter,
    onViewCoverLetter,
    onViewCard,
    onDelete,
    onEdit,
    disableOpenAi,
    disableFirecrawl,
  } = props;
  if (!items) return;
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const hasSearchFilter = Boolean(filterValue);
  const renderHeader = (item: Job) => (
    <div className='flex flex-row gap-3'>
      <div className='flex gap-2 h-full my-auto'>
        {onViewCard && (
          <Tooltip color='primary' content='View all listing information.'>
            <Button
              variant='flat'
              color='primary'
              onPress={() => onViewCard(item._id)}
              isLoading={loading}
              aria-label='View your cover letter.'
              isIconOnly={true}
              className='m-auto'
            >
              <EyeIcon />
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
  const renderCoverLetterActions = (item: Job) => (
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
            isLoading={loadingAI}
            isDisabled={
              !!item.automated_cover_letter ||
              !item._markdown ||
              item.stage?.toLocaleLowerCase() === 'closed' ||
              disableOpenAi
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
            <EditIcon />
          </Button>
        </Tooltip>
      )}
      {onViewCoverLetter && item.automated_cover_letter && (
        <Tooltip color='primary' content='View your cover letter.'>
          <Button
            variant='flat'
            color='primary'
            onPress={() => onViewCoverLetter(item._id)}
            isLoading={loading}
            isDisabled={!item.automated_cover_letter}
            aria-label='View your cover letter.'
            isIconOnly={true}
          >
            <EyeIcon />
          </Button>
        </Tooltip>
      )}
    </div>
  );
  const renderActionButtons = (item: Job) => (
    <div className='flex flex-row gap-3 justify-end'>
      {onAutoCollect && !item._markdown && (
        <Tooltip color='secondary' content='Get listing data'>
          <Button
            variant='flat'
            color='secondary'
            onPress={() => onAutoCollect(item._id)}
            isLoading={loadingAI}
            aria-label='Get Listing Data'
            isIconOnly={true}
            className='w-full'
            isDisabled={!!item._markdown || disableFirecrawl}
          >
            <AiIcon />
          </Button>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip color='primary' content='Edit application information'>
          <Button
            variant='flat'
            color='primary'
            onPress={() => onEdit(item._id)}
            isLoading={loading}
            aria-label='Edit'
            isIconOnly={true}
          >
            <EditIcon />
          </Button>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip color='danger' content='Delete application'>
          <Button
            variant='flat'
            color='danger'
            onPress={() => onDelete(item._id)}
            isLoading={loading}
            aria-label='Delete'
            isIconOnly={true}
          >
            <DeleteIcon />
          </Button>
        </Tooltip>
      )}
    </div>
  );
  const renderCell = useCallback((item: Job, columnKey: string) => {
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
  const filteredItems = useMemo(() => {
    let filteredItems = items;
    if (hasSearchFilter) {
      filteredItems = filteredItems.filter((item) =>
        item.company_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredItems;
  }, [items, filterValue]);
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
  return (
    <Table
      isHeaderSticky
      isStriped
      aria-label='List view of your application'
      selectionMode='multiple'
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      topContent={topContent}
      topContentPlacement='outside'
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
    >
      <TableHeader columns={columns}>
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
export default List;
