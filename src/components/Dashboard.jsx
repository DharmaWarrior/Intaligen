import React, { useContext, useEffect ,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/Context';
import Sidebar from './Sidebar';

export default function Dashboard() {

  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);


  const history = useNavigate();

  // const DashboardValid = async () => {
  //     let token = localStorage.getItem("usersdatatoken");

  //     const res = await fetch("/userdashboard", {
  //         method: "GET",
  //         headers: {
  //             "Content-Type": "application/json",
  //             "Authorization": token
  //         }
  //     });

  //     const data = await res.json();

  //     if (data.status == 401 || !data) {
  //         history("*");
  //     } else {
  //         console.log("user verify");
  //         setLoginData(data)
  //         history("/dash");
  //     }
  // }
  
  const DashboardValid = async () => {
    
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/api/userdashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();


  // const data = {
  //     status:200,
  //   ValidUserOne:{

  //     "id" : "12345",
  //     "name" : "John Doe",
  //     "email": "john.doe@example.com",
  //     "age": "30"
  //   }
  // };
    console.log(data.message);
    if (data.message === "Internal Server Error") {
      console.log("User not valid");
      // history("/");
        
    } else {
      const finalData = {
      status:200,
      ValidUserOne: data
    }
      console.log("login dataa is set");
      setLoginData(finalData);
      history("/dash");
    }

  }


  useEffect(() => {
      setTimeout(() => {
          DashboardValid();
          setData(true)
      }, 100)

  }, [])


  return (
    <>
      {data.message!="Internal Server Error" ? (
        <div>
          <div>Dashboard is here!</div>
          <Sidebar/>
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

