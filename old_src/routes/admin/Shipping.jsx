import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
  Page, Card, Tabs, Modal, EmptySearchResult, IndexTable, Icon, Text, ButtonGroup, Button, Stack,
  Toast, TextContainer, Loading, Layout, Form, FormLayout, Sheet, Scrollable, Checkbox, ResourceItem
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import {
  ExternalMinor, DeleteMinor, EditMinor, ArrowLeftMinor, ChevronDownMinor, ChevronUpMinor,
} from '@shopify/polaris-icons';
import {
  SkeltonShippingPage, getAccessToken, InputField, CheckBox
} from '../../components'
import { AppContext } from '../../components/providers/ContextProvider'
import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios";
import dateFormat from "dateformat";


import EmptyCheckBox from '../../assets/icons/EmptyCheckBox.png'
import FillCheckBox from '../../assets/icons/FillCheckBox.png'
import CheckboxTree from 'react-checkbox-tree';

export function Shipping() {
  const { apiUrl } = useContext(AppContext);
  const { user } = useAuthState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [toggleLoadData, setToggleLoadData] = useState(true)
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('')
  const [shippingInfoId, setShippingInfoId] = useState('')
  const [shippingDeleteModal, setShippingDeleteModal] = useState(false)
  const [taxInfoId, setTaxInfoId] = useState('')
  const [taxDeleteModal, setTaxDeleteModal] = useState(false)


  const [selectedTab, setSelectedTab] = useState(0)
  const [shippingRates, setShippingRates] = useState([])
  const [taxZones, setTaxZones] = useState([])
  const [isNewShippingRate, setIsNewShippingRate] = useState(true)
  const [isNewTax, setIsNewTax] = useState(true)
  const [shippingRateSheet, setShippingRateSheet] = useState(false);
  const [taxSheet, setTaxSheet] = useState(false);


  const [disabledTaxInputs, setDisabledTaxInputs] = useState([])
  const [oldDisabledTaxInputs, setOldDisabledTaxInputs] = useState([])
  const [countriesListForTax, setCountriesListForTax] = useState([])
  const [nodesDataForTax, setNodesDataForTax] = useState([])
  const [checkedTaxCountries, setCheckedTaxCountries] = useState([])
  const [oldCheckedTaxCountries, setOldCheckedTaxCountries] = useState([])
  const [expanded, setExpanded] = useState([])
  const [taxModal, setTaxModal] = useState(false)

  const [restOfWorlds, setRestOfWorlds] = useState({
    value: false,
    previous: false,
    forThis: true,
    global: false,
    oldForThis: true,
    oldGlobal: false,
  })

  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    internalName: '',
    description: '',
    price: '',
    itemsMin: 0,
    itemsMax: '',
    subtotalMin: 0,
    subtotalMax: '',
    weightMin: 0,
    weightMax: '',
    isDefault: false,
  })

  const [taxDetails, setTaxDetails] = useState({
    name: '',
    type: 'fixed',
    value: '',
    status: null,
    is_enabled: false,
    countries: [],
    states: [],
    country_id: [],
  })


  // =================Countries Modal Code Start Here================
  const [countriesModal, setCountriesModal] = useState(false)
  const [allCountriesChecked, setAllCountriesChecked] = useState(true);
  const [expandedContinent, setExpandedContinent] = useState([])
  const [continentsList, setContinentsList] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [checkedCountries, setCheckedCountries] = useState([])
  const [previousCheckedCountries, setPreviousCheckedCountries] = useState([])



  const handleAllCountriesChecked = (newChecked) => {
    setAllCountriesChecked(newChecked)
    if (newChecked == true) {
      selectAllCountries()
    }
    else {
      setCheckedCountries([])
    }
  }

  const handleSelectCountriesModal = () => {
    setCountriesModal(true)
  }

  const handleCountriesCancelModal = () => {
    setCountriesModal(false)
    setCheckedCountries(previousCheckedCountries)
  }

  const handleCountriesSaveModal = () => {
    if (checkedCountries?.length > 0) {
      setCountriesModal(false)
      setPreviousCheckedCountries(checkedCountries)
    }
    else {
      setToastMsg('Atleast one country should be selected!')
      setErrorToast(true)
    }
  }

  function selectAllCountries() {
    let arr = []
    continentsList?.map((continent) => {
      continent?.children?.map((countries) => {
        arr.push(countries.value)
      })
    })
    setCheckedCountries(arr)
    setPreviousCheckedCountries(arr)
  }

  function getFirstSelectedCountry(val, countries) {
    let value = ''

    if (countries?.length > 0) {
      if (val == 'sheet') {
        value = allCountries.find(obj => obj.code == countries[0]).name
      }
      else if (val == 'table') {
        value = allCountries.find(obj => obj.code == countries[0].code).name
      }
    }

    return value;
  }

  useEffect(() => {
    // console.log('checkedCountries: ', checkedCountries)
    // console.log('previousCheckedCountries: ', previousCheckedCountries)

    setContinentsList(groupCountries(allCountries))
    if (checkedCountries?.length < allCountries?.length) {
      setAllCountriesChecked(false)
    }
    else {
      setAllCountriesChecked(true)
    }
  }, [checkedCountries])


  function countrySelected(arr, region) {
    let countries = [];
    arr?.map((item) => {
      if (region != 'Other') {
        if (item.continent == region) {
          countries.push({ value: item.code, label: item.name })
        }
      }
      else {
        if (item.continent == 'Other' || item.continent == null) {
          countries.push({ value: item.code, label: item.name })
        }
      }
    })
    return countries;
  }

  function getSelectedCountriesLength(region) {
    let number = 0
    allCountries?.map((item2) => {
      if (region != 'Other') {
        if (item2.continent == region) {
          if (checkedCountries.find(obj => obj == item2.code)) {
            number = number + 1
          }
        }
      }
      else {
        if (item2.continent == 'Other' || item2.continent == null) {
          if (checkedCountries.find(obj => obj == item2.code)) {
            number = number + 1
          }
        }
      }
    })
    return number;
  }


  function groupCountries(array) {
    let list = []
    list.push({
      value: 'Asia',
      label: <>
        <span>Asia</span>
        <span>{getSelectedCountriesLength('Asia')} countries selected</span>
      </>,
      children: countrySelected(array, 'Asia'),
    })
    list.push({
      value: 'Europe',
      label: <>
        <span>Europe</span>
        <span>{getSelectedCountriesLength('Europe')} countries selected</span>
      </>,
      children: countrySelected(array, 'Europe'),
    })
    list.push({
      value: 'Africa',
      label: <>
        <span>Africa</span>
        <span>{getSelectedCountriesLength('Africa')} countries selected</span>
      </>,
      children: countrySelected(array, 'Africa'),
    })
    list.push({
      value: 'Central_America',
      label: <>
        <span>Central America</span>
        <span>{getSelectedCountriesLength('Central America')} countries selected</span>
      </>,
      children: countrySelected(array, 'Central America'),
    })
    list.push({
      value: 'South_America',
      label: <>
        <span>South America</span>
        <span>{getSelectedCountriesLength('South America')} countries selected</span>
      </>,
      children: countrySelected(array, 'South America'),
    })
    list.push({
      value: 'North_America',
      label: <>
        <span>North America</span>
        <span>{getSelectedCountriesLength('North America')} countries selected</span>
      </>,
      children: countrySelected(array, 'North America'),
    })
    list.push({
      value: 'Oceania',
      label: <>
        <span>Oceania</span>
        <span>{getSelectedCountriesLength('Oceania')} countries selected</span>
      </>,
      children: countrySelected(array, 'Oceania'),
    })
    list.push({
      value: 'Other',
      label: <>
        <span>Other</span>
        <span>{getSelectedCountriesLength('Other')} countries selected</span>
      </>,
      children: countrySelected(array, 'Other'),
    })
    return list;

  }

  // =================Countries Modal Code Ends Here================


  // ================================Tax Modal Code Starts here===================
  const handleSelectTaxModal = () => {
    setTaxModal(true)
  }

  const handleTaxCancelModal = () => {
    // setRestOfWorlds({
    //   ...restOfWorlds,
    //   value: restOfWorlds.previous
    // })
    setTaxModal(false)
    setCheckedTaxCountries(oldCheckedTaxCountries)
  }

  const handleTaxSaveModal = () => {
    // if (!checkedTaxCountries?.length && !restOfWorlds.value) {
    //   setToastMsg('Atleast one country / state should be selected!')
    //   setErrorToast(true)
    // }
    // else {
    //   setTaxModal(false)
    //   setOldCheckedTaxCountries(checkedTaxCountries)
    // }
    // setRestOfWorlds({
    //   ...restOfWorlds,
    //   previous: restOfWorlds.value
    // })
    if (!checkedTaxCountries?.length) {
      setToastMsg('Atleast one country / state should be selected!')
      setErrorToast(true)
    }
    else {
      setTaxModal(false)
      setOldCheckedTaxCountries(checkedTaxCountries)
    }
  }


  useEffect(() => {
    // console.log('checkedTaxCountries: ', checkedTaxCountries)
    setNodesDataForTax(groupByTax(allCountries))
  }, [checkedTaxCountries])

  function SetCustomTaxCountries(checked) {
    // if (restOfWorlds.value && !restOfWorlds.global) {
    //   setRestOfWorlds({
    //     ...restOfWorlds,
    //     value: false
    //   })
    // }
    if (disabledTaxInputs?.length > 0) {
      let tempArray = []
      checked?.map((item) => {
        if (!disabledTaxInputs.find(obj => obj == item)) {
          tempArray.push(item)
        }
      })
      setCheckedTaxCountries(tempArray)
    }
    else {
      setCheckedTaxCountries(checked)
    }
  }


  useEffect(() => {
    let disabled = []
    let states = []
    taxZones?.map((item) => {
      item.states?.map((item2) => {
        disabled.push(item2.id.toString())
        states.push(item2.id.toString())
      })

      item.countries?.map((item2) => {
        if (item2.states_count == 0) {
          disabled.push(item2.code.toString())
        }
      })

    })

    setDisabledTaxInputs(disabled)
    setOldDisabledTaxInputs(disabled)
  }, [taxZones, allCountries])


  useEffect(() => {
    if (!loading) {
      disableTaxFields()
    }
  }, [checkedTaxCountries, expanded, taxModal])

  function disableTaxFields() {
    if (taxModal) {
      let msg = "<small>In another zone</small>";
      let parent = document.getElementsByClassName('rct-node-parent')[0]
      let child = parent.querySelector('label')
      let id = child.getAttribute('for').split(/\-(?=[^\-]+$)/)[0]
      // console.log(id)
      if (disabledTaxInputs?.length > 0) {
        disabledTaxInputs?.map((item) => {
          let labels = document.getElementsByTagName('label')
          for (var i = 0; i < labels.length; i++) {
            if (labels[i].htmlFor == `${id}-${item}`) {
              labels[i].style.opacity = '0.7';
              labels[i].querySelector('input').disabled = true;
              let previousHtml = labels[i].getElementsByClassName('rct-title')[0].innerHTML.split(msg)[0]
              labels[i].getElementsByClassName('rct-title')[0].innerHTML = `${previousHtml} ${msg}`;
            }
          }
        })
      }
    }


  }

  function getSelectedTaxStatesLength(country) {
    let number = 0
    allCountries?.map((item) => {
      if (item.name == country) {
        item.states?.map((item2) => {
          if (checkedTaxCountries.find(obj => obj == item2.id)) {
            number = number + 1
          }
        })
      }
    })
    return number;
  }

  function groupByTax(data) {
    let arr = []
    data?.map((item) => {
      let state = []
      if (item.states?.length > 0) {
        item.states?.map((item2) => {
          state.push({ value: item2.id, label: item2.name })
        })
      }
      arr.push({
        value: item.code,
        label: <>
          {state?.length ?
            <>
              <span>{item.name}</span>
              <span>{getSelectedTaxStatesLength(item.name)} states selected</span>
            </> :
            <>
              <span>{item.name}</span>
            </>
          }
        </>,
        children: state,
      })
    })

    return arr;
  }

  const handleTaxDeleteModal = () => {
    setTaxDeleteModal(!taxDeleteModal)
    setTaxInfoId()
  }

  const handleDeleteTax = (id) => {
    setTaxInfoId(id)
    setTaxDeleteModal(true)
  }

  // ================================Tax Modal Code Ends here===================

  // ------------------------Toasts Code start here------------------
  const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
  const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

  const toastErrorMsg = errorToast ? (
    <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} duration={2000} />
  ) : null;

  const toastSuccessMsg = sucessToast ? (
    <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
  ) : null;


  const handleShippingRateSheet = () => {
    setShippingRateSheet(!shippingRateSheet)
    setBtnLoading(false)
    setShippingInfoId()
    setShippingDetails({
      name: '',
      internalName: '',
      description: '',
      price: '',
      itemsMin: 0,
      itemsMax: '',
      subtotalMin: 0,
      subtotalMax: '',
      weightMin: 0,
      weightMax: '',
      isDefault: false,
    })
    setTimeout(() => {
      setIsNewShippingRate(true)
    }, 500);

    setCountriesModal(false)
    let myArray = []
    allCountries?.map((item) => {
      myArray.push(item.code)
    })
    setCheckedCountries(myArray)
    setPreviousCheckedCountries(myArray)
  }


  const handleTaxSheet = () => {
    setTaxSheet(!taxSheet)
    setTimeout(() => {
      setIsNewTax(true)
    }, 500);
    setBtnLoading(false)
    setTaxInfoId()
    setTaxDetails({
      name: '',
      type: 'fixed',
      value: '',
      status: null,
      is_enabled: false,
      states: [],
    })
    // if (restOfWorlds.oldGlobal) {
    //   if (!restOfWorlds.global) {
    //     setRestOfWorlds({
    //       ...restOfWorlds,
    //       value: false,
    //       previous: false,
    //       global: true,
    //       oldForThis: false,
    //       forThis: false,
    //     })
    //   }
    // }
    // else {
    //   setRestOfWorlds({
    //     ...restOfWorlds,
    //     value: false,
    //     previous: false,
    //     oldGlobal: false,
    //     global: false,
    //     oldForThis: true,
    //     forThis: true,
    //   })
    // }

    setTaxModal(false)
    setCheckedTaxCountries([])
    setOldCheckedTaxCountries([])
    setDisabledTaxInputs(oldDisabledTaxInputs)
  }

  const handleRestOfWorldChecked = (newChecked) => {
    setRestOfWorlds({
      ...restOfWorlds,
      value: newChecked
    })
    if (checkedTaxCountries?.length > 0) {
      if (newChecked) {
        setCheckedTaxCountries([])
        setTaxDetails({
          ...taxDetails,
          states: [],
          countries: []
        })
      }
    }
  }

  const handleShippingDetails = (e) => {
    if (e.target.name == 'isDefault') {
      setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.checked })
    }
    else {
      setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value })
    }
  }

  const handleTaxDetails = (e) => {
    if (e.target.name == 'is_enabled') {
      setTaxDetails({ ...taxDetails, [e.target.name]: e.target.checked })
    }
    else {
      setTaxDetails({ ...taxDetails, [e.target.name]: e.target.value })
    }
  }

  const handleShippingDeleteModal = () => {
    setShippingDeleteModal(!shippingDeleteModal)
    setShippingInfoId()
  }

  const handleDeleteShipping = (id) => {
    setShippingInfoId(id)
    setShippingDeleteModal(true)
  }



  // ---------------------Tabs Code Start Here----------------------
  const tabs = [
    {
      id: '0',
      content: 'Shipping rates',
    },
    {
      id: '1',
      content: 'Taxes',
    },
    // {
    //   id: '2',
    //   content: (
    //     <span>
    //       <Badge status="success">Advanced</Badge> Shipping forms
    //     </span>
    //   ),
    // },
  ];

  const handleTabChange = (selectedTabIndex) => {
    if (selectedTab != selectedTabIndex) {
      setSelectedTab(selectedTabIndex)
      setLoading(true)
      setToggleLoadData(true)
    }
  }

  function convertBooleanToNumber(value) {
    let booleanValue;
    if (value === true) {
      booleanValue = 1;
    }
    else {
      booleanValue = 0;
    }

    return booleanValue;
  }

  function convertNumberToBoolean(value) {
    let booleanValue;
    if (value === 1) {
      booleanValue = true;
    }
    else {
      booleanValue = false;
    }
    return booleanValue;
  }

  const handleCreateShippingRate = () => {
    document.getElementById('updateShippingRate').click();
  }

  const handleCreateTaxZone = () => {
    document.getElementById('updateTaxZone').click();
  }

  // ---------------------Index Table Code Start Here----------------------
  const shippingResourceName = {
    singular: 'shipping',
    plural: 'shippings',
  };

  const taxResourceName = {
    singular: 'Tax',
    plural: 'Taxes',
  };

  const shippingRowMarkup = shippingRates?.map(
    ({ id, internalName, name, isDefault, price, countries }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
      >

        <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {internalName ? internalName : '---'}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>
          <span className='small-tgl-btn'
            onClick={() => updateShippingStatus(id, isDefault)}
          >
            <input id={id}
              type="checkbox"
              className="tgl tgl-light"
              onChange={() => ''}
              checked={convertNumberToBoolean(isDefault)}
            />
            <label htmlFor={id} className='tgl-btn'></label>
          </span>
        </IndexTable.Cell>

        <IndexTable.Cell>{price}</IndexTable.Cell>

        <IndexTable.Cell>
          {countries?.length < allCountries?.length ?
            countries?.length == 1 ?
              <Text variant="headingSm" as="h6">
                <span>
                  {getFirstSelectedCountry('table', countries)}
                </span>
              </Text> :
              <Text variant="headingSm" as="h6">
                <span>
                  {getFirstSelectedCountry('table', countries)}
                </span>
                &nbsp;
                <small>
                  {`+ ${countries?.length - 1} others`}
                </small>
              </Text>
            :
            <Text variant="headingSm" as="h6">
              <span>🌍</span>
              &nbsp;
              <span>All countries</span>
            </Text>
          }
        </IndexTable.Cell>


        <IndexTable.Cell className='Polaris-IndexTable-Delete-Column'>


          <ButtonGroup>
            <Button onClick={() => editShippingRate(id)} disabled={btnLoading[id]} >
              <Icon source={EditMinor}></Icon>
            </Button>

            <Button onClick={() => handleDeleteShipping(id)} disabled={btnLoading[id]}>
              <Icon source={DeleteMinor}></Icon>
            </Button>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row >
    ),
  );

  const taxRowMarkup = taxZones?.map(
    ({ id, name, type, value, status, is_enabled, states, countries }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
      // disabled={status == 'api_taxes'}
      >

        <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {name}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>{type}</IndexTable.Cell>
        <IndexTable.Cell>
          {value}
        </IndexTable.Cell>

        <IndexTable.Cell>
          <span className='small-tgl-btn'
            onClick={() => updateTaxStatus(id, is_enabled)}
          >
            <input id={id}
              type="checkbox"
              className="tgl tgl-light"
              onChange={() => ''}
              checked={convertNumberToBoolean(is_enabled)}
            />
            <label htmlFor={id} className='tgl-btn'></label>
          </span>
        </IndexTable.Cell>

        <IndexTable.Cell></IndexTable.Cell>

        <IndexTable.Cell className='Polaris-IndexTable-Delete-Column'>

          <ButtonGroup>
            <Button onClick={() => editTaxZone(id)} disabled={btnLoading[id] || status == 'api_taxes' || status == 'default_taxes'} >
              <Icon source={EditMinor}></Icon>
            </Button>

            <Button onClick={() => handleDeleteTax(id)} disabled={btnLoading[id] || status == 'api_taxes' || status == 'default_taxes'}>
              <Icon source={DeleteMinor}></Icon>
            </Button>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row >
    ),
  );

  // ---------------------Api starts Here----------------------


  const getCountriesList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/countries`)

      // console.log('getCountriesList response: ', response.data);
      setContinentsList(groupCountries(response.data))
      setCountriesListForTax(response.data)
      let myArray = []
      response.data?.map((item) => {
        myArray.push(item.code)
      })
      setAllCountries(response.data)
      setCheckedCountries(myArray)
      setPreviousCheckedCountries(myArray)
      setNodesDataForTax(groupByTax(response.data))


    } catch (error) {
      console.warn('getCountriesList Api Error', error.response);
    }
  }

  useEffect(() => {
    getCountriesList()
  }, [])

  const getShippingRates = async () => {
    setTableLoading(true)

    try {
      const response = await axios.get(`${apiUrl}/api/shipping/rates`, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('getShippingRates response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message)
        setErrorToast(true)
      }
      else {
        setShippingRates(response.data.data)
        setLoading(false)
        setTableLoading(false)
      }
      setToggleLoadData(false)


    } catch (error) {
      console.warn('getShippingRates Api Error', error.response);
      setLoading(false)
      setTableLoading(false)
      setToggleLoadData(false)
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message)
      }
      else {
        setToastMsg('Server Error')
      }
      setErrorToast(true)
    }
  }

  const getTaxZones = async () => {
    setTableLoading(true)

    try {
      const response = await axios.get(`${apiUrl}/api/taxes`, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('getTaxZones response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message)
        setErrorToast(true)
      }
      else {
        setTaxZones(response.data?.data)
        setLoading(false)
        setTableLoading(false)


        // response.data?.data?.map((item) => {
        //   if (convertNumberToBoolean(item.is_for_rest)) {
        //     setRestOfWorlds({
        //       ...restOfWorlds,
        //       global: true,
        //       forThis: false,
        //       oldForThis: false,
        //       oldGlobal: true,
        //     })
        //   }
        // })
      }
      setToggleLoadData(false)
    } catch (error) {
      console.warn('getTaxZones Api Error', error.response);
      setLoading(false)
      setTableLoading(false)
      setToggleLoadData(false)
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message)
      }
      else {
        setToastMsg('Server Error')
      }
      setErrorToast(true)
    }
  }

  useEffect(() => {
    if (toggleLoadData) {
      switch (selectedTab) {
        case 0:
          getShippingRates()
          break;

        case 1:
          getTaxZones()
          break;

        default:
          setSelectedTab(0)
          getShippingRates()
          break;
      }
    }
  }, [toggleLoadData])

  const updateShippingStatus = async (id, value) => {
    setTableLoading(true)

    let enableValue = '';
    let shippingStatus = ''
    if (value == 0) {
      enableValue = 1;
      shippingStatus = 'Shipping Rate Enabled'
    }
    else {
      enableValue = 0;
      shippingStatus = 'Shipping Rate Disabled'
    }

    let data = {
      isDefault: enableValue,
    }

    try {
      const response = await axios.put(`${apiUrl}/api/shipping/rates/${id}/update`, data, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      setToastMsg(shippingStatus)
      setSucessToast(true)
      setToggleLoadData(true)

    } catch (error) {
      console.warn('updateShippingStatus Api Error', error.response);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message)
      }
      else {
        setToastMsg('Server Error')
      }
      setErrorToast(true)
      setTableLoading(false)
    }

  }

  const deleteShippingRate = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[shippingInfoId]) {
        toggleId = { [shippingInfoId]: false };
      } else {
        toggleId = { [shippingInfoId]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.delete(`${apiUrl}/api/shipping/rates/${shippingInfoId}/delete`, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('deleteShippingRate response: ', response.data);
      setBtnLoading(false)
      setToastMsg('Shipping Rate Deleted')
      handleShippingDeleteModal()
      setSucessToast(true)
      setToggleLoadData(true)
    } catch (error) {
      console.warn('deleteShippingRate Api Error', error.response);
      setBtnLoading(false)
      handleShippingDeleteModal()
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message)
      }
      else {
        setToastMsg('Server Error')
      }
      setErrorToast(true)
    }
  }

  const editShippingRate = async (id) => {
    setTableLoading(true)
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[id]) {
        toggleId = { [id]: false };
      } else {
        toggleId = { [id]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.get(`${apiUrl}/api/shipping/rates/${id}/edit`, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('editShippingRate response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message)
        setErrorToast(true)
      }
      else {
        setShippingDetails({
          name: response.data.data?.name,
          internalName: response.data.data?.internalName,
          description: response.data.data?.description,
          price: response.data.data?.price,
          itemsMin: response.data.data?.itemsMin,
          itemsMax: response.data.data?.itemsMax,
          subtotalMin: response.data.data?.subtotalMin,
          subtotalMax: response.data.data?.subtotalMax,
          weightMin: response.data.data?.weightMin,
          weightMax: response.data.data?.weightMax,
          isDefault: convertNumberToBoolean(response.data.data?.isDefault)
        })

        let myArray = []
        response.data.data?.countries.map((item) => {
          myArray.push(item.code)
        })
        setCheckedCountries(myArray)
        setPreviousCheckedCountries(myArray)

        setShippingInfoId(id)
        setIsNewShippingRate(false)
        setShippingRateSheet(true)
      }
      setTableLoading(false)
      setBtnLoading(false)
    } catch (error) {
      console.warn('editShippingRate Api Error', error.response);
      setBtnLoading(false)
      setTableLoading(false)
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message)
      }
      else {
        setToastMsg('Server Error')
      }
      setErrorToast(true)
    }
  }

  const createShippingRate = async (e) => {
    e.preventDefault();

    let data = {
      name: shippingDetails.name,
      internalName: shippingDetails.internalName,
      description: shippingDetails.description,
      price: shippingDetails.price,
      itemsMin: shippingDetails.itemsMin,
      itemsMax: shippingDetails.itemsMax,
      subtotalMin: shippingDetails.subtotalMin,
      subtotalMax: shippingDetails.subtotalMax,
      weightMin: shippingDetails.weightMin,
      weightMax: shippingDetails.weightMax,
      isDefault: convertBooleanToNumber(shippingDetails.isDefault),
      countries: checkedCountries.toString()
    }


    setBtnLoading((prev) => {
      let toggleId;
      if (prev[3]) {
        toggleId = { [3]: false };
      } else {
        toggleId = { [3]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.post(`${apiUrl}/api/shipping/rates/store`, data, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('createShippingRate response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message)
        setErrorToast(true)
      }
      else {
        handleShippingRateSheet()
        setToastMsg('Shipping Rate Created Sucessfully')
        setSucessToast(true)
        setToggleLoadData(true)
      }
      setBtnLoading(false)

    } catch (error) {
      console.warn('createShippingRate Api Error', error);
      setToastMsg(error.response.data?.message)
      setErrorToast(true)
      setBtnLoading(false)
    }
  }

  const updateShippingRate = async (e) => {
    e.preventDefault();

    let data = {
      name: shippingDetails.name,
      internalName: shippingDetails.internalName,
      description: shippingDetails.description,
      price: shippingDetails.price,
      itemsMin: shippingDetails.itemsMin,
      itemsMax: shippingDetails.itemsMax,
      subtotalMin: shippingDetails.subtotalMin,
      subtotalMax: shippingDetails.subtotalMax,
      weightMin: shippingDetails.weightMin,
      weightMax: shippingDetails.weightMax,
      isDefault: convertBooleanToNumber(shippingDetails.isDefault),
      countries: checkedCountries.toString()
    }

    setBtnLoading((prev) => {
      let toggleId;
      if (prev[3]) {
        toggleId = { [3]: false };
      } else {
        toggleId = { [3]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.put(`${apiUrl}/api/shipping/rates/${shippingInfoId}/update`, data, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('updateShippingRate response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message)
        setErrorToast(true)
      }
      else {
        handleShippingRateSheet()
        setToastMsg('Shipping Rate Updated Sucessfully')
        setSucessToast(true)
        setToggleLoadData(true)
      }
      setBtnLoading(false)

    } catch (error) {
      console.log('updateShippingRate Api Error', error);
      setToastMsg(error.response.data?.message)
      setErrorToast(true)
      setBtnLoading(false)
    }
  }

  const updateTaxStatus = async (id, value) => {
    setTableLoading(true)

    let enableValue = '';
    let taxStatus = ''
    if (value == 0) {
      enableValue = 1;
      taxStatus = 'Tax Zone Enabled'
    }
    else {
      enableValue = 0;
      taxStatus = 'Tax Zone Disabled'
    }

    let data = {
      is_enabled: enableValue,
    }

    try {
      const response = await axios.put(`${apiUrl}/api/taxes/${id}/update`, data, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      setToastMsg(taxStatus)
      setSucessToast(true)
      setToggleLoadData(true)

    } catch (error) {
      console.warn('updateTaxStatus Api Error', error.response);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message)
      }
      else {
        setToastMsg('Server Error')
      }
      setErrorToast(true)
      setTableLoading(false)
    }

  }

  const deleteTaxZone = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[taxInfoId]) {
        toggleId = { [taxInfoId]: false };
      } else {
        toggleId = { [taxInfoId]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.delete(`${apiUrl}/api/taxes/${taxInfoId}/delete`, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('deleteTaxZone response: ', response.data);
      setBtnLoading(false)
      setToastMsg('Tax Zone Deleted')
      handleTaxDeleteModal()
      setSucessToast(true)
      setToggleLoadData(true)
    } catch (error) {
      console.warn('deleteTaxZone Api Error', error.response);
      setBtnLoading(false)
      handleTaxDeleteModal()
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message)
      }
      else {
        setToastMsg('Server Error')
      }
      setErrorToast(true)
    }
  }

  const editTaxZone = async (id) => {
    setTableLoading(true)
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[id]) {
        toggleId = { [id]: false };
      } else {
        toggleId = { [id]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.get(`${apiUrl}/api/taxes/${id}/edit`, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('editTaxZone response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message)
        setErrorToast(true)
      }
      else {
        setTaxDetails({
          ...taxDetails,
          name: response.data.data?.name,
          type: response.data.data?.type,
          value: response.data.data?.value,
          status: response.data.data?.status,
          is_enabled: convertNumberToBoolean(response.data.data?.is_enabled),
        })

        // if (convertNumberToBoolean(response.data.data?.is_for_rest)) {
        //   setRestOfWorlds({
        //     ...restOfWorlds,
        //     value: true,
        //     previous: true,
        //     global: false,
        //     forThis: true,
        //   })
        // }
        // else {
        //   setRestOfWorlds({
        //     ...restOfWorlds,
        //     value: false,
        //     previous: false
        //   })
        // }

        let checked = []
        if (response.data.data?.states?.length > 0) {
          response.data.data?.states?.map((item2) => {
            checked.push(item2.id.toString())
          })
        }
        if (response.data.data?.countries?.length > 0) {
          response.data.data?.countries?.map((item2) => {
            if (item2.states_count == 0) {
              checked.push(item2.code.toString())
            }
          })
        }
        setCheckedTaxCountries(checked)
        setOldCheckedTaxCountries(checked)

        let filtered = disabledTaxInputs.filter(val => !checked.includes(val));
        setDisabledTaxInputs(filtered)

        setTaxInfoId(id)
        setIsNewTax(false)
        setTaxSheet(true)
      }
      setTableLoading(false)
      setBtnLoading(false)
    } catch (error) {
      console.warn('editTaxZone Api Error', error.response);
      setBtnLoading(false)
      setTableLoading(false)
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message)
      }
      else {
        setToastMsg('Server Error')
      }
      setErrorToast(true)
    }
  }

  useEffect(() => {
    let country = []
    let state = []
    checkedTaxCountries?.map((item) => {
      let value = countriesListForTax.find(item1 => item1.code == item)
      if (value) {
        country.push(value.code)
      }
      else {
        state.push(item)
      }
      countriesListForTax?.map((item2) => {
        if (item2?.states?.length > 0) {
          let value2 = item2.states.find(item4 => item4.id == item)
          if (value2) {
            country.push(item2.code)
          }
        }
      })
    })

    let filtered = [...new Set(country)];

    setTaxDetails({
      ...taxDetails,
      states: state,
      countries: filtered
    })
  }, [checkedTaxCountries])

  const createTaxZone = async (e) => {
    e.preventDefault();
    // if (!checkedTaxCountries?.length && !restOfWorlds.value) {
    if (!checkedTaxCountries?.length) {
      setToastMsg('Atleast one country / state should be selected!')
      setErrorToast(true)
    }
    else {

      let data = {
        name: taxDetails.name,
        type: taxDetails.type,
        value: taxDetails.value,
        status: taxDetails.status,
        is_enabled: convertBooleanToNumber(taxDetails.is_enabled),
        // is_for_rest: convertBooleanToNumber(restOfWorlds.value),
        states: taxDetails.states.toString(),
        countries: taxDetails.countries.toString(),
      }

      setBtnLoading((prev) => {
        let toggleId;
        if (prev[3]) {
          toggleId = { [3]: false };
        } else {
          toggleId = { [3]: true };
        }
        return { ...toggleId };
      });

      try {
        const response = await axios.post(`${apiUrl}/api/taxes/store`, data, {
          headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })

        // console.log('createTaxZone response: ', response.data);
        if (response.data.errors) {
          setToastMsg(response.data.message)
          setErrorToast(true)
        }
        else {
          // if (restOfWorlds.oldGlobal) {
          //   if (!restOfWorlds.global) {
          //     setRestOfWorlds({
          //       ...restOfWorlds,
          //       oldGlobal: false,
          //       oldForThis: true,
          //       forThis: true,
          //     })
          //   }
          // }
          handleTaxSheet()
          setToastMsg('Tax Zone Created Sucessfully')
          setSucessToast(true)
          setToggleLoadData(true)
        }
        setBtnLoading(false)

      } catch (error) {
        console.warn('createTaxZone Api Error', error);
        setToastMsg(error.response.data?.message)
        setErrorToast(true)
        setBtnLoading(false)
      }
    }
  }

  const updateTaxZone = async (e) => {
    e.preventDefault();
    // if (!checkedTaxCountries?.length && !restOfWorlds.value) {
    if (!checkedTaxCountries?.length) {
      setToastMsg('Atleast one country / state should be selected!')
      setErrorToast(true)
    }
    else {
      let data = {
        name: taxDetails.name,
        type: taxDetails.type,
        value: taxDetails.value,
        status: taxDetails.status,
        // is_for_rest: convertBooleanToNumber(restOfWorlds.value),
        states: taxDetails.states.toString(),
        countries: taxDetails.countries.toString(),
      }

      setBtnLoading((prev) => {
        let toggleId;
        if (prev[3]) {
          toggleId = { [3]: false };
        } else {
          toggleId = { [3]: true };
        }
        return { ...toggleId };
      });

      try {
        const response = await axios.put(`${apiUrl}/api/taxes/${taxInfoId}/update`, data, {
          headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })

        // console.log('updateTaxZone response: ', response.data);
        if (response.data.errors) {
          setToastMsg(response.data.message)
          setErrorToast(true)
        }
        else {
          // if (restOfWorlds.oldGlobal) {
          //   if (!restOfWorlds.global) {
          //     setRestOfWorlds({
          //       ...restOfWorlds,
          //       oldGlobal: false,
          //       oldForThis: true,
          //       forThis: true,
          //     })
          //   }
          // }
          handleTaxSheet()
          setToastMsg('Tax Zone Updated Sucessfully')
          setSucessToast(true)
          setToggleLoadData(true)
        }
        setBtnLoading(false)

      } catch (error) {
        console.warn('updateTaxZone Api Error', error);
        setToastMsg(error.response.data?.message)
        setErrorToast(true)
        setBtnLoading(false)
      }

    }
  }

  const emptyStateMarkup = (
    <EmptySearchResult
      title={'No Shipping Rates'}
      withIllustration
    />
  );

  const taxEmptyStateMarkup = (
    <EmptySearchResult
      title={'No Tax Zones'}
      withIllustration
    />
  );

  return (
    <div className='Discounts-Pages Shipping-Page IndexTable-Page'>
      <Modal
        open={shippingDeleteModal}
        onClose={handleShippingDeleteModal}
        title="Delete Rate?"
        primaryAction={{
          content: 'Delete',
          destructive: true,
          loading: btnLoading[shippingInfoId],
          onAction: deleteShippingRate,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            disabled: btnLoading[shippingInfoId],
            onAction: handleShippingDeleteModal,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Are you sure? This action can not be undone.
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Modal
        open={taxDeleteModal}
        onClose={handleTaxDeleteModal}
        title="Delete Tax Zone?"
        primaryAction={{
          content: 'Delete',
          destructive: true,
          loading: btnLoading[taxInfoId],
          onAction: deleteTaxZone,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            disabled: btnLoading[taxInfoId],
            onAction: handleTaxDeleteModal,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Are you sure? This action can not be undone.
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Modal
        open={taxModal}
        onClose={handleTaxCancelModal}
        title="Select Tax Zones"
        primaryAction={{
          content: 'Save',
          onAction: handleTaxSaveModal,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleTaxCancelModal,
          },
        ]}
      >
        <Modal.Section>
          <div className='Countries-Modal-Section'>
            {/* <Checkbox
              label="Rest of world"
              disabled={!restOfWorlds.forThis && restOfWorlds.global}
              checked={restOfWorlds.value || restOfWorlds.global}
              onChange={handleRestOfWorldChecked}
            /> */}

            <CheckboxTree
              nodes={nodesDataForTax}
              checked={checkedTaxCountries}
              expanded={expanded}
              onCheck={checked => SetCustomTaxCountries(checked)}
              onExpand={expanded => setExpanded(expanded)}

              icons={{
                check: <img src={FillCheckBox} alt="checkbox" />,
                halfCheck: <span className='Polaris-Icon-Half-Check'><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M14.167 9h-8.334c-.46 0-.833.448-.833 1s.372 1 .833 1h8.334c.46 0 .833-.448.833-1s-.373-1-.833-1"></path> </svg></span>,
                uncheck: <img src={EmptyCheckBox} alt="checkbox" />,
                expandClose: <Icon source={ChevronDownMinor} />,
                expandOpen: <Icon source={ChevronUpMinor} />,
              }}
            />
          </div>
        </Modal.Section>
      </Modal>

      <Modal
        open={countriesModal}
        onClose={handleCountriesCancelModal}
        title="Select Countries"
        primaryAction={{
          content: 'Save',
          onAction: handleCountriesSaveModal,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleCountriesCancelModal,
          },
        ]}
      >
        <Modal.Section>
          <div className='Countries-Modal-Section'>
            <Checkbox
              label="Select all countries"
              checked={allCountriesChecked}
              onChange={handleAllCountriesChecked}
            />

            <CheckboxTree
              nodes={continentsList}
              checked={checkedCountries}
              expanded={expandedContinent}
              onCheck={checked => setCheckedCountries(checked)}
              onExpand={expanded => setExpandedContinent(expanded)}

              icons={{
                check: <img src={FillCheckBox} alt="checkbox" />,
                halfCheck: <span className='Polaris-Icon-Half-Check'><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M14.167 9h-8.334c-.46 0-.833.448-.833 1s.372 1 .833 1h8.334c.46 0 .833-.448.833-1s-.373-1-.833-1"></path> </svg></span>,
                uncheck: <img src={EmptyCheckBox} alt="checkbox" />,
                expandClose: <Icon source={ChevronDownMinor} />,
                expandOpen: <Icon source={ChevronUpMinor} />,
              }}
            />
          </div>
        </Modal.Section>
      </Modal>

      <Sheet
        open={shippingRateSheet}
        onClose={handleShippingRateSheet}
        accessibilityLabel="Shipping Rate"
      >
        <Form onSubmit={isNewShippingRate ? createShippingRate : updateShippingRate}>
          <div className='Sheet-Container Payment-Sheet'>

            <div className='Sheet-Header'>
              <div className='Flex Align-Center'>
                <Button
                  accessibilityLabel="Cancel"
                  icon={ArrowLeftMinor}
                  onClick={handleShippingRateSheet}
                  disabled={btnLoading[2] || btnLoading[3] || countriesModal}
                />
                <div className='Payment-Sheet-Heading'>
                  <Text variant="bodyMd" as="p" fontWeight="semibold">
                    {isNewShippingRate ? 'New Shipping Rate' : 'Edit Shipping Rate'}
                  </Text>
                  <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                    Shipping Rate on Checkout page
                  </Text>
                </div>
              </div>
              <Button>
                <a href="https://help.checkify.pro/en/articles/5405170-understanding-cash-on-delivery-cod"
                  target="_blank" rel="noopener noreferrer" className='Flex Align-Center'>
                  Helpdesk <Icon source={ExternalMinor}></Icon>
                </a>
              </Button>
            </div>

            <Scrollable className='Sheet-Scrollable'>
              <FormLayout>
                <span className='VisuallyHidden'>
                  <Button submit id='updateShippingRate'>Submit</Button>
                </span>

                <InputField
                  type="text"
                  label="Internal name (optional)"
                  name='internalName'
                  value={shippingDetails.internalName}
                  onChange={handleShippingDetails}
                  autoComplete="off"
                  placeholder='Italy rate # 1'
                />

                <InputField
                  type="text"
                  label="Rate name"
                  name='name'
                  required
                  value={shippingDetails.name}
                  onChange={handleShippingDetails}
                  autoComplete="off"
                  placeholder='Free Shipping'
                />

                <InputField
                  type="text"
                  label="Description - delivery time, special offers, etc. (optional)"
                  name='description'
                  value={shippingDetails.description}
                  onChange={handleShippingDetails}
                  autoComplete="off"
                  placeholder='ETA 7-14 Days'
                />

                <InputField
                  type="number"
                  label="Shipping price"
                  name='price'
                  required
                  prefix={`${user?.currency_symbol}`}
                  value={shippingDetails.price}
                  onChange={handleShippingDetails}
                  autoComplete="off"
                  placeholder='0'
                />

                <FormLayout.Group>
                  <InputField
                    type="number"
                    label="Cart items, Min (optional)"
                    min='0'
                    name='itemsMin'
                    value={shippingDetails.itemsMin}
                    onChange={handleShippingDetails}
                    autoComplete="off"
                    placeholder='0'
                  />

                  <InputField
                    type="number"
                    label="Cart items, Max (optional)"
                    min={shippingDetails.itemsMin}
                    name='itemsMax'
                    value={shippingDetails.itemsMax}
                    onChange={handleShippingDetails}
                    autoComplete="off"
                    placeholder='0'
                  />
                </FormLayout.Group>

                <FormLayout.Group>
                  <InputField
                    type="number"
                    min='0'
                    label="Cart Subtotal, Min (optional)"
                    name='subtotalMin'
                    value={shippingDetails.subtotalMin}
                    onChange={handleShippingDetails}
                    autoComplete="off"
                    placeholder='0'
                  />

                  <InputField
                    type="number"
                    label="Cart Subtotal, Max (optional)"
                    min={shippingDetails.subtotalMin}
                    name='subtotalMax'
                    value={shippingDetails.subtotalMax}
                    onChange={handleShippingDetails}
                    autoComplete="off"
                    placeholder='0'
                  />

                </FormLayout.Group>

                <FormLayout.Group>
                  <InputField
                    type="number"
                    label="Cart Weight, Min (optional)"
                    min='0'
                    name='weightMin'
                    value={shippingDetails.weightMin}
                    onChange={handleShippingDetails}
                    autoComplete="off"
                    placeholder='0'
                  />

                  <InputField
                    type="number"
                    label="Cart Weight, Max (optional)"
                    min={shippingDetails.weightMin}
                    name='weightMax'
                    value={shippingDetails.weightMax}
                    onChange={handleShippingDetails}
                    autoComplete="off"
                    placeholder='0'
                  />
                </FormLayout.Group>

                <span className='Modal-Select'>
                  <label htmlFor='shippingDefault'>Use this rate as a default</label>
                  <input
                    id='shippingDefault'
                    type="checkbox"
                    name='isDefault'
                    className="tgl tgl-light"
                    checked={shippingDetails.isDefault}
                    onChange={handleShippingDetails}
                  />
                  <label htmlFor='shippingDefault' className='tgl-btn'></label>
                </span>

                <div className='Countries-Section'>
                  <Text variant="headingMd" as="h6">
                    Countries
                  </Text>
                  <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                    Select specific countries or regions for which this shipping options will be displayed.
                  </Text>

                  <Stack>

                    {checkedCountries?.length < allCountries?.length ?
                      checkedCountries?.length == 1 ?
                        <Text variant="headingMd" as="h6">
                          <span>
                            {getFirstSelectedCountry('sheet', checkedCountries)}
                          </span>
                        </Text> :
                        <Text variant="headingMd" as="h6">
                          <span>
                            {getFirstSelectedCountry('sheet', checkedCountries)}
                          </span>
                          &nbsp;
                          <small>
                            {`+ ${checkedCountries?.length - 1} others`}
                          </small>
                        </Text>
                      :
                      <Text variant="headingMd" as="h6">
                        <span>🌍</span>
                        &nbsp;
                        <span>All countries</span>
                      </Text>
                    }

                    <Button onClick={handleSelectCountriesModal}>Edit Countries</Button>
                  </Stack>
                </div>

              </FormLayout>
            </Scrollable>

            <div className='Sheet-Footer'>
              {isNewShippingRate ?
                <>
                  <Button onClick={handleShippingRateSheet} disabled={btnLoading[3] || countriesModal}>
                    Cancel
                  </Button>
                  <Button primary loading={btnLoading[3]} disabled={countriesModal}
                    onClick={handleCreateShippingRate}
                  >
                    Create Rate
                  </Button>
                </>
                :
                <>
                  <Button onClick={handleShippingRateSheet} disabled={btnLoading[3] || countriesModal}>
                    Cancel
                  </Button>
                  <Button
                    primary
                    loading={btnLoading[3]}
                    disabled={countriesModal}
                    onClick={handleCreateShippingRate}
                  >
                    Save Changes
                  </Button>
                </>
              }
            </div>

          </div>
        </Form>

      </Sheet>

      <Sheet
        open={taxSheet}
        onClose={handleTaxSheet}
        accessibilityLabel="Tax Zone"
      >
        <Form onSubmit={isNewTax ? createTaxZone : updateTaxZone}>
          <div className='Sheet-Container Payment-Sheet Tax-Sheet'>

            <div className='Sheet-Header'>
              <div className='Flex Align-Center'>
                <Button
                  accessibilityLabel="Cancel"
                  icon={ArrowLeftMinor}
                  onClick={handleTaxSheet}
                  disabled={btnLoading[2] || btnLoading[3] || taxModal}
                />
                <div className='Payment-Sheet-Heading'>
                  <Text variant="bodyMd" as="p" fontWeight="semibold">
                    {isNewTax ? 'New Tax Zone' : 'Edit Tax Zone'}
                  </Text>
                  <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                    Tax on Checkout page
                  </Text>
                </div>
              </div>
              <Button>
                <a href="https://help.checkify.pro/en/articles/5405170-understanding-cash-on-delivery-cod"
                  target="_blank" rel="noopener noreferrer" className='Flex Align-Center'>
                  Helpdesk <Icon source={ExternalMinor}></Icon>
                </a>
              </Button>
            </div>

            <Scrollable className='Sheet-Scrollable'>
              <FormLayout>
                <span className='VisuallyHidden'>
                  <Button submit id='updateTaxZone'>Submit</Button>
                </span>

                <InputField
                  type="text"
                  label="Tax name"
                  name='name'
                  required
                  value={taxDetails.name}
                  onChange={handleTaxDetails}
                  autoComplete="off"
                  placeholder='USA Zone'
                />

                <div className='Tax-Type'>
                  <Stack vertical>
                    <div className="Polaris-Labelled__LabelWrapper">
                      <div className="Polaris-Label">
                        <label htmlFor={taxDetails.type} className="Polaris-Label__Text">
                          <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">
                            Type
                          </span>
                        </label>
                      </div>
                    </div>

                    <ButtonGroup segmented>

                      <Button
                        pressed={taxDetails.type == 'percentage'}
                        onClick={() => setTaxDetails({ ...taxDetails, type: 'percentage' })}
                      >
                        Percentage
                      </Button>

                      <Button
                        pressed={taxDetails.type == 'fixed'}
                        onClick={() => setTaxDetails({ ...taxDetails, type: 'fixed' })}
                      >
                        Fixed Amount
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </div>

                <InputField
                  placeholder={taxDetails.type == 'fixed' && '0.00'}
                  name='value'
                  label='Value'
                  type='number'
                  required
                  prefix={taxDetails.type == 'fixed' && `${user?.currency_symbol}`}
                  suffix={taxDetails.type == 'percentage' && '%'}
                  value={taxDetails.value}
                  onChange={handleTaxDetails}
                />

                <div className='Countries-Section'>
                  <Text variant="headingMd" as="h6">
                    Countries
                  </Text>

                  <Stack>
                    <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                      Select specific countries or states for which this tax zone.
                    </Text>
                    <Button onClick={handleSelectTaxModal}>Select Zones</Button>
                  </Stack>


                  {/* <Stack>

                    {checkedTaxCountries?.length < allCountries?.length ?
                      checkedTaxCountries?.length == 1 ?
                        <Text variant="headingMd" as="h6">
                          <span>
                            {getFirstSelectedCountry('sheet', checkedTaxCountries)}
                          </span>
                        </Text> :
                        <Text variant="headingMd" as="h6">
                          <span>
                            {getFirstSelectedCountry('sheet', checkedTaxCountries)}
                          </span>
                          &nbsp;
                          <small>
                            {`+ ${checkedTaxCountries?.length - 1} others`}
                          </small>
                        </Text>
                      :
                      <Text variant="headingMd" as="h6">
                        <span>🌍</span>
                        &nbsp;
                        <span>All countries</span>
                      </Text>
                    }
                    <span></span>

                    <Button onClick={handleSelectTaxModal}>Select Zones</Button>
                  </Stack> */}
                </div>


              </FormLayout>


            </Scrollable>

            <div className='Sheet-Footer'>
              {isNewTax ?
                <>
                  <Button onClick={handleTaxSheet} disabled={btnLoading[3] || taxModal}>
                    Cancel
                  </Button>
                  <Button primary loading={btnLoading[3]} disabled={taxModal}
                    onClick={handleCreateTaxZone}
                  >
                    Create Zone
                  </Button>
                </>
                :
                <>
                  <Button onClick={handleTaxSheet} disabled={btnLoading[3] || taxModal}>
                    Cancel
                  </Button>
                  <Button
                    primary
                    loading={btnLoading[3]}
                    disabled={taxModal}
                    onClick={handleCreateTaxZone}
                  >
                    Save Changes
                  </Button>
                </>
              }
            </div>

          </div>
        </Form>

      </Sheet>

      {loading ?
        <span>
          <Loading />
          <SkeltonShippingPage />
        </span> :
        <Page
          fullWidth
          title="Shipping & Taxes"
          primaryAction={{
            content: selectedTab == 0 ? 'Create Shipping Rate' : selectedTab == 1 ? 'Create Tax' : 'Create Shipping Form',
            onAction: selectedTab == 0 ? handleShippingRateSheet : selectedTab == 1 ? handleTaxSheet : '',
          }}
          secondaryActions={
            <ButtonGroup>
              <a href='https://help.checkify.pro/en/articles/4367163-general-customization-settings' target='_blank'>
                <Button>Explore the guide <Icon source={ExternalMinor}></Icon></Button>
              </a>
            </ButtonGroup>
          }
        >

          <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
            {(() => {
              switch (selectedTab) {
                case 0:
                  return (
                    <div className='Shipping-Rates-Table'>
                      <Layout>
                        <Layout.Section fullWidth>
                          <Card sectioned>
                            <IndexTable
                              resourceName={shippingResourceName}
                              itemCount={shippingRates.length}
                              selectable={false}
                              loading={tableLoading}
                              emptyState={emptyStateMarkup}
                              headings={[
                                { title: 'Internal Name' },
                                { title: 'Rate Name' },
                                { title: 'Default' },
                                { title: 'Price' },
                                { title: 'Countries' },
                                { title: '' },
                              ]}
                            >
                              {shippingRowMarkup}
                            </IndexTable>

                          </Card>
                        </Layout.Section>
                      </Layout>
                    </div>
                  )

                case 1:
                  return (
                    <div className='Shipping-Rates-Table'>
                      <Layout>
                        <Layout.Section fullWidth>
                          <Card sectioned>
                            <IndexTable
                              resourceName={taxResourceName}
                              itemCount={taxZones?.length}
                              selectable={false}
                              loading={tableLoading}
                              emptyState={taxEmptyStateMarkup}
                              headings={[
                                { title: 'Tax Zone Name' },
                                { title: 'Type' },
                                { title: 'Value' },
                                { title: 'Enable' },
                                { title: '' },
                                { title: '' },
                              ]}
                            >
                              {taxRowMarkup}
                            </IndexTable>
                          </Card>
                        </Layout.Section>
                      </Layout>
                    </div>
                  )

                case 2:
                  return (
                    <div className='Shipping-Forms-Tab'>

                    </div>
                  )

                default:
                  break
              }

            })()}
          </Tabs>
        </Page>
      }

      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}

