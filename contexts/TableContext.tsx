import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Selection } from '@heroui/react';
export interface TableContextInterface {
  page: number;
  rowsPerPage: number;
  filterCompanyName?: string;
  statusFilter?: Selection;
  visibleColumns?: Selection;
}
export const TableContext = createContext<TableContextInterface>({
  page: 0,
  rowsPerPage: 0,
  filterCompanyName: '',
  statusFilter: undefined,
  visibleColumns: undefined,
});
export const useTableContext = () => useContext(TableContext);
