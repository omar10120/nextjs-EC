
import React, { useEffect, useState } from 'react';
import Modal from '../Component/Modal';
import {
  Snackbar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Slide,
  useTheme,
  DialogContentText,
  TextField 
  
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function DataTable() {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });
  const [editingItem, setEditingItem] = useState(null);
  
  const [successMessage, setSuccessMessage] = useState('');
  const [animation, setAnimation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [open, setOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setisModalAddOpen] = useState(false);
  const [opendelete, setOpendelete] = React.useState(false);
  const [itemid, setitemid] = useState('');

  // dialog 

  const theme = useTheme();

  // delete dialog
  const handleClickOpenDelete = async (id) => {
    setOpendelete(true);
    setitemid(id)
  };

  const handleCloseDelete = () => {
    setOpendelete(false);
  };


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
        {
          showSuccessMessage("You Should Fill Product Details"); //Checking Empty of Product Details 
            return; 
        }
      else{
        setData([...data, result]); // Update state with the new item
        setNewItem({ name: '', price: '', description: '' });
        setAnimation('fadeIn');
        showSuccessMessage("Product added successfully!"  );
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
    finally{
      setOpen(true);
      setisModalAddOpen(false);
      newItem.name = '';
      newItem.price = '';
      newItem.description = '';
    }
  };

  const  handleEdit = async (item) => {
    setIsModalOpen(true); // Open the modal
    setEditingItem(item);
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
    }finally{

      setOpen(true)
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
    } finally{
      setOpen(true);
      setOpendelete(false);
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

  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleCloseDialog=()=>{
    setIsModalOpen(false)
  }

  const handleadddialogOpen=()=>{
    setisModalAddOpen(true)
  }

  const handleadddialogClose=()=>{
    setisModalAddOpen(false)
  }


  return (
    <>
    
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Items</h2>

      {successMessage && (

      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%' }} 
        >
        {successMessage}
      </Alert>
      </Snackbar>
      )}

        <div className="mb-6 flex justify-end">
          <Button variant="contained" onClick={handleadddialogOpen}>Add Item</Button>
        </div>
      

        <React.Fragment>
            <Dialog
              open={isModalAddOpen}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleadddialogClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Add Item"}</DialogTitle>
                      <DialogContent>
                  {/* Don't use DialogContentText if it will contain divs */}
                 <div className='flex flex-col gap-y-5 my-2'>
                    <TextField id="outlined-basic" label="Name" variant="outlined"  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                    <TextField id="outlined-basic" type='number' label="Price" variant="outlined"   onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}    />
                    <TextField id="outlined-basic" label="Description	" variant="outlined"   onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}  />
                 </div>
                  {/* <input
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
                  /> */}
            
                </DialogContent>

              <DialogActions>
                <Button onClick={handleadddialogClose}>Disagree</Button>
                <Button onClick={ handleAdd}>Add Item</Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>

     

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
                  <button  onClick={()=>handleClickOpenDelete(item.id)} className="ml-2 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out">
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
            <React.Fragment>
            <Dialog
              open={isModalOpen}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleCloseDialog}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Edit Item"}</DialogTitle>
              <DialogContent>
  {/* Don't use DialogContentText if it will contain divs */}
  {editingItem && ( 
      <div className='flex flex-col gap-y-5 my-2'>
        {/* <input
          type="text"
          placeholder="Name"
          value={editingItem.name}
          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
          
          className="border p-2 mr-2 rounded-xl"
        /> */}
        <TextField id="outlined-basic" label="Name" variant="outlined"  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} value={editingItem.name} />
        <TextField id="outlined-basic" type='number'  label="Price" variant="outlined"   onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}    value={editingItem.price} />
        <TextField id="outlined-basic" label="Description	" variant="outlined"   onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} value={editingItem.description} />

        {/* <input
          type="number"
          placeholder="Price"
          value={editingItem.price}
          onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
          className="border p-2 mr-2 rounded-xl"
        />
        <input
          type="text"
          placeholder="Description"
          value={editingItem.description}
          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
          className="border p-2 mr-2 rounded-xl"
        /> */}
      </div>
    )}
</DialogContent>

              <DialogActions>
                <Button onClick={handleCloseDialog}>Disagree</Button>
                <Button onClick={() => handleUpdate(editingItem.id)}>Update Item</Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
    </div>



  {/* Delete Dialog*/}
    <React.Fragment>
      <Dialog
        // fullScreen={fullScreen}
        open={opendelete}
        onClose={handleCloseDelete}
        TransitionComponent={Transition}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Confirm Message"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDelete}>
            Disagree
          </Button>
            <Button onClick={() => handleDelete(itemid)} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
    
    </>


  );
}

export default DataTable;

