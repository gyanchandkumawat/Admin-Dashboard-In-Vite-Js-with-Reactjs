import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function CodeC() {
  
  const oldCode = `import React, {useState, useEffect} from "react";

function MyApp() {
  const [d, setD] = useState([]);
  const [s, setS] = useState(false);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((r) => r.json())
      .then((data) => {
        setD(data);
        setS(true);
      });
  }, []);

  return (
    <div>
      <h2>User Info</h2>
      {s
        ? d.map((u, i) => (
            <div key={i}>
              <p>{u.name}</p>
              <p>{u.email}</p>
              <p>{u.address.street}, {u.address.city}</p>
              <p>{u.phone}</p>
              <p>{u.company.name}</p>
            </div>
          ))
        : "loading..."}
    </div>
  );
}

export default MyApp;`;

  const newCode = `import React, { useState, useEffect } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const userData = await response.json();
        setUsers(userData);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="user-list-container">
        <h2 className="user-list-title">User Information</h2>
        <div className="loading-spinner">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container">
        <h2 className="user-list-title">User Information</h2>
        <div className="error-message">
          <p>Failed to load user data. Please try again later.</p>
          <p className="error-details">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">User Information</h2>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3 className="user-name">{user.name}</h3>
            <p className="user-email">
              <span className="label">Email:</span> {user.email}
            </p>
            <p className="user-address">
              <span className="label">Address:</span> {user.address.street}, {user.address.city}
            </p>
            <p className="user-phone">
              <span className="label">Phone:</span> {user.phone}
            </p>
            <p className="user-company">
              <span className="label">Company:</span> {user.company.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;`;

  return (
    <div className="mx-auto max-w-7xl p-4">
      <AnimatePresence>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 text-center"
        >
          Code Refactoring Comparison
        </motion.h1>
      </AnimatePresence>


      <div className="flex gap-4">
        <div className='w-1/2 shadow-md border-1 border-slate-300 rounded-md'>
            <div className="bg-red-100 p-3 rounded-t-md border-b border-red-200">
              <h2 className="text-lg font-semibold text-red-800">Old Code</h2>
            </div>
            <pre className="p-4 overflow-auto  language-javascript bg-gray-50">
              <code className="text-sm text-gray-700">{oldCode}</code>
            </pre>
        </div>
        <div className='w-1/2 shadow-md border-1 border-slate-300 rounded-md'>
            <div className="bg-green-100 p-3 rounded-t-md border-b border-green-200">
              <h2 className="text-lg font-semibold text-green-800">Refactor Code</h2>
            </div>
            <pre className="p-4 overflow-auto  language-javascript bg-gray-50">
              <code className="text-sm text-gray-700">{newCode}</code>
            </pre>
        </div>
      </div>
    </div>
  );
}