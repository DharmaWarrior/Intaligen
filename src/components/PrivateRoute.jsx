import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './ContextProvider/Authcontext' 

const PrivateRoutes = () => {
  let auth = useAuth()


  return (
    auth.login ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default PrivateRoutes
