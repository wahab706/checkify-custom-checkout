import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../components/providers/ContextProvider'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from '../components'
import { useAuthState, useAuthDispatch } from '../components/providers/AuthProvider'

export default function HomePage() {
  const navigate = useNavigate();
  const { apiUrl } = useContext(AppContext);

  const { user, userToken } = useAuthState();
  const dispatch = useAuthDispatch();

  // useEffect(() => {
  //   console.log('user: ', user);
  //   console.log('userToken: ', userToken);
  // }, [user, userToken])

  return (
    <>
      <p>Dashboard</p>
    </>
  );
}