import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Layout, Card, Modal, Text, Stack, ButtonGroup, Button, PageActions, Form, FormLayout,
    Toast, List, TextContainer, Banner, Loading, Scrollable, Avatar, EmptyState, TextField,
    Listbox, EmptySearchResult, AutoSelection, Tabs, Icon
} from '@shopify/polaris';
import {
    SearchMinor, ChevronDownMinor, ChevronUpMinor,
} from '@shopify/polaris-icons';
import { SkeltonPageForProductDetail, getAccessToken, InputField, CheckBox } from '../../components'
import { AppContext } from '../../components/providers/ContextProvider'
import { useAuthState } from '../../components/providers/AuthProvider'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import dateFormat from "dateformat";

import EmptyCheckBox from '../../assets/icons/EmptyCheckBox.png'
import FillCheckBox from '../../assets/icons/FillCheckBox.png'
import CheckboxTree from 'react-checkbox-tree';

export function DiscountCreate() {
    const { apiUrl } = useContext(AppContext);
    const { user } = useAuthState();
    const navigate = useNavigate();
    const [btnLoading, setBtnLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [discountError, setDiscountError] = useState()
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [discardModal, setDiscardModal] = useState(false)

    let date = new Date();

    const [activeDates, setActiveDates] = useState({
        deleteAfterEndDate: false,
        isEndDate: false,
        startDate: dateFormat(date, "yyyy-mm-dd"),
        startTime: dateFormat(date, "hh:MM"),
        endDate: dateFormat(date, "yyyy-mm-dd"),
        endTime: dateFormat(date, "hh:MM"),
    })

    const disabledStartDate = dateFormat(date, "yyyy-mm-dd")
    const disabledEndDate = dateFormat(activeDates.startDate, "yyyy-mm-dd")


    const [discount, setDiscount] = useState({
        code: '',
        title: '',
        appliesTo: 'all',
        type: 'percentage',
        value: '',
        minimumRequirement: 'none',
        minimumValue: '',
        collections: null,
        products: null,
        variants: null,
        status: '',
    })


    // =================Products Modal Code Start Here================
    const [productsLoading, setProductsLoading] = useState(false)
    const [queryValue, setQueryValue] = useState('');
    const [toggleLoadProducts, setToggleLoadProducts] = useState(true)
    const [productTab, setProductTab] = useState(0);
    const [productsModal, setProductsModal] = useState(false)
    const [expandedProduct, setExpandedProduct] = useState([])
    const [globalProducts, setGlobalProducts] = useState([])
    const [productsList, setProductsList] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [selectedVariantProducts, setSelectedVariantProducts] = useState([])
    const [checkedVariants, setCheckedVariants] = useState([])
    const [previousCheckedVariants, setPreviousCheckedVariants] = useState([])


    const handleProductTabChange = useCallback(
        (selectedTabIndex) => setProductTab(selectedTabIndex),
        [],
    );

    const productModalTabs = [
        {
            id: 'all-products',
            content: 'All products',
        },
        {
            id: 'selected-products',
            content: 'Selected products',
        },
    ];

    const handleSelectProductsModal = () => {
        setProductsModal(true)
    }

    const handleProductsCancelModal = () => {
        setProductsModal(false)
        setCheckedVariants(previousCheckedVariants)
    }

    const handleProductsSaveModal = () => {
        setProductsModal(false)
        setPreviousCheckedVariants(checkedVariants)
    }

    const productsModalClose = () => {
        setProductsModal(false)
        setCheckedVariants([])
        setPreviousCheckedVariants([])
        setProductsLoading(false)
        setToggleLoadProducts(false)
        setProductTab(0)
        setQueryValue('')
        setExpandedProduct([])
        let list = []
        let all = []
        globalProducts?.slice(0, 20).map((item) => {
            list.push(item)
        })
        globalProducts?.slice(0, 20).map((item) => {
            all.push(item)
        })
        setProductsList(list)
        setAllProducts(all)
        setGlobalProducts(all)
        setSelectedVariantProducts([])
    }

    function SetCustomVariantsSelected(checked, type) {
        if (type == 'all') {
            let array1 = []
            checkedVariants?.map((item) => {
                allProducts?.map((item1) => {
                    let value1 = item1.variants.find(item2 => item2.id == item)
                    if (value1) {
                        array1.push(value1.id)
                    }
                })
            })
            let array2 = checkedVariants.filter(function (item) {
                return !array1.includes(item);
            })
            let array3 = checked.concat(array2);
            array3 = [...new Set(array3)];

            setCheckedVariants(array3)
        }
        else if (type == 'selected') {
            setCheckedVariants(checked)
        }
    }

    useEffect(() => {
        // console.log('checkedVariants: ', checkedVariants)
        // console.log('previousCheckedVariants: ', previousCheckedVariants)

        let nodes = groupProductNodes(allProducts)
        setProductsList(nodes)

        let selectedNodes = []
        let products = []
        checkedVariants?.map((item) => {
            globalProducts?.map((item2) => {
                if (item2?.variants?.length > 0) {
                    let value2 = item2.variants.find(item4 => item4.id == item)
                    if (value2) {
                        products.push(item2.id)
                        selectedNodes.push(item2)
                    }
                }
            })
        })

        let filtered = [...new Set(products)];
        if (checkedVariants?.length < 1) {
            setDiscount({
                ...discount,
                variants: null,
                products: null
            })
        }
        else {
            setDiscount({
                ...discount,
                variants: checkedVariants,
                products: filtered
            })
        }





        selectedNodes = selectedNodes.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.id === value.id
            ))
        )
        setSelectedVariantProducts(groupProductNodes(selectedNodes))

    }, [checkedVariants])

    // useEffect(() => {
    //     console.log('productsList: ', productsList)
    //     console.log('globalProducts: ', globalProducts);
    //     console.log('allProducts: ', allProducts)
    //     console.log('selectedVariantProducts: ', selectedVariantProducts)
    // }, [productsList, allProducts, globalProducts, selectedVariantProducts])

    function getSelectedVariantsLength(product) {
        let number = 0
        allProducts?.map((item) => {
            if (item.id == product) {
                item.variants?.map((item2) => {
                    if (checkedVariants?.find(obj => obj == item2.id)) {
                        number = number + 1
                    }
                })
            }
        })
        return number;
    }

    function groupProductNodes(data) {
        let arr = []
        data?.map((item) => {
            let variants = []
            if (item.variants?.length > 0) {
                item.variants?.map((item2) => {
                    variants.push({
                        value: item2.id,
                        label: <>
                            <span>{item2.title}</span>
                            <span>
                                ${item2.price}
                            </span>
                        </>,
                    })
                })
            }
            arr.push({
                value: item.id,
                label: <>
                    <span className='Product-Avatar'>
                        <Avatar
                            size="extraSmall"
                            name={item.title}
                            source={item.image}
                        />
                        <span>{item.title}</span>
                    </span>
                    <span>
                        {`${getSelectedVariantsLength(item.id)}/${item.totalVariants} selected`}
                    </span>
                </>,
                children: variants,
            })
        })

        return arr;
    }

    function variantsArraySet(variants, type) {
        let arr = []
        if (type == 'get') {
            if (variants?.edges?.length > 0) {
                variants?.edges?.map((item) => {
                    arr.push({
                        id: item.node.id.replace('gid://shopify/ProductVariant/', ''),
                        title: item.node.title,
                        price: item.node.price,
                        productId: item.node.product.id.replace('gid://shopify/Product/', ''),
                    })
                })
            }
        }
        else if (type == 'set') {
            if (variants?.length > 0) {
                variants?.map((item) => {
                    arr.push({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        productId: item.product_id,
                    })
                })
            }
        }
        return arr;
    }

    function productsArraySet(products, type, value) {
        let nextValue = ''
        let productsArray = []
        if (type == 'get') {
            products?.edges?.map((item) => {
                nextValue = item.cursor
                productsArray.push({
                    id: item.node.id.replace('gid://shopify/Product/', ''),
                    title: item.node.title,
                    status: item.node.status,
                    totalVariants: item.node.totalVariants,
                    variants: variantsArraySet(item.node.variants, 'get'),
                    image: item.node.featuredImage?.transformedSrc,
                })
            })
            if (value == 'products') {
                return productsArray;
            }
            else if (value == 'nextPage') {
                return nextValue;
            }
        }

        else if (type == 'set') {
            products?.map((item) => {
                productsArray.push({
                    id: item.id.toString(),
                    title: item.title,
                    status: item.status,
                    totalVariants: item.variants?.length ? item.variants?.length : 0,
                    variants: variantsArraySet(item.variants, 'set'),
                    image: item.image?.src,
                })
            })
            if (value == 'products') {
                return productsArray;
            }
        }

    }

    const getProducts = async () => {
        setProductsLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/api/shopify/products?title=${queryValue}&next=${nextPageCursor}&status=`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('getProducts response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                let products = response.data.data.body?.data?.products;

                if (products.edges?.length > 0) {
                    let productsArray = productsArraySet(products, 'get', 'products')
                    let nodes = groupProductNodes(productsArray)

                    let list = [...productsList, ...nodes];
                    let all = [...allProducts, ...productsArray];

                    let ids = new Set(globalProducts.map(d => d.id));
                    let global = [...globalProducts, ...productsArray.filter(d => !ids.has(d.id))];
                    setProductsList(list)
                    setAllProducts(all)
                    setGlobalProducts(global)

                    setNextPageCursor(productsArraySet(products, 'get', 'nextPage'))
                    setHasNextPage(products.pageInfo?.hasNextPage)
                }

            }


            setProductsLoading(false)
            setToggleLoadProducts(false)

        } catch (error) {
            console.warn('getProducts Api Error', error.response);
            setToastMsg('Server Error, Please Reload the page')
            setErrorToast(true)
            setToggleLoadProducts(false)
        }
    }

    useEffect(() => {
        if (toggleLoadProducts) {
            getProducts()
        }
    }, [toggleLoadProducts])

    const handleProductsPagination = () => {
        if (hasNextPage) {
            setProductsLoading(true);
            setToggleLoadProducts(true)
        }
    };

    const LazyLoadingMarkup = productsLoading ? (
        <Listbox.Loading
            accessibilityLabel={`${queryValue ? 'Filtering' : 'Loading'
                } Products`}
        />
    ) : allProducts?.length > 0 && hasNextPage ? <Button onClick={handleProductsPagination}>Load more...</Button> : null;

    const noResultsMarkup =
        !productsLoading && allProducts.length == 0 ? (
            <EmptySearchResult
                title="No product found"
            // description={`No product found`}
            />
        ) : null;


    const listboxMarkup = (
        <div >
            <Listbox
                enableKeyboardControl
                autoSelection={AutoSelection.FirstSelected}
            >
                {LazyLoadingMarkup}
                {noResultsMarkup}
            </Listbox>
        </div>
    );

    const handleQueryChange = (query) => {
        setQueryValue(query);

        setProductsLoading(true)
        setNextPageCursor('')
        setProductsList([])
        setAllProducts([])
        setTimeout(() => {
            setToggleLoadProducts(true)
        }, 500);


    };

    const handleQueryClear = () => {
        handleQueryChange('');
    };

    // =================Products Modal Code Ends Here================


    // =================Collections Modal Code Start Here================
    const [collectionsLoading, setCollectionsLoading] = useState(false)
    const [collectionQueryValue, setCollectionQueryValue] = useState('');
    const [toggleLoadCollections, setToggleLoadCollections] = useState(true)
    const [collectionTab, setCollectionTab] = useState(0);
    const [collectionModal, setCollectionModal] = useState(false)
    const [expandedCollection, setExpandedCollection] = useState([])
    const [globalCollections, setGlobalCollections] = useState([])
    const [collectionsList, setCollectionsList] = useState([])
    const [allCollections, setAllCollections] = useState([])
    const [hasNextPageCollection, setHasNextPageCollection] = useState(false)
    const [nextPageCursorCollection, setNextPageCursorCollection] = useState('')
    const [selectedVariantCollections, setSelectedVariantCollections] = useState([])
    const [checkedVariantsCollections, setCheckedVariantsCollections] = useState([])
    const [previousCheckedVariantsCollections, setPreviousCheckedVariantsCollections] = useState([])


    const handleCollectionTabChange = useCallback(
        (selectedTabIndex) => setCollectionTab(selectedTabIndex),
        [],
    );

    const collectionModalTabs = [
        {
            id: 'all-collections',
            content: 'All Collections',
        },
        {
            id: 'selected-collections',
            content: 'Selected Collections',
        },
    ];

    const handleSelectCollectionsModal = () => {
        setCollectionModal(true)
    }

    const handleCollectionsCancelModal = () => {
        setCollectionModal(false)
        setCheckedVariantsCollections(previousCheckedVariantsCollections)
    }

    const handleCollectionsSaveModal = () => {
        setCollectionModal(false)
        setPreviousCheckedVariantsCollections(checkedVariantsCollections)
    }

    const collectionsModalClose = () => {
        setCollectionModal(false)
        setCheckedVariantsCollections([])
        setPreviousCheckedVariantsCollections([])
        setCollectionsLoading(false)
        setToggleLoadCollections(false)
        setCollectionTab(0)
        setCollectionQueryValue('')
        setExpandedCollection([])
        let list = []
        let all = []
        globalCollections?.slice(0, 20).map((item) => {
            list.push(item)
        })
        globalCollections?.slice(0, 20).map((item) => {
            all.push(item)
        })
        setCollectionsList(list)
        setAllCollections(all)
        setGlobalCollections(all)
        setSelectedVariantCollections([])
    }

    function SetCustomVariantsSelectedCollection(checked, type) {
        if (type == 'all') {
            let array1 = []
            checkedVariantsCollections?.map((item) => {

                let value1 = allCollections.find(item2 => item2.id == item)
                if (value1) {
                    array1.push(value1.id)
                }

            })
            let array2 = checkedVariantsCollections.filter(function (item) {
                return !array1.includes(item);
            })
            let array3 = checked.concat(array2);
            array3 = [...new Set(array3)];

            setCheckedVariantsCollections(array3)
        }
        else if (type == 'selected') {
            setCheckedVariantsCollections(checked)
        }
    }



    useEffect(() => {
        // console.log('checkedVariantsCollections: ', checkedVariantsCollections)
        // console.log('previousCheckedVariantsCollections: ', previousCheckedVariantsCollections)

        let nodes = groupCollectionNodes(allCollections)
        setCollectionsList(nodes)

        let selectedNodes = []
        checkedVariantsCollections?.map((item) => {

            let value2 = globalCollections.find(item4 => item4.id == item)
            if (value2) {
                selectedNodes.push(value2)
            }

        })

        if (checkedVariantsCollections?.length < 1) {
            setDiscount({
                ...discount,
                collections: null,
            })
        }
        else {
            setDiscount({
                ...discount,
                collections: checkedVariantsCollections,
            })
        }




        selectedNodes = selectedNodes.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.id === value.id
            ))
        )
        setSelectedVariantCollections(groupCollectionNodes(selectedNodes))

    }, [checkedVariantsCollections])

    useEffect(() => {
        // console.log('collectionsList: ', collectionsList)
        // console.log('globalCollections: ', globalCollections);
        // console.log('allCollections: ', allCollections)
        // console.log('selectedVariantCollections: ', selectedVariantCollections)
    }, [collectionsList, allCollections, globalCollections, selectedVariantCollections])

    function groupCollectionNodes(data) {
        let arr = []
        data?.map((item) => {
            arr.push({
                value: item.id,
                label: <>
                    <span className='Product-Avatar'>
                        <Avatar
                            size="extraSmall"
                            name={item.title}
                            source={item.image}
                        />
                        <span>{item.title}</span>
                    </span>
                    <span>
                        {`${item.productsCount} products`}
                    </span>
                </>,
                // children: [],
            })
        })

        return arr;
    }

    function CollectionsArraySet(collections, type, value) {
        let nextValue = ''
        let collectionsArray = []
        if (type == 'get') {
            collections?.edges?.map((item) => {
                nextValue = item.cursor
                collectionsArray.push({
                    id: item.node.id.replace('gid://shopify/Collection/', ''),
                    title: item.node.title,
                    productsCount: item.node.productsCount,
                    image: item.node.image?.transformedSrc,
                })
            })
            if (value == 'collection') {
                return collectionsArray;
            }
            else if (value == 'nextPage') {
                return nextValue;
            }
        }

        // else if (type == 'set') {
        //     collections?.map((item) => {
        //         collectionsArray.push({
        //             id: item.id.toString(),
        //             title: item.title,
        //             status: item.status,
        //             totalVariants: item.variants?.length ? item.variants?.length : 0,
        //             variants: variantsArraySetCollection(item.variants, 'set'),
        //             image: item.image?.src,
        //         })
        //     })
        //     if (value == 'collections') {
        //         return collectionsArray;
        //     }
        // }

    }

    const getCollections = async () => {
        setCollectionsLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/api/shopify/collections?title=${collectionQueryValue}&next=${nextPageCursorCollection}`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('getCollections response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                let collections = response.data.data.body?.data?.collections;


                if (collections.edges?.length > 0) {
                    let collectionsArray = CollectionsArraySet(collections, 'get', 'collection')
                    let nodes = groupCollectionNodes(collectionsArray)

                    // console.log('collectionsArray: ', collectionsArray);

                    let list = [...collectionsList, ...nodes];
                    let all = [...allCollections, ...collectionsArray];

                    let ids = new Set(globalCollections.map(d => d.id));
                    let global = [...globalCollections, ...collectionsArray.filter(d => !ids.has(d.id))];
                    setCollectionsList(list)
                    setAllCollections(all)
                    setGlobalCollections(global)

                    setNextPageCursorCollection(CollectionsArraySet(collections, 'get', 'nextPage'))
                    setHasNextPageCollection(collections.pageInfo?.hasNextPageCollection)
                }

            }


            setCollectionsLoading(false)
            setToggleLoadCollections(false)

        } catch (error) {
            console.warn('getCollections Api Error', error.response);
            setToastMsg('Server Error, Please Reload the page')
            setErrorToast(true)
            setToggleLoadCollections(false)
        }
    }

    useEffect(() => {
        if (toggleLoadCollections) {
            getCollections()
        }
    }, [toggleLoadCollections])

    const handleCollectionsPagination = () => {
        if (hasNextPageCollection) {
            setCollectionsLoading(true);
            setToggleLoadCollections(true)
        }
    };

    const LazyLoadingMarkupCollection = collectionsLoading ? (
        <Listbox.Loading
            accessibilityLabel={`${collectionQueryValue ? 'Filtering' : 'Loading'
                } Products`}
        />
    ) : allCollections?.length > 0 && hasNextPageCollection ? <Button onClick={handleCollectionsPagination}>Load more...</Button> : null;

    const noResultsMarkupCollection =
        !collectionsLoading && allCollections.length == 0 ? (
            <EmptySearchResult
                title="No Collection found"
            />
        ) : null;


    const listboxMarkupCollection = (
        <div >
            <Listbox
                enableKeyboardControl
                autoSelection={AutoSelection.FirstSelected}
            >
                {LazyLoadingMarkupCollection}
                {noResultsMarkupCollection}
            </Listbox>
        </div>
    );

    const handleQueryChangeCollection = (query) => {
        setCollectionQueryValue(query);

        setCollectionsLoading(true)
        setNextPageCursorCollection('')
        setCollectionsList([])
        setAllCollections([])
        setTimeout(() => {
            setToggleLoadCollections(true)
        }, 500);


    };

    const handleQueryClearCollection = () => {
        handleQueryChangeCollection('');
    };


    // =================Collections Modal Code Ends Here================



    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;


    const handleDiscount = (e) => {
        setDiscount({ ...discount, [e.target.name]: e.target.value })
    }

    const handleDiscountCheckbox = (e) => {
        // setDiscount({ ...discount, [e.target.name]: e.target.checked })
        if (e.target.name == 'isEndDate') {
            setActiveDates({ ...activeDates, isEndDate: !activeDates.isEndDate })
        }
        else if (e.target.name == 'deleteAfterEndDate') {
            setActiveDates({ ...activeDates, deleteAfterEndDate: !activeDates.deleteAfterEndDate })
        }
    }

    const handleDiscountDates = (e) => {
        setActiveDates({ ...activeDates, [e.target.name]: e.target.value })
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

    const handleDiscardModal = () => {
        setDiscardModal(!discardModal)
    }

    const discardDiscount = () => {
        navigate('/admin/discounts')
    }

    const handleCreateDiscount = () => {
        document.getElementById('createDiscountBtn').click();
    }

    const createDiscount = async () => {
        let startDate = dateFormat(`${activeDates.startDate} ${activeDates.startTime}`, 'yyyy-mm-dd hh:MM:ss');
        let endDate = dateFormat(`${activeDates.endDate} ${activeDates.endTime}`, 'yyyy-mm-dd hh:MM:ss');
        if (!activeDates.isEndDate) {
            endDate = null
        }

        let collections = null;
        let products = null;
        let variants = null;

        if (discount.appliesTo == 'products') {
            products = discount.products.toString();
            variants = discount.variants.toString();
        }
        else if (discount.appliesTo == 'collections') {
            collections = discount.collections.toString();
        }

        let data = {
            title: discount.title,
            code: discount.code,
            type: discount.type,
            value: discount.value,
            minimumRequirement: discount.minimumRequirement,
            minimumValue: discount.minimumValue,
            appliesTo: discount.appliesTo,
            collections: collections,
            products: products,
            variants: variants,
            deleteAfterEndDate: convertBooleanToNumber(activeDates.deleteAfterEndDate),
            startDate: startDate,
            endDate: endDate,
        }

        setBtnLoading((prev) => {
            let toggleId;
            if (prev[1]) {
                toggleId = { [1]: false };
            } else {
                toggleId = { [1]: true };
            }
            return { ...toggleId };
        });

        try {
            const response = await axios.post(`${apiUrl}/api/automatic_discount/store`, data, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('createDiscount response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                setToastMsg('Discount Created Sucessfully')
                setSucessToast(true)
                productsModalClose()
                setLoading(true)

                setTimeout(() => {
                    navigate(`/admin/discounts/${response.data.data.id}`)
                }, 1000);
            }
            setBtnLoading(false)

        } catch (error) {
            console.warn('createDiscount Api Error', error.response);
            if (error.response?.data?.message) {
                setToastMsg(error.response?.data?.message)
            }
            else {
                setToastMsg('Server Error')
            }
            setErrorToast(true)
            setBtnLoading(false)
        }
    }

    const handleCreateDiscountSubmit = (e) => {
        e.preventDefault();
        if (discount.appliesTo == 'all') {
            setDiscountError()
            createDiscount()
        }
        else if (discount.appliesTo == 'products') {
            if (discount.products == null || discount.products == []) {
                setDiscountError('products')
                window.scrollTo(0, 0)
            }
            else {
                createDiscount()
            }
        }
        else if (discount.appliesTo == 'collections') {
            if (discount.collections == null || discount.collections == []) {
                setDiscountError('collections')
                window.scrollTo(0, 0)
            }
            else {
                createDiscount()
            }
        }
    }

    return (
        <div className='Discount-Detail-Page'>

            <Modal
                open={productsModal}
                onClose={handleProductsCancelModal}
                title="Select Products"
                primaryAction={{
                    content: 'Save',
                    onAction: handleProductsSaveModal,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleProductsCancelModal,
                    },
                ]}
            >
                <Modal.Section>
                    <div className='Countries-Modal-Section Products-Modal-Section'>
                        {/* {allProducts?.length > 0 && */}
                        <TextField
                            clearButton
                            placeholder="Search Product"
                            autoComplete="off"
                            value={queryValue}
                            prefix={<Icon source={SearchMinor} />}
                            onChange={handleQueryChange}
                            onClearButtonClick={handleQueryClear}
                            disabled={productTab == 1}
                        />

                        <Tabs tabs={productModalTabs} selected={productTab} onSelect={handleProductTabChange}>
                            {(() => {
                                switch (productTab) {
                                    case 0:
                                        return (
                                            <>
                                                <CheckboxTree
                                                    nodes={productsList}
                                                    checked={checkedVariants}
                                                    expanded={expandedProduct}
                                                    onCheck={checked => SetCustomVariantsSelected(checked, 'all')}
                                                    onExpand={expanded => setExpandedProduct(expanded)}

                                                    icons={{
                                                        check: <img src={FillCheckBox} alt="checkbox" />,
                                                        halfCheck: <span className='Polaris-Icon-Half-Check'><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M14.167 9h-8.334c-.46 0-.833.448-.833 1s.372 1 .833 1h8.334c.46 0 .833-.448.833-1s-.373-1-.833-1"></path> </svg></span>,
                                                        uncheck: <img src={EmptyCheckBox} alt="checkbox" />,
                                                        expandClose: <Icon source={ChevronDownMinor} />,
                                                        expandOpen: <Icon source={ChevronUpMinor} />,
                                                    }}
                                                />
                                                {listboxMarkup}
                                            </>
                                        )

                                    case 1:
                                        return (
                                            <span className='Selected-Tab-Modal'>
                                                <CheckboxTree
                                                    nodes={selectedVariantProducts}
                                                    checked={checkedVariants}
                                                    expanded={expandedProduct}
                                                    onCheck={checked => SetCustomVariantsSelected(checked, 'selected')}
                                                    onExpand={expanded => setExpandedProduct(expanded)}

                                                    icons={{
                                                        check: <img src={FillCheckBox} alt="checkbox" />,
                                                        halfCheck: <span className='Polaris-Icon-Half-Check'><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M14.167 9h-8.334c-.46 0-.833.448-.833 1s.372 1 .833 1h8.334c.46 0 .833-.448.833-1s-.373-1-.833-1"></path> </svg></span>,
                                                        uncheck: <img src={EmptyCheckBox} alt="checkbox" />,
                                                        expandClose: <Icon source={ChevronDownMinor} />,
                                                        expandOpen: <Icon source={ChevronUpMinor} />,
                                                    }}
                                                />
                                                {/* {listboxMarkup} */}
                                            </span>
                                        )

                                    default:
                                        break;
                                }

                            })()}
                        </Tabs>
                    </div>
                </Modal.Section>
            </Modal>

            <Modal
                open={collectionModal}
                onClose={handleCollectionsCancelModal}
                title="Select Collections"
                primaryAction={{
                    content: 'Save',
                    onAction: handleCollectionsSaveModal,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleCollectionsCancelModal,
                    },
                ]}
            >
                <Modal.Section>
                    <div className='Countries-Modal-Section Products-Modal-Section Collections-Modal-Section'>

                        <TextField
                            clearButton
                            placeholder="Search Collection"
                            autoComplete="off"
                            value={collectionQueryValue}
                            prefix={<Icon source={SearchMinor} />}
                            onChange={handleQueryChangeCollection}
                            onClearButtonClick={handleQueryClearCollection}
                            disabled={collectionTab == 1}
                        />

                        <Tabs tabs={collectionModalTabs} selected={collectionTab} onSelect={handleCollectionTabChange}>
                            {(() => {
                                switch (collectionTab) {
                                    case 0:
                                        return (
                                            <>
                                                <CheckboxTree
                                                    nodes={collectionsList}
                                                    checked={checkedVariantsCollections}
                                                    expanded={expandedCollection}
                                                    onCheck={checked => SetCustomVariantsSelectedCollection(checked, 'all')}
                                                    onExpand={expanded => setExpandedCollection(expanded)}

                                                    icons={{
                                                        check: <img src={FillCheckBox} alt="checkbox" />,
                                                        halfCheck: <span className='Polaris-Icon-Half-Check'><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M14.167 9h-8.334c-.46 0-.833.448-.833 1s.372 1 .833 1h8.334c.46 0 .833-.448.833-1s-.373-1-.833-1"></path> </svg></span>,
                                                        uncheck: <img src={EmptyCheckBox} alt="checkbox" />,
                                                        expandClose: <Icon source={ChevronDownMinor} />,
                                                        expandOpen: <Icon source={ChevronUpMinor} />,
                                                    }}
                                                />
                                                {listboxMarkupCollection}
                                            </>
                                        )

                                    case 1:
                                        return (
                                            <span className='Selected-Tab-Modal'>
                                                <CheckboxTree
                                                    nodes={selectedVariantCollections}
                                                    checked={checkedVariantsCollections}
                                                    expanded={expandedCollection}
                                                    onCheck={checked => SetCustomVariantsSelectedCollection(checked, 'selected')}
                                                    onExpand={expanded => setExpandedCollection(expanded)}

                                                    icons={{
                                                        check: <img src={FillCheckBox} alt="checkbox" />,
                                                        halfCheck: <span className='Polaris-Icon-Half-Check'><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M14.167 9h-8.334c-.46 0-.833.448-.833 1s.372 1 .833 1h8.334c.46 0 .833-.448.833-1s-.373-1-.833-1"></path> </svg></span>,
                                                        uncheck: <img src={EmptyCheckBox} alt="checkbox" />,
                                                        expandClose: <Icon source={ChevronDownMinor} />,
                                                        expandOpen: <Icon source={ChevronUpMinor} />,
                                                    }}
                                                />
                                                {/* {listboxMarkup} */}
                                            </span>
                                        )

                                    default:
                                        break;
                                }

                            })()}
                        </Tabs>
                    </div>
                </Modal.Section>
            </Modal>

            <Modal
                open={discardModal}
                onClose={handleDiscardModal}
                title="Leave page with unsaved changes?"
                primaryAction={{
                    content: 'Leave page',
                    destructive: true,
                    onAction: discardDiscount,
                }}
                secondaryActions={[
                    {
                        content: 'Stay',
                        onAction: handleDiscardModal,
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <p>
                            Leaving this page will delete all unsaved changes.
                        </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>

            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForProductDetail />
                </span>
                :
                <Page
                    breadcrumbs={[{ content: 'Discounts', onAction: handleDiscardModal }]}
                    title="Create new discount"
                    primaryAction={
                        {
                            content: 'Save discount',
                            onAction: handleCreateDiscount,
                            loading: btnLoading[1]
                        }
                    }
                >
                    {discountError ?
                        <Banner
                            title="There is 1 error with this discount:"
                            status="critical"
                        >
                            <List>
                                <List.Item>
                                    Specific {discountError} must be added
                                </List.Item>
                            </List>
                        </Banner> : ''
                    }

                    <Layout>
                        <Layout.Section>
                            <Form onSubmit={handleCreateDiscountSubmit}>
                                <FormLayout>
                                    <span className='VisuallyHidden'>
                                        <Button submit id='createDiscountBtn'>Submit</Button>
                                    </span>

                                    <Card sectioned title='Automatic discount'>
                                        <Text variant="bodyMd" as="p" fontWeight="regular">
                                            {`Customers will see this at the checkout page.
                                For the discount to appear in the shopping cart, duplicate it in Shopify. `}
                                            <a href="https://help.checkify.pro/en/articles/5463278-autodiscounts"
                                                target="_blank" rel="noopener noreferrer"
                                                style={{ color: '-webkit-link', textDecoration: 'underline' }}
                                            >
                                                {'Read more'}
                                            </a>
                                        </Text>

                                        <InputField
                                            label='Code'
                                            placeholder='e.g. SALE'
                                            type='text'
                                            marginTop
                                            required
                                            name='code'
                                            value={discount.code}
                                            onChange={handleDiscount}
                                        />

                                        <InputField
                                            label='Title (optional)'
                                            placeholder='e.g. Friday Sale'
                                            type='text'
                                            marginTop
                                            name='title'
                                            value={discount.title}
                                            onChange={handleDiscount}
                                            helpText='*Title will be displayed as a discount name in the general list (visible for you only).'
                                        />
                                    </Card>

                                    <Card sectioned title='Type'>
                                        <div className='Type-Section'>
                                            <Stack>
                                                <ButtonGroup segmented>
                                                    <Button
                                                        pressed={discount.type == 'percentage'}
                                                        onClick={() => setDiscount({ ...discount, type: 'percentage' })}
                                                    >
                                                        Percentage
                                                    </Button>

                                                    <Button
                                                        pressed={discount.type == 'fixed'}
                                                        onClick={() => setDiscount({ ...discount, type: 'fixed' })}
                                                    >
                                                        Fixed Amount
                                                    </Button>
                                                </ButtonGroup>

                                                <InputField
                                                    placeholder={discount.type == 'fixed' && '0.00'}
                                                    name='value'
                                                    type='number'
                                                    required
                                                    prefix={discount.type == 'fixed' && `${user?.currency_symbol}`}
                                                    suffix={discount.type == 'percentage' && '%'}
                                                    value={discount.value}
                                                    onChange={handleDiscount}
                                                />
                                            </Stack>
                                        </div>
                                    </Card>

                                    <Card sectioned title='Minimum purchase requirements'>
                                        <div className='Requirements-Section'>
                                            <CheckBox
                                                name='minimumRequirement'
                                                value='none'
                                                checked={discount.minimumRequirement == 'none' && true}
                                                onChange={handleDiscount}
                                                label='No minimum requirements'
                                            />

                                            <CheckBox
                                                name='minimumRequirement'
                                                value='amount'
                                                checked={discount.minimumRequirement == 'amount' && true}
                                                onChange={handleDiscount}
                                                label={`Minimum purchase amount (${user?.currency})`}
                                            />

                                            {discount.minimumRequirement == 'amount' &&
                                                <InputField
                                                    placeholder='0.00'
                                                    name='minimumValue'
                                                    type='number'
                                                    helpText='Applies to all products.'
                                                    required
                                                    prefix='$'
                                                    value={discount.minimumValue}
                                                    onChange={handleDiscount}
                                                />
                                            }

                                            <CheckBox
                                                name='minimumRequirement'
                                                value='quantity'
                                                checked={discount.minimumRequirement == 'quantity' && true}
                                                onChange={handleDiscount}
                                                label='Minimum quantity of items'
                                            />

                                            {discount.minimumRequirement == 'quantity' &&
                                                <InputField
                                                    name='minimumValue'
                                                    type='number'
                                                    helpText='Applies to all products.'
                                                    required
                                                    value={discount.minimumValue}
                                                    onChange={handleDiscount}
                                                />
                                            }
                                        </div>
                                    </Card>

                                    <Card sectioned title='Applies to'>
                                        <div className='AppliesTo-Section'>
                                            <CheckBox
                                                name='appliesTo'
                                                value='all'
                                                checked={discount.appliesTo == 'all' && true}
                                                onChange={handleDiscount}
                                                label='All products'
                                            />

                                            <CheckBox
                                                name='appliesTo'
                                                value='products'
                                                checked={discount.appliesTo == 'products' && true}
                                                onChange={handleDiscount}
                                                label='Specific products'
                                            />

                                            <CheckBox
                                                name='appliesTo'
                                                value='collections'
                                                checked={discount.appliesTo == 'collections' && true}
                                                onChange={handleDiscount}
                                                label='Specific collections'
                                            />

                                        </div>

                                        <br />


                                        <div className='Products-Section'>
                                            {discount.appliesTo == 'products' &&
                                                <span>
                                                    {checkedVariants?.length < 1 ?
                                                        <Card sectioned subdued>
                                                            <Stack>
                                                                <Text variant="bodyMd" as="p" fontWeight="regular">
                                                                    No product selected
                                                                </Text>
                                                                <Button primary onClick={handleSelectProductsModal}>Select products</Button>
                                                            </Stack>
                                                        </Card>
                                                        :
                                                        <Card sectioned subdued>
                                                            <Stack>
                                                                <Text variant="bodyMd" as="p" fontWeight="medium">
                                                                    {discount.variants?.length} Variants (of {discount.products?.length} Product) selected
                                                                </Text>
                                                                <Button primary onClick={handleSelectProductsModal}>Select products</Button>
                                                            </Stack>
                                                        </Card>
                                                    }
                                                </span>
                                            }
                                        </div>

                                        <div className='Products-Section'>
                                            {discount.appliesTo == 'collections' &&
                                                <span>
                                                    {checkedVariantsCollections?.length < 1 ?
                                                        <Card sectioned subdued>
                                                            <Stack>
                                                                <Text variant="bodyMd" as="p" fontWeight="regular">
                                                                    No collection selected
                                                                </Text>
                                                                <Button primary onClick={handleSelectCollectionsModal}>Select collections</Button>
                                                            </Stack>
                                                        </Card>
                                                        :
                                                        <Card sectioned subdued>
                                                            <Stack>
                                                                <Text variant="bodyMd" as="p" fontWeight="medium">
                                                                    {discount.collections?.length} selected
                                                                </Text>
                                                                <Button primary onClick={handleSelectCollectionsModal}>Select collections</Button>
                                                            </Stack>
                                                        </Card>
                                                    }
                                                </span>
                                            }
                                        </div>
                                    </Card>

                                    <Card sectioned title='Active dates'>
                                        <div className='Dates-Section'>
                                            <Stack>
                                                <InputField
                                                    type='date'
                                                    label='Start date'
                                                    name='startDate'
                                                    min={disabledStartDate}
                                                    required
                                                    value={activeDates.startDate}
                                                    onChange={handleDiscountDates}
                                                />
                                                <InputField
                                                    type='time'
                                                    label='Start time'
                                                    name='startTime'
                                                    required
                                                    value={activeDates.startTime}
                                                    onChange={handleDiscountDates}
                                                />
                                            </Stack>

                                            <CheckBox
                                                marginTop
                                                marginBottom
                                                name='isEndDate'
                                                checked={activeDates.isEndDate}
                                                onChange={handleDiscountCheckbox}
                                                label='Set end date'
                                            />

                                            {activeDates.isEndDate &&
                                                <Stack>
                                                    <InputField
                                                        type='date'
                                                        label='End date'
                                                        name='endDate'
                                                        min={disabledEndDate}
                                                        value={activeDates.endDate}
                                                        onChange={handleDiscountDates}
                                                    />
                                                    <InputField
                                                        type='time'
                                                        label='End time'
                                                        name='endTime'
                                                        value={activeDates.endTime}
                                                        onChange={handleDiscountDates}
                                                    />
                                                </Stack>
                                            }

                                            {/* {activeDates.isEndDate &&
                                                <CheckBox
                                                    name='deleteAfterEndDate'
                                                    marginTop
                                                    checked={activeDates.deleteAfterEndDate}
                                                    onChange={handleDiscountCheckbox}
                                                    label='Delete discount after end date'
                                                />
                                            } */}
                                        </div>
                                    </Card>

                                </FormLayout>
                            </Form>
                        </Layout.Section>

                        <Layout.Section oneThird>
                            <div className='Discount-Summary'>
                                <Card subdued title='Summary'>
                                    <Card.Section>
                                        {discount.title &&
                                            <Text variant="bodyMd" as="p" fontWeight="semibold">
                                                Title: {discount.title}
                                            </Text>
                                        }
                                        {discount.code ?
                                            <Text variant="bodyMd" as="p" fontWeight="semibold">
                                                Code: {discount.code}
                                            </Text>
                                            :
                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                No discount code yet.
                                            </Text>
                                        }

                                        <List type="bullet">
                                            {discount.value ?
                                                discount.type == 'fixed' ?
                                                    <List.Item>{user?.currency_symbol} {discount.value} off</List.Item> :
                                                    <List.Item>{discount.value}% off all products</List.Item> : ''
                                            }

                                            {discount.minimumRequirement == 'amount' && discount.minimumValue ?
                                                <List.Item>Minimum purchase of ${discount.minimumValue}</List.Item> : ''
                                            }

                                            {discount.minimumRequirement == 'quantity' && discount.minimumValue ?
                                                <List.Item>Minimum quantity of {discount.minimumValue}</List.Item> : ''
                                            }

                                            {discount.appliesTo == 'all' ?
                                                <List.Item>Applies to all products</List.Item> : ''
                                            }

                                            {discount.appliesTo == 'products' ?
                                                <List.Item>Applies to specific products</List.Item> : ''
                                            }

                                            {discount.appliesTo == 'collections' ?
                                                <List.Item> Applies to specific collections</List.Item> : ''
                                            }

                                            <List.Item>Active from {dateFormat(activeDates.startDate, "dd/mm/yyyy")}</List.Item>

                                            {activeDates.isEndDate &&
                                                <List.Item>End at {dateFormat(activeDates.endDate, "dd/mm/yyyy")}</List.Item>
                                            }

                                        </List>
                                    </Card.Section>

                                    <Card.Section title='Performance'>
                                        <Text variant="bodyMd" as="p" color="subdued">
                                            Discount is not active yet.
                                        </Text>
                                    </Card.Section>
                                </Card>
                            </div>

                            <Card sectioned subdued title='Important'>
                                <List>
                                    <List.Item>Customers can't combine discounts at checkout</List.Item>
                                    <List.Item>Customers will be able to override the automatic discount with their discount code.</List.Item>
                                    <List.Item>If two automatic discounts are applied to the order, the most favorable for the buyer will be displayed.</List.Item>

                                    <br />
                                    <a href="https://help.checkify.pro/en/articles/5463278-autodiscount" target="_blank" rel="noopener noreferrer">
                                        <Button>
                                            Helpdesk
                                        </Button>
                                    </a>
                                </List>
                            </Card>

                        </Layout.Section>

                    </Layout>

                    <div className='Polaris-Product-Actions'>
                        <PageActions
                            primaryAction={{
                                content: 'Save discount',
                                onAction: handleCreateDiscount,
                                loading: btnLoading[1]
                            }}
                            secondaryActions={[
                                {
                                    content: 'Discard',
                                    onAction: handleDiscardModal,
                                },
                            ]}
                        />
                    </div>
                </Page >
            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}
