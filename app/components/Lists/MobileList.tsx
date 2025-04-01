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
} from '@heroui/react';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { getBadgeColor } from '@/functions/functions';
import { SearchIcon } from '../Icons/SearchIcon';
import { PlusIcon } from '../Icons/PlusIcon';
interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}
interface Props {
  columns: Column[];
  initialVisibleColumns: string[];
  onAdd?: () => void;
  filterValue: string;
  onSearchChange: () => void;
  onClear: () => void;
  statusFilter: Selection;
  onRowsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  selectedKeys: Selection;
  setSelectedKeys: Dispatch<SetStateAction<Selection>>;
  jobs: JobInterface[];
  bottomContent: React.ReactNode;
  actionButtons: (item: JobInterface) => void;
  itemsLength?: number;
}
const MobileList = (props: Props) => {
  const {
    columns,
    initialVisibleColumns,
    onAdd,
    filterValue,
    onSearchChange,
    onClear,
    statusFilter,
    onRowsPerPageChange,
    selectedKeys,
    setSelectedKeys,
    jobs,
    bottomContent,
    actionButtons,
    itemsLength,
  } = props;
  if (!jobs) return;
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(initialVisibleColumns)
  );
  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
  const hasSearchFilter = Boolean(filterValue);
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
    onSearchChange,
    onRowsPerPageChange,
    itemsLength,
    hasSearchFilter,
  ]);
  const renderHeader = (item: JobInterface) => (
    <div className='flex flex-row gap-3'>
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
      className='mobile-only'
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
export default MobileList;
