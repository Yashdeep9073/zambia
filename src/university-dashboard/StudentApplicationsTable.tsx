// src/university-dashboard/StudentApplicationsTable.tsx
import React from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper 
} from '@tanstack/react-table';
import { FileText, User, Calendar, CheckCircle, Clock } from 'lucide-react';

interface Application {
  id: string;
  studentName: string;
  course: string;
  status: string;
  appliedDate: any;
}

const columnHelper = createColumnHelper<Application>();

const columns = [
  columnHelper.accessor('studentName', {
    header: () => <span className="flex items-center gap-2"><User className="w-4 h-4" /> Student</span>,
    cell: info => <span className="font-bold text-slate-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('course', {
    header: () => <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Course</span>,
    cell: info => <span className="text-slate-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('appliedDate', {
    header: () => <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</span>,
    cell: info => {
      const date = info.getValue()?.toDate ? info.getValue().toDate() : new Date();
      return <span className="text-slate-500 text-sm">{date.toLocaleDateString()}</span>;
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const status = info.getValue();
      const colors: any = {
        pending: 'bg-amber-100 text-amber-700',
        approved: 'bg-emerald-100 text-emerald-700',
        rejected: 'bg-red-100 text-red-700',
        reviewing: 'bg-blue-100 text-blue-700'
      };
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
          {status}
        </span>
      );
    },
  }),
];

interface StudentApplicationsTableProps {
  applications: Application[];
}

const StudentApplicationsTable: React.FC<StudentApplicationsTableProps> = ({ applications }) => {
  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No applications found</h3>
        <p className="text-slate-500">When students apply to your university, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentApplicationsTable;
