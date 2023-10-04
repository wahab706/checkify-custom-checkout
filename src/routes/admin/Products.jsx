import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Card, Tabs, Link, TextField, IndexTable, Loading, Icon, Text, Avatar, Pagination,
    Badge, EmptySearchResult, Toast, Tooltip
} from '@shopify/polaris';
import { SearchMinor, ViewMinor } from '@shopify/polaris-icons';
import { AppContext } from '../../components/providers/ContextProvider'
import { SkeltonPageForTable, getAccessToken, CustomBadge, NotifyBanner } from '../../components'
import axios from "axios"


export function Products() {
    const { apiUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true)
    const [productsLoading, setProductsLoading] = useState(false)
    const [selected, setSelected] = useState(0);
    const [queryValue, setQueryValue] = useState('');
    const [toggleLoadData, setToggleLoadData] = useState(true)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [storeUrl, setStoreUrl] = useState('')

    const [products, setProducts] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)
    const [pageCursor, setPageCursor] = useState('next')
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [previousPageCursor, setPreviousPageCursor] = useState('')
    const [pageCursorValue, setPageCursorValue] = useState('')
    const [productStatus, setProductStatus] = useState('')


    // ---------------------Tabs Code Start Here----------------------

    const handleTabChange = (selectedTabIndex) => {
        if (selected != selectedTabIndex) {
            setSelected(selectedTabIndex)
            if (selectedTabIndex == 0) {
                setProductStatus('')
            }
            else if (selectedTabIndex == 1) {
                setProductStatus('ACTIVE')
            }
            else if (selectedTabIndex == 2) {
                setProductStatus('DRAFT')
            }
            else if (selectedTabIndex == 3) {
                setProductStatus('ARCHIVED')
            }
            setPageCursorValue('')
            setProductsLoading(true)
            setToggleLoadData(true)
        }
    }

    const tabs = [
        {
            id: 'all-products',
            content: 'All',
            accessibilityLabel: 'All products',
            panelID: 'all-products-content',
        },
        {
            id: 'active-products',
            content: 'Active',
            panelID: 'active-products-content',
        },
        {
            id: 'draft-products',
            content: 'Draft',
            panelID: 'draft-products-content',
        },
        {
            id: 'archived-products',
            content: 'Archived',
            panelID: 'archived-products-content',
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
        setQueryValue('')
        setPageCursorValue('')
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
        setProductsLoading(true)
        setToggleLoadData(true)
    }


    // ---------------------Index Table Code Start Here----------------------


    const resourceName = {
        singular: 'product',
        plural: 'products',
    };


    const rowMarkup = products.map(
        ({ id, title, handle, image, status, totalInventory, productType, vendor, totalVariants }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                position={index}
            >

                <IndexTable.Cell className='Polaris-IndexTable-Image'>
                    <Avatar size="small" shape="square" name={title} source={image} />
                </IndexTable.Cell>

                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>
                    <div>
                        <a href={`https://${storeUrl}/admin/products/${id}`} target="_blank" rel="noopener noreferrer">
                            <Text variant="bodyMd" fontWeight="semibold" as="span">
                                {title}
                            </Text>
                        </a>
                        <span className='Preview-Link'>
                            <a href={`https://${storeUrl}/products/${handle}`} target="_blank" rel="noopener noreferrer">
                                <Tooltip
                                    content="Preview on Online Store"
                                    preferredPosition='below'
                                    dismissOnMouseOut
                                >
                                    <Icon source={ViewMinor}></Icon>
                                </Tooltip>
                            </a>
                        </span>
                    </div>
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <CustomBadge value={status} type='products' />
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {totalInventory != null ?
                        <Text variant="bodyMd" as="p" fontWeight="regular">
                            <Text variant="bodyMd" as="span" fontWeight="regular" color={totalInventory < 1 && 'critical'}>
                                {totalInventory}
                            </Text>
                            {' '} in stock
                            {totalVariants > 0 &&
                                ` for ${totalVariants} variants `
                            }
                        </Text>
                        :
                        <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                            Inventory not tracked
                        </Text>
                    }
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {productType ? productType : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {vendor ? vendor : '---'}
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No Products Found'}
            withIllustration
        />
    );

    const handleClearStates = () => {
        setProducts([])
        setPageCursor('next')
        setPageCursorValue('')
        setHasNextPage(false)
        setHasPreviousPage(false)
    }

    // ---------------------Api Code starts Here----------------------
    const getProducts = async () => {
        setProductsLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/api/shopify/products?title=${queryValue}&${pageCursor}=${pageCursorValue}&status=${productStatus}`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('getProducts response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                let products = response.data.data.body?.data?.products;
                let productsArray = []
                let nextValue = ''

                if (products.edges?.length > 0) {
                    let previousValue = products.edges[0]?.cursor;
                    products.edges.map((item) => {
                        nextValue = item.cursor
                        productsArray.push({
                            id: item.node.id.replace('gid://shopify/Product/', ''),
                            title: item.node.title,
                            handle: item.node.handle,
                            status: item.node.status,
                            vendor: item.node.vendor,
                            productType: item.node.productType,
                            totalInventory: item.node.totalInventory,
                            totalVariants: item.node.totalVariants,
                            image: item.node.featuredImage?.transformedSrc,
                        })
                    })

                    setProducts(productsArray)
                    setPageCursorValue('')
                    setNextPageCursor(nextValue)
                    setPreviousPageCursor(previousValue)
                    setHasNextPage(products.pageInfo?.hasNextPage)
                    setHasPreviousPage(products.pageInfo?.hasPreviousPage)
                }
                else {
                    handleClearStates()
                }

                setStoreUrl(response.data.user?.shopifyShopDomainName)
            }


            setLoading(false)
            setProductsLoading(false)
            setToggleLoadData(false)


        } catch (error) {
            console.warn('getProducts Api Error', error.response);
            setLoading(false)
            setToastMsg('Server Error')
            setErrorToast(true)
            setToggleLoadData(false)
            handleClearStates()

        }
    }

    useEffect(() => {
        if (toggleLoadData) {
            getProducts()
        }
    }, [toggleLoadData])





    return (
        <div className='Products-Page IndexTable-Page'>
            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForTable />
                </span> :

                <Page
                    fullWidth
                    title="Products"
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
                                                placeholder='Search Product'
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
                                        itemCount={products.length}
                                        hasMoreItems
                                        selectable={false}
                                        loading={productsLoading}
                                        emptyState={emptyStateMarkup}
                                        headings={[
                                            { title: '' },
                                            { title: 'Product' },
                                            { title: 'Status' },
                                            { title: 'Inventory' },
                                            { title: 'Type' },
                                            { title: 'Vendor', hidden: false },
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

