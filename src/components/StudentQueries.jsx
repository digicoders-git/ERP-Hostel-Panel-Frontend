import { useState, useEffect } from 'react';
import { FaQuestionCircle, FaReply, FaCheck, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import Swal from 'sweetalert2';

const StudentQueries = () => {
  const [queries, setQueries] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const savedQueries = JSON.parse(localStorage.getItem('studentQueries') || '[]');
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');

    // Add some sample queries if none exist
    if (savedQueries.length === 0 && savedStudents.length > 0) {
      const sampleQueries = [
        {
          id: 1,
          studentId: savedStudents[0]?.id || 1,
          studentName: savedStudents[0]?.name || 'John Doe',
          rollNumber: savedStudents[0]?.rollNumber || 'CS001',
          category: 'Maintenance',
          subject: 'AC not working in room',
          description: 'The air conditioner in my room has stopped working since yesterday. Please fix it as soon as possible.',
          status: 'Pending',
          priority: 'High',
          submittedDate: new Date().toISOString().split('T')[0],
          reply: null
        },
        {
          id: 2,
          studentId: savedStudents[1]?.id || 2,
          studentName: savedStudents[1]?.name || 'Jane Smith',
          rollNumber: savedStudents[1]?.rollNumber || 'CS002',
          category: 'Mess',
          subject: 'Food quality complaint',
          description: 'The food quality has been poor lately. Please improve the mess services.',
          status: 'Pending',
          priority: 'Medium',
          submittedDate: new Date().toISOString().split('T')[0],
          reply: null
        }
      ];
      setQueries(sampleQueries);
      localStorage.setItem('studentQueries', JSON.stringify(sampleQueries));
    } else {
      setQueries(savedQueries);
    }

    setStudents(savedStudents);
  }, []);

  const handleReply = (queryId) => {
    if (!replyText.trim()) {
      Swal.fire('Error', 'Please enter a reply', 'error');
      return;
    }

    const updatedQueries = queries.map(query => {
      if (query.id === queryId) {
        return {
          ...query,
          reply: replyText,
          status: 'Resolved',
          repliedDate: new Date().toISOString().split('T')[0]
        };
      }
      return query;
    });

    setQueries(updatedQueries);
    localStorage.setItem('studentQueries', JSON.stringify(updatedQueries));

    Swal.fire('Success!', 'Reply sent successfully', 'success');
    setSelectedQuery(null);
    setReplyText('');
  };

  const handleStatusChange = (queryId, newStatus) => {
    const updatedQueries = queries.map(query => {
      if (query.id === queryId) {
        return { ...query, status: newStatus };
      }
      return query;
    });

    setQueries(updatedQueries);
    localStorage.setItem('studentQueries', JSON.stringify(updatedQueries));

    Swal.fire('Success!', `Query status updated to ${newStatus}`, 'success');
  };

  const filteredQueries = queries.filter(query => {
    const studentName = query.studentName || '';
    const subject = query.subject || '';
    const rollNumber = query.rollNumber || '';

    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || query.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || query.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQueryStats = () => {
    const pending = queries.filter(q => q.status === 'Pending').length;
    const inProgress = queries.filter(q => q.status === 'In Progress').length;
    const resolved = queries.filter(q => q.status === 'Resolved').length;
    return { pending, inProgress, resolved, total: queries.length };
  };

  const stats = getQueryStats();

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaQuestionCircle className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Queries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaQuestionCircle className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaQuestionCircle className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheck className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Student Queries</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Mess">Mess</option>
            <option value="Room">Room</option>
            <option value="General">General</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Queries Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Priority</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((query) => (
                <tr key={query.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{query.studentName}</p>
                      <p className="text-sm text-gray-600">{query.rollNumber}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{query.category}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900 font-medium">{query.subject}</p>
                    <p className="text-sm text-gray-600 truncate max-w-xs">{query.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(query.priority)}`}>
                      {query.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(query.status)}`}>
                      {query.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{query.submittedDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedQuery(query)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        title="Reply"
                      >
                        <FaReply />
                      </button>
                      {query.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(query.id, 'In Progress')}
                          className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          title="Mark In Progress"
                        >
                          <FaQuestionCircle />
                        </button>
                      )}
                      {query.status !== 'Resolved' && (
                        <button
                          onClick={() => handleStatusChange(query.id, 'Resolved')}
                          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                          title="Mark Resolved"
                        >
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredQueries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No queries found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Reply to Query</h3>
              <button
                onClick={() => setSelectedQuery(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedQuery.subject}</p>
              <p className="text-sm text-gray-600 mt-1">{selectedQuery.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                From: {selectedQuery.studentName} ({selectedQuery.rollNumber})
              </p>
            </div>

            {selectedQuery.reply && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Previous Reply:</p>
                <p className="text-sm text-blue-800 mt-1">{selectedQuery.reply}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Type your reply here..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedQuery(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReply(selectedQuery.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQueries;