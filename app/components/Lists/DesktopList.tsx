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
  Selection,
} from '@heroui/react';
import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { EditIcon } from '../Icons/EditIcon';
import { EyeIcon } from '../Icons/EyeIcon';
import { getBadgeColor } from '@/functions/functions';
import { useUserContext } from '@/contexts/UserContext';
import { useTableContext } from '@/contexts/TableContext';
interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}
interface Props {
  columns: Column[];
  onAutoCoverLetter?: (id: string) => void;
  onViewCoverLetter?: (id: string) => void;
  onViewCard?: (id: string) => void;
  iconWidth?: string;
  selectedKeys: Selection;
  setSelectedKeys: Dispatch<SetStateAction<Selection>>;
  jobs: JobInterface[];
  topContent: React.ReactNode;
  bottomContent: React.ReactNode;
  actionButtons: (item: JobInterface) => void;
}
const DesktopList = (props: Props) => {
  const {
    columns,
    onAutoCoverLetter,
    onViewCoverLetter,
    onViewCard,
    iconWidth,
    selectedKeys,
    setSelectedKeys,
    jobs,
    topContent,
    bottomContent,
    actionButtons,
  } = props;
  if (!jobs) return;
  const { openai_key } = useUserContext();
  const { visibleColumns } = useTableContext();
  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all' || !visibleColumns) return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
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
