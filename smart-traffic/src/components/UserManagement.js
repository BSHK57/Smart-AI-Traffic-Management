import React, { useState, useEffect } from "react";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "" });

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const handleDelete = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      alert("Please fill in all fields.");
      return;
    }

    // Ensure unique emails (prevent duplicate registrations)
    if (users.some(user => user.email === newUser.email)) {
      alert("User with this email already exists.");
      return;
    }

    // Add the new user with password stored securely in localStorage
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Reset form fields
    setNewUser({ name: "", email: "", password: "", role: "" });
  };

  return (
    <div className="user-management-container">
      <h2>User Management</h2>

      {/* Add User Form */}
      <form className="add-user-form" onSubmit={handleAddUser}>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={newUser.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={newUser.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={newUser.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={newUser.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
        <button type="submit" className="add-btn">Add User</button>
      </form>

      {/* User Table */}
      {users.length === 0 ? (
        <p className="no-users">No users available.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
