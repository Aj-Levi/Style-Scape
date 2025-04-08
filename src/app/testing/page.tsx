'use client';
import Modal from '@/components/Modal';
import React, { useState } from 'react';

// Define interfaces for type safety
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

// Mock data for demonstration
const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', lastLogin: '2023-04-06' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-04-05' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Editor', status: 'Inactive', lastLogin: '2023-03-20' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'Pending', lastLogin: 'Never' },
  { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'User', status: 'Active', lastLogin: '2023-04-01' },
];

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Filter users based on search term
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate pagination values
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getStatusBadgeClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-error';
      case 'pending': return 'badge-warning';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="btn btn-primary" onClick={() => setIsAddUserModalOpen(true)}>
          Add User
        </button>
      </div>
      
      <div className="form-control mb-6 w-full max-w-xs">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="input input-bordered" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div className={`badge ${getStatusBadgeClass(user.status)}`}>
                    {user.status}
                  </div>
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-xs btn-info" onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}>View</button>
                    <button className="btn btn-xs btn-warning" onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => {
                      setSelectedUser(user);
                      setIsDeleteModalOpen(true);
                    }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex justify-center mt-4">
          <div className="join">
            <button 
              className="join-item btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              «
            </button>
            <button className="join-item btn">Page {currentPage} of {totalPages}</button>
            <button 
              className="join-item btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              »
            </button>
          </div>
        </div>
      )}
      
      {/* User Details/Edit Modal */}
      {isModalOpen && selectedUser && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{selectedUser.name}</h3>
            <div className="py-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered" 
                  defaultValue={selectedUser.name} 
                />
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  className="input input-bordered" 
                  defaultValue={selectedUser.email} 
                />
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select className="select select-bordered w-full" defaultValue={selectedUser.role}>
                  <option>User</option>
                  <option>Admin</option>
                  <option>Editor</option>
                </select>
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select className="select select-bordered w-full" defaultValue={selectedUser.status}>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary">Save</button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </dialog>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">Are you sure you want to delete user {selectedUser.name}? This action cannot be undone.</p>
            <div className="modal-action">
              <button className="btn btn-error">Delete</button>
              <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </dialog>
      )}
      
      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New User</h3>
            <div className="py-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered" 
                  placeholder="Enter name" 
                />
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  className="input input-bordered" 
                  placeholder="Enter email" 
                />
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input 
                  type="password" 
                  className="input input-bordered" 
                  placeholder="Enter password" 
                />
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select className="select select-bordered w-full">
                  <option>User</option>
                  <option>Admin</option>
                  <option>Editor</option>
                </select>
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select className="select select-bordered w-full">
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary">Add User</button>
              <button className="btn" onClick={() => setIsAddUserModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ManageUsers;