import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    Page, Layout, Card, ResourceList, Thumbnail, Text, Stack, ButtonGroup, Button, Badge, DropZone, useIndexResourceState,
    PageActions, Select, Frame, ContextualSaveBar, Modal, TextContainer, Banner, List, TextField, Avatar, Navigation,
    InlineError, Collapsible, Autocomplete, Icon, Tag, Link, IndexTable, Filters, OptionList
} from '@shopify/polaris';
import {
    LinkMinor, EmbedMinor, NoteMinor, SearchMinor, CirclePlusMinor, DeleteMinor, PlusMinor
} from '@shopify/polaris-icons';
import { useParams } from 'react-router-dom';


const productVariantsData = [
    {
        id: '1',
        product: 'Dance of the devil',
        size: 'S',
        color: 'Black',
        price: '45.99',
        quantity: '712',
        sku: 'BPN3963ydd32',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/black.jpg?v=1667398012',
    },
    {
        id: '2',
        product: 'Dance of the devil',
        size: 'S',
        color: 'White',
        price: '76.00',
        quantity: '64',
        sku: 'BPN3535ydd32',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/white.jpg?v=1667398096',
    },
    {
        id: '3',
        product: 'Dance of the devil',
        size: 'S',
        color: 'Blue',
        price: '39.99',
        quantity: '38',
        sku: 'BPN39797h336',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/blue.jpg?v=1667398487',
    },
    {
        id: '4',
        product: 'Dance of the devil',
        size: 'S',
        color: 'Red',
        price: '45.00',
        quantity: '112',
        sku: 'BPN34653gr64',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/red.jpg?v=1667398168',
    },
    {
        id: '5',
        product: 'Dance of the devil',
        size: 'M',
        color: 'Black',
        price: '45.99',
        quantity: '712',
        sku: 'BPN3963ydd32',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/black.jpg?v=1667398012',
    },
    {
        id: '6',
        product: 'Dance of the devil',
        size: 'M',
        color: 'White',
        price: '76.00',
        quantity: '64',
        sku: 'BPN3535ydd32',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/white.jpg?v=1667398096',
    },
    {
        id: '7',
        product: 'Dance of the devil',
        size: 'M',
        color: 'Blue',
        price: '39.99',
        quantity: '38',
        sku: 'BPN39797h336',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/blue.jpg?v=1667398487',
    },
    {
        id: '8',
        product: 'Dance of the devil',
        size: 'M',
        color: 'Red',
        price: '45.00',
        quantity: '112',
        sku: 'BPN34653gr64',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/red.jpg?v=1667398168',
    },
    {
        id: '9',
        product: 'Dance of the devil',
        size: 'L',
        color: 'Black',
        price: '45.99',
        quantity: '712',
        sku: 'BPN3963ydd32',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/black.jpg?v=1667398012',
    },
    {
        id: '10',
        product: 'Dance of the devil',
        size: 'L',
        color: 'White',
        price: '76.00',
        quantity: '64',
        sku: 'BPN3535ydd32',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/white.jpg?v=1667398096',
    },
    {
        id: '11',
        product: 'Dance of the devil',
        size: 'L',
        color: 'Blue',
        price: '39.99',
        quantity: '38',
        sku: 'BPN39797h336',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/blue.jpg?v=1667398487',
    },
    {
        id: '12',
        product: 'Dance of the devil',
        size: 'L',
        color: 'Red',
        price: '45.00',
        quantity: '112',
        sku: 'BPN34653gr64',
        image: 'https://cdn.shopify.com/s/files/1/0136/5223/0203/products/red.jpg?v=1667398168',
    },

];


export function OrderDetail() {
    const params = useParams()

    const productStatusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
    ];

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg', 'image/svg'];

    // {------------------------Product organization Card Data-------------------}

    const productCategoryOptionsData = useMemo(
        () => [
            { value: 'clothing', label: 'Clothing' },
            { value: 'shoes', label: 'Shoes' },
            { value: 'tops', label: 'Tops' },
            { value: 'kids', label: 'Kids' },
            { value: 'women', label: 'Women' },
            { value: 'men', label: 'Men' },
        ],
        [],
    );

    const productTypeOptionsData = useMemo(
        () => [
            { value: 'rustic', label: 'Rustic' },
            { value: 'antique', label: 'Antique' },
            { value: 'vinyl', label: 'Vinyl' },
            { value: 'vintage', label: 'Vintage' },
            { value: 'refurbished', label: 'Refurbished' },
        ],
        [],
    );

    const VendorOptionsData = useMemo(
        () => [
            { value: 'inline-tube-development', label: 'Inline Tube Development' },
            { value: 'inline-tube', label: 'Inline Tube' },
            { value: 'ilt2-development', label: 'ilt2 Development' },
        ],
        [],
    );

    const TagsOptionsData = useMemo(
        () => [
            { value: 'men', label: 'Men' },
            { value: 'women', label: 'Women' },
            { value: 'kids', label: 'Kids' },
            { value: 'tops', label: 'Tops' },
            { value: 'shoes', label: 'Shoes' },
            { value: 'jackets', label: 'Jackets' },
            { value: 'sale', label: 'Sale' },
            { value: 'new-arrival', label: 'New Arrival' },
            { value: 'special-occasion', label: 'Special Occasion' },
            { value: 'birthday-dresses', label: 'Birthday Dresses' },
        ],
        [],
    );

    const selectedTagsData = useMemo(
        () => [
            { value: 'women', label: 'Women' },
            { value: 'kids', label: 'Kids' },
            { value: 'jackets', label: 'Jackets' },
            { value: 'sale', label: 'Sale' },
            { value: 'birthday-dresses', label: 'Birthday Dresses' },
        ],
        [],
    );

    const avaialbleSalesChannelsData = useMemo(
        () => [
            { value: 'Online Store', label: 'Online Store' },
            { value: 'Wholesale', label: 'Wholesale' },
            { value: 'Point of Sale', label: 'Point of Sale' },
            { value: 'Buy Button', label: 'Buy Button' },
            { value: 'Hydrogen', label: 'Hydrogen' },
        ],
        [],
    );

    const selectedSalesChannelsData = useMemo(
        () => [
            { value: 'Online Store', label: 'Online Store' },
            { value: 'Point of Sale', label: 'Point of Sale' },
            { value: 'Buy Button', label: 'Buy Button' },
        ],
        [],
    );

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(productVariantsData);

    let title = 'Dance with the Devil';
    let description = '';
    const [productTitle, setProductTitle] = useState(title);
    const [productDescription, setProductDescription] = useState(description);

    const [mediaFiles, setImageFiles] = useState([]);
    const [openFileDialog, setOpenFileDialog] = useState(false);
    const [rejectedFiles, setRejectedFiles] = useState([]);
    const hasImageError = rejectedFiles.length > 0;

    let activeProductStatus = 'active';
    const [productStatus, setProductStatus] = useState(activeProductStatus);
    const [contextualSaveBar, setContextualSaveBar] = useState(false)
    const [discardModal, setDiscardModal] = useState(false);

    const [salesChannelModal, setSalesChannelModal] = useState(false);
    const [salesChannelSelected, setSalesChannelSelected] = useState('');
    const [salesChannelsOptions, setSalesChannelsOptions] = useState(avaialbleSalesChannelsData);

    const [optionsLoading, setOptionsLoading] = useState(false);
    let category = productCategoryOptionsData[0].label;
    const [productCategory, setProductCategory] = useState(category);
    const [productCategoryOptions, setProductCategoryOptions] = useState(productCategoryOptionsData);

    let productType = '';
    const [productTypeValue, setProductTypeValue] = useState(productType);
    const [productTypeOptions, setProductTypeOptions] = useState(productTypeOptionsData);

    let vendor = VendorOptionsData[0].label;
    const [vendorValue, setVendorValue] = useState(vendor);
    const isVendorInvalid = isValueInvalid(vendorValue);
    const [vendorOptions, setVendorOptions] = useState(VendorOptionsData);

    const [tagOptionsSelected, setTagOptionsSelected] = useState('');
    const [tagInputValue, setTagInputValue] = useState('');
    const [tagOptions, setTagOptions] = useState(TagsOptionsData);
    const [tagsModal, setTagsModal] = useState(false);


    useEffect(() => {
        if (productStatus != activeProductStatus) {
            setContextualSaveBar(true)
        }
        else {
            setContextualSaveBar(false)
        }
    }, [productStatus])

    // useEffect(() => {
    //     let options = [];
    //     selectedSalesChannelsData?.map((option) => {
    //         options.push(option.value)
    //     })
    //     setSalesChannelSelected(...salesChannelSelected, options)
    // }, [selectedSalesChannelsData])

    // useEffect(() => {
    //     let options = [];
    //     selectedTagsData?.map((option) => {
    //         options.push(option.value)
    //     })
    //     setTagOptionsSelected(...tagOptionsSelected, options)
    // }, [selectedTagsData])

    // -----------------Product Status Card--------------------

    const handleProductStatusChange = useCallback((value) => setProductStatus(value), []);

    const handleDiscardModal = useCallback(() => setDiscardModal(!discardModal), [discardModal]);
    const handleTagsModal = useCallback(() => setTagsModal(!tagsModal), [tagsModal]);
    const handleSalesChannelModal = useCallback(() => setSalesChannelModal(!salesChannelModal), [salesChannelModal]);

    const salesChannelContentMarkup = salesChannelSelected.length > 0 ? (
        <div className='Sales-Channels-Stack'>
            <Stack spacing="baseTight" vertical>
                {salesChannelSelected.map((option) => {
                    let tagLabel = '';
                    tagLabel = option.replace('-', ' ');
                    tagLabel = tagTitleCase(option);
                    return (
                        <>
                            <p key={`option${option}`}>
                                {option}
                            </p>
                        </>
                    );
                })}

            </Stack>
        </div>
    ) : null;

    // ------------------------Title/ Description Card-------------------

    const handleProductDescriptionChange = useCallback((newValue) => setProductDescription(newValue), []);
    const handleProductTitleChange = useCallback((newValue) => setProductTitle(newValue), []);
    const isTitleInvalid = isValueInvalid(productTitle);

    function isValueInvalid(content) {
        if (!content) {
            return true;
        }

        return content.length < 1;
    }

    // --------------------Media Card -------------------
    const imageErrorMessage = hasImageError && (
        <Banner
            title="The following images couldn’t be uploaded:"
            status="critical"
        >
            <List type="bullet">
                {rejectedFiles.map((file, index) => (
                    <List.Item key={index}>
                        {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
                    </List.Item>
                ))}
            </List>
        </Banner>
    );

    const handleDropZoneDrop = useCallback(
        (_droppedFiles, acceptedFiles, rejectedFiles) => {
            setImageFiles((mediaFiles) => [...mediaFiles, ...acceptedFiles]);
            setRejectedFiles(rejectedFiles);
        },
        [],
    );

    const toggleOpenFileDialog = useCallback(
        () => setOpenFileDialog((openFileDialog) => !openFileDialog),
        [],
    );

    const fileUpload = (
        <DropZone.FileUpload
            actionTitle={'Add files'}
            actionHint="Accepts images, videos, or 3D models"
        />
    );

    const dropZone = !mediaFiles.length && (
        <Stack vertical>
            {imageErrorMessage}
            <DropZone accept="image/*, video/*" type="image,video"
                openFileDialog={openFileDialog}
                onDrop={handleDropZoneDrop}
                onFileDialogClose={toggleOpenFileDialog}
            >
                {fileUpload}
            </DropZone>

        </Stack>
    )

    const uploadedFiles = mediaFiles.length > 0 && (
        <Stack id='jjj'>
            {mediaFiles.map((file, index) => (
                <Stack alignment="center" key={index}>
                    <div className='Polaris-Product-Gallery'>
                        <Thumbnail
                            size="large"
                            alt={file.name}
                            source={
                                validImageTypes.indexOf(file.type) > -1
                                    ? window.URL.createObjectURL(file)
                                    : NoteMinor
                            }
                        />
                    </div>
                </Stack>
            ))}

            <div className='Polaris-Product-DropZone'>
                <Stack alignment="center">
                    <DropZone accept="image/*, video/*" type="image,video"
                        openFileDialog={openFileDialog}
                        onDrop={handleDropZoneDrop}
                        onFileDialogClose={toggleOpenFileDialog}
                    >
                        <DropZone.FileUpload
                            actionTitle={'Add files'}
                        />
                    </DropZone>
                </Stack>
            </div>
        </Stack>
    );


    // -------------------Product Category------------------------

    const productCategoryUpdateText = useCallback(
        (value) => {
            setProductCategory(value);

            if (!optionsLoading) {
                setOptionsLoading(true);
            }

            setTimeout(() => {
                if (value === '') {
                    setProductCategoryOptions(productCategoryOptionsData);
                    setOptionsLoading(false);
                    return;
                }
                const filterRegex = new RegExp(value, 'i');
                const resultOptions = productCategoryOptionsData.filter((option) =>
                    option.label.match(filterRegex),
                );
                setProductCategoryOptions(resultOptions);
                setOptionsLoading(false);
            }, 300);
        },
        [productCategoryOptionsData, optionsLoading],
    );

    const productCategoryUpdateSelection = useCallback(
        (selected) => {
            const selectedText = selected.map((selectedItem) => {
                const matchedOption = productCategoryOptions.find((option) => {
                    return option.value.match(selectedItem);
                });
                return matchedOption && matchedOption.label;
            });
            setProductCategory(selectedText[0]);
        },
        [productCategoryOptions],
    );

    const productCategoryInputField = (
        <Autocomplete.TextField
            onChange={productCategoryUpdateText}
            label="Product Category"
            value={productCategory}
            placeholder="e.g., clothing, shoes"
        />
    );


    // -------------------Product Type------------------------
    // const [productType, setProductType] = useState([]);

    const productTypeUpdateText = useCallback(
        (value) => {
            setProductTypeValue(value);

            if (!optionsLoading) {
                setOptionsLoading(true);
            }

            setTimeout(() => {
                if (value === '') {
                    setProductTypeOptions(productTypeOptionsData);
                    setOptionsLoading(false);
                    return;
                }
                const filterRegex = new RegExp(value, 'i');
                const resultOptions = productTypeOptionsData.filter((option) =>
                    option.label.match(filterRegex),
                );
                setProductTypeOptions(resultOptions);
                setOptionsLoading(false);
            }, 300);
        },
        [productTypeOptionsData, optionsLoading],
    );

    const productTypeUpdateSelection = useCallback(
        (selected) => {
            const selectedText = selected.map((selectedItem) => {
                const matchedOption = productTypeOptions.find((option) => {
                    return option.value.match(selectedItem);
                });
                return matchedOption && matchedOption.label;
            });
            setProductTypeValue(selectedText[0]);
        },
        [productTypeOptions],
    );

    const productTypeInputField = (
        <Autocomplete.TextField
            onChange={productTypeUpdateText}
            label="Product Type"
            value={productTypeValue}
            placeholder="e.g., T-Shirt"
        />
    );


    // -------------------Vendor------------------------

    const vendorUpdateText = useCallback(
        (value) => {
            setVendorValue(value);

            if (!optionsLoading) {
                setOptionsLoading(true);
            }

            setTimeout(() => {
                if (value === '') {
                    setVendorOptions(VendorOptionsData);
                    setOptionsLoading(false);
                    return;
                }
                const filterRegex = new RegExp(value, 'i');
                const resultOptions = VendorOptionsData.filter((option) =>
                    option.label.match(filterRegex),
                );
                setVendorOptions(resultOptions);
                setOptionsLoading(false);
            }, 300);
        },
        [VendorOptionsData, optionsLoading],
    );

    const vendorUpdateSelection = useCallback(
        (selected) => {
            const selectedText = selected.map((selectedItem) => {
                const matchedOption = vendorOptions.find((option) => {
                    return option.value.match(selectedItem);
                });
                return matchedOption && matchedOption.label;
            });
            setVendorValue(selectedText[0]);
        },
        [vendorOptions],
    );

    const vendorInputField = (
        <Autocomplete.TextField
            onChange={vendorUpdateText}
            label="Vendor"
            value={vendorValue}
            placeholder="e.g., Webinopoly"
        />
    );


    // -------------------Tags------------------------

    const tagUpdateText = useCallback(
        (value) => {
            setTagInputValue(value);

            if (!optionsLoading) {
                setOptionsLoading(true);
            }

            setTimeout(() => {
                if (value === '') {
                    setTagOptions(TagsOptionsData);
                    setOptionsLoading(false);
                    return;
                }

                const filterRegex = new RegExp(value, 'i');
                const resultOptions = TagsOptionsData.filter((option) =>
                    option.label.match(filterRegex),
                );
                let endIndex = resultOptions.length - 1;
                if (resultOptions.length === 0) {
                    endIndex = 0;
                }
                setTagOptions(resultOptions);
                setOptionsLoading(false);
            }, 300);
        },
        [TagsOptionsData, optionsLoading, tagOptionsSelected],
    );

    const removeTag = useCallback(
        (tag) => () => {
            const tagOptions = [...tagOptionsSelected];
            tagOptions.splice(tagOptions.indexOf(tag), 1);
            setTagOptionsSelected(tagOptions);
        },
        [tagOptionsSelected],
    );

    const tagsContentMarkup = tagOptionsSelected.length > 0 ? (
        <div className='Product-Tags-Stack'>
            <Stack spacing="extraTight" alignment="center">
                {tagOptionsSelected.map((option) => {
                    let tagLabel = '';
                    tagLabel = option.replace('_', ' ');
                    tagLabel = tagTitleCase(tagLabel);
                    return (
                        <Tag key={`option${option}`} onRemove={removeTag(option)}>
                            {tagLabel}
                        </Tag>
                    );
                })}
            </Stack>
        </div>
    ) : null;


    function tagTitleCase(string) {
        return string
            .toLowerCase()
            .split(' ')
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join('');
    }

    const tagTextField = (
        <Autocomplete.TextField
            onChange={tagUpdateText}
            label="Tags"
            value={tagInputValue}
            placeholder="Select Tags"
        // verticalContent={tagsContentMarkup}
        />
    );



    // ---------------------Index Table Code Start Here----------------------

    const resourceName = {
        singular: 'variant',
        plural: 'variants',
    };

    const promotedBulkActions = [
        {
            content: 'Open Bulk Editor',
            onAction: () => console.log('Todo: implement bulk edit'),
        },
    ];
    const bulkActions = [
        {
            content: 'Add tags',
            onAction: () => console.log('Todo: implement bulk add tags'),
        },
        {
            content: 'Remove tags',
            onAction: () => console.log('Todo: implement bulk remove tags'),
        },
        {
            content: 'Delete Products',
            onAction: () => console.log('Todo: implement bulk delete'),
        },
    ];

    const rowMarkup = productVariantsData.map(
        ({ id, product, size, color, price, quantity, sku, image }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell className='Polaris-IndexTable-Image'>
                    <Avatar size="large" shape="square" name={product} source={image} />
                </IndexTable.Cell>
                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {size} {" / "} {color}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell className='Polaris-IndexTable-Price'>
                    <TextField
                        value={price}
                        prefix="$"
                        // onChange={handleChange}
                        autoComplete="off"
                    />
                </IndexTable.Cell>
                <IndexTable.Cell className='Polaris-IndexTable-Qunatity'>
                    <TextField
                        value={quantity}
                        type="number"
                        // onChange={handleChange}
                        autoComplete="off"
                    />
                </IndexTable.Cell>
                <IndexTable.Cell className='Polaris-IndexTable-Price'>
                    <TextField
                        value={sku}
                        // onChange={handleChange}
                        autoComplete="off"
                    />
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <div className='Variants-Button-Group'>
                        <ButtonGroup segmented>
                            <Button size="slim" className='Variants-Edit-Button'>Edit</Button>
                            <Button size="slim"><Icon source={DeleteMinor} /></Button>
                        </ButtonGroup>
                    </div>
                </IndexTable.Cell>
                {/* <IndexTable.Cell className='Variants-Edit-Button'>
                    <Button size="slim">Edit</Button>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Button size="slim"><Icon source={DeleteMinor} /></Button>
                </IndexTable.Cell> */}
            </IndexTable.Row>
        ),
    );





    return (
        <>
            {contextualSaveBar &&
                <div className='Polris-Contextual-SaveBar'>
                    <Frame>
                        <ContextualSaveBar
                            alignContentFlush
                            message="Unsaved changes"
                            saveAction={{
                                onAction: () => {
                                    setContextualSaveBar(false)
                                },
                            }}
                            discardAction={{
                                onAction: () => {
                                    setDiscardModal(true)
                                },
                            }}
                        />
                    </Frame>
                </div>
            }

            <Modal
                open={discardModal}
                onClose={handleDiscardModal}
                title="Discard all unsaved changes"
                primaryAction={{
                    content: 'Discard changes',
                    destructive: true,
                    onAction: () => {
                        setContextualSaveBar(false)
                        setProductStatus(activeProductStatus)
                        setDiscardModal(false)
                    },
                }}
                secondaryActions={[
                    {
                        content: 'Continue editing',
                        onAction: () => {
                            setDiscardModal(false)
                        },
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <p> If you discard changes, you’ll delete any edits you made since you last saved. </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>

            <Modal
                open={tagsModal}
                onClose={handleTagsModal}
                title="Manage tags"
                primaryAction={{
                    content: 'Done',
                    onAction: () => {
                        setTagsModal(false)
                    },
                }}
            // secondaryActions={[
            //     {
            //         content: 'Cancel',
            //         onAction: () => {
            //             setTagsModal(false)
            //         },
            //     },
            // ]}
            >
                <Modal.Section>
                    <div className='Modal-Product-Tags'>
                        <OptionList
                            title="AVAILABLE"
                            onChange={setTagOptionsSelected}
                            options={TagsOptionsData}
                            selected={tagOptionsSelected}
                            allowMultiple
                        />
                    </div>
                </Modal.Section>
            </Modal>

            <Modal
                open={salesChannelModal}
                onClose={handleSalesChannelModal}
                title="Sales channels and apps"
                primaryAction={{
                    content: 'Done',
                    onAction: () => {
                        setSalesChannelModal(false)
                    },
                }}
            >
                <Modal.Section>
                    <OptionList
                        onChange={setSalesChannelSelected}
                        options={avaialbleSalesChannelsData}
                        selected={salesChannelSelected}
                        allowMultiple
                    />

                </Modal.Section>
            </Modal>


            <Page
                breadcrumbs={[{ content: 'Orders', url: '/admin/orders' }]}
                title={`Order ${params.orderId}`}
                titleMetadata={<Badge status="success">Active</Badge>}
                secondaryActions={[
                    { content: 'Duplicate' },
                    {
                        content: 'View',
                    },
                ]}
                actionGroups={[
                    {
                        title: 'Share',
                        accessibilityLabel: 'Action group label',
                        actions: [
                            {
                                content: 'Copy link',
                                icon: LinkMinor,
                                accessibilityLabel: 'Individual action label',
                                onAction: () => console.log('Share on Facebook action'),
                            },
                            {
                                content: 'Facebook',
                                icon: FacebookIcon,
                                accessibilityLabel: 'Individual action label',
                                onAction: () => console.log('Share on Facebook action'),
                            },
                            {
                                content: 'Twitter',
                                icon: TwitterIcon,
                                accessibilityLabel: 'Individual action label',
                                onAction: () => console.log('Share on Facebook action'),
                            },
                            {
                                content: 'Reddit',
                                icon: RedditIcon,
                                accessibilityLabel: 'Individual action label',
                                onAction: () => console.log('Share on Facebook action'),
                            },
                        ],
                    },
                    {
                        title: 'More actions',
                        accessibilityLabel: 'Action group label',
                        actions: [
                            {
                                content: 'Embed on a website',
                                icon: EmbedMinor,
                                accessibilityLabel: 'Individual action label',
                                onAction: () => console.log('Embed on a website'),
                            },
                            {
                                content: 'Create checkout link',
                                icon: CheckoutLink,
                                accessibilityLabel: 'Individual action label',
                                onAction: () => console.log('Create checkout link'),
                            },
                            {
                                content: 'Run Flow automation',
                                icon: RunflowAutomation,
                                accessibilityLabel: 'Individual action label',
                                onAction: () => console.log('Run Flow automation'),
                            },
                        ],
                    },
                ]}

                pagination={{
                    hasPrevious: true,
                    hasNext: true,
                }}
            >
                <Layout>
                    <Layout.Section>
                        <Card sectioned>
                            <TextField
                                label="Tile"
                                value={productTitle}
                                onChange={handleProductTitleChange}
                                autoComplete="off"
                                placeholder="Short sleeve t-shirt"
                                // requiredIndicator
                                error={isTitleInvalid}
                                id='product-title'
                            />
                            <div style={{ marginTop: '4px' }}>
                                <InlineError
                                    fieldID='product-title'
                                    message={isTitleInvalid && 'Title can’t be blank'}
                                />
                            </div>

                            <div className='Product-Options'>
                                <TextField
                                    label="Description"
                                    value={productDescription}
                                    onChange={handleProductDescriptionChange}
                                    multiline={6}
                                    autoComplete="off"

                                />
                            </div>
                        </Card>

                        <Card
                            sectioned
                            title="Media"
                            actions={[
                                {
                                    onAction: toggleOpenFileDialog,
                                },
                            ]}
                        >

                            {dropZone}
                            {uploadedFiles}
                        </Card>


                        <Card title="Options">
                            <div className='Product-Options-Card'>
                                <Card.Section>
                                    <div className='Product-Options-Section'>
                                        <div className='Product-Options-Control'>
                                            <span>
                                                <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg_375hu" focusable="false" aria-hidden="true"><path d="M7 2a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm0 6a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm0 6a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm6-8a2 2 0 1 0-.001-4.001 2 2 0 0 0 .001 4.001zm0 2a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm0 6a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001z"></path></svg>
                                            </span>
                                        </div>
                                        <div className='Product-Options-Grid'>
                                            <div className='Product-Options-Heading'>
                                                <Text variant="bodyMd" as="p" fontWeight="semibold">
                                                    Size
                                                </Text>
                                                <Button size="slim">Edit</Button>
                                            </div>

                                            <div className='Product-Options-Tags'>
                                                <Tag>S</Tag>
                                                <Tag>M</Tag>
                                                <Tag>L</Tag>
                                                <Tag>XL</Tag>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Section>

                                <Card.Section>
                                    <div className='Product-Options-Section'>
                                        <div className='Product-Options-Control'>
                                            <span>
                                                <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg_375hu" focusable="false" aria-hidden="true"><path d="M7 2a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm0 6a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm0 6a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm6-8a2 2 0 1 0-.001-4.001 2 2 0 0 0 .001 4.001zm0 2a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm0 6a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001z"></path></svg>
                                            </span>
                                        </div>
                                        <div className='Product-Options-Grid'>
                                            <div className='Product-Options-Heading'>
                                                <Text variant="bodyMd" as="p" fontWeight="semibold">
                                                    Color
                                                </Text>
                                                <Button size="slim">Edit</Button>
                                            </div>

                                            <div className='Product-Options-Tags'>
                                                <Tag>Black</Tag>
                                                <Tag>White</Tag>
                                                <Tag>Red</Tag>
                                                <Tag>Blue</Tag>
                                                <Tag>Brown</Tag>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Section>

                                <Card.Section>
                                    <div className='Product-Options-Section Add-Variant'>
                                        <div className='Product-Options-Control'>
                                            <span>
                                                <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg_375hu" focusable="false" aria-hidden="true"><path d="M10 4a1 1 0 0 0-1 1v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4v-4a1 1 0 0 0-1-1Z"></path></svg>
                                            </span>
                                        </div>
                                        <div className='Product-Options-Grid'>
                                            <span className='Add-Product-Variant'>
                                                <Text variant="bodyMd" as="p" fontWeight="regular">
                                                    Add another option
                                                </Text>
                                            </span>
                                        </div>
                                    </div>
                                </Card.Section>
                            </div>
                        </Card>

                        <Card title="Variants" actions={[{ content: 'Add variant' }]}>
                            {/* <Card.Section>
                                <div className='Variants-Filter-Section'>
                                    <Stack>
                                        <Text variant="bodyMd" as="p" color="subdued">
                                            Select
                                        </Text>
                                        <Button>All</Button>
                                        <Button>None</Button>
                                        <Button>Size</Button>
                                        <Button>Color</Button>
                                    </Stack>
                                </div>
                            </Card.Section> */}
                            <Card.Section>
                                <div className='Product-Variants-Table'>
                                    <IndexTable
                                        resourceName={resourceName}
                                        itemCount={productVariantsData.length}
                                        selectedItemsCount={
                                            allResourcesSelected ? 'All' : selectedResources.length
                                        }
                                        onSelectionChange={handleSelectionChange}
                                        hasMoreItems
                                        bulkActions={bulkActions}
                                        promotedBulkActions={promotedBulkActions}
                                        // lastColumnSticky
                                        headings={[
                                            { title: '' },
                                            { title: 'Variant' },
                                            { title: 'Price' },
                                            { title: 'Quantity' },
                                            { title: 'SKU' },
                                            { title: '' },
                                            // { title: '' },
                                        ]}
                                    >
                                        {rowMarkup}
                                    </IndexTable>
                                </div>
                            </Card.Section>
                        </Card>

                        <Card sectioned title="Search engine listing" actions={[{ content: 'Edit' }]}>
                            <p className='Product-Seo-Title'> Dance With The Devil</p>
                            <p className='Product-Seo-Url'> https://ilt2-development.myshopify.com/products/dance-with-the-devil-5</p>
                            <p className='Product-Seo-Description'>
                                Available In Black. Elastic Waistband Drawstring Side Hand Pockets Disclaimer: Due To The Printing Process A Difference In Saturation May Occur. Each Garment Is Unique 60% Cotton 40% Polyester Imported
                            </p>
                        </Card>

                    </Layout.Section>

                    <Layout.Section oneThird>
                        <Card title="Product status">
                            <Card.Section>
                                <Select
                                    options={productStatusOptions}
                                    onChange={handleProductStatusChange}
                                    value={productStatus}
                                />
                            </Card.Section>

                            <div className='Product-Card-Sales-Channel'>
                                <Card.Section
                                    actions={[{
                                        content: 'Manage',
                                        onAction: () => {
                                            setSalesChannelModal(true)
                                        },
                                    }]}
                                    title="SALES CHANNELS AND APPS" >
                                    {salesChannelContentMarkup}


                                </Card.Section>
                            </div>
                        </Card>

                        <div className='Insights-Card'>
                            <Card title="Insights" sectioned>
                                <Text as="h2" variant="bodyMd">
                                    Insights will display when the product has had recent sales
                                </Text>
                            </Card>
                        </div>

                        <div className='Product-Organization-Card'>
                            <Card title="Product organization" >
                                <Card.Section>
                                    <Autocomplete
                                        options={productCategoryOptions}
                                        selected={productCategory}
                                        onSelect={productCategoryUpdateSelection}
                                        loading={optionsLoading}
                                        textField={productCategoryInputField}
                                        id='product-category-value'
                                    />
                                </Card.Section>

                                <Card.Section>
                                    <Autocomplete
                                        options={productTypeOptions}
                                        selected={productTypeValue}
                                        onSelect={productTypeUpdateSelection}
                                        loading={optionsLoading}
                                        textField={productTypeInputField}
                                    />
                                </Card.Section>

                                <Card.Section>
                                    <Autocomplete
                                        options={vendorOptions}
                                        selected={vendorValue}
                                        onSelect={vendorUpdateSelection}
                                        loading={optionsLoading}
                                        textField={vendorInputField}
                                        id='vendor-value'
                                    />

                                    <div style={{ marginTop: '4px' }}>
                                        <InlineError
                                            fieldID='vendor-value'
                                            message={isVendorInvalid && 'Vendor can’t be blank'}
                                        />
                                    </div>
                                </Card.Section>

                                <Card.Section
                                    actions={[{
                                        content: 'Manage',
                                        onAction: () => {
                                            setTagsModal(true)
                                        },
                                    }]}>
                                    <div className='Product-Tags'>
                                        <Autocomplete
                                            // actionBefore={
                                            //     console.log('Action Clicked!')
                                            // }
                                            allowMultiple
                                            options={tagOptions}
                                            selected={tagOptionsSelected}
                                            textField={tagTextField}
                                            loading={optionsLoading}
                                            onSelect={setTagOptionsSelected}
                                            listTitle="Available Tags"
                                        />
                                        {tagsContentMarkup}
                                    </div>

                                </Card.Section>

                            </Card>
                        </div>

                        <div className='OnlineStore-Card'>
                            <Card title="Online Store" sectioned>
                                <Select
                                    label="Theme template"
                                    disabled
                                    options={[
                                        { label: 'Default Template', value: 'default-template' },
                                        { label: 'Dawn Theme', value: 'dawn-theme' },
                                        { label: 'Headless Hydrogen', value: 'headless-hydrogen' },
                                    ]}
                                />
                            </Card>
                        </div>

                    </Layout.Section>
                </Layout>

                <div className='Polaris-Product-Actions'>
                    <PageActions
                        primaryAction={{
                            content: 'Save',
                        }}
                        secondaryActions={[
                            { content: 'Archive product' },
                            {
                                content: 'Delete product',
                                destructive: true,
                            },
                        ]}
                    />
                </div>
            </Page >
        </>
    );
}

function FacebookIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" role="img" class="Polaris-Icon__Svg_375hu" focusable="false" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 8.049C16 3.604 12.418 0 8 0S0 3.604 0 8.049C0 12.066 2.925 15.396 6.75 16v-5.624H4.719V8.049H6.75V6.276c0-2.018 1.194-3.132 3.022-3.132.875 0 1.79.157 1.79.157v1.981h-1.008c-.994 0-1.304.62-1.304 1.257v1.51h2.219l-.355 2.327H9.25V16c3.825-.604 6.75-3.934 6.75-7.951Z"></path></svg>
    );
}

function TwitterIcon() {
    return (
        <svg width="16" height="14" viewBox="0 0 16 14" xmlns="http://www.w3.org/2000/svg" role="img" class="Polaris-Icon__Svg_375hu" focusable="false" aria-hidden="true"><path d="M14.362 3.737c.01.14.01.282.01.424 0 4.338-3.302 9.34-9.34 9.34v-.003A9.293 9.293 0 0 1 0 12.027a6.591 6.591 0 0 0 4.858-1.36 3.287 3.287 0 0 1-3.067-2.28c.492.095 1 .075 1.482-.057A3.283 3.283 0 0 1 .64 5.113V5.07c.457.254.967.395 1.49.41A3.287 3.287 0 0 1 1.114 1.1a9.317 9.317 0 0 0 6.765 3.43 3.285 3.285 0 0 1 5.594-2.995 6.587 6.587 0 0 0 2.085-.797 3.295 3.295 0 0 1-1.443 1.816A6.529 6.529 0 0 0 16 2.036a6.669 6.669 0 0 1-1.638 1.7Z"></path></svg>
    );
}

function RedditIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" role="img" class="Polaris-Icon__Svg_375hu" focusable="false" aria-hidden="true"><path d="M9.492 10.232a.144.144 0 0 1 0 .204c-.31.308-.796.458-1.487.458l-.006-.001-.005.001c-.69 0-1.177-.15-1.487-.459a.143.143 0 0 1 0-.203.146.146 0 0 1 .204 0c.253.251.672.374 1.283.374l.005.001.006-.001c.61 0 1.029-.123 1.282-.374a.146.146 0 0 1 .205 0ZM7.199 8.62a.614.614 0 0 0-1.23 0 .614.614 0 0 0 1.23 0ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-3.333-.086a1.032 1.032 0 0 0-1.75-.739c-.704-.463-1.656-.758-2.71-.796l.576-1.816 1.562.366-.002.023a.844.844 0 0 0 1.69 0 .844.844 0 0 0-1.63-.305l-1.684-.395a.144.144 0 0 0-.171.097l-.643 2.025c-1.104.013-2.104.31-2.839.787a1.03 1.03 0 0 0-1.733.753c0 .377.208.704.512.883-.02.11-.033.221-.033.334 0 1.52 1.87 2.758 4.169 2.758 2.298 0 4.168-1.238 4.168-2.758a1.83 1.83 0 0 0-.029-.315c.324-.174.547-.51.547-.902Zm-3.248.094a.614.614 0 0 0-.615.613.614.614 0 0 0 1.23 0 .614.614 0 0 0-.615-.613Z"></path></svg>
    );
}

function CheckoutLink() {
    return (
        <img src="https://cdn.shopify.com/s/files/applications/5076396ac61bba417a451577630ddc08_80x.png?1624291018" alt="checkout" />
    )
}

function RunflowAutomation() {
    return (
        <img src="https://cdn.shopify.com/s/files/applications/15100ebca4d221b650a7671125cd1444_80x.png?1661466254" alt="automation" />
    )
}