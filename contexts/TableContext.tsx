import { createContext, useContext } from 'react';
export interface TableContextInterface {
  page: number;
  rowsPerPage: number;
  /*
  filterCompanyName?: string;
  statusFilter?: string[];
  columnFilter?: string[];
  visibleColumns?: string;
  */
}
export const TableContext = createContext<TableContextInterface>({
  page: 1,
  rowsPerPage: 15,
  /*
  filterCompanyName: '',
  statusFilter: [''],
  columnFilter: [''],
  visibleColumns: '',
  */
});
export const useTableContext = () => useContext(TableContext);
