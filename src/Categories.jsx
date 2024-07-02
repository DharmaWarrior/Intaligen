import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from './components/ContextProvider/Context';
import ImportIcon from '@mui/icons-material/ImportExport';
import PlusIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import MasterTable from './components/MasterTable';
import AddForm from './components/AddForm';

export default function Items() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModes, setEditModes] = useState({});
    const [open, setOpen] = useState(false);
    const [formType, setFormType] = useState('');

    const fetchData = async () => {
      try {
        let token = localStorage.getItem("usersdatatoken");
        if(!token) {
          console.log("Token not found");
        }
        
        const response = await fetch("/api/catogory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        });
  
        if (response.ok) {
          const result = await response.json();
          result.categories.map((item, index) => {
            item.category_type_name = 
            item.category_type === 0 ? item.category_type_name = "ITEM": "NA"
            item.category_type === 1 ? item.category_type_name = "RESOURCE": "NA" 
            item.category_type === 2 ? item.category_type_name = "PARTNER": "NA"
          });

          setData(result.categories);
          // console.log(data);
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
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const handleOpen = (type) => {
      setFormType(type);
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

    const columns = React.useMemo(() => [
      { "Header": "Name", "accessor": "name" , "type": "text" , "url": "/product/" , "url_append": `id`, "editable" : "true"},
      { "Header": "Category Type", "accessor": "category_type_name" , "type": "select" , "url": "/product/" , "url_append": `id`, "editable" : "true", "options": [{"name": "ITEM", "value": 0}, {"name": "RESOURCE", "value": 1}, {"name": "PARTNER", "value": 2}]},
    ], [editModes]);

    const categoryFields = [
      { name: 'Category_Name', label: 'Category Name *', type: 'text', required: true },
      { name: 'Category_Type', label: 'Category Type', type: 'text' },
    ];

    return (
      <div className="w-full h-[120vh] mt-0 flex flex-col">
        <div className="w-full  justify-center px-10 py-10">
          <div className='flex flex-row'>
            <h1 className='text-4xl font-sans'>LIST OF CATEGORIES</h1>
            <div className='absolute right-10'>
              <Tooltip title="Add new item">
                <IconButton onClick={() => handleOpen('category')}>
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
            <MasterTable columns={columns} data={data} setData={setData}/>
          </div>
        </div>
  
        {formType === 'category' && (
        <AddForm
          open={open}
          handleClose={handleClose}
          handleFormSubmit={handleFormSubmit}
          fetchData={fetchData}
          formFields={categoryFields}
          title="Add New category"
        />
      )}
      </div>
    );
  }