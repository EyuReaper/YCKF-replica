'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import { useTheme } from '@/context/ThemeContext'; // Import the useTheme hook

// Mock data for complaints (replace with real data from an API or database)
const initialComplaints = [
  { id: 1, name: "Abebe Kebede", email: "abebe@example.com", complaint: "Issue with training session", status: "Pending" },
  { id: 2, name: "Chaltu Tadesse", email: "chaltu@example.com", complaint: "Website loading slow", status: "Resolved" },
];

export default function Complaints() {
  const { theme } = useTheme(); // Access the theme from context
  const [complaints, setComplaints] = useState(initialComplaints);
  const [formData, setFormData] = useState({ name: '', email: '', complaint: '' });
  const [message, setMessage] = useState('');

  // Dynamic classes based on theme
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const subTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderClass = theme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputTextClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const labelTextClass = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const buttonBgClass = theme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const buttonHoverClass = theme === 'light' ? 'hover:bg-blue-700' : 'hover:bg-blue-800';
  const successTextClass = theme === 'light' ? 'text-green-600' : 'text-green-400';
  const tableHeaderBgClass = theme === 'light' ? 'bg-gray-100' : 'bg-gray-700';
  const tableHeaderTextClass = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const tableRowBorderClass = theme === 'light' ? 'border-t' : 'border-t dark:border-gray-600';

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
    <div className={`flex flex-col min-h-screen ${textClass} ${bgClass} dark:${bgClass} dark:${textClass}`}>
      <TopBar />
      <Header />
      <main className="flex-1">
        <section className={`px-4 py-16 mx-auto max-w-7xl ${bgClass}`}>
          <h1 className={`mb-6 text-4xl font-extrabold tracking-tight ${textClass}`}>Submit a Complaint</h1>
          <p className={`mb-10 text-lg ${subTextClass} max-w-2xl`}>
            Let us know about any issues or concerns. We’re here to assist you.
          </p>

          {/* Complaint Form */}
          <div className={`p-6 ${cardBgClass} rounded-lg shadow-md mb-10`}>
            <h2 className={`mb-4 text-2xl font-bold ${textClass}`}>File a Complaint</h2>
            {message && <p className={`mb-4 ${successTextClass}`}>{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className={`block mb-1 text-sm font-medium ${labelTextClass}`}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={`w-full px-4 py-2 ${borderClass} rounded-md ${inputBgClass} ${inputTextClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className={`block mb-1 text-sm font-medium ${labelTextClass}`}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-2 ${borderClass} rounded-md ${inputBgClass} ${inputTextClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              <div>
                <label htmlFor="complaint" className={`block mb-1 text-sm font-medium ${labelTextClass}`}>
                  Complaint
                </label>
                <textarea
                  id="complaint"
                  name="complaint"
                  value={formData.complaint}
                  onChange={handleChange}
                  placeholder="Describe your complaint..."
                  rows={4}
                  className={`w-full px-4 py-2 ${borderClass} rounded-md ${inputBgClass} ${inputTextClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className={`w-full px-6 py-3 text-white transition-colors duration-200 ${buttonBgClass} rounded-md ${buttonHoverClass}`}
              >
                Submit Complaint
              </button>
            </form>
          </div>

          {/* Complaints Table */}
          <div className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
            <h2 className={`mb-4 text-2xl font-bold ${textClass}`}>Complaints List</h2>
            {complaints.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`${tableHeaderBgClass}`}>
                      <th className={`p-3 text-sm font-semibold ${tableHeaderTextClass}`}>ID</th>
                      <th className={`p-3 text-sm font-semibold ${tableHeaderTextClass}`}>Name</th>
                      <th className={`p-3 text-sm font-semibold ${tableHeaderTextClass}`}>Email</th>
                      <th className={`p-3 text-sm font-semibold ${tableHeaderTextClass}`}>Complaint</th>
                      <th className={`p-3 text-sm font-semibold ${tableHeaderTextClass}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint) => (
                      <tr key={complaint.id} className={tableRowBorderClass}>
                        <td className={`p-3 text-sm ${textClass}`}>{complaint.id}</td>
                        <td className={`p-3 text-sm ${textClass}`}>{complaint.name}</td>
                        <td className={`p-3 text-sm ${textClass}`}>{complaint.email}</td>
                        <td className={`p-3 text-sm ${subTextClass}`}>{complaint.complaint}</td>
                        <td className={`p-3 text-sm ${subTextClass}`}>{complaint.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={`text-center ${subTextClass}`}>No complaints submitted yet.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}