import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getProfile, getAdmins, getEmployees, assignRole, deactivateAdmin, updateProfile, changePassword } from '../../services/settingService'

const SettingView = () => {
  const [profile, setProfile] = useState({ name: '', email: ''})
  const [admins, setAdmins] = useState([])
  const [employees, setEmployees] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profilePassword, setProfilePassword] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfile(sessionStorage.getItem('id'))
        setProfile(profileData)
        const adminsData = await getAdmins()
        setAdmins(adminsData)
        const employeesData = await getEmployees()
        setEmployees(employeesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleSubmitPassword = async (e) => {
    e.preventDefault()
    // Add password change logic
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    try {
      await changePassword(sessionStorage.getItem("id"),{current: passwordData.currentPassword, new: passwordData.newPassword})
      alert("Password changed successfully!")
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to change password')
    }
  }

  // New handler for role assignment
  const handleAssignRole = async (selectedRole, adminPassword) => {
    try {
      const adminId = sessionStorage.getItem('id')
      await assignRole(selectedEmployee, selectedRole, adminPassword, adminId)
      alert('Role successfully updated!')
      // Refresh admin list
      const adminsData = await getAdmins()
      setAdmins(adminsData)
      setShowRoleModal(false)
      setShowAdd(false)
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to assign role')
    }
  }

  // Move state inside modal
  const RoleChangeModal = () => {
    const [selectedRole, setSelectedRole] = useState('super_admin')
    const [adminPassword, setAdminPassword] = useState('')

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Confirm Role Change</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Role</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {/* <option value="sub_admin">Sub Admin</option> */}
                <option value="super_admin">Admin</option>
                <option value="employees">Employee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Your Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignRole(selectedRole, adminPassword)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handler for profile update with password confirmation
  const handleProfileUpdate = async () => {
    setShowProfileModal(true)
  }

  const handleConfirmProfileUpdate = async () => {
    try {
      // Try to change password with current password to verify
      await changePassword(sessionStorage.getItem('id'), {
        current: profilePassword,
        new: profilePassword // dummy, will not actually change
      })
      // If password is correct, update profile
      await updateProfile(sessionStorage.getItem('id'), profile)
      alert('Profile updated successfully!')
      setShowProfileModal(false)
      setProfilePassword('')
    } catch (error) {
      alert(error.response?.data?.error || 'Password incorrect or failed to update profile')
    }
  }

  const ProfilePasswordModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Confirm Profile Update</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Enter your password to confirm</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={profilePassword}
              onChange={e => setProfilePassword(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => { setShowProfileModal(false); setProfilePassword(''); }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmProfileUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Profile</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={profile.status}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={profile.role}
                  readOnly
                />
              </div>
            </div>
            <button
              onClick={handleProfileUpdate}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Password Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handlePasswordChange}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Admins Management Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Manage Admins</h2>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className={` ${sessionStorage.getItem('id') !== 'SU000001' ? 'hidden' : ''} py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors flex items-center`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Sub-Admin
          </button>
        </div>

        {showAdd && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="flex-1 px-3 py-2 border rounded"
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.user_id} className={` ${emp.employee_id === 'EMP000001' ? 'hidden' : ''}`} value={emp.employee_id}>{emp.name} | {emp.email}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Assign Role
                </button>
                {/* ... cancel button */}
              </div>
            </div>
          </div>
        )}

        {showRoleModal && <RoleChangeModal />}
        {showProfileModal && <ProfilePasswordModal />}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map(admin => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      { admin.user_id === 'SU000001' ? admin.role : 'Sub Admin'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SettingView