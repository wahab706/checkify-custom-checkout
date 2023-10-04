import React, { useEffect, useState } from 'react'
import { Form, FormLayout } from '@shopify/polaris';
import { InputField, CustomSelect } from '../../components';

export function BillingForm({ billingDetails, handleBillingDetails, billingFormErrors, countriesList,
    localizations, customization, convertNumberToBoolean }) {
    const countryOptions = countriesList?.map((item) => {
        return (
            { label: convertNumberToBoolean(customization?.showNativeCountry) ? item.local_name : item.name, value: item.id }
        )
    })

    const [stateOptions, setStateOptions] = useState([])
    useEffect(() => {
        let countrySelected = countriesList?.find(item => item.id == billingDetails.country)
        let stateOption = []
        countrySelected?.states?.map((item) => {
            stateOption.push({ label: item.name, value: item.id })
        })
        setStateOptions(stateOption)

        let stateSelected = countrySelected?.states?.find(item => item.id == billingDetails.state)
    }, [handleBillingDetails, countriesList])

    return (
        <div className='Billing-Form'>
            <Form>
                <FormLayout>
                    <FormLayout.Group>
                        <InputField
                            type='text'
                            name='firstName'
                            value={billingDetails.firstName}
                            onChange={handleBillingDetails}
                            placeholder={localizations?.SD_FirstName}
                            error={billingFormErrors.firstName && "First Name isn't valid"}
                        />
                        <InputField
                            type='text'
                            name='lastName'
                            value={billingDetails.lastName}
                            onChange={handleBillingDetails}
                            placeholder={localizations?.SD_LastName}
                            error={billingFormErrors.lastName && "Last Name isn't valid"}
                        />
                    </FormLayout.Group>

                    <FormLayout.Group>
                        <InputField
                            type='text'
                            name='address'
                            value={billingDetails.address}
                            onChange={handleBillingDetails}
                            placeholder={localizations?.SD_Address}
                            error={billingFormErrors.address && "Address isn't valid"}
                        />
                    </FormLayout.Group>

                    <FormLayout.Group>
                        {/* <div className="Polaris-Connected">
                            <div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
                                <div className="Polaris-Select">
                                    <select
                                        name='country'
                                        value={billingDetails.country}
                                        onChange={handleBillingDetails}
                                        className="Polaris-Select__Input"
                                        aria-invalid="false">

                                        {countryOptions?.map((item, index) => {
                                            return (
                                                <option value={item.label} key={index}> {item.label}</option>
                                            )
                                        })}

                                    </select>
                                    <div className="Polaris-Select__Content" aria-hidden="true">
                                        <span className="Polaris-Select__SelectedOption">{billingDetails.country}</span>
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
                        </div> */}
                        <CustomSelect
                            // label='Select Country'
                            name='country'
                            value={billingDetails.country}
                            onChange={handleBillingDetails}
                            options={countryOptions}
                            error={billingFormErrors.country && "Select your Country"}
                        />

                        <CustomSelect
                            // label='Select State'
                            name='state'
                            value={billingDetails.state}
                            onChange={handleBillingDetails}
                            options={stateOptions}
                            disabled={!billingDetails.country}
                            error={billingFormErrors.state && "Select your State"}
                        />
                    </FormLayout.Group>

                    <FormLayout.Group>
                        <InputField
                            type='text'
                            name='city'
                            value={billingDetails.city}
                            onChange={handleBillingDetails}
                            placeholder={localizations?.SD_City}
                            error={billingFormErrors.city && "City isn't valid"}
                        />

                        <InputField
                            type='text'
                            name='zipCode'
                            value={billingDetails.zipCode}
                            onChange={handleBillingDetails}
                            placeholder={localizations?.SD_ZipCode}
                            disabled={!billingDetails.country}
                            error={billingFormErrors.zipCode && "Zip Code isn't valid"}
                        />

                    </FormLayout.Group>

                    <FormLayout.Group>
                        <InputField
                            type='tel'
                            name='phone'
                            value={billingDetails.phone}
                            onChange={handleBillingDetails}
                            placeholder={localizations?.SD_Phone}
                            error={billingFormErrors.phone && "Phone isn't valid"}
                        />
                    </FormLayout.Group>

                </FormLayout>
            </Form>
        </div>
    )
}
