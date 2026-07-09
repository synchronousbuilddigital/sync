import React, { useState, useMemo, useRef } from 'react';
import { Search, ArrowUpDown, Download, ZoomIn, ZoomOut, Calendar, RotateCcw } from 'lucide-react';

const parseFlexibleDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  const str = String(val).trim();

  // 1. Check for YYYY-MM-DD
  const ymd = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (ymd) {
    return new Date(parseInt(ymd[1]), parseInt(ymd[2]) - 1, parseInt(ymd[3]));
  }

  // 2. Check for DD-MM-YYYY or DD/MM/YYYY (e.g. 10-06-2026 or 24/06/2026)
  const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (dmy) {
    let first = parseInt(dmy[1]);
    let second = parseInt(dmy[2]);
    let y = parseInt(dmy[3]);
    if (y < 100) y += 2000;

    if (second > 12) {
      return new Date(y, first - 1, second);
    } else {
      return new Date(y, second - 1, first);
    }
  }

  // 3. Check for DD-MMM-YY or DD Month YYYY (e.g. 10-Jun-26 or 08 June 2026)
  const dmm = str.match(/^(\d{1,2})[\/\-\s]+([A-Za-z]{3,})[\/\-\s]*(\d{0,4})$/);
  if (dmm) {
    const day = parseInt(dmm[1]);
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const mIdx = monthNames.findIndex(m => dmm[2].toLowerCase().startsWith(m));
    if (mIdx !== -1) {
      let y = dmm[3] ? parseInt(dmm[3]) : new Date().getFullYear();
      if (y < 100) y += 2000;
      return new Date(y, mIdx, day);
    }
  }

  let d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

export default function AdminSpreadsheet({ tasks, companies = [], interns = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [companyFilter, setCompanyFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [teamMemberFilter, setTeamMemberFilter] = useState('');
  
  // Date & Month filters
  const [monthFilter, setMonthFilter] = useState('');
  const [dateFilterType, setDateFilterType] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Zoom & Pan state
  const [zoom, setZoom] = useState(0.9);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e) => {
    // Only enable click-drag pan on middle click or when space is held, or keep simple pan
    if (!containerRef.current || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
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
    // Only zoom when holding Ctrl or Cmd key to prevent breaking normal vertical scrolling
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY !== 0) {
        setZoom(z => Math.max(0.4, Math.min(2.0, Number((z - e.deltaY * 0.002).toFixed(2)))));
      }
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

    // Month & Date Range Filters
    if (monthFilter !== "" || dateFilterType !== "All" || fromDate || toDate) {
      result = result.filter(task => {
        const dStr = task.dueDate || task.marketingData?.postTracker?.scheduledDate || task.createdAt;
        const d = parseFlexibleDate(dStr);
        const sheetMonth = task.marketingData?.postTracker?.month || "";

        if (monthFilter !== "") {
          const mIndex = parseInt(monthFilter, 10);
          const monthsFull = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
          const monthsShort = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
          const targetFull = monthsFull[mIndex];
          const targetShort = monthsShort[mIndex];
          const targetNum = (mIndex + 1).toString();
          const targetNumPad = targetNum.padStart(2, "0");

          let monthMatched = false;
          if (d && d.getMonth() === mIndex) monthMatched = true;
          if (!monthMatched && sheetMonth) {
            const sStr = String(sheetMonth).trim().toLowerCase();
            if (sStr === targetFull || sStr === targetShort || sStr === targetNum || sStr === targetNumPad || sStr.includes(targetFull) || sStr.includes(targetShort)) {
              monthMatched = true;
            }
          }
          if (!monthMatched) return false;
        }

        if (dateFilterType !== "All" || fromDate || toDate) {
          if (!d) return false;
          const now = new Date();
          if (dateFilterType === "Today" && d.toDateString() !== now.toDateString()) return false;
          if (dateFilterType === "This Week") {
            const firstDay = new Date(now);
            firstDay.setHours(0, 0, 0, 0);
            firstDay.setDate(now.getDate() - now.getDay());
            const lastDay = new Date(firstDay);
            lastDay.setDate(firstDay.getDate() + 6);
            lastDay.setHours(23, 59, 59, 999);
            if (d < firstDay || d > lastDay) return false;
          }
          if (dateFilterType === "This Month" && (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear())) return false;
          if (fromDate && new Date(fromDate + "T00:00:00") > d) return false;
          if (toDate && new Date(toDate + "T23:59:59") < d) return false;
        }
        return true;
      });
    }

    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

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
  }, [tasks, searchTerm, sortConfig, companyFilter, departmentFilter, teamMemberFilter, monthFilter, dateFilterType, fromDate, toDate]);

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
    { key: 'postingTime', label: 'Time Clock' },
    { key: 'postStatus', label: 'Post Status' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'rawLink', label: 'Raw Link' },
    { key: 'editedLink', label: 'Editor Link' },
    { key: 'editorStatus', label: 'Editor Status' },
    { key: 'brandReview', label: 'Brand Review' }
  ];

  return (
    <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-6 md:p-10 overflow-hidden flex flex-col space-y-6 h-[85vh]">
      {/* Top Header & Zoom Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
            Task <span className="text-[#F05E23]">Spreadsheet</span>
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            Showing {sortedAndFilteredTasks.length} of {tasks.length} tasks
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/40 p-1.5 rounded-2xl border border-black/5 dark:border-white/10">
          <span className="text-[10px] font-black uppercase text-slate-400 px-2">Zoom:</span>
          <button
            onClick={() => setZoom(z => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
            title="Zoom Out"
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-white transition-all shadow-sm active:scale-95"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1.0)}
            title="Reset Zoom (100%)"
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 text-xs font-black text-[#F05E23] transition-all shadow-sm hover:scale-105"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => setZoom(z => Math.min(2.0, Number((z + 0.1).toFixed(2))))}
            title="Zoom In"
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-white transition-all shadow-sm active:scale-95"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-black/5 dark:border-white/5">
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 focus:border-[#F05E23]/50 outline-none text-xs font-bold text-slate-700 dark:text-white transition-all appearance-none cursor-pointer"
        >
          <option value="">All Companies</option>
          {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 focus:border-[#F05E23]/50 outline-none text-xs font-bold text-slate-700 dark:text-white transition-all appearance-none cursor-pointer"
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          value={teamMemberFilter}
          onChange={(e) => setTeamMemberFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 focus:border-[#F05E23]/50 outline-none text-xs font-bold text-slate-700 dark:text-white transition-all appearance-none cursor-pointer"
        >
          <option value="">All Team Members</option>
          {uniqueTeamMembers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 focus:border-[#F05E23]/50 outline-none text-xs font-bold text-[#F05E23] transition-all appearance-none cursor-pointer"
        >
          <option value="">All Months</option>
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, idx) => (
            <option key={m} value={idx}>{m}</option>
          ))}
        </select>

        <select
          value={dateFilterType}
          onChange={(e) => setDateFilterType(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 focus:border-[#F05E23]/50 outline-none text-xs font-bold text-slate-700 dark:text-white transition-all appearance-none cursor-pointer"
        >
          <option value="All">All Dates</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="Custom">Custom Range</option>
        </select>

        {dateFilterType === 'Custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-white outline-none"
            />
            <span className="text-xs text-slate-400 font-bold">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-white outline-none"
            />
          </div>
        )}

        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 focus:border-[#F05E23]/50 outline-none text-xs font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
        className={`flex-1 overflow-x-auto overflow-y-auto rounded-2xl border border-black/5 dark:border-white/10 custom-scrollbar ${isDragging ? 'cursor-grabbing select-none' : ''}`}
      >
        <table className="w-full text-left border-collapse min-w-max transition-all duration-150" style={{ zoom }}>
          <thead className="bg-slate-100 dark:bg-black/60 sticky top-0 z-10 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-black/5 dark:border-white/10 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors whitespace-nowrap select-none"
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
                <td colSpan={columns.length} className="p-12 text-center text-sm font-bold text-slate-400 italic">
                  No tasks match your filters.
                </td>
              </tr>
            ) : (
              sortedAndFilteredTasks.map((task) => (
                <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                  <td className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                    {task.contentId || '-'}
                  </td>
                  <td className="p-4 text-xs font-bold text-slate-900 dark:text-white max-w-[220px] truncate" title={task.title}>
                    {task.title}
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600 dark:text-white/70">
                    {task.internId?.name || 'Unassigned'}
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600 dark:text-white/70">
                    {task.marketingData?.companyId?.name || '-'}
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600 dark:text-white/70">
                    {task.marketingData?.departmentId?.name || '-'}
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md ${task.status === 'Complete' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 border border-black/10 dark:border-white/20'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md ${task.priority === 'High' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 border border-black/10 dark:border-white/20'}`}>
                      {task.priority || 'Medium'}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {task.taskType || 'General'}
                  </td>
                  <td className="p-4 text-[10px] font-bold text-[#F05E23] uppercase tracking-widest">
                    {task.marketingData?.postTracker?.scheduledDate || task.dueDate || '-'}
                  </td>
                  <td className="p-4 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                    {task.marketingData?.postTracker?.postingTime || '-'}
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${task.marketingData?.postTracker?.status?.includes('Posted') ? 'text-green-500 font-bold' : (task.marketingData?.postTracker?.status ? 'text-amber-500 font-bold' : 'text-slate-400')}`}>
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
