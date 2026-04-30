import React from 'react'
import {Outlet} from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { useGetMeQuery } from '../redux/api/authApi'

function Layout() {
  // Check authentication status when app loads
  useGetMeQuery();
  
  return (
    <>
    <NavBar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout