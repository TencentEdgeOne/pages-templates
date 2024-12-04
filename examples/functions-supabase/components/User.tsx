'use client';

import { getUsers } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers.users);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(
          'Environment configuration is missing. Please set up the necessary environment variables in your EdgeOne Pages project settings.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300 bg-black">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-300 bg-black">
      <div className="w-full max-w-4xl p-8 bg-gray-900 rounded-lg shadow-xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-100">
          <a
            href="https://edgeone.ai/products/pages"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            EdgeOne Pages: Supabase Database
          </a>
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Occupation</th>
              </tr>
            </thead>
            {error ? (
              <tbody>
                <tr>
                  <td colSpan={4} className="p-3 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="p-3">{`${user['First Name']} ${user['Last Name']}`}</td>
                    <td className="p-3">{user.Email}</td>
                    <td className="p-3">{`${user.City}, ${user.Country}`}</td>
                    <td className="p-3">{user.Occupation}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
