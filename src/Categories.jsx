import React from 'react'
import Tableitems, { SelectColumnFilter } from './components/Tableitems' 
import Sidebar from "./components/Sidebar"

const getData = () => {
  // const data = null;
  const data = [
    {
      name: 'Jane Cooper',
      email: 'jane.cooper@example.com',
      title: 'Regional Paradigm Technician',
      department: 'Optimization',
      status: 'Active',
      role: 'Admin',
      age: 27,
      imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
      name: 'Cody Fisher',
      email: 'cody.fisher@example.com',
      title: 'Product Directives Officer',
      department: 'Intranet',
      status: 'Active',
      role: 'Owner',
      age: 43,
      imgUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
      name: 'Esther Howard',
      email: 'esther.howard@example.com',
      title: 'Forward Response Developer',
      department: 'Directives',
      status: 'Active',
      role: 'Member',
      age: 32,
      imgUrl: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
      name: 'Jenny Wilson',
      email: 'jenny.wilson@example.com',
      title: 'Central Security Manager',
      department: 'Program',
      status: 'Active',
      role: 'Member',
      age: 29,
      imgUrl: 'https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
      name: 'Kristin Watson',
      email: 'kristin.watson@example.com',
      title: 'Lean Implementation Liaison',
      department: 'Mobility',
      status: 'Active',
      role: 'Admin',
      age: 36,
      imgUrl: 'https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
      name: 'Cameron Williamson',
      email: 'cameron.williamson@example.com',
      title: 'Internal Applications Engineer',
      department: 'Security',
      status: 'Active',
      role: 'Member',
      age: 24,
      imgUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
  ]
  return [...data, ...data, ...data]
}

export default function Categories() {

  const columns = React.useMemo(() => [
    {
      Header: "Name",
      accessor: 'name',
    },
    {
      Header: "Title",
      accessor: 'title',
    },
    {
      Header: "Status",
      accessor: 'status',
    },
    {
      Header: "Age",
      accessor: 'age',
    },
    {
      Header: "Role",
      accessor: 'role',
      Filter: SelectColumnFilter,  // new
      filter: 'includes',
    },
  ], [])

  const data = React.useMemo(() => getData(), [])
  
  return (
    // <div className="min-h-screen bg-blue-100 text-gray-900">
    //   <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        // <div>
          // {/* <Sidebar/> */}
        // {/* <div className="mt-4 ">
        //   <Tableitems columns={columns} data={data}/>
        // </div> */}
        // </div>
    //   </main>
    // </div>

    <div className="w-full h-[90vh] mt-0 flex flex-col">
          
        <Sidebar/>
        <div className="absolute right-0 w-[80%] h-[90%] overflow-y-auto  px-10 py-10 h-[80vh] overflow-y-auto ">
          <h1 className='text-4xl font-sans'>LIST OF CATEGORIES</h1>
          <div className="ml-15 flex flex-col mt-5"> 
                <div className='flex flex-row'>
                <button  className="mr-5 w-72 mt-1 font-sans btn bg-gradient-to-r from-purple-400 to-teal-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline">Add new category</button>
                <button  className="mr-5 w-72 mt-1 font-sans btn bg-gradient-to-r from-teal-600 to-purple-400 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline">Bulk category configuration</button>
                </div>
                <Tableitems columns={columns} data={data}/>
        </div>
        </div>
        </div>
  );
}
