import { useState, useEffect } from 'react';

function DataTable() {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', Email: '', description: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [animation, setAnimation] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/auth/register');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const result = await response.json();
      setData([...data, result]);
      setNewItem({ Email: '', password: ''});
      setAnimation('fadeIn');
      showSuccessMessage("Product added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };



  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      const result = await response.json();
      setData(data.map((item) => (item.id === result.id ? result : item)));
      setEditingItem(null);
      setAnimation('fade-in');
      showSuccessMessage("Product updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`//api/auth/register?id=${id}`, {
        method: 'DELETE',
      });
      setData(data.filter((item) => item.id !== id));
      setAnimation('slide-in');
      showSuccessMessage("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>

     

      {/* Data Table */}
      <div className="overflow-x-auto  ">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200  ">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">role</th>
              <th className="px-5 py-3">password</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item) => (
              <tr key={item.id} className={`${animation}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Next  
        </button>
      </div>
    </div>
  );
}

export default DataTable;
