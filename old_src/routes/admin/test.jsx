formData.append("buttonsColor", customizationSettings?.buttonsColor);
formData.append("accentColor", customizationSettings.accentColor);
formData.append("errorColor", customizationSettings.errorColor);
formData.append("backgroundColor", customizationSettings.backgroundColor);
formData.append("cardColor", customizationSettings.cardColor);
formData.append("textColor", customizationSettings.textColor);
formData.append("motivatorTextColor", customizationSettings.motivatorTextColor);
formData.append("motivatorBackgroundColor", customizationSettings.motivatorBackgroundColor);

formData.append("fontText", customizationSettings.fontText);
formData.append("fontBody", customizationSettings.fontBody);
formData.append("fontButton", customizationSettings.fontButton);

formData.append("leftImageUrl", customizationSettings.leftImageUrl);
formData.append("rightImageUrl", customizationSettings.rightImageUrl);
formData.append("favicons", customizationSettings.favicons);


formData.append("logoUrl", customizationSettings.logoUrl);
formData.append("returnsPolicyUrl", customizationSettings.returnsPolicyUrl);
formData.append("shippingPolicyUrl", customizationSettings.shippingPolicyUrl);
formData.append("privacyPolicyUrl", customizationSettings.privacyPolicyUrl);
formData.append("termsAndConditionsUrl", customizationSettings.termsAndConditionsUrl);


formData.append("isPhoneFieldHidden", convertBooleanToNumber(customizationSettings.isPhoneFieldHidden));
formData.append("isPhoneFieldRequired", convertBooleanToNumber(customizationSettings.isPhoneFieldRequired));
formData.append("isPhone", convertBooleanToNumber(customizationSettings.isPhone));
formData.append("emailText", convertBooleanToNumber(customizationSettings.emailText));
formData.append("phoneText", convertBooleanToNumber(customizationSettings.phoneText));

formData.append("hideDiscountMobile", convertBooleanToNumber(customizationSettings.hideDiscountMobile));
formData.append("showDiscountMobile", convertBooleanToNumber(customizationSettings.showDiscountMobile));
formData.append("hideDiscountDesktop", convertBooleanToNumber(customizationSettings.hideDiscountDesktop));

formData.append("transByIp", convertBooleanToNumber(customizationSettings.transByIp));
formData.append("transByDevice", convertBooleanToNumber(customizationSettings.transByDevice));

formData.append("zipValidate", convertBooleanToNumber(customizationSettings.zipValidate));

formData.append("taxCharge", convertBooleanToNumber(customizationSettings.taxCharge));

formData.append("showCountryCurrency", convertBooleanToNumber(customizationSettings.showCountryCurrency));

formData.append("emailOrderConfirm", convertBooleanToNumber(customizationSettings.emailOrderConfirm));
formData.append("customerInvite", convertBooleanToNumber(customizationSettings.customerInvite));
formData.append("acceptsMarketing", convertBooleanToNumber(customizationSettings.acceptsMarketing));

formData.append("billing", convertBooleanToNumber(customizationSettings.billing));
formData.append("defaultCollapsed", convertBooleanToNumber(customizationSettings.defaultCollapsed));
formData.append("stripeType", convertBooleanToNumber(customizationSettings.stripeType));

formData.append("showNativeCountry", convertBooleanToNumber(customizationSettings.showNativeCountry));
formData.append("displayTimer", convertBooleanToNumber(customizationSettings.displayTimer));
formData.append("isCustomTextBarShowed", convertBooleanToNumber(customizationSettings.isCustomTextBarShowed));
formData.append("hideShipping", convertBooleanToNumber(customizationSettings.hideShipping));
formData.append("hideShippingOption", convertBooleanToNumber(customizationSettings.hideShippingOption));
formData.append("hideBilling", convertBooleanToNumber(customizationSettings.hideBilling));
formData.append("hideSummary", convertBooleanToNumber(customizationSettings.hideSummary));
formData.append("hidePayment", convertBooleanToNumber(customizationSettings.hidePayment));
formData.append("hideProductOption", convertBooleanToNumber(customizationSettings.hideProductOption));
formData.append("hideDiscount", convertBooleanToNumber(customizationSettings.hideDiscount));

formData.append("showShippingOptions", convertBooleanToNumber(customizationSettings.showShippingOptions));
formData.append("hideBillingForm", convertBooleanToNumber(customizationSettings.hideBillingForm));