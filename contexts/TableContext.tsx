import { createContext, useContext } from 'react';
import { Selection } from '@heroui/react';
export interface TableContextInterface {
  page: number;
  rowsPerPage: number;
  filterCompanyName: string;
  statusFilter: Selection;
  visibleColumns: Selection;
  selectedRows: any;
}
export const TableContext = createContext<TableContextInterface>({
  page: 0,
  rowsPerPage: 0,
  filterCompanyName: '',
  statusFilter: 'all',
  visibleColumns: 'all',
  selectedRows: '',
});
export const useTableContext = () => useContext(TableContext);
