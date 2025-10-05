'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import TopBar from '@/components/TopBar';

// Mock data for complaints (replace with real data from an API or database)
const initialComplaints = [
  { id: 1, name: "Abebe Kebede", email: "abebe@example.com", complaint: "Issue with training session", status: "Pending" },
  { id: 2, name: "Chaltu Tadesse", email: "chaltu@example.com", complaint: "Website loading slow", status: "Resolved" },
];

export default function Complaints() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [formData, setFormData] = useState({ name: '', email: '', complaint: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint = {
      id: complaints.length + 1,
      name: formData.name,
      email: formData.email,
      complaint: formData.complaint,
      status: "Pending",
    };
    setComplaints([...complaints, newComplaint]);
    setFormData({ name: '', email: '', complaint: '' });
    setMessage('Complaint submitted successfully!');
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <main className="flex-1">
        <section className="px-4 py-16 mx-auto max-w-7xl">
          <h1 className="mb-6 text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Submit a Complaint</h1>
          <p className="mb-10 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Let us know about any issues or concerns. We’re here to assist you.
          </p>

          {/* Complaint Form */}
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 mb-10">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">File a Complaint</h2>
            {message && <p className="mb-4 text-green-600 dark:text-green-400">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="complaint" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Complaint
                </label>
                <textarea
                  id="complaint"
                  name="complaint"
                  value={formData.complaint}
                  onChange={handleChange}
                  placeholder="Describe your complaint..."
                  rows={4}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Submit Complaint
              </button>
            </form>
          </div>

          {/* Complaints Table */}
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Complaints List</h2>
            {complaints.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                      <th className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                      <th className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                      <th className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Complaint</th>
                      <th className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint) => (
                      <tr key={complaint.id} className="border-t dark:border-gray-600">
                        <td className="p-3 text-sm text-gray-900 dark:text-gray-100">{complaint.id}</td>
                        <td className="p-3 text-sm text-gray-900 dark:text-gray-100">{complaint.name}</td>
                        <td className="p-3 text-sm text-gray-900 dark:text-gray-100">{complaint.email}</td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{complaint.complaint}</td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{complaint.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">No complaints submitted yet.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}