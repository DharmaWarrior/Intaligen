import React, { useContext, useEffect ,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/Context';
import Sidebar from './Sidebar';

export default function Dashboard() {

  const [data, setData] = useState(false);

  return (
    <>
      {data.message !== "Internal Server Error" ? (
        <div className='flex'>
          <div className="h-screen flex justify-center items-center mx-auto text-3xl">
              Dashboard is here!
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          Loading... &nbsp;
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        
      )}
    </>
  );
}

