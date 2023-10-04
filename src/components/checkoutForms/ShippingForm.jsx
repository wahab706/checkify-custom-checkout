import React, { useEffect, useState } from 'react'
import { Form, FormLayout, Button, Card, Text } from '@shopify/polaris';
import { InputField, CustomSelect } from '../../components';

export function ShippingForm({ shippingDetails, handleShippingDetails, shippingFormErrors, paymentSubmit,
    countriesList, localizations, customization, convertNumberToBoolean, shippingRates }) {
    // { label: <span> <small>{item.code}</small> {item.name}</span>, value: item.id }

    const countryOptions = countriesList?.map((item) => {
        return (
            { label: convertNumberToBoolean(customization?.showNativeCountry) ? item.local_name : item.name, value: item.id }
        )
    })


    const [stateOptions, setStateOptions] = useState([])

    useEffect(() => {
        let countrySelected = countriesList?.find(item => item.id == shippingDetails.country)
        let stateOption = []
        countrySelected?.states?.map((item) => {
            stateOption.push({ label: item.name, value: item.id })
        })
        setStateOptions(stateOption)

        let stateSelected = countrySelected?.states?.find(item => item.id == shippingDetails.state)
    }, [shippingDetails, countriesList])


    return (
        <>
            {!shippingRates?.length &&
                <span className='No-Shipping-Rates-Card'>
                    <Card sectioned>
                        <Text variant="bodyMd" as="p" alignment="center" fontWeight='medium'>
                            {localizations?.SO_NoShippingOptionsSubtitle}
                        </Text>
                    </Card>
                </span>
            }

            <Form onSubmit={paymentSubmit}>
                <FormLayout>
                    <span className='VisuallyHidden'>
                        <Button submit id='completePurchaseBtn'>Submit</Button>
                    </span>

                    {convertNumberToBoolean(customization?.isPhone) ?
                        <FormLayout.Group>
                            <InputField
                                type='tel'
                                name='phone'
                                value={shippingDetails.phone}
                                onChange={handleShippingDetails}
                                placeholder={localizations?.SD_Phone}
                                error={shippingFormErrors.phone && "Phone isn't valid"}
                                helpText={convertNumberToBoolean(customization?.phoneText) &&
                                    "We`ll send you an order receipt and recurring shipping updates via text message. Reply STOP to unsubscribe. Reply HELP for help. Message frequency varies. View our Privacy policy and Terms of service."
                                }
                            />
                        </FormLayout.Group>
                        :
                        <FormLayout.Group>
                            <InputField
                                type='email'
                                name='email'
                                value={shippingDetails.email}
                                onChange={handleShippingDetails}
                                placeholder={localizations?.SD_EmailAddress}
                                error={shippingFormErrors.email && "Email isn't valid"}
                                helpText={convertNumberToBoolean(customization?.emailText) &&
                                    "We`ll send you an order receipt and recurring shipping updates via Email. Message frequency varies.View our Privacy policy and Terms of service."}
                            />
                        </FormLayout.Group>
                    }

                    <FormLayout.Group>
                        <InputField
                            type='text'
                            name='firstName'
                            value={shippingDetails.firstName}
                            onChange={handleShippingDetails}
                            placeholder={localizations?.SD_FirstName}
                            error={shippingFormErrors.firstName && "First Name isn't valid"}
                        />
                        <InputField
                            type='text'
                            name='lastName'
                            value={shippingDetails.lastName}
                            onChange={handleShippingDetails}
                            placeholder={localizations?.SD_LastName}
                            error={shippingFormErrors.lastName && "Last Name isn't valid"}
                        />

                    </FormLayout.Group>

                    <FormLayout.Group>
                        <InputField
                            type='text'
                            name='address'
                            value={shippingDetails.address}
                            onChange={handleShippingDetails}
                            placeholder={localizations?.SD_Address}
                            error={shippingFormErrors.address && "Address isn't valid"}
                        />
                    </FormLayout.Group>

                    <FormLayout.Group condensed>
                        <CustomSelect
                            // label='Select Country'
                            name='country'
                            value={shippingDetails.country}
                            onChange={handleShippingDetails}
                            options={countryOptions}
                            error={shippingFormErrors.country && "Select your Country"}
                        />

                        <CustomSelect
                            // label='Select State'
                            name='state'
                            value={shippingDetails.state}
                            onChange={handleShippingDetails}
                            options={stateOptions}
                            disabled={!shippingDetails.country}
                            error={shippingFormErrors.state && "Select your State"}
                        />

                        <InputField
                            type='text'
                            name='zipCode'
                            value={shippingDetails.zipCode}
                            onChange={handleShippingDetails}
                            disabled={!shippingDetails.country}
                            placeholder={localizations?.SD_ZipCode}
                            error={shippingFormErrors.zipCode && "Zip Code isn't valid"}
                        />

                    </FormLayout.Group>

                    <FormLayout.Group>
                        <InputField
                            type='text'
                            name='city'
                            value={shippingDetails.city}
                            onChange={handleShippingDetails}
                            placeholder={localizations?.SD_City}
                            error={shippingFormErrors.city && "City isn't valid"}
                        />
                    </FormLayout.Group>

                    {convertNumberToBoolean(customization?.isPhoneFieldRequired) &&
                        <FormLayout.Group>
                            <InputField
                                type='tel'
                                name='phone'
                                value={shippingDetails.phone}
                                onChange={handleShippingDetails}
                                placeholder={localizations?.SD_Phone}
                                error={shippingFormErrors.phone && "Phone isn't valid"}
                                helpText={convertNumberToBoolean(customization?.phoneText) &&
                                    "We`ll send you an order receipt and recurring shipping updates via text message. Reply STOP to unsubscribe. Reply HELP for help. Message frequency varies. View our Privacy policy and Terms of service."
                                }
                            />
                        </FormLayout.Group>
                    }

                    <FormLayout.Group>
                        <div className="Polaris-Connected">
                            <div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
                                <div className="Polaris-Select">
                                    <select
                                        name='experience'
                                        value={shippingDetails.experience}
                                        onChange={handleShippingDetails}
                                        className="Polaris-Select__Input"
                                        aria-invalid="false">

                                        <option value="It's awesome!">It's awesome!</option>
                                        <option value="It's great :)">It's great :)</option>
                                        <option value="It's okay...">It's okay...</option>
                                        <option value="It can be better :(">It can be better :(</option>
                                    </select>


                                    <div className="Polaris-Select__Content" aria-hidden="true">
                                        <span className="Polaris-Select__SelectedOption">{shippingDetails.experience}</span>
                                        <span className="Polaris-Select__Icon">
                                            <span className="Polaris-Icon">
                                                <span className="Polaris-Text--root Polaris-Text--bodySm Polaris-Text--regular Polaris-Text--visuallyHidden">
                                                </span>
                                                <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                                    <path d="M7.676 9h4.648c.563 0 .879-.603.53-1.014l-2.323-2.746a.708.708 0 0 0-1.062 0l-2.324 2.746c-.347.411-.032 1.014.531 1.014Zm4.648 2h-4.648c-.563 0-.878.603-.53 1.014l2.323 2.746c.27.32.792.32 1.062 0l2.323-2.746c.349-.411.033-1.014-.53-1.014Z">
                                                    </path>
                                                </svg>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="Polaris-TextField__Backdrop"> </div>
                            </div>
                        </div>
                    </FormLayout.Group>

                </FormLayout>
            </Form>
        </>
    )
}
