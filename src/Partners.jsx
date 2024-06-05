// import React from 'react'
// import Tableitems, { SelectColumnFilter } from './components/Tableitems' 
// import Sidebar from "./components/Sidebar"

// const getData = () => {
//   // const data = null;
//   const data = [
//     {
//       name: 'Jane Cooper',
//       email: 'jane.cooper@example.com',
//       title: 'Regional Paradigm Technician',
//       department: 'Optimization',
//       status: 'Active',
//       role: 'Admin',
//       age: 27,
//       imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
//     },
//     {
//       name: 'Cody Fisher',
//       email: 'cody.fisher@example.com',
//       title: 'Product Directives Officer',
//       department: 'Intranet',
//       status: 'Active',
//       role: 'Owner',
//       age: 43,
//       imgUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
//     },
//     {
//       name: 'Esther Howard',
//       email: 'esther.howard@example.com',
//       title: 'Forward Response Developer',
//       department: 'Directives',
//       status: 'Active',
//       role: 'Member',
//       age: 32,
//       imgUrl: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
//     },
//     {
//       name: 'Jenny Wilson',
//       email: 'jenny.wilson@example.com',
//       title: 'Central Security Manager',
//       department: 'Program',
//       status: 'Active',
//       role: 'Member',
//       age: 29,
//       imgUrl: 'https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
//     },
//     {
//       name: 'Kristin Watson',
//       email: 'kristin.watson@example.com',
//       title: 'Lean Implementation Liaison',
//       department: 'Mobility',
//       status: 'Active',
//       role: 'Admin',
//       age: 36,
//       imgUrl: 'https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
//     },
//     {
//       name: 'Cameron Williamson',
//       email: 'cameron.williamson@example.com',
//       title: 'Internal Applications Engineer',
//       department: 'Security',
//       status: 'Active',
//       role: 'Member',
//       age: 24,
//       imgUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
//     },
//   ]
//   return [...data, ...data, ...data]
// }

// export default function Categories() {

//   const columns = React.useMemo(() => [
//     {
//       Header: "Name",
//       accessor: 'name',
//     },
//     {
//       Header: "Title",
//       accessor: 'title',
//     },
//     {
//       Header: "Status",
//       accessor: 'status',
//     },
//     {
//       Header: "Age",
//       accessor: 'age',
//     },
//     {
//       Header: "Role",
//       accessor: 'role',
//       Filter: SelectColumnFilter,  // new
//       filter: 'includes',
//     },
//   ], [])

//   const data = React.useMemo(() => getData(), [])
  
//   return (
//     // <div className="min-h-screen bg-blue-100 text-gray-900">
//     //   <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
//         // <div>
//           // {/* <Sidebar/> */}
//         // {/* <div className="mt-4 ">
//         //   <Tableitems columns={columns} data={data}/>
//         // </div> */}
//         // </div>
//     //   </main>
//     // </div>

//     <div className="w-full h-[90vh] mt-0 flex flex-col">
          
//         <Sidebar/>
//         <div className="absolute right-0 w-[80%] h-[90%] overflow-y-auto  px-10 py-10 h-[80vh] overflow-y-auto ">
//           <h1 className='text-4xl font-sans'>LIST OF CATEGORIES</h1>
//           <div className="ml-15 flex flex-col mt-5"> 
//                 <div className='flex flex-row'>
//                 <button  className="mr-5 w-72 mt-1 font-sans btn bg-gradient-to-r from-purple-400 to-teal-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline">Add new category</button>
//                 <button  className="mr-5 w-72 mt-1 font-sans btn bg-gradient-to-r from-teal-600 to-purple-400 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline">Bulk category configuration</button>
//                 </div>
//                 <Tableitems columns={columns} data={data}/>
//         </div>
//         </div>
//         </div>
//   );
// }

import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "./components/Sidebar";
import { LoginContext } from './components/ContextProvider/Context';
import ImportIcon from '@mui/icons-material/ImportExport';
import PlusIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddItemForm from './components/AddItemForm';
import { toast } from 'react-toastify';
import TablePartners from './components/TablePartners';

export default function Partners() {
    const { logindata } = useContext(LoginContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModes, setEditModes] = useState({});
    const [open, setOpen] = useState(false);
  
    const fetchData = async () => {
      try {
        let token = localStorage.getItem("usersdatatoken");
        if(!token) {
          console.log("Token not found");
        }
        
        const response = await fetch("/api/partners", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        });
  
        if (response.ok) {
          const result = await response.json();
          setData(result.partners);
          setLoading(false);
        } else {
          console.error('Failed to fetch data');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleFormSubmit = async (formData) => {
      try {
        const response = await fetch("/api/AddItem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("usersdatatoken"),
          },
          body: JSON.stringify({
            "p_code": formData.code,
            "p_name": formData.itemName,
            "p_rate": formData.jobRate,
            "p_unit": formData.fundamentalUnit,
            "p_flag": formData.bom ? "YES" : "NO",
            "pf_cost_price": formData.costPrice,
            "pf_sale_price": formData.salePrice,
            "pf_tax": formData.taxPercentage,
            "pf_hsn": formData.hsnCode
          })
        });
        const res = await response.json();
        if (res.message === "iteminfo") {
          toast.success("Item added.", { position: "top-center" });
          fetchData(); // Re-fetch the data to update the list
        } else {
          toast.info(res.message, { position: "top-center" });
        }
      } catch (error) {
        toast.error("Error!!", { position: "top-center" });
      }
    };
  
    // const columns = React.useMemo(() => [
    //   { "Header": "Registration Date", "accessor": "regdate" },
    //   { "Header": "Raw Flag", "accessor": "raw_flag" },
    //   { "Header": "Data ID", "accessor": "data_id" },
    //   { "Header": "Code", "accessor": "code" },
    //   { "Header": "Name", "accessor": "name" },
    //   { "Header": "Unit", "accessor": "unit" },
    //   { "Header": "ID", "accessor": "id" },
    //   { "Header": "Rate", "accessor": "rate" },
    //   {
    //     "Header": "Edit",
    //     // "Cell": ({ row }) => (
    //     //   <div className="flex items-center">
    //     //     {editModes[row.index] ? (
    //     //       <>
    //     //         <FaCheck className="text-green-500 mr-2 cursor-pointer" onClick={() => handleEditClick(row.index)} />
    //     //         <FaTimes className="text-red-500 cursor-pointer" onClick={() => handleEditClick(row.index)} />
    //     //       </>
    //     //     ) : (
    //     //       <FaPencilAlt className="cursor-pointer" onClick={() => handleEditClick(row.index)} />
    //     //     )}
    //     //   </div>
    //     // )
    //   }
    // ], [editModes]);
  
    // if (loading) {
    //   return <div>Loading...</div>;
    // }
  
    return (
      <div className="w-full h-[90vh] mt-0 flex flex-col">
        <Sidebar />
        <div className="h-[90%] overflow-y-auto absolute right-0 w-[80%] px-10 py-10">
          <div className='flex flex-row'>
            <h1 className='text-4xl font-sans'>LIST OF Categories</h1>
            <div className='absolute right-10'>
              <Tooltip title="Add new item">
                <IconButton onClick={handleClickOpen}>
                  <PlusIcon className='text-custom-green' fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add new item">
                <IconButton>
                  <ImportIcon className='text-custom-green' fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add new item">
                <IconButton>
                  <ImportIcon className='text-custom-green' fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className="ml-15 flex flex-col mt-5">
            <TablePartners />
          </div>
        </div>
  
        <AddItemForm open={open} handleClose={handleClose} handleFormSubmit={handleFormSubmit} fetchData={fetchData} />
      </div>
    );
  }