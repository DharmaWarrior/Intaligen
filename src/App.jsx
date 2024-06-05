import Header from "./components/Header";
import { Routes, Route, useNavigate } from "react-router-dom"
import { React, useEffect, useContext, useState } from "react";
import { LoginContext } from "./components/ContextProvider/Context";
import Login from "./components/Login";
import Register from "./components/Register";
import Labors from "./Labors";
import Dashboard from "./components/Dashboard";
import Productionchartsnew from "./components/Productionchartsnew";
import Items from "./Items";
import ProductInfo from "./ProductInfo";
import Categories from "./Categories";





export default function App() {

  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);


  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/userdashboard", {
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
      console.log("User not valid app.js");
      // history("/");
       
    } 
    else {
          const finalData = {
          status:200,
          ValidUserOne: data
        }
      console.log("login dataa is set");
      setLoginData(finalData);
      
    }
  
  }

  useEffect(() => {
    setTimeout(()=>{
      DashboardValid();
      setData(true)
    },100)

  }, [])


  return (
    <div className="flex flex-col h-screen">
      <div className=" fixed top-0 w-full z-10 mb-10"> 
        <Header />
      </div>
   
      <div className=" mt-20 flex flex-col justify-center items-center flex-grow">
        {
          //adding sidebar here in future
          data ? (
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/labors" element={<Labors />} />
              <Route path="/dash" element={<Dashboard />} />
              <Route path="/masterDataDashboard" element={<Productionchartsnew/>} />
              <Route path="*" element={<Error />} />
              <Route path="/items" element={<Items />} />
              <Route path="/product/:id" element={<ProductInfo />} />
              <Route path="/categories" element={<Categories />} />
              {/* <Route path="/partners" element={<Partners />} />
              */}
            </Routes>
          ) : (
            <div className="flex justify-center items-center flex-col flex-grow">
              Loading...
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )
        }
      </div> 
    </div>
  );
}
