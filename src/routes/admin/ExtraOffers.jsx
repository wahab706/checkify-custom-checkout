import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Page,
  Button,
  ButtonGroup,
  Card,
  Icon,
  Tabs,
  Text,
  Form,
  FormLayout,
  TextContainer,
  PageActions,
  Stack,
  ResourceList,
  ResourceItem,
  Avatar,
  EmptyState,
  Toast,
  Modal,
  Sheet,
  Scrollable,
  Listbox,
  EmptySearchResult,
  AutoSelection,
  TextField,
  Loading,
  Thumbnail,
  DropZone,
} from "@shopify/polaris";
import { Link } from "react-router-dom";
import {
  ExternalMinor,
  DeleteMinor,
  EditMinor,
  MobileCancelMajor,
  SearchMinor,
  ChevronDownMinor,
  ChevronUpMinor,
  NoteMinor,
} from "@shopify/polaris-icons";
import axios from "axios";
import {
  SkeltonTabsWithThumbnail,
  getAccessToken,
  InputField,
  CheckBox,
  NotifyBanner,
} from "../../components";
import { AppContext } from "../../components/providers/ContextProvider";
import { useAuthState } from "../../components/providers/AuthProvider";

import EmptyCheckBox from "../../assets/icons/EmptyCheckBox.png";
import FillCheckBox from "../../assets/icons/FillCheckBox.png";
import CheckboxTree from "react-checkbox-tree";

export function ExtraOffers() {
  const { apiUrl } = useContext(AppContext);
  const { user } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [imageError, setImageError] = useState(false);
  const [btnUrlError, setBtnUrlError] = useState(false);

  const [offersData, setOffersData] = useState([]);
  const [offerId, setOfferId] = useState();
  const [thankYouOfferData, setThankYouOfferData] = useState([]);
  const [thankYouOfferId, setThankYouOfferId] = useState();

  const [modalDeleteOffer, setModalDeleteOffer] = useState(false);
  const [modalDeleteThankYouOffer, setModalDeleteThankYouOffer] =
    useState(false);
  const [offerSheet, setOfferSheet] = useState(false);
  const [editOfferToggle, setEditOfferToggle] = useState(false);
  const [thankYouOfferSheet, setThankYouOfferSheet] = useState(false);
  const [editThankYouOfferToggle, setEditThankYouOfferToggle] = useState(false);

  const [offer, setOffer] = useState({
    title: "",
    intTitle: "",
    description: "",
    imageUrl: "",
    selected: false,
    isRequiresShipping: false,
    isEnabled: true,
    price: "",
    appliesTo: "all",
    productId: null,
    productsIds: null,
    variantId: null,
    variantsIds: null,
  });

  const [thankYouOffer, setThankYouOffer] = useState({
    title: "",
    intTitle: "",
    description: "",
    imageUrl: "",
    isEnabled: true,
    price: "",
    appliesTo: "all",
    buttonText: "",
    buttonUrl: "",
    productId: null,
    productsIds: null,
    variantId: null,
    variantsIds: null,
  });

  const [file, setFile] = useState();
  const [file2, setFile2] = useState();

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile((file) => acceptedFiles[0]),
    []
  );

  const handleDropZoneDrop2 = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile2((file2) => acceptedFiles[0]),
    []
  );

  const handleRemoveImage = (type) => {
    if (type == "extraOffer") {
      setFile();
      setOffer({ ...offer, imageUrl: "" });
    } else if (type == "thankYouOffer") {
      setFile2();
      setThankYouOffer({ ...thankYouOffer, imageUrl: "" });
    }
  };

  const validImageTypes = [
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/svg",
  ];

  // =================Products Modal Code Start Here================
  const [productsLoading, setProductsLoading] = useState(false);
  const [queryValue, setQueryValue] = useState("");
  const [toggleLoadProducts, setToggleLoadProducts] = useState(true);
  const [productTab, setProductTab] = useState(0);
  const [productsModal, setProductsModal] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState([]);
  const [globalProducts, setGlobalProducts] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextPageCursor, setNextPageCursor] = useState("");
  const [selectedVariantProducts, setSelectedVariantProducts] = useState([]);
  const [checkedVariants, setCheckedVariants] = useState([]);
  const [previousCheckedVariants, setPreviousCheckedVariants] = useState([]);

  const handleProductTabChange = useCallback(
    (selectedTabIndex) => setProductTab(selectedTabIndex),
    []
  );

  const productModalTabs = [
    {
      id: "all-products",
      content: "All products",
    },
    {
      id: "selected-products",
      content: "Selected products",
    },
  ];

  const handleSelectProductsModal = () => {
    setProductsModal(true);
  };

  const handleProductsCancelModal = () => {
    setProductsModal(false);
    setCheckedVariants(previousCheckedVariants);
  };

  const handleProductsSaveModal = () => {
    setProductsModal(false);
    setPreviousCheckedVariants(checkedVariants);
  };

  const productsModalClose = () => {
    setProductsModal(false);
    setCheckedVariants([]);
    setPreviousCheckedVariants([]);
    setProductsLoading(false);
    setToggleLoadProducts(false);
    setProductTab(0);
    setQueryValue("");
    setExpandedProduct([]);
    let list = [];
    let all = [];
    globalProducts?.slice(0, 20).map((item) => {
      list.push(item);
    });
    globalProducts?.slice(0, 20).map((item) => {
      all.push(item);
    });
    setProductsList(list);
    setAllProducts(all);
    setGlobalProducts(all);
    setSelectedVariantProducts([]);
  };

  function SetCustomVariantsSelected(checked, type) {
    if (type == "all") {
      let array1 = [];
      checkedVariants?.map((item) => {
        allProducts?.map((item1) => {
          let value1 = item1.variants.find((item2) => item2.id == item);
          if (value1) {
            array1.push(value1.id);
          }
        });
      });
      let array2 = checkedVariants.filter(function (item) {
        return !array1.includes(item);
      });
      let array3 = checked.concat(array2);
      array3 = [...new Set(array3)];

      setCheckedVariants(array3);
    } else if (type == "selected") {
      setCheckedVariants(checked);
    }
  }

  useEffect(() => {
    // console.log('checkedVariants: ', checkedVariants)
    // console.log('previousCheckedVariants: ', previousCheckedVariants)

    let nodes = groupProductNodes(allProducts);
    setProductsList(nodes);

    let selectedNodes = [];
    let products = [];
    checkedVariants?.map((item) => {
      globalProducts?.map((item2) => {
        if (item2?.variants?.length > 0) {
          let value2 = item2.variants.find((item4) => item4.id == item);
          if (value2) {
            products.push(item2.id);
            selectedNodes.push(item2);
          }
        }
      });
    });

    let filtered = [...new Set(products)];
    if (selectedTab == 0) {
      setOffer({
        ...offer,
        variantsIds: checkedVariants,
        productsIds: filtered,
      });
    } else if (selectedTab == 1) {
      setThankYouOffer({
        ...thankYouOffer,
        variantsIds: checkedVariants,
        productsIds: filtered,
      });
    }

    selectedNodes = selectedNodes.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );
    setSelectedVariantProducts(groupProductNodes(selectedNodes));
  }, [checkedVariants]);

  // useEffect(() => {
  //     console.log('offer: ', offer);
  // }, [offer])

  // useEffect(() => {
  //     console.log('productsList: ', productsList)
  //     console.log('globalProducts: ', globalProducts);
  //     console.log('allProducts: ', allProducts)
  //     console.log('selectedVariantProducts: ', selectedVariantProducts)
  // }, [productsList, allProducts, globalProducts, selectedVariantProducts])

  function getSelectedVariantsLength(product) {
    let number = 0;
    allProducts?.map((item) => {
      if (item.id == product) {
        item.variants?.map((item2) => {
          if (checkedVariants?.find((obj) => obj == item2.id)) {
            number = number + 1;
          }
        });
      }
    });
    return number;
  }

  function groupProductNodes(data) {
    let arr = [];
    data?.map((item) => {
      let variants = [];
      if (item.variants?.length > 0) {
        item.variants?.map((item2) => {
          variants.push({
            value: item2.id,
            label: (
              <>
                <span>{item2.title}</span>
                <span>${item2.price}</span>
              </>
            ),
          });
        });
      }
      arr.push({
        value: item.id,
        label: (
          <>
            <span className="Product-Avatar">
              <Avatar size="extraSmall" name={item.title} source={item.image} />
              <span>{item.title}</span>
            </span>
            <span>
              {`${getSelectedVariantsLength(item.id)}/${
                item.totalVariants
              } selected`}
            </span>
          </>
        ),
        children: variants,
      });
    });

    return arr;
  }

  function variantsArraySet(variants, type) {
    let arr = [];
    if (type == "get") {
      if (variants?.edges?.length > 0) {
        variants?.edges?.map((item) => {
          arr.push({
            id: item.node.id.replace("gid://shopify/ProductVariant/", ""),
            title: item.node.title,
            price: item.node.price,
            productId: item.node.product.id.replace(
              "gid://shopify/Product/",
              ""
            ),
          });
        });
      }
    } else if (type == "set") {
      if (variants?.length > 0) {
        variants?.map((item) => {
          arr.push({
            id: item.id,
            title: item.title,
            price: item.price,
            productId: item.product_id,
          });
        });
      }
    }
    return arr;
  }

  function productsArraySet(products, type, value) {
    let nextValue = "";
    let productsArray = [];
    if (type == "get") {
      products?.edges?.map((item) => {
        nextValue = item.cursor;
        productsArray.push({
          id: item.node.id.replace("gid://shopify/Product/", ""),
          title: item.node.title,
          status: item.node.status,
          totalVariants: item.node.totalVariants,
          variants: variantsArraySet(item.node.variants, "get"),
          image: item.node.featuredImage?.transformedSrc,
        });
      });
      if (value == "products") {
        return productsArray;
      } else if (value == "nextPage") {
        return nextValue;
      }
    } else if (type == "set") {
      products?.map((item) => {
        productsArray.push({
          id: item.id.toString(),
          title: item.title,
          status: item.status,
          totalVariants: item.variants?.length ? item.variants?.length : 0,
          variants: variantsArraySet(item.variants, "set"),
          image: item.image?.src,
        });
      });
      if (value == "products") {
        return productsArray;
      }
    }
  }

  const getProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/shopify/products?title=${queryValue}&next=${nextPageCursor}&status=`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('getProducts response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        let products = response.data.data.body?.data?.products;

        if (products.edges?.length > 0) {
          let productsArray = productsArraySet(products, "get", "products");
          let nodes = groupProductNodes(productsArray);

          let list = [...productsList, ...nodes];
          let all = [...allProducts, ...productsArray];

          let ids = new Set(globalProducts.map((d) => d.id));
          let global = [
            ...globalProducts,
            ...productsArray.filter((d) => !ids.has(d.id)),
          ];
          setProductsList(list);
          setAllProducts(all);
          setGlobalProducts(global);

          setNextPageCursor(productsArraySet(products, "get", "nextPage"));
          setHasNextPage(products.pageInfo?.hasNextPage);
        }
      }

      setProductsLoading(false);
      setToggleLoadProducts(false);
    } catch (error) {
      console.warn("getProducts Api Error", error.response);
      setToastMsg("Server Error, Please Reload the page");
      setErrorToast(true);
      setToggleLoadProducts(false);
    }
  };

  useEffect(() => {
    if (toggleLoadProducts) {
      getProducts();
    }
  }, [toggleLoadProducts]);

  const handleProductsPagination = () => {
    if (hasNextPage) {
      setProductsLoading(true);
      setToggleLoadProducts(true);
    }
  };

  const LazyLoadingMarkup = productsLoading ? (
    <Listbox.Loading
      accessibilityLabel={`${queryValue ? "Filtering" : "Loading"} Products`}
    />
  ) : allProducts?.length > 0 && hasNextPage ? (
    <Button onClick={handleProductsPagination}>Load more...</Button>
  ) : null;

  const noResultsMarkup =
    !productsLoading && allProducts.length == 0 ? (
      <EmptySearchResult
        title="No product found"
        // description={`No product found`}
      />
    ) : null;

  const listboxMarkup = (
    <div>
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

    setProductsLoading(true);
    setNextPageCursor("");
    setProductsList([]);
    setAllProducts([]);
    setTimeout(() => {
      setToggleLoadProducts(true);
    }, 500);
  };

  const handleQueryClear = () => {
    handleQueryChange("");
  };

  // =================Products Modal Code Ends Here================

  const toggleErrorMsgActive = useCallback(
    () => setErrorToast((errorToast) => !errorToast),
    []
  );
  const toggleSuccessMsgActive = useCallback(
    () => setSucessToast((sucessToast) => !sucessToast),
    []
  );

  const toastErrorMsg = errorToast ? (
    <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
  ) : null;

  const toastSuccessMsg = sucessToast ? (
    <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
  ) : null;

  const handleDeleteOfferModal = () => {
    setModalDeleteOffer(!modalDeleteOffer);
    setOfferId();
  };

  const handleDeleteThankYouOfferModal = () => {
    setModalDeleteThankYouOffer(!modalDeleteThankYouOffer);
    setThankYouOfferId();
  };

  const handleOfferSheet = () => {
    setOfferSheet(!offerSheet);
    setEditOfferToggle(false);
    setOfferId();
    setImageError(false);
    setFile();
    setOffer({
      title: "",
      intTitle: "",
      description: "",
      imageUrl: "",
      selected: false,
      isRequiresShipping: false,
      isEnabled: true,
      price: "",
      appliesTo: "all",
      productId: "",
      productsIds: [],
      variantId: "",
      variantsIds: [],
    });

    productsModalClose();
  };

  const handleThankYouOfferSheet = () => {
    setThankYouOfferSheet(!thankYouOfferSheet);
    setEditThankYouOfferToggle(false);
    setThankYouOfferId();
    setImageError(false);
    setBtnUrlError(false);
    setFile2();
    setThankYouOffer({
      title: "",
      intTitle: "",
      description: "",
      imageUrl: "",
      isEnabled: true,
      price: "",
      appliesTo: "all",
      buttonText: "",
      buttonUrl: "",
      productId: null,
      productsIds: null,
      variantId: null,
      variantsIds: null,
    });

    productsModalClose();
  };

  const handleDeleteOffer = (id) => {
    setOfferId(id);
    setModalDeleteOffer(true);
  };

  const handleDeleteThankYouOffer = (id) => {
    setThankYouOfferId(id);
    setModalDeleteThankYouOffer(true);
  };

  const handleOffer = (e) => {
    if (e.target.name == "imageUrl") {
      setImageError(false);
    }
    setOffer({ ...offer, [e.target.name]: e.target.value });
  };

  const handleOfferCheckbox = (e) => {
    setOffer({ ...offer, [e.target.name]: e.target.checked });
  };

  const handleThankYouOffer = (e) => {
    if (e.target.name == "imageUrl") {
      setImageError(false);
    }
    if (e.target.name == "buttonUrl") {
      setBtnUrlError(false);
    }
    setThankYouOffer({ ...thankYouOffer, [e.target.name]: e.target.value });
  };

  const tabs = [
    {
      id: "1",
      content: "Offers on Checkout page",
    },
    {
      id: "2",
      content: "Offers on Thank You page",
    },
  ];

  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
    setToggleLoadData(true);
  };

  const EmptyCard = ({ value }) => {
    return (
      <div className="Empty-State-Card">
        <Card sectioned>
          {value === "offers" && (
            <EmptyState
              heading="You don't have any offers yet"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Offer on Checkout page — discretionary, services or product that
                you can provide to your customers (upsell, link download for
                digital products, etc.).
              </p>
              <Button primary onClick={handleOfferSheet}>
                Create offer
              </Button>
            </EmptyState>
          )}
          {value === "thankYou" && (
            <EmptyState
              heading="You don't have any offers yet"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Offer on Thank You page — services or product that you can
                provide to your customers (upsell, link download for digital
                products, etc.).
              </p>
              <Button primary onClick={handleThankYouOfferSheet}>
                Create offer
              </Button>
            </EmptyState>
          )}
        </Card>
      </div>
    );
  };

  function convertBooleanToNumber(value) {
    let booleanValue;
    if (value === true) {
      booleanValue = 1;
    } else {
      booleanValue = 0;
    }

    return booleanValue;
  }

  function convertNumberToBoolean(value) {
    let booleanValue;
    if (value === 1) {
      booleanValue = true;
    } else {
      booleanValue = false;
    }
    return booleanValue;
  }

  function checkImageURL(url) {
    if (typeof url !== "string") return false;
    return (
      url.match(
        /^http[^\?]*.(jpeg|jpg|gif|png|svg|tiff|bmp|JPG|PNG|GIF|JPEG|SVG|TIFF|BMP)(\?(.*))?$/gim
      ) != null
    );
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return false;
    } catch (err) {
      return true;
    }
  }

  function checkOfferVariants() {
    let value = true;
    if (offer.appliesTo == "products") {
      if (offer.variantsIds == null || !offer.variantsIds?.length) {
        value = false;
      }
    }
    return value;
  }

  function checkThankYouOfferVariants() {
    let value = true;
    if (thankYouOffer.appliesTo == "products") {
      if (
        thankYouOffer.variantsIds == null ||
        !thankYouOffer.variantsIds?.length
      ) {
        value = false;
      }
    }
    return value;
  }

  const getOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/customization/additional-offer`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('getOffers response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        setOffersData(response.data.data);
        setToggleLoadData(false);
        setLoading(false);
      }
    } catch (error) {
      console.warn("getOffers Api Error", error.response);
      setToggleLoadData(false);
      setLoading(false);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const deleteOffer = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[2]) {
        toggleId = { [2]: false };
      } else {
        toggleId = { [2]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.delete(
        `${apiUrl}/api/customization/additional-offer/${offerId}/delete`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('deleteOffer response: ', response.data);
      setBtnLoading(false);
      setToastMsg("Offer Deleted");
      setSucessToast(true);
      handleDeleteOfferModal();
      setToggleLoadData(true);
    } catch (error) {
      console.warn("deleteOffer Api Error", error.response);
      setBtnLoading(false);
      handleDeleteOfferModal();
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const createOffer = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", offer.title);
    formData.append("intTitle", offer.intTitle == null ? "" : offer.intTitle);
    formData.append("description", offer.description);
    formData.append("imageUrl", file ? file : offer.imageUrl);
    formData.append("selected", convertBooleanToNumber(offer.selected));
    formData.append(
      "isRequiresShipping",
      convertBooleanToNumber(offer.isRequiresShipping)
    );
    formData.append("isEnabled", convertBooleanToNumber(offer.isEnabled));
    formData.append("price", offer.price);
    formData.append("appliesTo", offer.appliesTo);
    formData.append("variantsIds", offer.variantsIds.toString());
    formData.append("productsIds", offer.productsIds.toString());

    if (checkOfferVariants()) {
      setBtnLoading((prev) => {
        let toggleId;
        if (prev[3]) {
          toggleId = { [3]: false };
        } else {
          toggleId = { [3]: true };
        }
        return { ...toggleId };
      });

      try {
        const response = await axios.post(
          `${apiUrl}/api/customization/additional-offer/store`,
          formData,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );

        // console.log('createOffer response: ', response.data);
        if (response.data.errors) {
          setToastMsg(response.data.message);
          setErrorToast(true);
        } else {
          handleOfferSheet();
          setToastMsg("Offer Created Sucessfully");
          setSucessToast(true);
          setToggleLoadData(true);
        }
        setBtnLoading(false);
      } catch (error) {
        console.warn("createOffer Api Error", error.response);
        // if (error.response?.status == 422) {
        //     setToastMsg('Image field is required')
        //     setErrorToast(true)
        // }
        if (error.response?.data?.message) {
          setToastMsg(error.response?.data?.message);
        } else {
          setToastMsg("Server Error");
        }
        setErrorToast(true);
        setBtnLoading(false);
      }
    } else {
      setToastMsg("You must have to select atleast one product");
      setErrorToast(true);
    }
  };

  const editOffer = async (id) => {
    setResourceLoading(true);
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[id]) {
        toggleId = { [id]: false };
      } else {
        toggleId = { [id]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.get(
        `${apiUrl}/api/customization/additional-offer/${id}/edit`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('editOffer response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        setOffer({
          title: response.data.data?.title,
          intTitle:
            response.data.data?.intTitle == "null"
              ? ""
              : response.data.data?.intTitle,
          description: response.data.data?.description,
          imageUrl: response.data.data?.imageUrl,
          selected: convertNumberToBoolean(response.data.data?.selected),
          isRequiresShipping: convertNumberToBoolean(
            response.data.data?.isRequiresShipping
          ),
          isEnabled: convertNumberToBoolean(response.data.data?.isEnabled),
          price: response.data.data?.price,
          appliesTo: response.data.data?.appliesTo,
          productsIds: response.data.data?.productsIds,
          variantsIds: response.data.data?.variantsIds,
        });

        if (response.data.data?.variantsIds != null) {
          let products =
            response.data.data?.proudct_data?.original?.data?.body?.products;
          let productsArray = productsArraySet(products, "set", "products");
          let ids = new Set(globalProducts.map((d) => d.id));
          let global = [
            ...globalProducts,
            ...productsArray.filter((d) => !ids.has(d.id)),
          ];
          setGlobalProducts(global);
        }

        let checked = [];
        if (response.data.data?.variantsIds != null) {
          checked = response.data.data?.variantsIds?.split(",");
        }
        setPreviousCheckedVariants(checked);
        setCheckedVariants(checked);

        setOfferId(id);
        setEditOfferToggle(true);

        setTimeout(() => {
          setOfferSheet(true);
          setResourceLoading(false);
          setBtnLoading(false);
        }, 500);
      }
    } catch (error) {
      console.warn("editOffer Api Error", error.response);
      setBtnLoading(false);
      setResourceLoading(false);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const updateOffer = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", offer.title);
    formData.append("intTitle", offer.intTitle == null ? "" : offer.intTitle);
    formData.append("description", offer.description);
    formData.append("imageUrl", file ? file : offer.imageUrl);
    formData.append("selected", convertBooleanToNumber(offer.selected));
    formData.append(
      "isRequiresShipping",
      convertBooleanToNumber(offer.isRequiresShipping)
    );
    formData.append("isEnabled", convertBooleanToNumber(offer.isEnabled));
    formData.append("price", offer.price);
    formData.append("appliesTo", offer.appliesTo);
    formData.append("variantsIds", offer.variantsIds.toString());
    formData.append("productsIds", offer.productsIds.toString());

    if (checkOfferVariants()) {
      setBtnLoading((prev) => {
        let toggleId;
        if (prev[3]) {
          toggleId = { [3]: false };
        } else {
          toggleId = { [3]: true };
        }
        return { ...toggleId };
      });

      try {
        const response = await axios.post(
          `${apiUrl}/api/customization/additional-offer/${offerId}/update?_method=PUT`,
          formData,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );

        // console.log('updateOffer response: ', response.data);
        if (response.data.errors) {
          setToastMsg(response.data.message);
          setErrorToast(true);
        } else {
          handleOfferSheet();
          setEditOfferToggle(false);
          setToastMsg("Offer Updated Sucessfully");
          setSucessToast(true);
          setToggleLoadData(true);
        }
        setBtnLoading(false);
      } catch (error) {
        console.warn("updateOffer Api Error", error.response);
        // if (error.response?.status == 422) {
        //     setToastMsg('Image field is required')
        //     setErrorToast(true)
        // }
        if (error.response?.data?.message) {
          setToastMsg(error.response?.data?.message);
        } else {
          setToastMsg("Server Error");
        }
        setErrorToast(true);
        setBtnLoading(false);
      }
    } else {
      setToastMsg("You must have to select atleast one product");
      setErrorToast(true);
    }
  };

  const updateOfferStatus = async (id, value) => {
    setResourceLoading(true);
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[id]) {
        toggleId = { [id]: false };
      } else {
        toggleId = { [id]: true };
      }
      return { ...toggleId };
    });

    let enableValue = "";
    let offerStatus = "";
    if (value == 0) {
      enableValue = 1;
      offerStatus = "Offer Enabled";
    } else {
      enableValue = 0;
      offerStatus = "Offer Disabled";
    }

    let data = {
      isEnabled: enableValue,
      mini: 1,
    };

    try {
      const response = await axios.put(
        `${apiUrl}/api/customization/additional-offer/${id}/update`,
        data,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      setBtnLoading(false);
      setResourceLoading(false);
      setToastMsg(offerStatus);
      setSucessToast(true);
      setToggleLoadData(true);
    } catch (error) {
      console.warn("updateOfferStatus Api Error", error.response);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
      setBtnLoading(false);
      setResourceLoading(false);
    }
  };

  const getThankYouOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/customization/thankyou-page-offer`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('getThankYouOffers response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        setThankYouOfferData(response.data.data);
        setToggleLoadData(false);
        setLoading(false);
      }
    } catch (error) {
      console.warn("getThankYouOffers Api Error", error.response);
      setToggleLoadData(false);
      setLoading(false);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const deleteThankYouOffer = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[2]) {
        toggleId = { [2]: false };
      } else {
        toggleId = { [2]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.delete(
        `${apiUrl}/api/customization/thankyou-page-offer/${thankYouOfferId}/delete`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('deleteThankYouOffer response: ', response.data);
      setBtnLoading(false);
      setToastMsg("Offer Deleted");
      setSucessToast(true);
      handleDeleteThankYouOfferModal();
      setToggleLoadData(true);
    } catch (error) {
      console.warn("deleteThankYouOffer Api Error", error.response);
      setBtnLoading(false);
      handleDeleteThankYouOfferModal();
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const createThankYouOffer = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", thankYouOffer.title);
    formData.append("description", thankYouOffer.description);
    formData.append("imageUrl", file2 ? file2 : thankYouOffer.imageUrl);
    formData.append(
      "price",
      thankYouOffer.price == null ? "" : thankYouOffer.price
    );
    formData.append(
      "intTitle",
      thankYouOffer.intTitle == null ? "" : thankYouOffer.intTitle
    );
    formData.append(
      "buttonText",
      thankYouOffer.buttonText == null ? "" : thankYouOffer.buttonText
    );
    formData.append(
      "buttonUrl",
      thankYouOffer.buttonUrl == null ? "" : thankYouOffer.buttonUrl
    );
    formData.append(
      "isEnabled",
      convertBooleanToNumber(thankYouOffer.isEnabled)
    );
    formData.append("appliesTo", thankYouOffer.appliesTo);
    formData.append("variantsIds", thankYouOffer.variantsIds.toString());
    formData.append("productsIds", thankYouOffer.productsIds.toString());

    if (checkThankYouOfferVariants()) {
      setBtnLoading((prev) => {
        let toggleId;
        if (prev[3]) {
          toggleId = { [3]: false };
        } else {
          toggleId = { [3]: true };
        }
        return { ...toggleId };
      });

      try {
        const response = await axios.post(
          `${apiUrl}/api/customization/thankyou-page-offer/store`,
          formData,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );

        // console.log('createThankYouOffer response: ', response.data);
        if (response.data.errors) {
          setToastMsg(response.data.message);
          setErrorToast(true);
        } else {
          handleThankYouOfferSheet();
          setToastMsg("Offer Created Sucessfully");
          setSucessToast(true);
          setToggleLoadData(true);
        }
        setBtnLoading(false);
      } catch (error) {
        console.warn("createThankYouOffer Api Error", error.response);
        // if (error.response?.status == 422) {
        //     setToastMsg('Image field is required')
        //     setErrorToast(true)
        // }
        if (error.response?.data?.message) {
          setToastMsg(error.response?.data?.message);
        } else {
          setToastMsg("Server Error");
        }
        setErrorToast(true);
        setBtnLoading(false);
      }
    } else {
      setToastMsg("You must have to select atleast one product");
      setErrorToast(true);
    }
  };

  const editThankYouOffer = async (id) => {
    setResourceLoading(true);
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[id]) {
        toggleId = { [id]: false };
      } else {
        toggleId = { [id]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.get(
        `${apiUrl}/api/customization/thankyou-page-offer/${id}/edit`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('editThankYouOffer response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        setThankYouOffer({
          title: response.data.data?.title,
          description: response.data.data?.description,
          imageUrl: response.data.data?.imageUrl,
          isEnabled: convertNumberToBoolean(response.data.data?.isEnabled),
          price:
            response.data.data?.price == "null"
              ? ""
              : response.data.data?.price,
          intTitle:
            response.data.data?.intTitle == "null"
              ? ""
              : response.data.data?.intTitle,
          buttonText:
            response.data.data?.buttonText == "null"
              ? ""
              : response.data.data?.buttonText,
          buttonUrl:
            response.data.data?.buttonUrl == "null"
              ? ""
              : response.data.data?.buttonUrl,
          appliesTo: response.data.data?.appliesTo,
          productsIds: response.data.data?.productsIds,
          variantsIds: response.data.data?.variantsIds,
        });

        if (response.data.data?.variantsIds != null) {
          let products =
            response.data.data?.proudct_data?.original?.data?.body?.products;
          let productsArray = productsArraySet(products, "set", "products");
          let ids = new Set(globalProducts.map((d) => d.id));
          let global = [
            ...globalProducts,
            ...productsArray.filter((d) => !ids.has(d.id)),
          ];
          setGlobalProducts(global);
        }

        let checked = [];
        if (response.data.data?.variantsIds != null) {
          checked = response.data.data?.variantsIds?.split(",");
        }
        setPreviousCheckedVariants(checked);
        setCheckedVariants(checked);

        setThankYouOfferId(id);
        setEditThankYouOfferToggle(true);

        setTimeout(() => {
          setResourceLoading(false);
          setBtnLoading(false);
          setThankYouOfferSheet(true);
        }, 500);
      }
    } catch (error) {
      console.warn("editThankYouOffer Api Error", error.response);
      setBtnLoading(false);
      setResourceLoading(false);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const updateThankYouOffer = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", thankYouOffer.title);
    formData.append("description", thankYouOffer.description);
    formData.append("imageUrl", file2 ? file2 : thankYouOffer.imageUrl);
    formData.append(
      "price",
      thankYouOffer.price == null ? "" : thankYouOffer.price
    );
    formData.append(
      "intTitle",
      thankYouOffer.intTitle == null ? "" : thankYouOffer.intTitle
    );
    formData.append(
      "buttonText",
      thankYouOffer.buttonText == null ? "" : thankYouOffer.buttonText
    );
    formData.append(
      "buttonUrl",
      thankYouOffer.buttonUrl == null ? "" : thankYouOffer.buttonUrl
    );
    formData.append(
      "isEnabled",
      convertBooleanToNumber(thankYouOffer.isEnabled)
    );
    formData.append("appliesTo", thankYouOffer.appliesTo);
    formData.append("variantsIds", thankYouOffer.variantsIds.toString());
    formData.append("productsIds", thankYouOffer.productsIds.toString());

    if (checkThankYouOfferVariants()) {
      setBtnLoading((prev) => {
        let toggleId;
        if (prev[3]) {
          toggleId = { [3]: false };
        } else {
          toggleId = { [3]: true };
        }
        return { ...toggleId };
      });

      try {
        const response = await axios.post(
          `${apiUrl}/api/customization/thankyou-page-offer/${thankYouOfferId}/update?_method=PUT`,
          formData,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );

        // console.log('updateThankYouOffer response: ', response.data);
        if (response.data.errors) {
          setToastMsg(response.data.message);
          setErrorToast(true);
        } else {
          handleThankYouOfferSheet();
          setEditThankYouOfferToggle(false);
          setToastMsg("Offer Updated Sucessfully");
          setSucessToast(true);
          setToggleLoadData(true);
        }
        setBtnLoading(false);
      } catch (error) {
        console.warn("updateThankYouOffer Api Error", error.response);
        // if (error.response?.status == 422) {
        //     setToastMsg('Image field is required')
        //     setErrorToast(true)
        // }
        if (error.response?.data?.message) {
          setToastMsg(error.response?.data?.message);
        } else {
          setToastMsg("Server Error");
        }
        setErrorToast(true);
        setBtnLoading(false);
      }
    } else {
      setToastMsg("You must have to select atleast one product");
      setErrorToast(true);
    }
  };

  const updateThankYouOfferStatus = async (id, value) => {
    setResourceLoading(true);
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[id]) {
        toggleId = { [id]: false };
      } else {
        toggleId = { [id]: true };
      }
      return { ...toggleId };
    });

    let enableValue = "";
    let offerStatus = "";
    if (value == 0) {
      enableValue = 1;
      offerStatus = "Offer Enabled";
    } else {
      enableValue = 0;
      offerStatus = "Offer Disabled";
    }

    let data = {
      isEnabled: enableValue,
      mini: 1,
    };

    try {
      const response = await axios.put(
        `${apiUrl}/api/customization/thankyou-page-offer/${id}/update`,
        data,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      setBtnLoading(false);
      setResourceLoading(false);
      setToastMsg(offerStatus);
      setSucessToast(true);
      setToggleLoadData(true);
    } catch (error) {
      console.warn("updateThankYouOfferStatus Api Error", error.response);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
      setBtnLoading(false);
      setResourceLoading(false);
    }
  };

  useEffect(() => {
    if (toggleLoadData) {
      switch (selectedTab) {
        case 0:
          getOffers();
          break;

        case 1:
          getThankYouOffers();
          break;

        default:
          setSelectedTab(0);
          getOffers();
          break;
      }
    }
  }, [toggleLoadData]);

  return (
    <div className="Customization-Page">
      <Modal
        open={productsModal}
        onClose={handleProductsCancelModal}
        title="Select Products"
        primaryAction={{
          content: "Save",
          onAction: handleProductsSaveModal,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleProductsCancelModal,
          },
        ]}
      >
        <Modal.Section>
          <div className="Countries-Modal-Section Products-Modal-Section">
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

            <Tabs
              tabs={productModalTabs}
              selected={productTab}
              onSelect={handleProductTabChange}
            >
              {(() => {
                switch (productTab) {
                  case 0:
                    return (
                      <>
                        <CheckboxTree
                          nodes={productsList}
                          checked={checkedVariants}
                          expanded={expandedProduct}
                          onCheck={(checked) =>
                            SetCustomVariantsSelected(checked, "all")
                          }
                          onExpand={(expanded) => setExpandedProduct(expanded)}
                          icons={{
                            check: <img src={FillCheckBox} alt="checkbox" />,
                            halfCheck: (
                              <span className="Polaris-Icon-Half-Check">
                                <svg
                                  viewBox="0 0 20 20"
                                  className="Polaris-Icon__Svg"
                                  focusable="false"
                                  aria-hidden="true"
                                >
                                  <path d="M14.167 9h-8.334c-.46 0-.833.448-.833 1s.372 1 .833 1h8.334c.46 0 .833-.448.833-1s-.373-1-.833-1"></path>{" "}
                                </svg>
                              </span>
                            ),
                            uncheck: <img src={EmptyCheckBox} alt="checkbox" />,
                            expandClose: <Icon source={ChevronDownMinor} />,
                            expandOpen: <Icon source={ChevronUpMinor} />,
                          }}
                        />
                        {listboxMarkup}
                      </>
                    );

                  case 1:
                    return (
                      <span className="Selected-Tab-Modal">
                        <CheckboxTree
                          nodes={selectedVariantProducts}
                          checked={checkedVariants}
                          expanded={expandedProduct}
                          onCheck={(checked) =>
                            SetCustomVariantsSelected(checked, "selected")
                          }
                          onExpand={(expanded) => setExpandedProduct(expanded)}
                          icons={{
                            check: <img src={FillCheckBox} alt="checkbox" />,
                            halfCheck: (
                              <span className="Polaris-Icon-Half-Check">
                                <svg
                                  viewBox="0 0 20 20"
                                  className="Polaris-Icon__Svg"
                                  focusable="false"
                                  aria-hidden="true"
                                >
                                  <path d="M14.167 9h-8.334c-.46 0-.833.448-.833 1s.372 1 .833 1h8.334c.46 0 .833-.448.833-1s-.373-1-.833-1"></path>{" "}
                                </svg>
                              </span>
                            ),
                            uncheck: <img src={EmptyCheckBox} alt="checkbox" />,
                            expandClose: <Icon source={ChevronDownMinor} />,
                            expandOpen: <Icon source={ChevronUpMinor} />,
                          }}
                        />
                        {/* {listboxMarkup} */}
                      </span>
                    );

                  default:
                    break;
                }
              })()}
            </Tabs>
          </div>
        </Modal.Section>
      </Modal>

      <Modal
        small
        open={modalDeleteOffer}
        onClose={handleDeleteOfferModal}
        title="Delete offer?"
        loading={btnLoading[2]}
        primaryAction={{
          content: "Delete",
          destructive: true,
          disabled: btnLoading[2],
          onAction: deleteOffer,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading[2],
            onAction: handleDeleteOfferModal,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>Are you sure? This action can not be undone.</p>
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Modal
        small
        open={modalDeleteThankYouOffer}
        onClose={handleDeleteThankYouOfferModal}
        title="Delete offer?"
        loading={btnLoading[2]}
        primaryAction={{
          content: "Delete",
          destructive: true,
          disabled: btnLoading[2],
          onAction: deleteThankYouOffer,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading[2],
            onAction: handleDeleteThankYouOfferModal,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>Are you sure? This action can not be undone.</p>
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Sheet
        open={offerSheet}
        onClose={handleOfferSheet}
        accessibilityLabel="Add Offer"
      >
        <Form onSubmit={editOfferToggle ? updateOffer : createOffer}>
          <div className="Sheet-Container">
            <div className="Sheet-Header">
              <Text variant="headingMd" as="h2">
                {editOfferToggle ? "Edit Offer " : "Add Offer "}
              </Text>
              <Button
                accessibilityLabel="Cancel"
                icon={MobileCancelMajor}
                onClick={handleOfferSheet}
                plain
              />
            </div>

            <Scrollable className="Sheet-Scrollable">
              <FormLayout>
                <FormLayout.Group>
                  <InputField
                    type="text"
                    label="Internal offer name"
                    name="intTitle"
                    value={offer.intTitle}
                    onChange={handleOffer}
                    autoComplete="off"
                    placeholder="Enter internal offer name"
                  />

                  <InputField
                    type="number"
                    label="Offer price"
                    name="price"
                    value={offer.price}
                    onChange={handleOffer}
                    autoComplete="off"
                    required
                    suffix={`${user?.currency}`}
                    placeholder="Enter Offer price"
                  />
                </FormLayout.Group>

                <InputField
                  type="text"
                  label="Offer title"
                  name="title"
                  value={offer.title}
                  onChange={handleOffer}
                  autoComplete="off"
                  required
                  placeholder="Enter Offer title"
                />

                <InputField
                  type="text"
                  label="Offer description"
                  name="description"
                  value={offer.description}
                  onChange={handleOffer}
                  autoComplete="off"
                  required
                  placeholder="Enter Offer Description"
                />

                {/* <InputField
                                    type="text"
                                    label="Offer image"
                                    name='imageUrl'
                                    value={offer.imageUrl}
                                    onChange={handleOffer}
                                    autoComplete="off"
                                    required
                                    error={imageError && 'Invalid URL'}
                                    placeholder='Enter Offer Image Url'
                                /> */}

                <div style={{ width: 114, height: 114 }}>
                  <DropZone
                    allowMultiple={false}
                    onDrop={handleDropZoneDrop}
                    accept="image/*"
                    type="image"
                  >
                    {(!offer.imageUrl || offer.imageUrl == "null") && !file && (
                      <DropZone.FileUpload actionTitle={"Add Image"} />
                    )}
                    {offer.imageUrl && offer.imageUrl != "null" && !file && (
                      <span>
                        <Thumbnail
                          size="large"
                          alt={"header-img"}
                          source={offer.imageUrl}
                        />
                      </span>
                    )}
                    {file && (
                      <span>
                        <Thumbnail
                          size="large"
                          alt={file.name}
                          source={
                            validImageTypes.includes(file.type)
                              ? window.URL.createObjectURL(file)
                              : NoteMinor
                          }
                        />
                      </span>
                    )}
                  </DropZone>
                </div>

                {(offer.imageUrl && offer.imageUrl != "null") || file ? (
                  <span className="Image-Remove">
                    <Button
                      plain
                      onClick={() => handleRemoveImage("extraOffer")}
                    >
                      Remove
                    </Button>
                  </span>
                ) : (
                  ""
                )}

                <FormLayout.Group>
                  <span className="Modal-Select">
                    <label htmlFor="offer-isRequiresShipping">
                      Requires shipping
                    </label>
                    <input
                      id="offer-isRequiresShipping"
                      type="checkbox"
                      name="isRequiresShipping"
                      className="tgl tgl-light"
                      checked={offer.isRequiresShipping}
                      onChange={handleOfferCheckbox}
                    />
                    <label
                      htmlFor="offer-isRequiresShipping"
                      className="tgl-btn"
                    ></label>
                  </span>

                  <span className="Modal-Select">
                    <label htmlFor="offer-selected">Pre-select offer</label>
                    <input
                      id="offer-selected"
                      type="checkbox"
                      name="selected"
                      className="tgl tgl-light"
                      checked={offer.selected}
                      onChange={handleOfferCheckbox}
                    />
                    <label htmlFor="offer-selected" className="tgl-btn"></label>
                  </span>
                </FormLayout.Group>

                <div className="Products-Selection-Section">
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    Offer applies to
                  </Text>

                  <CheckBox
                    name="appliesTo"
                    value="all"
                    checked={offer.appliesTo == "all" ? true : false}
                    onChange={handleOffer}
                    label="All products"
                  />

                  <CheckBox
                    name="appliesTo"
                    value="products"
                    checked={offer.appliesTo == "products" ? true : false}
                    onChange={handleOffer}
                    label="Specific products"
                  />
                </div>

                <div className="Products-Section">
                  {offer.appliesTo == "products" && (
                    <span>
                      {checkedVariants?.length < 1 ? (
                        <Card sectioned subdued>
                          <Stack>
                            <Text variant="bodyMd" as="p" fontWeight="regular">
                              No product selected
                            </Text>
                            <Button primary onClick={handleSelectProductsModal}>
                              Select products
                            </Button>
                          </Stack>
                        </Card>
                      ) : (
                        <Card sectioned subdued>
                          <Stack>
                            <Text variant="bodyMd" as="p" fontWeight="medium">
                              {offer.variantsIds?.length} Variants (of{" "}
                              {offer.productsIds?.length} Product) selected
                            </Text>
                            <Button primary onClick={handleSelectProductsModal}>
                              Select products
                            </Button>
                          </Stack>
                        </Card>
                      )}
                    </span>
                  )}
                </div>
              </FormLayout>
            </Scrollable>

            <div className="Sheet-Footer">
              <Button onClick={handleOfferSheet} disabled={productsModal}>
                Cancel
              </Button>
              <Button
                primary
                submit
                loading={btnLoading[3]}
                disabled={productsModal}
              >
                {editOfferToggle ? "Update Offer " : "Create Offer "}
              </Button>
            </div>
          </div>
        </Form>
      </Sheet>

      <Sheet
        open={thankYouOfferSheet}
        onClose={handleThankYouOfferSheet}
        accessibilityLabel="Add Offer"
      >
        <Form
          onSubmit={
            editThankYouOfferToggle ? updateThankYouOffer : createThankYouOffer
          }
        >
          <div className="Sheet-Container">
            <div className="Sheet-Header">
              <Text variant="headingMd" as="h2">
                {editThankYouOfferToggle ? "Edit Offer " : "Add Offer "}
              </Text>
              <Button
                accessibilityLabel="Cancel"
                icon={MobileCancelMajor}
                onClick={handleThankYouOfferSheet}
                plain
              />
            </div>

            <Scrollable className="Sheet-Scrollable">
              <FormLayout>
                <FormLayout.Group>
                  <InputField
                    type="text"
                    label="Internal offer name"
                    name="intTitle"
                    value={thankYouOffer.intTitle}
                    onChange={handleThankYouOffer}
                    autoComplete="off"
                    placeholder="Enter internal offer name"
                  />

                  <InputField
                    type="number"
                    label="Offer price"
                    name="price"
                    value={thankYouOffer.price}
                    onChange={handleThankYouOffer}
                    autoComplete="off"
                    suffix={`${user?.currency}`}
                    placeholder="Enter Offer price"
                  />
                </FormLayout.Group>

                <InputField
                  type="text"
                  label="Offer title"
                  name="title"
                  value={thankYouOffer.title}
                  onChange={handleThankYouOffer}
                  autoComplete="off"
                  required
                  placeholder="Enter Offer title"
                />

                <InputField
                  type="text"
                  label="Offer description"
                  name="description"
                  value={thankYouOffer.description}
                  onChange={handleThankYouOffer}
                  autoComplete="off"
                  required
                  placeholder="Enter Offer Description"
                />

                {/* <InputField
                                    type="text"
                                    label="Offer image"
                                    name='imageUrl'
                                    value={thankYouOffer.imageUrl}
                                    onChange={handleThankYouOffer}
                                    autoComplete="off"
                                    required
                                    error={imageError && 'Invalid URL'}
                                    placeholder='Enter Offer Image Url'
                                /> */}

                <div style={{ width: 114, height: 114 }}>
                  <DropZone
                    allowMultiple={false}
                    onDrop={handleDropZoneDrop2}
                    accept="image/*"
                    type="image"
                  >
                    {(!thankYouOffer.imageUrl ||
                      thankYouOffer.imageUrl == "null") &&
                      !file2 && (
                        <DropZone.FileUpload actionTitle={"Add Image"} />
                      )}
                    {thankYouOffer.imageUrl &&
                      thankYouOffer.imageUrl != "null" &&
                      !file2 && (
                        <span>
                          <Thumbnail
                            size="large"
                            alt={"header-img"}
                            source={thankYouOffer.imageUrl}
                          />
                        </span>
                      )}
                    {file2 && (
                      <span>
                        <Thumbnail
                          size="large"
                          alt={file2.name}
                          source={
                            validImageTypes.includes(file2.type)
                              ? window.URL.createObjectURL(file2)
                              : NoteMinor
                          }
                        />
                      </span>
                    )}
                  </DropZone>
                </div>

                {(thankYouOffer.imageUrl && thankYouOffer.imageUrl != "null") ||
                file2 ? (
                  <span className="Image-Remove">
                    <Button
                      plain
                      onClick={() => handleRemoveImage("thankYouOffer")}
                    >
                      Remove
                    </Button>
                  </span>
                ) : (
                  ""
                )}

                <InputField
                  type="text"
                  label="Button URL"
                  name="buttonUrl"
                  value={thankYouOffer.buttonUrl}
                  onChange={handleThankYouOffer}
                  autoComplete="off"
                  error={btnUrlError && "Invalid URL"}
                  placeholder="Enter Button URL"
                />

                <InputField
                  type="text"
                  label="Button text"
                  name="buttonText"
                  value={thankYouOffer.buttonText}
                  onChange={handleThankYouOffer}
                  autoComplete="off"
                  placeholder="Enter Button text"
                />

                <div className="Products-Selection-Section">
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    Offer applies to
                  </Text>

                  <CheckBox
                    name="appliesTo"
                    value="all"
                    checked={thankYouOffer.appliesTo == "all" ? true : false}
                    onChange={handleThankYouOffer}
                    label="All products"
                  />

                  <CheckBox
                    name="appliesTo"
                    value="products"
                    checked={
                      thankYouOffer.appliesTo == "products" ? true : false
                    }
                    onChange={handleThankYouOffer}
                    label="Specific products"
                  />
                </div>

                <div className="Products-Section">
                  {thankYouOffer.appliesTo == "products" && (
                    <span>
                      {checkedVariants?.length < 1 ? (
                        <Card sectioned subdued>
                          <Stack>
                            <Text variant="bodyMd" as="p" fontWeight="regular">
                              No product selected
                            </Text>
                            <Button primary onClick={handleSelectProductsModal}>
                              Select products
                            </Button>
                          </Stack>
                        </Card>
                      ) : (
                        <Card sectioned subdued>
                          <Stack>
                            <Text variant="bodyMd" as="p" fontWeight="medium">
                              {thankYouOffer.variantsIds?.length} Variants (of{" "}
                              {thankYouOffer.productsIds?.length} Product)
                              selected
                            </Text>
                            <Button primary onClick={handleSelectProductsModal}>
                              Select products
                            </Button>
                          </Stack>
                        </Card>
                      )}
                    </span>
                  )}
                </div>
              </FormLayout>
            </Scrollable>

            <div className="Sheet-Footer">
              <Button
                onClick={handleThankYouOfferSheet}
                disabled={productsModal}
              >
                Cancel
              </Button>
              <Button
                primary
                submit
                loading={btnLoading[3]}
                disabled={productsModal}
              >
                {editThankYouOfferToggle ? "Update Offer " : "Create Offer "}
              </Button>
            </div>
          </div>
        </Form>
      </Sheet>

      {loading && <Loading />}
      <Page
        fullWidth
        title="Extra Offers"
        primaryAction={{
          content: "Create Offer",
          onAction:
            selectedTab == 0 ? handleOfferSheet : handleThankYouOfferSheet,
        }}
        // secondaryActions={
        //     <ButtonGroup>
        //         <a
        //         //  href='https://help.checkify.pro/en/articles/4367163-general-customization-settings'
        //           target='_blank'>
        //             <Button>Explore the guide <Icon source={ExternalMinor}></Icon></Button>
        //         </a>
        //     </ButtonGroup>
        // }
      >
        <NotifyBanner />
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
          {loading ? (
            <SkeltonTabsWithThumbnail />
          ) : (
            <>
              {(() => {
                switch (selectedTab) {
                  case 0:
                    return (
                      <div className="Customization-Tab4 Custom-ResourceList Custom-ResourceList-Offers">
                        {offersData?.length > 0 ? (
                          <span>
                            <ResourceList
                              loading={resourceLoading}
                              resourceName={{
                                singular: "offer",
                                plural: "offers",
                              }}
                              items={offersData}
                              renderItem={(item) => {
                                const {
                                  id,
                                  imageUrl,
                                  intTitle,
                                  title,
                                  description,
                                  isEnabled,
                                } = item;

                                return (
                                  <Card>
                                    <ResourceItem
                                      id={id}
                                      media={
                                        <Avatar
                                          customer
                                          size="medium"
                                          name={intTitle}
                                          source={imageUrl}
                                        />
                                      }
                                      accessibilityLabel={`View details for ${intTitle}`}
                                      name={intTitle}
                                    >
                                      <div className="Title">
                                        <Text
                                          variant="bodyMd"
                                          fontWeight="bold"
                                          as="h3"
                                        >
                                          {intTitle}
                                        </Text>
                                        <Text
                                          variant="bodyMd"
                                          fontWeight="semibold"
                                          as="h3"
                                        >
                                          {description}
                                        </Text>
                                        {title && <span>Title: {title}</span>}
                                      </div>

                                      <div className="Action-Section">
                                        <span
                                          onClick={() =>
                                            updateOfferStatus(id, isEnabled)
                                          }
                                        >
                                          <input
                                            id={id}
                                            type="checkbox"
                                            className="tgl tgl-light"
                                            checked={convertNumberToBoolean(
                                              isEnabled
                                            )}
                                          />
                                          <label
                                            htmlFor={id}
                                            className="tgl-btn"
                                          ></label>
                                        </span>

                                        <ButtonGroup>
                                          <Button onClick={() => editOffer(id)}>
                                            <Icon source={EditMinor}></Icon>
                                          </Button>

                                          <Button
                                            onClick={() =>
                                              handleDeleteOffer(id)
                                            }
                                          >
                                            <Icon source={DeleteMinor}></Icon>
                                          </Button>
                                        </ButtonGroup>
                                      </div>
                                    </ResourceItem>
                                  </Card>
                                );
                              }}
                            />

                            {/* <PageActions
                                                            primaryAction={{
                                                                content: 'Create Offer',
                                                                onAction: handleOfferSheet
                                                            }}
                                                        /> */}
                          </span>
                        ) : (
                          <EmptyCard value="offers" />
                        )}
                      </div>
                    );

                  case 1:
                    return (
                      <div className="Customization-Tab5 Custom-ResourceList Custom-ResourceList-Offers">
                        {thankYouOfferData?.length > 0 ? (
                          <span>
                            <ResourceList
                              loading={resourceLoading}
                              resourceName={{
                                singular: "ThankYou Offer",
                                plural: "ThankYou Offers",
                              }}
                              items={thankYouOfferData}
                              renderItem={(item) => {
                                const {
                                  id,
                                  imageUrl,
                                  intTitle,
                                  title,
                                  description,
                                  isEnabled,
                                } = item;

                                return (
                                  <Card>
                                    <ResourceItem
                                      id={id}
                                      media={
                                        <Avatar
                                          customer
                                          size="medium"
                                          name={intTitle}
                                          source={imageUrl}
                                        />
                                      }
                                      accessibilityLabel={`View details for ${intTitle}`}
                                      name={intTitle}
                                    >
                                      <div className="Title">
                                        <Text
                                          variant="bodyMd"
                                          fontWeight="bold"
                                          as="h3"
                                        >
                                          {intTitle}
                                        </Text>
                                        <Text
                                          variant="bodyMd"
                                          fontWeight="semibold"
                                          as="h3"
                                        >
                                          {description}
                                        </Text>
                                        {title && <span>Title: {title}</span>}
                                      </div>

                                      <div className="Action-Section">
                                        <span
                                          onClick={() =>
                                            updateThankYouOfferStatus(
                                              id,
                                              isEnabled
                                            )
                                          }
                                        >
                                          <input
                                            id={id}
                                            type="checkbox"
                                            className="tgl tgl-light"
                                            checked={convertNumberToBoolean(
                                              isEnabled
                                            )}
                                          />
                                          <label
                                            htmlFor={id}
                                            className="tgl-btn"
                                          ></label>
                                        </span>

                                        <ButtonGroup>
                                          <Button
                                            onClick={() =>
                                              editThankYouOffer(id)
                                            }
                                          >
                                            <Icon source={EditMinor}></Icon>
                                          </Button>

                                          <Button
                                            onClick={() =>
                                              handleDeleteThankYouOffer(id)
                                            }
                                          >
                                            <Icon source={DeleteMinor}></Icon>
                                          </Button>
                                        </ButtonGroup>
                                      </div>
                                    </ResourceItem>
                                  </Card>
                                );
                              }}
                            />

                            {/* <PageActions
                                                            primaryAction={{
                                                                content: 'Create Offer',
                                                                onAction: handleThankYouOfferSheet
                                                            }}
                                                        /> */}
                          </span>
                        ) : (
                          <EmptyCard value="thankYou" />
                        )}
                      </div>
                    );

                  default:
                    break;
                }
              })()}
            </>
          )}
        </Tabs>
      </Page>
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
