
import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Search, ChevronLeft, ChevronRight, Eye, MoreVertical } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  country?: string;
  uni?: string;
  course?: string;
  status: string;
  createdAt?: any;
  engagement?: number;
}

interface StudentTableProps {
  data: Student[];
  onViewProfile: (student: Student) => void;
}

const columnHelper = createColumnHelper<Student>();

const StudentTable: React.FC<StudentTableProps> = ({ data, onViewProfile }) => {
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => <span className="font-bold text-slate-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => <span className="text-slate-500">{info.getValue()}</span>,
    }),
    columnHelper.accessor('country', {
      header: 'Country',
      cell: info => info.getValue() || 'Zambia',
    }),
    columnHelper.accessor('uni', {
      header: 'University',
      cell: info => <span className="text-xs">{info.getValue() || 'N/A'}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
            ${status === 'New' ? 'bg-blue-100 text-blue-700' : 
              status === 'Review' ? 'bg-orange-100 text-orange-700' : 
              status === 'Enrolled' ? 'bg-emerald-100 text-emerald-700' : 
              'bg-slate-100 text-slate-700'}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('engagement', {
      header: 'Engagement',
      cell: info => (
        <div className="flex items-center space-x-2">
          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500" 
              style={{ width: `${info.getValue() || 0}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-500">{info.getValue() || 0}%</span>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: props => (
        <button 
          onClick={() => onViewProfile(props.row.original)}
          className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-emerald-600"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    }),
  ], [onViewProfile]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No students yet</h3>
        <p className="text-slate-500 text-sm">Create your first student to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
          <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-50">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition cursor-pointer" onClick={() => onViewProfile(row.original)}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-white transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase">
          Showing {table.getRowModel().rows.length} of {data.length} Students
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
