import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { Table, TableHeader, TableRow, TableHead, TableCell } from './../components/ui/table';
import { TableBody } from '@mui/material';
import { PencilIcon,CheckIcon } from '@heroicons/react/solid';
import Modal from 'react-modal';

export default function ProductInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);

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
        setProduct(result);
        setLoading(false);
      } else {
        alert('Failed to fetch product info');
        setLoading(false);
      }
    } catch (error) {
      alert('Error fetching product info: ' + error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditable(!isEditable);
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
          <h1 className="text-3xl font-bold text-gray-800">{product.ITEM.name}</h1>
          
          {/*Description of item box*/ }
          <div className="hero bg-white p-10 shadow-lg rounded-xl border border-gray-200 pt-5">
            <div className="hero-content">
              <div className="space-y-5 mt-1">
                <div className="flex items-center space-x-2">
                  <div className="w-100">
                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">ITEM NAME:</label>
                    <div className="relative mt-2 rounded-md shadow-sm ">
                      <input type="text" name="price" id="price" className="block w-80 rounded-md border-0 py-1.5 pl-1 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder={`${product.ITEM.name}`} disabled={!isEditable}/>
                    </div>
                  </div>
                  <div className="flex mt-7">
                    <label htmlFor="bom" className="text-25 font-medium leading-6 text-gray-900 mr-2">BOM:</label>
                    <input type="checkbox" id="bom" checked={product.ITEM.bom} onChange={() => {}} className="w-6 h-6 mr-4 bg-gray-400 rounded focus:ring-2 ring-blue-500" disabled={!isEditable}/>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="w-full">
                    <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">CODE:</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input type="text" name="price" id="price" className="block w-full rounded-md border-0 py-1.5 pl-1 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder={`${product.ITEM.code}`} disabled={!isEditable}/>
                    </div>
                  </div>
                  <div className="w-full">
                    <label htmlFor="unit" className="block text-sm font-medium leading-6 text-gray-900">STANDARD UNIT OF MEASUREMENT:</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input type="text" name="price" id="price" className="block w-full rounded-md border-0 py-1.5 pl-1 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder={`${product.ITEM.unit}`} disabled={!isEditable}/>
                    </div>
                  </div>
                  <div className="w-full">
                    <label htmlFor="rate" className="block text-sm font-medium leading-6 text-gray-900">JOB RATE / COST OF UNIT ITEM:</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input type="text" name="price" id="price" className="block w-full rounded-md border-0 py-1.5 pl-1 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder={`${product.ITEM.rate}`} disabled={!isEditable}/>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleEdit}
                  className={`mt-4 py-2 px-4 rounded-lg transition duration-300 ${
                    isEditable ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {isEditable ? (
                    <>
                      <CheckIcon className="h-6 w-6 inline-block mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <PencilIcon className="h-6 w-6 inline-block mr-2" />
                      Edit
                    </>
                  )}
                </button>
              </div>
            </div>
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
              <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2">
                <div className="hero-content">
                  <div className="space-y-auto mt-1">
                    <div className='flex flew-row justify-between items-center'>
                      <h1 className="text-3xl font-small text-gray-800">BILL OF MATERIAL</h1>
                      <p className="py-6">For 1 KG of <b>{`${product.ITEM.name}`}</b></p>
                      <button
                        
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
                      <TableBody
                        data={product.BOM_DATA.map((item) => (
                          <TableRow key={item.id} className="bg-white py-1 px-2 rounded">
                            <TableCell>{item.child_item.code}</TableCell>
                            <TableCell>{item.child_item.name}</TableCell>
                            <TableCell>{item.child_item_qty}</TableCell>
                            <TableCell>{item.child_item.unit}</TableCell>
                            <TableCell>{item.margin}</TableCell>
                            <TableCell>{item.child_item.itemfinance.cost_price}</TableCell>
                            <TableCell>{item.child_item.itemfinance.sale_price}</TableCell>
                          </TableRow>
                        ))}
                      >
                      </TableBody>
                    </Table>
                  </div>
                </div>

                
              </div>
            
            </div>

            <div className='flex flex-col gap-4'>
              
              {/* Inventory*/}
              <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2">
                <div className="hero-content w-60">
                  <div className="space-y-auto mt-1">
                    <div className='flex flew-row justify-between items-center'>
                      <h3 className="text-3xl font-small text-gray-800">Inventory</h3>
                      <button
                        
                        className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md p-2 ml-2"
                      >
                        <PencilIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="space-y-1 mt-5">
                      <div className="flex justify-between bg-gray-100 py-2 px-4 rounded">
                        <p className="text-gray-600">Consumption Mode:</p>
                        <p className="text-gray-800">{product.ITEM.iteminventory.consumption_mode}</p>
                      </div>
                      <div className="flex justify-between bg-white py-2 px-4 rounded">
                        <p className="text-gray-600">Minimum-level:</p>
                        <p className="text-gray-800">{product.ITEM.iteminventory.min_level}</p>
                      </div>
                      <div className="flex justify-between bg-gray-100 py-2 px-4 rounded">
                        <p className="text-gray-600">Maximum-level:</p>
                        <p className="text-gray-800">{product.ITEM.iteminventory.max_level}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Finance */}
              <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2">
                <div className="hero-content">
                  <div className="space-y-auto mt-1">
                    <div className='flex flew-row justify-between items-center'>
                      <h1 className="text-3xl font-small text-gray-800">Finance</h1>
                      <button
                        
                        className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md p-2 ml-2"
                      >
                        <PencilIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="space-y-1 mt-5">
                      <div className="flex justify-between bg-gray-100 py-2 px-4 rounded">
                        <p className="text-gray-600">HSN:</p>
                        <p className="text-gray-800">{product.ITEM.iteminventory.consumption_mode}</p>
                      </div>
                      <div className="flex justify-between bg-white py-2 px-4 rounded">
                        <p className="text-gray-600">Cost Price:</p>
                        <p className="text-gray-800">{product.ITEM.iteminventory.min_level}</p>
                      </div>
                      <div className="flex justify-between bg-gray-100 py-2 px-4 rounded">
                        <p className="text-gray-600">Sale Price:</p>
                        <p className="text-gray-800">{product.ITEM.iteminventory.max_level}</p>
                      </div>
                      <div className="flex justify-between bg-gray-100 py-2 px-4 rounded">
                        <p className="text-gray-600">Tax (%):</p>
                        <p className="text-gray-800">{product.ITEM.iteminventory.max_level}</p>
                      </div>
                    </div>
                  </div>
                </div>
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
                            <TableRow className="bg-gray-100 py-1 px-2 rounded">
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
                        
                        className="bg-teal-500 hover:bg-teal-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md p-1 pl-4 pr-4"
                      >
                        +
                      </button>
                    </div>
                    <div className="mt-4 space-y-2">
                      {product.categories.map((category, index) => (
                        <div key={index} className="flex items-center  bg-white-100 p-2 rounded-md shadow-sm">
                          <span className="text-gray-800 text-sm font-medium px-4 py-2 bg-blue-600 hover:bg-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-default">
                            {category[1]}
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


