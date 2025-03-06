import React from 'react'
import './style.css'
import Header from 'layouts/Header'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from 'layouts/Footer'
import { LOGIN_PATH } from 'constant'

export default function Container() {

    const {pathname} = useLocation();

  return (
    <>
        <Header></Header>
        <Outlet></Outlet>
        {pathname !== LOGIN_PATH() && <Footer></Footer>}
    </>
  )
}
