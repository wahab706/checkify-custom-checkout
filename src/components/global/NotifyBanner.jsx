import React, { useState, useEffect, useContext,Fragment } from "react";
import { Button, Banner, List, Text } from "@shopify/polaris";
import { useAuthDispatch, useAuthState } from "../providers/AuthProvider";
import { AppContext } from "../providers/ContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../providers";

export function NotifyBanner() {
  const { apiUrl, locationChange, setLocationChange } = useContext(AppContext);
  // const { locationChange, setLocationChange } = useContext(AppContext);
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();
  const { isNotifyBanner } = useAuthState();
  const handleBannerClick = () => {
    setLocationChange('/admin/settings');
    navigate('/admin/settings')
  };
  const handleBannerClickDismiss = async() => {
    let data = {
      type: 'enableSettings',
      isNotifyBanner: 0,
  }

    const response = await axios.post(`${apiUrl}/api/store/minor`,data, {
      headers: { "Authorization": `Bearer ${getAccessToken()}` }
  })

    dispatch({ isNotifyBanner: false });
  };
  return (
    <>
      {isNotifyBanner ? (

        <Fragment>
          <Banner
            title="Activate Checkout on Store"
            status="warning"
            action={{ content: "Settings" , onAction: handleBannerClick }}
            secondaryAction={{ content:'Dismiss',onAction:handleBannerClickDismiss }}
            onDismiss={handleBannerClickDismiss}
          >
            {/* <p>
            You will have to enable checkout on your Store for this please click theme button which will move to settings page.
            </p> */}
            <List>
              <List.Item>You will have to enable checkout on your Store for this please click  Setting button which will move to settings page.</List.Item>
            </List>
          </Banner>
       <br/>
       </Fragment>
             ) : (
        ""
      )}
    </>
  );
}
