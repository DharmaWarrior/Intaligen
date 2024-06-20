import Header from "./components/Header";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
import Partners from "./Partners";
import Orders from "./Orders";
import Flow from "./ProductionDept";
import DetailsPage from "./components/DetailsPage";
import { TooltipProvider } from "./../components/ui/tooltip";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./components/ContextProvider/Authcontext";
import PrivateRoute from './components/PrivateRoute';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './../components/ui/resizable';
import Cookies from "js-cookie"; // Import js-cookie

export default function App() {
  const [data, setData] = useState(false);

  const history = useNavigate();
  const location = useLocation(); // Get the current location

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

    console.log(data.message);
    if (data.message === "Internal Server Error") {
      console.log("User not valid app.js");
      // history("/");
    } else {
      const finalData = {
        status: 200,
        ValidUserOne: data
      };
      console.log("login dataa is set");
      setLoginData(finalData);
    }
  };

  

  // Retrieve layout and collapsed state from cookies
  const layout = Cookies.get("react-resizable-panels:layout");
  const collapsed = Cookies.get("react-resizable-panels:collapsed");
  
  const defaultLayout = layout ? (JSON.parse(layout) || undefined) : undefined;
  const defaultCollapsed = false;

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 100);
  }, []);

  return (
    <div className="flex h-screen">
      <AuthProvider>
      <TooltipProvider>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes) => {
            Cookies.set("react-resizable-panels:layout", JSON.stringify(sizes));
          }}
          className="h-full max-h-[800px] items-stretch"
        >
          {location.pathname !== '/' && location.pathname !== '/register' && (
            <>
              <Sidebar
                defaultLayout={defaultLayout}
                defaultCollapsed={defaultCollapsed}
                navCollapsedSize={4}
              />
              <ResizableHandle withHandle />
            </>
          )}
          <ResizablePanel>
            <div className="flex flex-col flex-grow">
              {data ? (
                
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<PrivateRoute />}>
                      <Route path="/labors" element={<Labors />} />
                      <Route path="/dash" element={<Dashboard />} />
                      <Route path="/masterDataDashboard" element={<Productionchartsnew />} />
                      <Route path="*" element={<Error />} />
                      <Route path="/items" element={<Items />} />
                      <Route path="/product/:id" element={<ProductInfo />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/partners" element={<Partners />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/workstation_console" element={<Flow />} />
                      <Route path="/details" element={<DetailsPage />} />
                    </Route>
                  </Routes>
                
              ) : (
                <div className="flex justify-center items-center flex-col flex-grow">
                  Loading...
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
      </AuthProvider>
    </div>
  );
}
