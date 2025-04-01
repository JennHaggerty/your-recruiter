import { createContext, useContext } from 'react';
export interface TableContextInterface {
  page: number;
  setPage: () => void;
  /*
  rowsPerPage: number;
  filterCompanyName?: string;
  statusFilter?: string[];
  columnFilter?: string[];
  visibleColumns?: string;
  */
}
export const TableContext = createContext<TableContextInterface>({
  page: 1,
  setPage: () => {},
  /*
  rowsPerPage: 15,
  filterCompanyName: '',
  statusFilter: [''],
  columnFilter: [''],
  visibleColumns: '',
  */
});
export const useTableContext = () => useContext(TableContext);
