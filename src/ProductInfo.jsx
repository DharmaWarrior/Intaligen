import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { Table, TableHeader, TableRow, TableHead, TableCell } from './../components/ui/table';
import { TableBody } from '@mui/material';
import { PencilIcon,CheckIcon } from '@heroicons/react/solid';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, Typography } from '@mui/material';
import { Dropdown } from 'flowbite-react';
import DescriptionBox from './cards/DescriptionBox';
import InventoryCard from './cards/InventoryCard';
import FinanceCard from './cards/FinanceCard';
import BOMDialog from './cards/BOMDialog';

export default function ProductInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBOM, setShowBOM] = useState("hidden");
  const [open, setOpen] = useState(false);
  const [itemHeading, setitemHeading] = useState();
  const [categories, setCategories] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesToAdd, setCategoriesToAdd] = useState([]);
  const [Dproduct, setDProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (updatedProduct) => {
    setDProduct(updatedProduct);
    setitemHeading(updatedProduct.ITEM.name)
    (updatedProduct.ITEM.raw_flag === 'NO') ? setShowBOM("block") : setShowBOM("hidden");
    
  };

  const handleEdit = () => {
    setIsDialogOpen(true);
  };

  const fetchProduct = async () => {
    
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch(`/api/ItemsInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          "item_id":id
        }
      )
      });

      if (response.ok) {
        const result = await response.json();
        (!result.ITEM.iteminventory) ? result.ITEM.iteminventory = {
            "min_level": 0.0,
            "id": 47,
            "data_id": 1,
            "item_id": 70,
            "consumption_mode": "AUTO",
            "max_level": 10000000.0
        } : result.ITEM.iteminventory; 
        (!result.ITEM.itemfinance) ? result.ITEM.itemfinance = {
            "HSN": 0.0,
            "Cst": 47,
            "data_id": 1,
            "item_id": 70,
            "consumption_mode": "AUTO",
            "max_level": 10000000.0
        } : result.ITEM.itemfinance; 
        // console.log(result);
        setProduct(result);
        setDProduct(result);
        setitemHeading(result.ITEM.name)
        setCategories(result.item_categories);
        setLoading(false);
        (result.ITEM.raw_flag === 'NO') ? setShowBOM("block") : setShowBOM("hidden");

      } else {
        alert('Failed to fetch product info');
        setLoading(false);
      }
    } catch (error) {
      alert('Error fetching product info: ' + error);
      setLoading(false);
    }
  };



  const handleDelete = async (category) => {

    const formattedData = {
      "delete_category_item_id":category.item_id,
      "delete_category_id":category.category_id
  };

    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch(`/api/delete_category_from_item`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(formattedData)
      });

      if (response.status === 200) {
        setCategories(prevCategories => prevCategories.filter(cat => cat.id !== category.id));
      } else {
        console.error('Failed to delete the category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const handleCategorySelect = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category) 
        : [...prev, category]
    );
  };
  
  const styles = {
    dialogContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    selectedCategories: {
      marginLeft: '1rem',
      display: 'flex',
      flexDirection: 'column',
    },
  };

  const DefaultCategories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' },
    { id: 4, name: 'Category 4' },
    // Add more categories as needed
  ];


  const handleSaveCategories = async () => {
    try {
      const response = await fetch('/api/add_categories_to_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ categories: selectedCategories }),
      });

      if (response.status === 200) {
        const addedCategories = await response.json();
        setCategoriesToAdd(addedCategories);
      } else {
        console.error('Failed to add categories');
      }
    } catch (error) {
      console.error('Error adding categories:', error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>No product information available</div>;
  }

  return (
    <div className="w-full h-[90vh] mt-0 flex flex-col">
      <Sidebar />
      <div className="h-[90%] overflow-y-auto absolute right-0 w-[80%] px-5 py-5">
        <div className="ml-2 flex flex-col mt-1 space-y-5">
          <h1 className="text-3xl font-bold text-gray-800">{itemHeading}</h1>
          
          {/*Description of item box*/ }
          <div>
            <DescriptionBox Dproduct={Dproduct} handleSave={handleSave} />
          </div>

          
          <div className='flex flex-row gap-4'>
            
            <div className='flex flex-col gap-4'>
              
              {/* Additional Fields*/}
              <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2">
                <div className="hero-content">
                  <div className="space-y-auto mt-1">
                    <div className='flex flex-row justify-between items-center '>
                      <h1 className="text-3xl font-small text-gray-800">Additional Fields</h1>
                      <button
                        
                        className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md p-2 ml-2"
                      >
                        <PencilIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* BILL OF MATERIAL*/}
              
              <div className={`hero ${showBOM} bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2`}>
                <div className="hero-content">
                  <div className="space-y-auto mt-1">
                    <div className='flex flew-row justify-between items-center'>
                      <h1 className="text-3xl font-small text-gray-800">BILL OF MATERIAL</h1>
                      <p className="py-6">For 1 KG of <b>{`${product.ITEM.name}`}</b></p>
                      <button
                        onClick={handleEdit}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md p-2 ml-2"
                      >
                        <PencilIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <Table>
                      <TableHeader>
                          <TableRow className="bg-gray-100 py-1 px-2 rounded">
                            <TableHead className="text-gray-600">Code</TableHead>
                            <TableHead className="text-gray-600">Name</TableHead>
                            <TableHead className="text-gray-600">QTY</TableHead>
                            <TableHead className="text-gray-600">UNIT</TableHead>
                            <TableHead className="text-gray-600">% Margin</TableHead>
                            <TableHead className="text-gray-600">Set Cost Rate</TableHead>
                            <TableHead className="text-gray-600">Cost Amount</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.BOM_DATA.map((item) => (
                          <TableRow key={item.id} className="bg-white py-1 px-2 rounded ">
                            <TableCell>{item.child_item.code}</TableCell>
                            <TableCell>{item.child_item.name}</TableCell>
                            <TableCell>{item.child_item_qty}</TableCell>
                            <TableCell>{item.child_item.unit}</TableCell>
                            <TableCell>{item.margin}</TableCell>
                            <TableCell>{item.child_item.rate}</TableCell>
                            <TableCell>{item.child_item.itemfinance.cost_price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <BOMDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSave={handleSave}
                    itemId={product.ITEM.id}
                    product={product}
                  />
                </div>                
              </div>

            </div>

            <div className='flex flex-col gap-4'>
              
              {/* Inventory*/}
              <div>
              <InventoryCard
                heading="Inventory"
                inventoryData={product.ITEM.iteminventory}
                itemId={product.ITEM.id}
              />
              </div>
              {/* Finance */}
              <div>
                <FinanceCard
                  heading="Finance"
                  inventoryData={product.ITEM.iteminventory}
                  itemId={product.ITEM.id}
                />
              </div>
            </div>

            <div className='flex flex-col gap-4 w-[30%]'>
              
              {/* Units*/}
              <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2">
                <div className="hero-content ">
                  <div className="space-y-auto mt-1">
                    <div className="flex justify-between items-center">
                      <h1 className="text-3xl font-small text-gray-800">Units</h1>
                      <button
                          
                          className="bg-teal-500 hover:bg-teal-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md p-1 pl-4 pr-4"
                        >
                          +
                      </button>
                    </div>
                    <div className='mt-5'>
                      <Table>
                        <TableHeader>
                            <TableRow className="bg-white-800 px-2 rounded ">
                              <TableHead className="text-gray-600">Unit</TableHead>
                              <TableHead className="text-gray-600">Conversion Factor</TableHead>
                              <TableHead className="text-gray-600">Type</TableHead>
                            </TableRow>
                        </TableHeader>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Categories */}
              <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2">
                <div className="hero-content">
                  <div className="space-y-auto mt-1">
                    <div className="flex justify-between items-center">
                      <h1 className="text-3xl font-small text-gray-800">Categories</h1>
                      <button
                        onClick={handleOpenDialog}
                        className="bg-teal-500 hover:bg-teal-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md p-1 pl-4 pr-4"
                      >
                        +
                      </button>
                    </div>
                    <div className="mt-4 space-y-2">
                      {product.item_categories.map((category, index) => (
                        <div key={index} className="flex items-center  bg-white-100 p-2 rounded-md shadow-sm">
                          <span className="text-white text-sm font-medium px-4 py-2 bg-blue-500 hover:bg-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-default">
                            {product.categories[category.category_id][1]}
                          </span>
                          <button 
                            onClick={() => handleDelete(category)} 
                            className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-md p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                        {categoriesToAdd.map((category, index) => (
                          <div key={index} className="flex items-center  bg-white-100 p-2 rounded-md shadow-sm">
                            <span className="text-white text-sm font-medium px-4 py-2 bg-blue-500 hover:bg-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-default">
                              {category.category_id}
                            </span>
                            <button 
                              onClick={() => handleDelete(category)} 
                              className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-md p-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>Select Categories</DialogTitle>
                  <DialogContent style={styles.dialogContent}>
                    <div className="flex flex-row gap-4">
                      <Dropdown label="Select Categories">
                        {DefaultCategories.map((category) => (
                          <Dropdown.Item key={category.id} onClick={() => handleCategorySelect(category.name)}>
                            {category.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                      <Typography style={styles.selectedCategories}>
                        {selectedCategories.join(', ')}
                      </Typography>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleSaveCategories}>Save</Button>
                  </DialogActions>
                </Dialog>
              </div>

            </div>
          </div>
          <div className="bg-white-100 text-center text-xs p-3 w-full">
            <p>&copy; 2023 - RAQGEN SOLUTIONS PRIVATE LIMITED</p>
          </div>
        </div>
      </div>
    </div>
  );
}


