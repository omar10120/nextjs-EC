import { useState, useEffect } from 'react';
import Modal from '../Component/Modal';

function DataTable() {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [animation, setAnimation] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, [editingItem]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const result = await response.json();
      if(newItem.name == '' || newItem.price == '' || newItem.description== '')
        showSuccessMessage("You Should Fill Product Details"); //Checking Empty of Product Details 
      else{
        setData([...data, result]); // Update state with the new item
        setNewItem({ name: '', price: '', description: '' });
        setAnimation('fadeIn');
        showSuccessMessage("Product added successfully!"  );
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true); // Open the modal
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      const result = await response.json();
      
      // Update the specific item in the state after a successful edit
      setData(data.map((item) => (item.id === result.id ? result : item)));
      
      setEditingItem(null);
      setIsModalOpen(false); // Close the modal after update
      setAnimation('fade-in');
      showSuccessMessage("Product updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      // Remove the deleted item from the state immediately
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
    <>
    
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Items</h2>

      {successMessage && (

        <div className={` border  ${successMessage == "You Should Fill Product Details"? 'text-red-400 border-red-400 bg-red-100': 'text-green-700 border-green-400 bg-green-100'}  px-4 py-3 rounded relative mb-4`}>
          {successMessage}
        </div>
      )}

      <div className="mb-6">
        
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 mr-2 rounded-xl "
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="border p-2 mr-2 rounded-xl"
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          className="border p-2 mr-2 rounded-xl"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200 ">
          <thead className="bg-gray-100 ">
            <tr className=''>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {currentItems.map((item) => (
              <tr key={item.id} className={`${animation} `}>
                <td className="px-6 py-4 whitespace-nowrap items-center text-gray-900   text-center ">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap items-center text-gray-900   text-center ">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap items-center text-gray-900   text-center ">${item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap items-center text-gray-900  text-center">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap items-center text-gray-900    text-center">
                  <button onClick={() => handleEdit(item)} className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="ml-2 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl mb-4">Edit Item</h3>
        {editingItem && (
          <div>
            <input
              type="text"
              placeholder="Name"
              value={editingItem.name}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              className="border p-2 mb-2 w-full rounded-xl"
            />
            <input
              type="number"
              placeholder="Price"
              value={editingItem.price}
              onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
              className="border p-2 mb-2 w-full rounded-xl"
            />
            <input
              type="text"
              placeholder="Description"
              value={editingItem.description}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="border p-2 mb-2 w-full rounded-xl"
            />
            <button
              onClick={() => handleUpdate(editingItem.id)}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Update Item
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </Modal>
    </div>


    </>


  );
}

export default DataTable;
