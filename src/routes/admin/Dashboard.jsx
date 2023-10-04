import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
    Page, Layout, Button, ButtonGroup, Card, Icon, Tabs, Text, Form, FormLayout, TextContainer, PageActions,
    Stack, ResourceList, ResourceItem, Avatar, EmptyState, Toast, Modal, Sheet, Scrollable, Loading,
    Thumbnail, DropZone, EmptySearchResult,
} from '@shopify/polaris';
import { Link } from 'react-router-dom';
import {
    ExternalMinor, DeleteMinor, EditMinor, MobileCancelMajor, NoteMinor
} from '@shopify/polaris-icons';
import axios from "axios";
import {
    SkeltonDashboardPage, getAccessToken,
    NotifyBanner
} from '../../components'
import { AppContext } from '../../components/providers/ContextProvider'
import dateFormat from "dateformat";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function Dashboard() {
    const { apiUrl } = useContext(AppContext);

    const [loading, setLoading] = useState(true)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')

    const [userData, setUserData] = useState([])
    const [dashboardData, setDashboardData] = useState([])
    const [orderStats, setOrderStats] = useState([])
    const [checkoutStats, setCheckoutStats] = useState([])

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    const maxMonth = `${y}-${(m + 1).toString().padStart(2, 0)}`

    const [currentDate, setCurrentDate] = useState({
        start: dateFormat(firstDay, "yyyy-mm-dd 00:00:00"),
        end: dateFormat(lastDay, "yyyy-mm-dd 00:00:00"),
    })

    const d = new Date();
    const name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = name[d.getMonth()];
    const year = d.getFullYear()

    const [currentMonth, setCurrentMonth] = useState({
        month: month,
        year: year,
    })
    const [allDays, setAllDays] = useState([])

    const handleMonthChange = (e) => {
        if (e.target.value) {
            let value = e.target.value
            value = value.split('-')
            setCurrentMonth({
                month: name[Number(value[1] - 1).toFixed(0)],
                year: value[0]
            })
            var last = new Date(value[0], Number(value[1]).toFixed(0), 0);
            setCurrentDate({
                start: `${e.target.value}-01 00:00:00`,
                end: dateFormat(last, "yyyy-mm-dd 00:00:00"),
            })
        }
        else {
            setCurrentMonth({
                month: month,
                year: year,
            })

            setCurrentDate({
                start: dateFormat(firstDay, "yyyy-mm-dd 00:00:00"),
                end: dateFormat(lastDay, "yyyy-mm-dd 00:00:00"),
            })
        }


    }

    const handleMonthChangeBtn = () => {
        let span = document.getElementById('monthPicker')
        let input = span.querySelector('input[type="month"]')
        if ('showPicker' in HTMLInputElement.prototype) {
            input.showPicker();
        }
    }

    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelectedTab(selectedTabIndex),
        [],
    );

    const tabs = [
        {
            id: 'tab1',
            content: (
                <span className='Tab-Content'>
                    <Text variant="bodyMd" as="p" fontWeight="medium" alignment='start'>
                        Average conversion rate
                    </Text>
                    <Text variant="heading2xl" as="h3" alignment='start'>
                        {dashboardData?.ordersTotalStats?.conversion ?
                            `${Number(dashboardData?.ordersTotalStats?.conversion).toFixed(2)} %` : '---'}
                    </Text>
                </span>
            ),
        },
        {
            id: 'tab2',
            content: (
                <span className='Tab-Content'>
                    <Text variant="bodyMd" as="p" fontWeight="medium" alignment='start'>
                        Checkout reached
                    </Text>
                    <Text variant="heading2xl" as="h3" alignment='start'>
                        {dashboardData?.checkoutsStats?.total_checkouts ?
                            `${Number(dashboardData?.checkoutsStats?.total_checkouts)}` : '---'}
                    </Text>
                </span>
            ),
        },
        {
            id: 'tab3',
            content: (
                <span className='Tab-Content'>
                    <Text variant="bodyMd" as="p" fontWeight="medium" alignment='start'>
                        Checkout completed
                    </Text>
                    <Text variant="heading2xl" as="h3" alignment='start'>
                        {dashboardData?.ordersTotalStats?.count ?
                            `${Number(dashboardData?.ordersTotalStats?.count)}` : '---'}
                    </Text>
                </span>
            ),
        },
        {
            id: 'tab4',
            content: (
                <span className='Tab-Content'>
                    <Text variant="bodyMd" as="p" fontWeight="medium" alignment='start'>
                        Total revenue
                    </Text>
                    <Text variant="heading2xl" as="h3" alignment='start'>
                        {dashboardData?.ordersTotalStats?.revenue ?
                            `${userData?.currency_symbol} ${Number(dashboardData?.ordersTotalStats?.revenue).toFixed(2)}` : '---'}
                    </Text>
                </span>
            ),
        },
    ];

    const getDashboardData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/dashboard?dateStart=${currentDate.start}&dateEnd=${currentDate.end}`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('getDashboardData response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                let endDay = dateFormat(currentDate.end, "d")
                let all_days = [];
                for (let index = 1; index < Number(endDay) + 1; index++) {
                    all_days.push(index);
                }
                setAllDays(all_days)


                setDashboardData(response.data?.data)
                setUserData(response.data?.user)
                setLoading(false)
            }
        } catch (error) {
            console.warn('getDashboardData Api Error', error.response);
            setLoading(false)
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
        getDashboardData()
    }, [currentDate])


    useEffect(() => {
        let order_stats = []
        let checkout_stats = []
        allDays?.map((item) => {
            let test = dashboardData?.ordersStats?.find(obj => obj.day == item)
            if (test) {
                order_stats.push(test)
            }
            else {
                order_stats.push({
                    day: Number(item),
                    count: 0,
                    revenue: 0,
                    conversion: 0,
                })
            }
        })

        allDays?.map((item, index) => {
            let test = dashboardData?.checkoutsStats?.checkoutPerDay[index + 1]
            if (test) {
                checkout_stats.push({
                    day: index + 1,
                    count: test,
                })
            }
            else {
                checkout_stats.push({
                    day: index + 1,
                    count: 0,
                })
            }
        })

        setOrderStats(order_stats)
        setCheckoutStats(checkout_stats)
    }, [dashboardData])

    const labels = allDays;
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },

        },
    };

    const data1 = {
        labels,
        datasets: [
            {
                label: 'conversion rate (%)',
                data: orderStats?.map((item) => item.conversion),
                backgroundColor: 'rgba(97, 206, 180, 0.3)',
            },
        ],
    };

    const data2 = {
        labels,
        datasets: [
            {
                label: 'checkout reached',
                data: checkoutStats?.map((item) => item.count),
                backgroundColor: 'rgba(97, 206, 180, 0.3)',
            },
        ],
    };

    const data3 = {
        labels,
        datasets: [
            {
                label: 'checkout completed',
                data: orderStats?.map((item) => item.count),
                backgroundColor: 'rgba(97, 206, 180, 0.3)',
            },
        ],
    };

    const data4 = {
        labels,
        datasets: [
            {
                label: `revenue (${userData?.currency})`,
                data: orderStats?.map((item) => item.revenue),
                backgroundColor: 'rgba(97, 206, 180, 0.3)',
            },
        ],
    };



    return (
        <div className='Dashboard-Page'>
            {loading ? <SkeltonDashboardPage /> :
                <Page
                    fullWidth
                    title={`Welcome Home, ${userData?.name != null ? userData?.name : ''} ${userData?.last_name != null ? userData?.last_name : ''}`}
                    primaryAction={
                        {
                            content: <span id='monthPicker'>
                                {`${currentMonth.month} ${currentMonth.year}`}
                                <input type="month" onChange={handleMonthChange} max={maxMonth} />
                            </span>,
                            onAction: handleMonthChangeBtn
                        }
                    }
                >
                    <NotifyBanner/>
                    <Card>
                        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} fitted>
                            <Card.Section>
                                {(() => {
                                    switch (selectedTab) {
                                        case 0:
                                            return (
                                                <span>
                                                    <Bar options={options} data={data1} height={100} />
                                                </span>
                                            )

                                        case 1:
                                            return (
                                                <span>
                                                    <Bar options={options} data={data2} height={100} />
                                                </span>
                                            )

                                        case 2:
                                            return (
                                                <span>
                                                    <Bar options={options} data={data3} height={100} />
                                                </span>
                                            )

                                        case 3:
                                            return (
                                                <span>
                                                    <Bar options={options} data={data4} height={100} />
                                                </span>
                                            )


                                        default:
                                            break
                                    }

                                })()}

                            </Card.Section>
                        </Tabs>
                    </Card>
                </Page>
            }

            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}