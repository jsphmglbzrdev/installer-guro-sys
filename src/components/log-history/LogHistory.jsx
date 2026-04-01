import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  Settings, 
  UserPlus, 
  Trash2, 
  LogIn,
  MoreVertical,
  Calendar
} from 'lucide-react';

// Mock Data for Admin Logs
const mockLogs = [
  {
    id: 'LOG-8029',
    timestamp: '2026-04-01T14:32:00',
    user: 'Sarah Connor',
    email: 's.connor@admin.system',
    action: 'User Deleted',
    details: 'Deleted account for user ID #4920 (John Doe)',
    type: 'danger',
    ip: '192.168.1.45',
    icon: Trash2
  },
  {
    id: 'LOG-8028',
    timestamp: '2026-04-01T13:15:22',
    user: 'Admin System',
    email: 'system@admin.system',
    action: 'System Backup',
    details: 'Automated daily database backup completed successfully.',
    type: 'system',
    ip: '127.0.0.1',
    icon: Settings
  },
  {
    id: 'LOG-8027',
    timestamp: '2026-04-01T11:05:10',
    user: 'Marcus Wright',
    email: 'm.wright@admin.system',
    action: 'Settings Updated',
    details: 'Modified global payment gateway timeout settings.',
    type: 'warning',
    ip: '10.0.0.212',
    icon: Settings
  },
  {
    id: 'LOG-8026',
    timestamp: '2026-04-01T09:41:05',
    user: 'Sarah Connor',
    email: 's.connor@admin.system',
    action: 'Role Assigned',
    details: 'Assigned "Editor" role to user ID #5102.',
    type: 'success',
    ip: '192.168.1.45',
    icon: UserPlus
  },
  {
    id: 'LOG-8025',
    timestamp: '2026-04-01T08:30:00',
    user: 'Unknown',
    email: 'N/A',
    action: 'Failed Login',
    details: 'Multiple failed login attempts detected.',
    type: 'danger',
    ip: '45.22.19.102',
    icon: ShieldAlert
  },
  {
    id: 'LOG-8024',
    timestamp: '2026-03-31T16:20:15',
    user: 'Marcus Wright',
    email: 'm.wright@admin.system',
    action: 'Login',
    details: 'Successful authenticated session started.',
    type: 'info',
    ip: '10.0.0.212',
    icon: LogIn
  },
  {
    id: 'LOG-8023',
    timestamp: '2026-03-31T14:10:05',
    user: 'System API',
    email: 'api@admin.system',
    action: 'Data Export',
    details: 'Exported monthly revenue report via API.',
    type: 'system',
    ip: '127.0.0.1',
    icon: Download
  }
];

// Helper to format date
const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper for type badges
const getTypeBadge = (type) => {
  switch (type) {
    case 'danger':
      return 'bg-red-50 text-red-600 border-red-200';
    case 'success':
      return 'bg-green-50 text-green-600 border-green-200';
    case 'warning':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'system':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'info':
    default:
      return 'bg-blue-50 text-blue-600 border-blue-200';
  }
};

export default function LogHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Filter logic
  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || log.type === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans p-4 md:p-8">
      
      {/* Page Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-orange-500 rounded-full inline-block"></span>
              Admin Activity Logs
            </h1>
            <p className="text-gray-500 text-sm mt-1 ml-4">Monitor system events, user actions, and security alerts.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors shadow-sm text-sm font-medium">
              <Calendar size={16} />
              Last 7 Days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/30 text-sm font-medium">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
            
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all bg-white"
                placeholder="Search by user, action, or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <Filter size={16} />
                <span>Filter:</span>
              </div>
              <select 
                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 block p-2.5 cursor-pointer outline-none min-w-[140px]"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Events</option>
                <option value="danger">Danger/Alerts</option>
                <option value="warning">Warnings</option>
                <option value="success">Success</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                  <th className="px-6 py-4 font-semibold">IP Address</th>
                  <th className="px-6 py-4 text-right font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    const Icon = log.icon;
                    return (
                      <tr key={log.id} className="hover:bg-orange-50/30 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs border border-orange-200">
                              {log.user === 'Unknown' ? '?' : log.user.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">{log.user}</p>
                              <p className="text-xs text-gray-400">{log.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Icon size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-800">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {log.details}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{log.ip}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wide font-bold ${getTypeBadge(log.type)}`}>
                              {log.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 hover:text-orange-500 transition-colors p-1 rounded hover:bg-orange-50">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <Search size={24} className="text-gray-400" />
                        </div>
                        <p className="text-base font-medium text-gray-900">No logs found</p>
                        <p className="text-sm">We couldn't find any logs matching your current filters.</p>
                        <button 
                          onClick={() => {setSearchTerm(''); setFilterType('All')}}
                          className="mt-2 text-orange-500 font-medium hover:text-orange-600"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{filteredLogs.length}</span> of <span className="font-medium text-gray-900">128</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-orange-500 text-white font-medium text-sm flex items-center justify-center shadow-sm">1</button>
                <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 font-medium text-sm hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors flex items-center justify-center">2</button>
                <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 font-medium text-sm hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors flex items-center justify-center">3</button>
                <span className="px-1 text-gray-400">...</span>
                <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 font-medium text-sm hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors flex items-center justify-center">12</button>
              </div>
              <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}