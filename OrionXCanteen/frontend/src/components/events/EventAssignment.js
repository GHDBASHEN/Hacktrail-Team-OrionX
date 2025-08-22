import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  getAssignmentOptions,
  assignEmployeeToEvent,
  getAssignments,
  updateAssignment,
  deleteAssignment
} from '../../services/EventService';

const assignmentSchema = Yup.object().shape({
  eventId: Yup.string().required('Event selection is required'),
  employeeId: Yup.string().required('Employee selection is required'),
  userRole: Yup.string()
    .required('Role is required')
    .oneOf(['owner', 'chef', 'waiter', 'security', 'decorators'], 'Invalid role selection')
});

const EventAssignment = () => {
  const [options, setOptions] = useState({ employees: [], events: [] });
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Safe array access
  const safeEmployees = Array.isArray(options.employees) ? options.employees : [];
  const safeEvents = Array.isArray(options.events) ? options.events : [];
  const safeAssignments = Array.isArray(assignments) ? assignments : [];

  // Get unique years and months from assignments
  const getDateFilters = () => {
    const years = new Set();
    const months = new Set();
    
    safeAssignments.forEach(assignment => {
      if (assignment.eventDate) {
        const date = new Date(assignment.eventDate);
        years.add(date.getFullYear());
        months.add(date.getMonth() + 1);
      }
    });
    
    return {
      years: Array.from(years).sort(),
      months: Array.from(months).sort((a, b) => a - b)
    };
  };

  const { years, months } = getDateFilters();

  // Combined filter function
  const filteredAssignments = safeAssignments.filter(assignment => {
    const searchText = filterText.toLowerCase();
    const eventMatch = selectedEvent ? assignment.event?.id === selectedEvent : true;
    const date = assignment.eventDate ? new Date(assignment.eventDate) : null;
    
    const yearMatch = selectedYear ? date?.getFullYear() === parseInt(selectedYear) : true;
    const monthMatch = selectedMonth ? (date?.getMonth() + 1) === parseInt(selectedMonth) : true;

    return (
      eventMatch &&
      yearMatch &&
      monthMatch &&
      (
        assignment.event?.label?.toLowerCase().includes(searchText) ||
        assignment.employees?.name?.toLowerCase().includes(searchText) ||
        assignment.userRole?.toLowerCase().includes(searchText)
      )
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [optionsData, assignmentsData] = await Promise.all([
          getAssignmentOptions(),
          getAssignments()
        ]);

        setOptions({
          employees: optionsData?.employees || [],
          events: optionsData?.events || []
        });

        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setError('');
      const selectedEvent = options.events.find(e => e?.id === values.eventId);

      if (!selectedEvent) {
        throw new Error('Selected event not found');
      }

      const result = await assignEmployeeToEvent(values);

      setAssignments(prev => [{
        ...result,
        employees: options.employees.find(e => e?.id === values.employeeId) || {},
        event: selectedEvent
      }, ...(Array.isArray(prev) ? prev : [])]);

      resetForm();
      setSuccess(`Assignment ${result?.assignmentId} created successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create assignment');
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(assignmentId);
        setAssignments(prev =>
          (Array.isArray(prev) ? prev : []).filter(a => a?.assignmentId !== assignmentId)
        );
        setSuccess('Assignment deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete assignment');
      }
    }
  };

  const handleUpdate = async (values) => {
    try {
      const updated = await updateAssignment(editData?.assignmentId, values);
      setAssignments(prev =>
        (Array.isArray(prev) ? prev : []).map(a =>
          a?.assignmentId === updated?.assignmentId ? { ...a, ...updated } : a
        )
      );
      setEditData(null);
      setSuccess('Assignment updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update assignment');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Assignment Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Event Staff Assignment</h1>
          <p className="text-gray-500">Assign employees to upcoming events with role specifications</p>
        </header>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        <Formik
          initialValues={{ eventId: '', employeeId: '', userRole: '' }}
          validationSchema={assignmentSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Event Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Event</label>
                <Field
                  as="select"
                  name="eventId"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                >
                  <option value="">Select an event</option>
                  {safeEvents.map(event => (
                    <option key={event?.id} value={event?.id}>
                      {event?.label || 'Unknown Event'}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="eventId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Employee Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <Field
                  as="select"
                  name="employeeId"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                >
                  <option value="">Select an employees</option>
                  {safeEmployees.map(employees => (
                    <option key={employees?.id} value={employees?.id}>
                      {employees?.label || 'Unknown Employee'}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="employeeId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <Field
                  as="select"
                  name="userRole"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                >
                  <option value="">Select a role</option>
                  <option value="owner">Owner</option>
                  <option value="chef">Chef</option>
                  <option value="waiter">Waiter</option>
                  <option value="security">Security</option>
                  <option value="decorators">Decorator</option>
                </Field>
                <ErrorMessage name="userRole" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? 'Assigning...' : 'Create Assignment'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Assignment</h3>
            <Formik
              initialValues={{ userRole: editData?.userRole || '' }}
              validationSchema={Yup.object({
                userRole: assignmentSchema.fields.userRole
              })}
              onSubmit={handleUpdate}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Role</label>
                    <Field
                      as="select"
                      name="userRole"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200"
                    >
                      <option value="owner">Owner</option>
                      <option value="chef">Chef</option>
                      <option value="waiter">Waiter</option>
                      <option value="security">Security</option>
                      <option value="decorators">Decorator</option>
                    </Field>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditData(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                      Update
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Assignments Table */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-full md:w-64">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All Events</option>
              {safeEvents.map(event => (
                <option key={event.id} value={event.id}>
                  {event.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-32">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="w-32">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1).toLocaleString('default', { month: 'short' })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 md:flex-none md:w-64">
            <input
              type="text"
              placeholder="Search assignments..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map(assignment => (
                <tr key={assignment?.assignmentId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {assignment?.event?.label || 'Unknown Event'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {assignment?.employees?.name || 'Unknown Employee'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1.5 text-xs font-medium capitalize rounded-full bg-indigo-100 text-indigo-800">
                      {assignment?.userRole || 'Unknown Role'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {assignment?.eventDate ? new Date(assignment.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric'
                    }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setEditData(assignment)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(assignment?.assignmentId)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAssignments.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {safeAssignments.length === 0 ? 'No assignments found' : 'No matching assignments found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventAssignment;