import React, { useState, useMemo, useRef } from 'react';
import { Search, ArrowUpDown, Download, ZoomIn, ZoomOut } from 'lucide-react';

export default function AdminSpreadsheet({ tasks, companies = [], interns = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [companyFilter, setCompanyFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [teamMemberFilter, setTeamMemberFilter] = useState('');

  // Zoom & Pan state
  const [zoom, setZoom] = useState(0.85);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    // Use two-finger scroll (deltaY) to zoom in and out
    if (e.deltaY !== 0) {
      setZoom(z => Math.max(0.3, Math.min(2, z - e.deltaY * 0.005)));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const uniqueCompanies = useMemo(() => {
    const set = new Set();
    companies.forEach(c => set.add(c.name));
    return Array.from(set).sort();
  }, [companies]);

  const uniqueDepartments = useMemo(() => {
    const set = new Set();
    companies.forEach(c => {
      if (companyFilter && c.name !== companyFilter) return;
      c.departments?.forEach(d => set.add(d.name));
    });
    return Array.from(set).sort();
  }, [companies, companyFilter]);

  const uniqueTeamMembers = useMemo(() => {
    const set = new Set();
    interns.forEach(i => set.add(i.name));
    return Array.from(set).sort();
  }, [interns]);

  const sortedAndFilteredTasks = useMemo(() => {
    let result = [...tasks];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((task) =>
        task.title?.toLowerCase().includes(lowerSearch) ||
        task.contentId?.toLowerCase().includes(lowerSearch) ||
        task.description?.toLowerCase().includes(lowerSearch) ||
        task.internId?.name?.toLowerCase().includes(lowerSearch) ||
        task.marketingData?.companyId?.name?.toLowerCase().includes(lowerSearch) ||
        task.marketingData?.departmentId?.name?.toLowerCase().includes(lowerSearch) ||
        task.status?.toLowerCase().includes(lowerSearch)
      );
    }

    if (companyFilter) {
      result = result.filter(t => t.marketingData?.companyId?.name === companyFilter);
    }
    if (departmentFilter) {
      result = result.filter(t => t.marketingData?.departmentId?.name === departmentFilter);
    }
    if (teamMemberFilter) {
      result = result.filter(t => t.internId?.name === teamMemberFilter);
    }

    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested properties
      if (sortConfig.key === 'internName') {
        aValue = a.internId?.name || '';
        bValue = b.internId?.name || '';
      } else if (sortConfig.key === 'companyName') {
        aValue = a.marketingData?.companyId?.name || '';
        bValue = b.marketingData?.companyId?.name || '';
      } else if (sortConfig.key === 'departmentName') {
        aValue = a.marketingData?.departmentId?.name || '';
        bValue = b.marketingData?.departmentId?.name || '';
      } else if (sortConfig.key === 'editorStatus') {
        aValue = a.marketingData?.editorStatus || '';
        bValue = b.marketingData?.editorStatus || '';
      } else if (sortConfig.key === 'brandReview') {
        aValue = a.marketingData?.brandManagerReviewStatus || '';
        bValue = b.marketingData?.brandManagerReviewStatus || '';
      } else if (sortConfig.key === 'scheduledDate') {
        aValue = a.marketingData?.postTracker?.scheduledDate || '';
        bValue = b.marketingData?.postTracker?.scheduledDate || '';
      } else if (sortConfig.key === 'postStatus') {
        aValue = a.marketingData?.postTracker?.status || '';
        bValue = b.marketingData?.postTracker?.status || '';
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [tasks, searchTerm, sortConfig, companyFilter, departmentFilter, teamMemberFilter]);

  const columns = [
    { key: 'contentId', label: 'ID' },
    { key: 'title', label: 'Task Title' },
    { key: 'internName', label: 'Assigned Intern' },
    { key: 'companyName', label: 'Company' },
    { key: 'department', label: 'Department' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'taskType', label: 'Type' },
    { key: 'scheduledDate', label: 'Scheduled' },
    { key: 'postStatus', label: 'Post Status' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'rawLink', label: 'Raw Link' },
    { key: 'editedLink', label: 'Editor Link' },
    { key: 'editorStatus', label: 'Editor Status' },
    { key: 'brandReview', label: 'Brand Review' }
  ];

  return (
    <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden flex flex-col space-y-8 h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
            Task <span className="text-[#F05E23]">Spreadsheet</span>
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Raw Database View (Zoom: {Math.round(zoom * 100)}%)</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-black/40 border border-transparent focus:border-[#F05E23]/50 focus:bg-white dark:focus:bg-black/60 outline-none text-xs font-bold text-slate-600 dark:text-white transition-all appearance-none cursor-pointer"
          >
            <option value="">All Companies</option>
            {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-black/40 border border-transparent focus:border-[#F05E23]/50 focus:bg-white dark:focus:bg-black/60 outline-none text-xs font-bold text-slate-600 dark:text-white transition-all appearance-none cursor-pointer"
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={teamMemberFilter}
            onChange={(e) => setTeamMemberFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-black/40 border border-transparent focus:border-[#F05E23]/50 focus:bg-white dark:focus:bg-black/60 outline-none text-xs font-bold text-slate-600 dark:text-white transition-all appearance-none cursor-pointer"
          >
            <option value="">All Team Members</option>
            {uniqueTeamMembers.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-black/40 border border-transparent focus:border-[#F05E23]/50 focus:bg-white dark:focus:bg-black/60 outline-none text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
        className={`flex-1 overflow-x-auto overflow-y-auto rounded-2xl border border-black/5 dark:border-white/10 custom-scrollbar ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      >
        <table className="w-full text-left border-collapse min-w-max" style={{ zoom }}>
          <thead className="bg-slate-50 dark:bg-black/40 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-black/5 dark:border-white/10 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortConfig.key === col.key ? (
                      <ArrowUpDown className={`w-3 h-3 ${sortConfig.direction === 'asc' ? 'text-[#F05E23]' : 'text-slate-400'}`} />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-20" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {sortedAndFilteredTasks.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-sm font-bold text-slate-400 italic">
                  No tasks found.
                </td>
              </tr>
            ) : (
              sortedAndFilteredTasks.map((task) => (
                <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                    {task.contentId || '-'}
                  </td>
                  <td className="p-4 text-xs font-bold text-slate-900 dark:text-white max-w-[200px] truncate" title={task.title}>
                    {task.title}
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600 dark:text-white/60">
                    {task.internId?.name || 'Unassigned'}
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600 dark:text-white/60">
                    {task.marketingData?.companyId?.name || '-'}
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600 dark:text-white/60">
                    {task.marketingData?.departmentId?.name || '-'}
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ${task.status === 'Complete' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 border border-black/10 dark:border-white/20'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ${task.priority === 'High' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 border border-black/10 dark:border-white/20'}`}>
                      {task.priority || 'Medium'}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {task.taskType || 'General'}
                  </td>
                  <td className="p-4 text-[10px] font-bold text-[#F05E23] uppercase tracking-widest">
                    {task.marketingData?.postTracker?.scheduledDate || '-'}
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${task.marketingData?.postTracker?.status?.includes('Posted') ? 'text-green-500' : (task.marketingData?.postTracker?.status ? 'text-amber-500' : 'text-slate-400')}`}>
                      {task.marketingData?.postTracker?.status || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] font-medium text-slate-400">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {task.marketingData?.rawLink ? (
                      <a href={task.marketingData.rawLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-500 hover:text-blue-600 hover:underline">
                        View Raw
                      </a>
                    ) : <span className="text-slate-400 text-[10px]">-</span>}
                  </td>
                  <td className="p-4">
                    {task.marketingData?.editedLink ? (
                      <a href={task.marketingData.editedLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-purple-500 hover:text-purple-600 hover:underline">
                        View Edited
                      </a>
                    ) : <span className="text-slate-400 text-[10px]">-</span>}
                  </td>
                  <td className="p-4 text-[10px] font-bold text-[#F05E23] uppercase tracking-widest">
                    {task.marketingData?.editorStatus || '-'}
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${task.marketingData?.brandManagerReviewStatus === 'Approved' ? 'text-green-500' : (task.marketingData?.brandManagerReviewStatus === 'Changes Requested' ? 'text-red-500' : 'text-slate-400')}`}>
                      {task.marketingData?.brandManagerReviewStatus || '-'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
