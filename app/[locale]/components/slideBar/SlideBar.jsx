
"use client"

import { useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu  } from 'react-pro-sidebar';
import './slidBar.css'
import Link from 'next/link';



  function SlideBar() {
    const [width, setWidth] = useState(window.innerWidth);
    const [collapse, setCollapse] = useState(width < 500);
    const [isExpand, setIsExpand] = useState(true);
  
    const handleCollapse = () => {
      setCollapse(!collapse);
    };
  
    useEffect(() => {
      // Add the 'resize' event listener to the window and call updateWidth when resized
      const handleResize = () => {
        const newWidth = window.innerWidth;
        setWidth(newWidth);
        setCollapse(newWidth < 500);
      };
  
      window.addEventListener('resize', handleResize);
  
      // Cleanup: Remove the event listener when the component unmounts
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
  
    
    
    return (
      <>
            <Sidebar width={'300px'} className='position-absloute' collapsed={collapse} style={{minHeight:'100vh', backgroundColor: '#ECF5FA'}}  >
            <div onClick={() => handleCollapse()} className={`icon ${isExpand ? '' : 'd-block'} me-1`}>
            <i className="bi bi-list"></i>
            </div>
          <Menu className='mt-4'>
            <SubMenu className='mt-4 menuItem' icon={ <i className="bi bi-person-gear"></i> } label="Edit Profile" >
              <MenuItem component={<Link href={'/editprofile/personal_info'}></Link>} className='hoverClass'>
                <i className="slid_icon bi bi-person"></i> Personal information
              </MenuItem >
              <MenuItem component={<Link href={'/editprofile/security'}></Link>} className='hoverClass' icon={<i className="slid_icon bi bi-person-lock"></i>}>
               Security
              </MenuItem>
            </SubMenu>
            <MenuItem component={<Link href={'/editprofile/wishlist'}></Link>} className='menuItem ' icon={<i className="slid_icon bi bi-heart"></i>}>
               Wishlist
            </MenuItem>
            <SubMenu  label="Cart"  icon={<i className="slid_icon bi bi-cart"></i>}>
            <MenuItem    component={<Link href={'/editprofile/cart'}></Link>} className='hoverClass ' icon={<i class="bi bi-bag-check-fill"></i>}>
              Shopping Cart
            </MenuItem>
            <MenuItem  component={<Link href={'/editprofile/file_cart'}></Link>} className='hoverClass ' icon={<i class="bi bi-file-earmark-zip"></i>}>
              File Cart
            </MenuItem>
            </SubMenu>
          </Menu>
        </Sidebar>

      </>
    )
  }

  export default SlideBar