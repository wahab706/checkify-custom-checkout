import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Card, Tabs, Link, TextField, IndexTable, Loading, Icon, Text, Avatar, Pagination,
    Badge, EmptySearchResult, Toast, Tooltip
} from '@shopify/polaris';
import { SearchMinor, ExternalMinor } from '@shopify/polaris-icons';
import { AppContext } from '../../components/providers/ContextProvider'
import { SkeltonPageForTable, getAccessToken, CustomBadge, NotifyBanner } from '../../components'
import axios from "axios"
import dateFormat from "dateformat";



export function Orders() {
    const { apiUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true)
    const [ordersLoading, setOrdersLoading] = useState(false)
    const [selected, setSelected] = useState(0);
    const [queryValue, setQueryValue] = useState('');
    const [toggleLoadData, setToggleLoadData] = useState(true)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [storeUrl, setStoreUrl] = useState('')

    const [orders, setOrders] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)
    const [pageCursor, setPageCursor] = useState('next')
    const [pageCursorValue, setPageCursorValue] = useState('')
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [previousPageCursor, setPreviousPageCursor] = useState('')
    const [orderStatus, setOrderStatus] = useState('')




    // ---------------------Tabs Code Start Here----------------------

    const handleTabChange = (selectedTabIndex) => {
        if (selected != selectedTabIndex) {
            setSelected(selectedTabIndex)
            if (selectedTabIndex == 0) {
                setOrderStatus('')
            }
            else if (selectedTabIndex == 1) {
                setOrderStatus('unfulfilled')
            }
            else if (selectedTabIndex == 2) {
                setOrderStatus('unpaid')
            }
            else if (selectedTabIndex == 3) {
                setOrderStatus('open')
            }
            else if (selectedTabIndex == 4) {
                setOrderStatus('closed')
            }
            setPageCursorValue('')
            setOrdersLoading(true)
            setToggleLoadData(true)
        }
    }

    const tabs = [
        {
            id: 'all-orders',
            content: 'All',
            accessibilityLabel: 'All orders',
            panelID: 'all-orders-content',
        },
        {
            id: 'active-orders',
            content: 'Unfulfilled',
            panelID: 'active-orders-content',
        },
        {
            id: 'draft-orders',
            content: 'Unpaid',
            panelID: 'draft-orders-content',
        },
        {
            id: 'open-orders',
            content: 'Open',
            panelID: 'open-orders-content',
        },
        {
            id: 'closed-orders',
            content: 'Closed',
            panelID: 'closed-orders-content',
        },
    ];



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
        setOrdersLoading(true)
        setToggleLoadData(true)
    }

    // ---------------------Index Table Code Start Here----------------------


    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };


    const rowMarkup = orders?.map(
        ({ id, name, date, customerFName, customerLName, quantity, paymentStatus, fulfillmentStatus, deliveryMethod }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                position={index}
            >
                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>
                    <a href={`https://${storeUrl}/admin/orders/${id}`} target="_blank" rel="noopener noreferrer">
                        <Text variant="bodyMd" fontWeight="semibold" as="span">
                            {name} <Icon source={ExternalMinor} color='subdued'></Icon>
                        </Text>
                    </a>
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {dateFormat(date, "dddd, mmm dd, yyyy")}
                </IndexTable.Cell>

                <IndexTable.Cell className='Capitalize-Cell'>
                    {customerFName != null ? `${customerFName} ${customerLName}` : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <CustomBadge value={paymentStatus} type='orders' variant='financial' />
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <CustomBadge value={fulfillmentStatus} type='orders' variant='fulfillment' />
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {quantity ?
                        quantity < 2 ? `${quantity} item` : `${quantity} items`
                        : '---'
                    }
                </IndexTable.Cell>

                <IndexTable.Cell className='Capitalize-Cell'>
                    {deliveryMethod != null ? deliveryMethod : '---'}
                </IndexTable.Cell>

            </IndexTable.Row>
        ),
    );

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No Orders Found'}
            withIllustration
        />
    );


    const handleClearStates = () => {
        setOrders([])
        setPageCursorValue('')
        setNextPageCursor('')
        setPreviousPageCursor('')
    }

    // ---------------------Api Code starts Here----------------------

    const getOrders = async () => {
        setOrdersLoading(true)
        try {

            const response = await axios.get(`${apiUrl}/api/shopify/order?title=${queryValue}&${pageCursor}=${pageCursorValue}&status=${orderStatus}`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('getOrders response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                let orders = response.data.data.body?.data?.orders;
                let ordersArray = []
                let nextValue = ''

                if (orders?.edges?.length > 0) {
                    let previousValue = orders.edges[0]?.cursor;
                    orders?.edges?.map((item) => {
                        nextValue = item.cursor
                        ordersArray.push({
                            id: item.node.id.replace('gid://shopify/Order/', ''),
                            name: item.node.name,
                            date: item.node.processedAt,
                            quantity: item.node.currentSubtotalLineItemsQuantity,
                            paymentStatus: item.node.displayFinancialStatus,
                            fulfillmentStatus: item.node.displayFulfillmentStatus,
                            deliveryMethod: item.node.shippingLine?.title,
                            customerFName: item.node.customer?.firstName,
                            customerLName: item.node.customer?.lastName,
                        })
                    })


                    setOrders(ordersArray)
                    setPageCursorValue('')
                    setNextPageCursor(nextValue)
                    setPreviousPageCursor(previousValue)
                    setHasNextPage(orders.pageInfo?.hasNextPage)
                    setHasPreviousPage(orders.pageInfo?.hasPreviousPage)
                }
                else {
                    handleClearStates()
                }
                setStoreUrl(response.data.user?.shopifyShopDomainName)
            }


            setLoading(false)
            setOrdersLoading(false)
            setToggleLoadData(false)


        } catch (error) {
            console.warn('getOrders Api Error', error.response);
            setLoading(false)
            // setOrdersLoading(false)
            setToastMsg('Server Error')
            setToggleLoadData(false)
            setErrorToast(true)
            handleClearStates()
        }
    }

    useEffect(() => {
        if (toggleLoadData) {
            getOrders()
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
                    title="Orders"
                >
   <NotifyBanner/>
                    <Card>
                        <Tabs
                            tabs={tabs}
                            selected={selected}
                            onSelect={handleTabChange}
                            disclosureText="More views"
                        >
                            <div className='Polaris-Table'>
                                <Card.Section>
                                    <div style={{ padding: '16px', display: 'flex' }}>
                                        <div style={{ flex: 1 }}>
                                            <TextField
                                                placeholder='Search Order'
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
                                        itemCount={orders.length}
                                        hasMoreItems
                                        selectable={false}
                                        loading={ordersLoading}
                                        emptyState={emptyStateMarkup}
                                        headings={[
                                            { title: 'Order' },
                                            { title: 'Date' },
                                            { title: 'Customer' },
                                            { title: 'Payment Status' },
                                            { title: 'Fulfillment Status' },
                                            { title: 'Items' },
                                            { title: 'Delivery Method' },
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
                        </Tabs>
                    </Card>
                </Page>

            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}

