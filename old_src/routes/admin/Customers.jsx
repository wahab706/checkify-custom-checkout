import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Card, Tabs, Link, TextField, IndexTable, Loading, Icon, Text, Avatar, Pagination,
    Badge, EmptySearchResult, Toast, Tooltip
} from '@shopify/polaris';
import { SearchMinor, ExternalMinor } from '@shopify/polaris-icons';
import { AppContext } from '../../components/providers/ContextProvider'
import { SkeltonPageForTable, getAccessToken, CustomBadge } from '../../components'
import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios"
import dateFormat from "dateformat";



export function Customers() {
    const { apiUrl } = useContext(AppContext);
    const { user } = useAuthState();
    const [loading, setLoading] = useState(true)
    const [customersLoading, setCustomersLoading] = useState(false)
    const [selected, setSelected] = useState(0);
    const [queryValue, setQueryValue] = useState('');
    const [toggleLoadData, setToggleLoadData] = useState(true)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [storeUrl, setStoreUrl] = useState('')

    const [customers, setCustomers] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)
    const [pageCursor, setPageCursor] = useState('next')
    const [pageCursorValue, setPageCursorValue] = useState('')
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [previousPageCursor, setPreviousPageCursor] = useState('')
    const [orderStatus, setOrderStatus] = useState('')




    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;


    // ---------------------Tag/Filter Code Start Here----------------------
    const handleQueryValueRemove = () => {
        setPageCursorValue('')
        setQueryValue('')
        setToggleLoadData(true)
    }
    const handleFiltersQueryChange = (value) => {
        setPageCursorValue('')
        setQueryValue(value)
        setTimeout(() => {
            setToggleLoadData(true)
        }, 1000);
    }

    const handlePagination = (value) => {
        if (value == 'next') {
            setPageCursorValue(nextPageCursor)
        }
        else {
            setPageCursorValue(previousPageCursor)
        }
        setPageCursor(value)
        setToggleLoadData(true)
    }

    // ---------------------Index Table Code Start Here----------------------


    const resourceName = {
        singular: 'Customer',
        plural: 'Customers',
    };


    const rowMarkup = customers?.map(
        ({ id, name, email, ordersCount, totalSpent, address }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                position={index}
            >
                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>
                    <a href={`https://${storeUrl}/admin/customers/${id}`} target="_blank" rel="noopener noreferrer">
                        <Text variant="bodyMd" fontWeight="semibold" as="span">
                            {name} <Icon source={ExternalMinor} color='subdued'></Icon>
                        </Text>
                    </a>
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {email != null ? email : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell className='Capitalize-Cell'>
                    {address != null ? address : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {ordersCount != null ? ordersCount >= 2 ? `${ordersCount} orders` : `${ordersCount} order` : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {totalSpent != null ? `${user?.currency_symbol} ${Number(totalSpent).toFixed(2)}` : '---'}
                </IndexTable.Cell>

            </IndexTable.Row>
        ),
    );

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No Customers Found'}
            withIllustration
        />
    );


    const handleClearStates = () => {
        setCustomers([])
        setPageCursorValue('')
        setNextPageCursor('')
        setPreviousPageCursor('')
    }

    // ---------------------Api Code starts Here----------------------

    const getCustomers = async () => {
        setCustomersLoading(true)
        try {

            const response = await axios.get(`${apiUrl}/api/shopify/customers?title=${queryValue}&${pageCursor}=${pageCursorValue}`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('getCustomers response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                let customers = response.data.data.body?.data?.customers;
                let customersArray = []
                let nextValue = ''

                if (customers?.edges?.length > 0) {
                    let previousValue = customers.edges[0]?.cursor;
                    customers?.edges?.map((item) => {
                        nextValue = item.cursor
                        customersArray.push({
                            id: item.node.id.replace('gid://shopify/Customer/', ''),
                            name: item.node.displayName,
                            email: item.node.email,
                            ordersCount: item.node.ordersCount,
                            totalSpent: item.node.totalSpent,
                            address: item.node.defaultAddress?.formattedArea,
                        })
                    })


                    setCustomers(customersArray)
                    setPageCursorValue('')
                    setNextPageCursor(nextValue)
                    setPreviousPageCursor(previousValue)
                    setHasNextPage(customers.pageInfo?.hasNextPage)
                    setHasPreviousPage(customers.pageInfo?.hasPreviousPage)
                }
                else {
                    handleClearStates()
                }
                setStoreUrl(response.data.user?.shopifyShopDomainName)
            }


            setLoading(false)
            setCustomersLoading(false)
            setToggleLoadData(false)


        } catch (error) {
            console.warn('getCustomers Api Error', error.response);
            setLoading(false)
            // setCustomersLoading(false)
            setToastMsg('Server Error')
            setToggleLoadData(false)
            setErrorToast(true)
            handleClearStates()
        }
    }

    useEffect(() => {
        if (toggleLoadData) {
            getCustomers()
        }
    }, [toggleLoadData])



    return (
        <div className='Products-Page IndexTable-Page Orders-page'>
            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForTable />
                </span> :

                <Page
                    fullWidth
                    title="Customers"
                >

                    <Card>
                        <div className='Polaris-Table'>
                            <Card.Section>
                                <div style={{ padding: '16px', display: 'flex' }}>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            placeholder='Search Customer'
                                            value={queryValue}
                                            onChange={handleFiltersQueryChange}
                                            clearButton
                                            onClearButtonClick={handleQueryValueRemove}
                                            autoComplete="off"
                                            prefix={<Icon source={SearchMinor} />}
                                        />
                                    </div>
                                </div>

                                <IndexTable
                                    resourceName={resourceName}
                                    itemCount={customers.length}
                                    hasMoreItems
                                    selectable={false}
                                    loading={customersLoading}
                                    emptyState={emptyStateMarkup}
                                    headings={[
                                        { title: 'Customer name' },
                                        { title: 'Email' },
                                        { title: 'Location' },
                                        { title: 'Orders' },
                                        { title: 'Amount spent' },
                                    ]}
                                >
                                    {rowMarkup}
                                </IndexTable>

                            </Card.Section>


                            <Card.Section>
                                <div className='data-table-pagination'>

                                    <Pagination
                                        hasPrevious={hasPreviousPage ? true : false}
                                        onPrevious={() => handlePagination('prev')}
                                        hasNext={hasNextPage ? true : false}
                                        onNext={() => handlePagination('next')}
                                    />
                                </div>
                            </Card.Section>

                        </div>
                    </Card>
                </Page>

            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}

