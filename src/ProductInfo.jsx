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


const styles = {
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  selectedCategories: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 10px',
    backgroundColor: '#8BC34A', // Soothing green color
    color: '#FFF',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#7CB342', // Slightly darker green for hover
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
  },
  crossButton: {
    marginLeft: '5px',
    color: '#FF0000',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  crossButtonHover: {
    color: '#D00000',
  },
};

const DefaultCategories = [
  { name: 'QWERTY', value: 1 },
  { name: 'SEMI-FINISHED', value: 2 },
  { name: 'EXPORT', value: 3 },
  { name: 'RAW MATERIAL', value: 4 },
  { name: 'PACKING MATERIAL', value: 5 },
  { name: 'MACHINE', value: 6 },
  { name: 'RAJASTHAN', value: 7 },
  { name: 'ABC', value: 15 },
];

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
  const [isBOMDialogOpen, setIsBOMDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState({ unit_name: '', conversion_factor: '', unit_type: '' });
  const [availableCategories, setAvailableCategories] = useState(DefaultCategories);

  

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

  const handleSave = (updatedProduct) => {
    setDProduct(updatedProduct);
    setitemHeading(updatedProduct.ITEM.name)
    (updatedProduct.ITEM.raw_flag === 'NO') ? setShowBOM("block") : setShowBOM("hidden");
    
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategories([]);
    setAvailableCategories(DefaultCategories);
  };

  const handleEdit = () => {
    setIsBOMDialogOpen(true);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };


  const handleDeleteUnit = async (unitId) => {
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch(`/api/delete_unit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          "delete_unit_id" :`${unitId}`
        }
      )
      });

      if (response.status === 200) {
        setUnits(units.filter(unit => unit.id !== unitId));
      } else {
        console.error('Failed to delete unit');
      }
    } catch (error) {
      console.error('Error deleting unit', error);
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
        fetchProduct();
      } else {
        console.error('Failed to delete the category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  
  const handleAddUnit = async () => {
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch('/api/createconversion', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
            "itemId":product.ITEM.id,
            "toUnit":`${newUnit.unit_name}`,
            "conversionFactor":newUnit.conversion_factor,
            "toUnitType":`${newUnit.unit_type}`
        }),
      });
      if (response.status === 302) {
        fetchProduct();
        setIsDialogOpen(false);
        setNewUnit({ unit_name: '', conversion_factor: '', unit_type: '' });
      } else {
        console.error('Failed to add unit');
      }
    } catch (error) {
      console.error('Error adding unit', error);
    }
  };
  
  const handleSaveBOM = async (bomData) => {
    // fetchProduct();
    setIsBOMDialogOpen(false);
  };
  

  const handleCategorySelect = (category) => {
    setSelectedCategories([...selectedCategories, category]);
    setAvailableCategories(availableCategories.filter((item) => item.value !== category.value));
  };

  const handleCategoryRemove = (category) => {
    setSelectedCategories(selectedCategories.filter((item) => item.value !== category.value));
    setAvailableCategories([...availableCategories, category]);
  };

  const handleSaveCategories = async () => {

    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch(`/api/add_category_to_item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          "add_category_item_id":product.ITEM.id,
          "add_category_id_list":selectedCategories.map((category) => category.value.toString()),
        }
      )
      });
      if (response.status === 200) {
        fetchProduct();
        handleCloseDialog();
      } else {
        console.error('Failed to save categories');
      }
    } catch (error) {
      console.error('Error saving categories', error);
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
                            <TableCell>{item.child_item.code ? item.child_item.code : 'NA'}</TableCell>
                            <TableCell>{item.child_item.name}</TableCell>
                            <TableCell>{item.child_item_qty}</TableCell>
                            <TableCell>{item.child_item.unit}</TableCell>
                            <TableCell>{item.margin}</TableCell>
                            <TableCell>{item.child_item.rate}</TableCell>
                            <TableCell>{item.child_item.itemfinance ? item.child_item.itemfinance.cost_price : ''}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <BOMDialog
                    isOpen={isBOMDialogOpen}
                    onClose={() => setIsBOMDialogOpen(false)}
                    onSave={handleSaveBOM}
                    itemId={product.ITEM.id}
                    product={product}
                    setProduct={setProduct}
                    fetchProduct={fetchProduct}
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
                  inventoryData={product.itemfinance}
                  itemId={product.ITEM.id}
                />
              </div>
            </div>

            <div className='flex flex-col gap-4 w-[30%]'>
              
              {/* Units*/}
              <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2">
                <div className="hero-content">
                  <div className="space-y-auto mt-1">
                    <div className="flex justify-between items-center">
                      <h1 className="text-3xl font-small text-gray-800">Units</h1>
                      <button
                        className="bg-teal-500 hover:bg-teal-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md p-1 pl-4 pr-4"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        +
                      </button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-white-800 px-2 rounded">
                          <TableHead className="text-gray-600">Unit</TableHead>
                          <TableHead className="text-gray-600">Conversion Factor</TableHead>
                          <TableHead className="text-gray-600">Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.units.map((unit) => (
                          <TableRow key={unit.id} className="bg-white-800 py-1 px-2 rounded">
                            <TableCell>{unit.unit_name}</TableCell>
                            <TableCell>{unit.conversion_factor}</TableCell>
                            <TableCell>{unit.unit_type}</TableCell>
                            <TableCell>
                              <button
                                className="bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-md p-1"                                
                                onClick={() => handleDeleteUnit(unit.id)}
                              >
                                ×
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                {isDialogOpen && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                      <h2 className="text-xl mb-4">Add Units</h2>
                      <div className="mb-4">
                        <label className="block text-gray-700">Unit Name</label>
                        <input
                          type="text"
                          className="border rounded w-full py-2 px-3"
                          value={newUnit.unit_name}
                          onChange={(e) => setNewUnit({ ...newUnit, unit_name: e.target.value })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Conversion Factor</label>
                        <input
                          type="text"
                          className="border rounded w-full py-2 px-3"
                          value={newUnit.conversion_factor}
                          onChange={(e) => setNewUnit({ ...newUnit, conversion_factor: e.target.value })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Unit Type</label>
                        <input
                          type="text"
                          className="border rounded w-full py-2 px-3"
                          value={newUnit.unit_type}
                          onChange={(e) => setNewUnit({ ...newUnit, unit_type: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white rounded-md p-2 mr-2"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-teal-500 hover:bg-teal-600 text-white rounded-md p-2"
                          onClick={handleAddUnit}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                        <div key={index} className="flex items-center bg-white-100 p-2 rounded-md shadow-sm">
                          <span className="text-white text-sm font-medium px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-default"
                                style={{
                                  background: 'linear-gradient(145deg, #6a85b6, #bac8e0)',
                                  boxShadow: '5px 5px 10px #3a4a67, -5px -5px 10px #d0e1ff'
                                }}>
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
                    </div>
                  </div>
                </div>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>Select Categories</DialogTitle>
                  <DialogContent style={styles.dialogContent}>
                    <div className="flex flex-col gap-4">
                      <select
                        onChange={(e) => handleCategorySelect(JSON.parse(e.target.value))}
                        value=""
                        className="border rounded w-full py-2 px-3"
                      >
                        <option value="" disabled>Select Category</option>
                        {availableCategories.map((category) => (
                          <option key={category.value} value={JSON.stringify(category)}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div style={styles.selectedCategories}>
                        {selectedCategories.map((category) => (
                          <div key={category.value} style={styles.button}>
                            {category.name}
                            <span
                              onClick={() => handleCategoryRemove(category)}
                              style={styles.crossButton}
                            >
                              ✕
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveCategories} color="primary">Save</Button>
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


