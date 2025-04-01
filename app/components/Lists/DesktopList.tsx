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
  DropdownMenu,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
} from '@heroui/react';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { EditIcon } from '../Icons/EditIcon';
import { EyeIcon } from '../Icons/EyeIcon';
import { capitalize, getBadgeColor } from '@/functions/functions';
import { SearchIcon } from '../Icons/SearchIcon';
import { ChevronDownIcon } from '../Icons/ChevronDownIcon';
import { PlusIcon } from '../Icons/PlusIcon';
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
  onAdd?: () => void;
  onAutoCoverLetter?: (id: string) => void;
  onViewCoverLetter?: (id: string) => void;
  onViewCard?: (id: string) => void;
  disableOpenAi?: boolean;
  disableFirecrawl?: boolean;
  iconWidth?: string;
  filterValue: string;
  onSearchChange: () => void;
  onClear: () => void;
  statusFilter: Selection;
  setStatusFilter: Dispatch<SetStateAction<Selection>>;
  onRowsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  selectedKeys: Selection;
  setSelectedKeys: Dispatch<SetStateAction<Selection>>;
  jobs: JobInterface[];
  bottomContent: React.ReactNode;
  actionButtons: (item: JobInterface) => void;
  itemsLength?: number;
}
const DesktopList = (props: Props) => {
  const {
    columns,
    statusOptions,
    initialVisibleColumns,
    onAdd,
    onAutoCoverLetter,
    onViewCoverLetter,
    onViewCard,
    iconWidth,
    filterValue,
    onSearchChange,
    onClear,
    statusFilter,
    setStatusFilter,
    onRowsPerPageChange,
    selectedKeys,
    setSelectedKeys,
    jobs,
    bottomContent,
    actionButtons,
    itemsLength,
  } = props;
  if (!jobs) return;
  const { openai_key } = useUserContext();
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(initialVisibleColumns)
  );
  const hasSearchFilter = Boolean(filterValue);
  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
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
            Total of {itemsLength} applications
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
    itemsLength,
    hasSearchFilter,
  ]);
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
        return actionButtons(item);
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
              <TableCell className='text-bold text-sm capitalize text-default-400'>
                {renderCell(item, columnKey as string)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default DesktopList;
