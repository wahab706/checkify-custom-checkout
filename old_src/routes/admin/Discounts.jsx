import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
    Page, Card, Tabs, Modal, EmptySearchResult, IndexTable, Icon, Text, ButtonGroup, Button, Stack,
    Toast, TextContainer, Loading
} from '@shopify/polaris';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalMinor, DeleteMinor, } from '@shopify/polaris-icons';
import {
    SkeltonPageForTable, getAccessToken, CheckBox, CustomBadge
} from '../../components'
import { AppContext } from '../../components/providers/ContextProvider'
import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios";
import dateFormat from "dateformat";


export function Discounts() {
    const { apiUrl } = useContext(AppContext);
    const { user } = useAuthState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [tabLoading, setTabLoading] = useState(false)
    const [toggleLoadData, setToggleLoadData] = useState(true)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [deleteDiscountId, setDeleteDiscountId] = useState('')
    const [discountDeleteModal, setDiscountDeleteModal] = useState(false)

    const [allDiscounts, setAllDiscounts] = useState([])
    const [filteredDiscounts, setFilteredDiscounts] = useState([])
    const [selectedTab, setSelectedTab] = useState(0)


    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;

    const handleDiscountDeleteModal = () => {
        setDiscountDeleteModal(!discountDeleteModal)
        setDeleteDiscountId()
    }

    const handleDeleteDiscount = (id) => {
        setDeleteDiscountId(id)
        setDiscountDeleteModal(true)
    }

    // ---------------------Tabs Code Start Here----------------------
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
            content: 'Scheduled',
            panelID: 'draft-products-content',
        },
        {
            id: 'archived-products',
            content: 'Expired',
            panelID: 'archived-products-content',
        },
    ];

    function handleFilterDiscounts(value) {
        let filteredData = []
        allDiscounts.filter((curElem) => {
            if (curElem.status === value) {
                filteredData.push(curElem)
            }
        });

        setFilteredDiscounts(filteredData)
        setTabLoading(false)
    }

    const handleTabChange = (selectedTabIndex) => {
        setTabLoading(true)
        setSelectedTab(selectedTabIndex);
        if (selectedTabIndex === 1) {
            handleFilterDiscounts('ACTIVE')
        }
        else if (selectedTabIndex === 2) {
            handleFilterDiscounts('SCHEDULED')
        }
        else if (selectedTabIndex === 3) {
            handleFilterDiscounts('EXPIRED')
        }
        else {
            setTabLoading(false)
        }
    }

    // ---------------------Index Table Code Start Here----------------------
    const resourceName = {
        singular: 'discount',
        plural: 'discounts',
    };

    const discounts = selectedTab == 0 ? allDiscounts : filteredDiscounts;

    const rowMarkup = discounts?.map(
        ({ id, title, code, type, value, status, minimumRequirement, minimumValue, usageCount, startDate, endDate }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                position={index}
                disabled={btnLoading[id]}
            >

                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>
                    <Link to={`/admin/discounts/${id}`}>
                        <Stack vertical>
                            <Text variant="bodyMd" fontWeight="semibold" as="span">
                                {code}
                            </Text>
                            <span>
                                {type == 'fixed' &&
                                    <p>
                                        {user?.currency_symbol} {value} off entire order
                                        {minimumRequirement == 'amount' &&
                                            <> • Minimum purchase of ${minimumValue} </>
                                        }
                                        {minimumRequirement == 'quantity' &&
                                            <> • Minimum quantity of {minimumValue} products</>
                                        }
                                    </p>
                                }
                                {type == 'percentage' &&
                                    <p>
                                        {value}% off entire order
                                        {minimumRequirement == 'amount' &&
                                            <> • Minimum purchase of ${minimumValue} </>
                                        }
                                        {minimumRequirement == 'quantity' &&
                                            <> • Minimum quantity of {minimumValue} products</>
                                        }
                                    </p>
                                }
                            </span>
                        </Stack>
                    </Link>
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {title ? title : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <CustomBadge value={status} type='discount' />
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {usageCount ? <p>{usageCount} Used</p> : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {dateFormat(startDate, "dd.mm.yy")} - {dateFormat(endDate, "dd.mm.yy")}
                </IndexTable.Cell>

                <IndexTable.Cell className='Polaris-IndexTable-Delete-Column'>
                    <Button onClick={() => handleDeleteDiscount(id)} disabled={btnLoading[id]}>
                        <Icon source={DeleteMinor}></Icon>
                    </Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    // ---------------------Api starts Here----------------------
    const getDiscounts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/automatic_discount`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('getDiscounts response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                setAllDiscounts(response.data.data)
                setLoading(false)
            }
            setToggleLoadData(false)

        } catch (error) {
            console.warn('getDiscounts Api Error', error.response);
            setLoading(false)
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

    const deleteDiscount = async () => {
        setBtnLoading((prev) => {
            let toggleId;
            if (prev[deleteDiscountId]) {
                toggleId = { [deleteDiscountId]: false };
            } else {
                toggleId = { [deleteDiscountId]: true };
            }
            return { ...toggleId };
        });

        try {
            const response = await axios.delete(`${apiUrl}/api/automatic_discount/${deleteDiscountId}/delete`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('deleteDiscount response: ', response.data);
            setBtnLoading(false)
            setToastMsg('Discount Deleted')
            handleDiscountDeleteModal()
            setSucessToast(true)
            setToggleLoadData(true)
        } catch (error) {
            console.warn('deleteDiscount Api Error', error.response);
            setBtnLoading(false)
            handleDiscountDeleteModal()
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
            getDiscounts()
        }
    }, [toggleLoadData])


    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No Discounts Found'}
            withIllustration
        />
    );

    const createNewDiscount = () => {
        navigate('/admin/discounts/new')
    }


    return (
        <div className='Discounts-Page IndexTable-Page'>
            <Modal
                open={discountDeleteModal}
                onClose={handleDiscountDeleteModal}
                title="Delete discount?"
                primaryAction={{
                    content: 'Delete',
                    destructive: true,
                    loading: btnLoading[deleteDiscountId],
                    onAction: deleteDiscount,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        disabled: btnLoading[deleteDiscountId],
                        onAction: handleDiscountDeleteModal,
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

            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForTable />
                </span> :
                <Page
                    fullWidth
                    title="Automatic discounts"
                    primaryAction={{
                        content: 'Create discount',
                        onAction: createNewDiscount
                    }}
                    secondaryActions={
                        <ButtonGroup>
                            <a href='https://help.checkify.pro/en/articles/4367163-general-customization-settings' target='_blank'>
                                <Button>Explore the guide <Icon source={ExternalMinor}></Icon></Button>
                            </a>
                        </ButtonGroup>
                    }
                >
                    <Card>
                        <Tabs
                            tabs={tabs}
                            selected={selectedTab}
                            onSelect={handleTabChange}
                            disclosureText="More views"
                        >
                            <div className='Polaris-Table'>
                                <Card.Section>
                                    <IndexTable
                                        resourceName={resourceName}
                                        itemCount={discounts.length}
                                        selectable={false}
                                        loading={tabLoading}
                                        emptyState={emptyStateMarkup}
                                        headings={[
                                            { title: 'Discount Details' },
                                            { title: 'Title' },
                                            { title: 'Status' },
                                            { title: 'Statistic' },
                                            { title: 'Date' },


                                        ]}
                                    >
                                        {rowMarkup}
                                    </IndexTable>
                                </Card.Section>
                            </div>
                        </Tabs>
                    </Card>

                    {/* <FooterHelp>
                        Learn more about{' '}
                        <Link url="https://help.shopify.com/en/manual/products">
                            products
                        </Link>
                    </FooterHelp> */}

                </Page>
            }

            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}

