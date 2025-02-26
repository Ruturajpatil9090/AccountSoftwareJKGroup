import React, { useState, useEffect, useRef } from "react";
import NavigationButtons from "../../../Common/CommonButtons/NavigationButtons";
import ActionButtonGroup from "../../../Common/CommonButtons/ActionButtonGroup";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OtherPurchase.css";
import AccountMasterHelp from "../../../Helper/AccountMasterHelp";
import GSTRateMasterHelp from "../../../Helper/GSTRateMasterHelp";
import GroupMasterHelp from "../../../Helper/SystemmasterHelp";
import { useRecordLocking } from '../../../hooks/useRecordLocking';
import UserAuditInfo from "../../../Common/UserAuditInfo/UserAuditInfo";
import { Typography } from "@mui/material";
import { HashLoader } from "react-spinners";

//API Credentials
const API_URL = process.env.REACT_APP_API;

//Labels Global variables
var SupplierName = ""
var SupplierCode = ""
var Exp_Ac_Code = ""
var Exp_Ac_Name = ""
var TDSCutAcCode = ""
var TDSCutAcName = ""
var TDSAcCodeNew = ""
var TDSAcName = ""
var GStrateCode = ""
var GStrateName = ""
var Provision_Ac_Code = ""
var Provision_Ac_Name = ""
var GroupCode = ""
var GroupName = ""

const OtherPurchase = () => {

  //GET values from session storage
  const Year_Code = sessionStorage.getItem("Year_Code")
  const companyCode = sessionStorage.getItem("Company_Code");
  const username = sessionStorage.getItem("username");

  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [addOneButtonEnabled, setAddOneButtonEnabled] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(true);
  const [cancelButtonEnabled, setCancelButtonEnabled] = useState(true);
  const [editButtonEnabled, setEditButtonEnabled] = useState(false);
  const [deleteButtonEnabled, setDeleteButtonEnabled] = useState(false);
  const [backButtonEnabled, setBackButtonEnabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState(null);
  const [cancelButtonClicked, setCancelButtonClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [Exp_Ac, setExp_Ac] = useState('');
  const [Supplier, setSupplier] = useState('');
  const [SupplierAccoid, setSupplierAccoid] = useState('');
  const [TDSCuttAcCode, setTDSCuttAcCode] = useState('')
  const [TDSAcCode, setTDSAcCode] = useState('')
  const [gstRateCode, setgstRateCode] = useState('')
  const [formErrors, setFormErrors] = useState({});
  const [GstRate, setGstRate] = useState(0.0);
  const [matchStatus, setMatchStatus] = useState(null);
  const [groupCode, setGroupCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTDSACCodeManually, setIsTDSACCodeManually] = useState(false);
  const [tdsCutAcCodeName, setTDSCutAcCodeName] = useState('')

  const navigate = useNavigate();
  const location = useLocation();
  const selectedRecord = location.state?.selectedRecord;
  const inputRef = useRef(null)

  const initialFormData = {
    Doc_Date: new Date().toISOString().slice(0, 10),
    Supplier_Code: "",
    Exp_Ac: "",
    Narration: "",
    Taxable_Amount: 0.00,
    GST_RateCode: 0.00,
    CGST_Rate: 0.00,
    CGST_Amount: 0.00,
    SGST_Rate: 0.00,
    SGST_Amount: 0.00,
    IGST_Rate: 0.00,
    IGST_Amount: 0.00,
    Other_Amount: 0.00,
    Bill_Amount: 0.00,
    Company_Code: companyCode,
    Year_Code: Year_Code,
    TDS_Amt: 0.00,
    TDS_Per: 0.00,
    TDS: 0.00,
    TDS_Cutt_AcCode: 0,
    TDS_AcCode: 0,
    sc: "",
    ea: "",
    tca: "",
    tac: "",
    billno: "",
    ASN_No: "",
    einvoiceno: "",
    Group_Code: 0,
    gcid: 0,
    ProvisionAmt: 0.00,
    ExpensisAmt: 0.00,
    Provision_Ac: 0,
    pa: 0
  };

  const [formData, setFormData] = useState(initialFormData);

  const { isRecordLockedByUser, lockRecord, unlockRecord } = useRecordLocking(formData.Doc_No, undefined, companyCode, Year_Code, "other_purchase");

  // Manage the States of application
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      return updatedFormData;
    });
  };

  //Fetch last record
  const fetchLastRecord = () => {
    fetch(`${API_URL}/get-next-doc-no-OtherPurchase?Company_Code=${companyCode}&Year_Code=${Year_Code}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch last record");
        }
        return response.json();
      })
      .then((data) => {
        setFormData((prevState) => ({
          ...prevState,
          Doc_No: data.next_doc_no,
        }));
      })
      .catch((error) => {
        console.error("Error fetching last record:", error);
      });
  };

  //API Integration and Button Functionality
  const handleAddOne = () => {
    setAddOneButtonEnabled(false);
    setSaveButtonEnabled(true);
    setCancelButtonEnabled(true);
    setEditButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setIsEditing(true);
    fetchLastRecord();
    setFormData(initialFormData);
    SupplierName = ""
    SupplierCode = ""
    Exp_Ac_Code = ""
    Exp_Ac_Name = ""
    TDSCutAcCode = ""
    TDSCutAcName = ""
    TDSAcCodeNew = ""
    TDSAcName = ""
    GStrateCode = ""
    GStrateName = ""
    Provision_Ac_Code = ""
    Provision_Ac_Name = ""
    GroupCode = ""
    GroupName = ""
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const checkMatchStatus = async (ac_code, company_code, year_code) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/get_match_status`,
        {
          params: {
            Ac_Code: ac_code,
            Company_Code: company_code,
            Year_Code: year_code,
          },
        }
      );
      return data.match_status;
    } catch (error) {
      console.error("Couldn't able to match GST State Code:", error);
      return error;
    }
  };

  const calculateDependentValues = async (
    name,
    input,
    formData,
    matchStatus,
    gstRate
  ) => {
    const updatedFormData = { ...formData, [name]: input };
    const provisionAmt = parseFloat(updatedFormData.ProvisionAmt) || 0.0;
    const expAmt = parseFloat(updatedFormData.ExpensisAmt) || 0.0;
    updatedFormData.Taxable_Amount = (provisionAmt + expAmt).toFixed(2)
    const rate = gstRate;


    if (matchStatus === "TRUE") {
      updatedFormData.CGST_Rate = (rate / 2).toFixed(2);
      updatedFormData.SGST_Rate = (rate / 2).toFixed(2);
      updatedFormData.IGST_Rate = 0.0;

      updatedFormData.CGST_Amount = (
        (updatedFormData.Taxable_Amount * updatedFormData.CGST_Rate) /
        100
      ).toFixed(2);
      updatedFormData.SGST_Amount = (
        (updatedFormData.Taxable_Amount * updatedFormData.SGST_Rate) /
        100
      ).toFixed(2);
      updatedFormData.IGST_Amount = 0.0;
    } else {
      updatedFormData.IGST_Rate = rate.toFixed(2);
      updatedFormData.CGST_Rate = 0.0;
      updatedFormData.SGST_Rate = 0.0;

      updatedFormData.IGST_Amount = (
        (updatedFormData.Taxable_Amount * updatedFormData.IGST_Rate) /
        100
      ).toFixed(2);
      updatedFormData.CGST_Amount = 0.0;
      updatedFormData.SGST_Amount = 0.0;
    }


    const miscAmount = parseFloat(updatedFormData.Other_Amount) || 0.0;
    updatedFormData.Bill_Amount = (
      (parseFloat(updatedFormData.Taxable_Amount) || 0.0) +
      (parseFloat(updatedFormData.CGST_Amount) || 0.0) +
      (parseFloat(updatedFormData.SGST_Amount) || 0.0) +
      (parseFloat(updatedFormData.IGST_Amount) || 0.0) +
      miscAmount
    ).toFixed(2);


    const tdsRate = parseFloat(updatedFormData.TDS_Per) || 0.0;
    const tdsAmount = Math.floor((updatedFormData.TDS_Amt * tdsRate) / 100);
    const formattedTDS = (tdsAmount / 1.00).toFixed(2);

    updatedFormData.TDS = formattedTDS;


    return updatedFormData;
  };

  const handleKeyDownCalculations = async (event) => {
    if (event.key === "Tab") {
      const { name, value } = event.target;
      const matchStatus = await checkMatchStatus(
        formData.Supplier_Code,
        companyCode,
        Year_Code
      );
      let gstRate = GstRate;

      if (!gstRate || gstRate === 0) {
        const cgstRate = parseFloat(formData.CGST_Rate) || 0;
        const sgstRate = parseFloat(formData.SGST_Rate) || 0;
        const igstRate = parseFloat(formData.IGST_Rate) || 0;

        gstRate = igstRate > 0 ? igstRate : cgstRate + sgstRate;
      }
      const updatedFormData = await calculateDependentValues(
        name,
        value,
        formData,
        matchStatus,
        gstRate
      );
      setFormData(updatedFormData);
    }
  };

  //Insert and Update record Functionality
  const handleSaveOrUpdate = () => {
    if (formData.TDS_Amt != 0) {
      if (formData.TDS_AcCode === 0) {
        alert("Enter the TDSAcCode !")
        return;
      }

    };
    setIsLoading(true);
    let headData = {
      ...formData,
      GST_RateCode: gstRateCode || GStrateCode
    }
    if (isEditMode) {
      headData = {
        ...headData,
        Modified_By: username
      }
      axios
        .put(
          `${API_URL}/update-OtherPurchase?Doc_No=${formData.Doc_No}&Company_Code=${companyCode}&Year_Code=${Year_Code}`,
          headData
        )
        .then((response) => {
          toast.success("Record update successfully!");
          unlockRecord();
          setTimeout(() => {
            window.location.reload();
          }, 1000);

          setIsEditMode(false);
          setAddOneButtonEnabled(true);
          setEditButtonEnabled(true);
          setDeleteButtonEnabled(true);
          setBackButtonEnabled(true);
          setSaveButtonEnabled(false);
          setCancelButtonEnabled(false);
          setUpdateButtonClicked(true);
          setIsEditing(false);
          setIsLoading(false);
        })
        .catch((error) => {
          handleCancel();
          setIsLoading(false)
          console.error("Error updating data:", error);
        });
    } else {
      headData = {
        ...headData,
        Created_By: username
      }
      axios
        .post(
          `${API_URL}/create-Record-OtherPurchase?Company_Code=${companyCode}&Year_Code=${Year_Code}`,
          headData
        )
        .then((response) => {
          toast.success("Record Create successfully!");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          setIsEditMode(false);
          setAddOneButtonEnabled(true);
          setEditButtonEnabled(true);
          setDeleteButtonEnabled(true);
          setBackButtonEnabled(true);
          setSaveButtonEnabled(false);
          setCancelButtonEnabled(false);
          setUpdateButtonClicked(true);
          setIsLoading(false);
          setIsEditing(false);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    }
  };

  //handle Edit record functionality.
  const handleEdit = async () => {
    axios.get(`${API_URL}/get-OtherPurchaseSelectedRecord?Company_Code=${companyCode}&Year_Code=${Year_Code}&Doc_No=${formData.Doc_No}`)
      .then((response) => {
        const data = response.data;
        const isLockedNew = data.selected_Record_data.LockedRecord;
        const isLockedByUserNew = data.selected_Record_data.LockedUser;

        if (isLockedNew) {
          window.alert(`This record is locked by ${isLockedByUserNew}`);
          return;
        } else {
          lockRecord()
        }
        setFormData({
          ...formData,
          ...data.last_head_data
        });
        setIsEditMode(true);
        setAddOneButtonEnabled(false);
        setSaveButtonEnabled(true);
        setCancelButtonEnabled(true);
        setEditButtonEnabled(false);
        setDeleteButtonEnabled(false);
        setBackButtonEnabled(true);
        setIsEditing(true);
      })
      .catch((error) => {
        window.alert("This record is already deleted! Showing the previous record.");
      });
  };


  //Show last record on Screen
  const handleCancel = () => {
    axios
      .get(
        `${API_URL}/get-OtherPurchase-lastRecord?Company_Code=${companyCode}&Year_Code=${Year_Code}`
      )
      .then((response) => {
        const data = response.data;
        SupplierName = data.labels.SupplierName;
        SupplierCode = data.last_OtherPurchase_data.Supplier_Code;
        Exp_Ac_Name = data.labels.ExpAcName;
        Exp_Ac_Code = data.last_OtherPurchase_data.Exp_Ac;
        TDSCutAcName = data.labels.TDSCutAcName;
        TDSCutAcCode = data.last_OtherPurchase_data.TDS_Cutt_AcCode;
        TDSAcName = data.labels.tdsacname;
        TDSAcCodeNew = data.last_OtherPurchase_data.TDS_AcCode;
        GStrateName = data.labels.GST_Name;
        GStrateCode = data.last_OtherPurchase_data.GST_RateCode;
        Provision_Ac_Code = data.last_OtherPurchase_data.Provision_Ac;
        Provision_Ac_Name = data.labels.provisionAcName;
        GroupCode = data.last_OtherPurchase_data.Group_Code;
        GroupName = data.labels.groupName;

        setFormData({
          ...formData,
          ...data.last_OtherPurchase_data,
        });

      })

      .catch((error) => {
        console.error("Error fetching latest data for edit:", error);
      });
    unlockRecord();
    // Reset other state variables
    setIsEditing(false);
    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setCancelButtonClicked(true);
  };

  //Record Delete Functionality
  const handleDelete = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-OtherPurchaseSelectedRecord?Company_Code=${companyCode}&Year_Code=${Year_Code}&Doc_No=${formData.Doc_No}`);
      const data = response.data;
      const isLockedNew = data.selected_Record_data.LockedRecord;
      const isLockedByUserNew = data.selected_Record_data.LockedUser;

      if (isLockedNew) {
        window.alert(`This record is locked by ${isLockedByUserNew}`);
        return;
      }

      const isConfirmed = window.confirm(`Are you sure you want to delete this Doc_No ${formData.Doc_No}?`);
      if (isConfirmed) {
        setIsEditMode(false);
        setAddOneButtonEnabled(true);
        setEditButtonEnabled(true);
        setDeleteButtonEnabled(true);
        setBackButtonEnabled(true);
        setSaveButtonEnabled(false);
        setCancelButtonEnabled(false);
        setIsLoading(true);

        const deleteApiUrl = `${API_URL}/delete-OtherPurchase?Doc_No=${formData.Doc_No}&Company_Code=${companyCode}&Year_Code=${Year_Code}`;
        await axios.delete(deleteApiUrl);
        toast.success("Record deleted successfully!");
        setIsLoading(false);
        handleCancel();
      } else {
        console.log("Deletion cancelled");
      }
    } catch (error) {
      toast.error("Deletion cancelled. Error occurred during the operation.");
      console.error("Error during API call:", error);
    }
  };

  const handleBack = () => {
    navigate("/other-purchaseutility");
  };

  //Handle Record DoubleCliked in Utility Page Show that record for Edit
  const handlerecordDoubleClicked = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/get-OtherPurchaseSelectedRecord?Company_Code=${companyCode}&Year_Code=${Year_Code}&Doc_No=${selectedRecord.Doc_No}`
      );
      const data = response.data;
      SupplierName = data.labels.SupplierName;
      SupplierCode = data.selected_Record_data.Supplier_Code;
      Exp_Ac_Name = data.labels.ExpAcName;
      Exp_Ac_Code = data.selected_Record_data.Exp_Ac;
      TDSCutAcName = data.labels.TDSCutAcName;
      TDSCutAcCode = data.selected_Record_data.TDS_Cutt_AcCode;
      TDSAcName = data.labels.tdsacname;
      TDSAcCodeNew = data.selected_Record_data.TDS_AcCode;
      GStrateName = data.labels.GST_Name;
      GStrateCode = data.selected_Record_data.GST_RateCode;
      Provision_Ac_Code = data.selected_Record_data.Provision_Ac;
      Provision_Ac_Name = data.labels.provisionAcName;
      GroupCode = data.selected_Record_data.Group_Code;
      GroupName = data.labels.groupName;
      setFormData({
        ...formData,
        ...data.selected_Record_data,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setUpdateButtonClicked(true);
    setIsEditing(false);
  };

  useEffect(() => {
    if (selectedRecord) {
      handlerecordDoubleClicked();
    } else {
      handleAddOne();
    }
  }, [selectedRecord]);

  //change No functionality to get that particular record
  const handleKeyDown = async (event) => {
    if (event.key === "Tab") {
      const changeNoValue = event.target.value;
      try {
        const response = await axios.get(
          `${API_URL}/get-OtherPurchaseSelectedRecord?Company_Code=${companyCode}&Year_Code=${Year_Code}&Doc_No=${changeNoValue}`
        );
        const data = response.data;
        SupplierName = data.labels.SupplierName;
        SupplierCode = data.selected_Record_data.Supplier_Code;
        Exp_Ac_Name = data.labels.ExpAcName;
        Exp_Ac_Code = data.selected_Record_data.Exp_Ac;
        TDSCutAcName = data.labels.TDSCutAcName;
        TDSCutAcCode = data.selected_Record_data.TDS_Cutt_AcCode;
        TDSAcName = data.labels.tdsacname;
        TDSAcCodeNew = data.selected_Record_data.TDS_AcCode;
        GStrateName = data.labels.GST_Name;
        GStrateCode = data.selected_Record_data.GST_RateCode;
        Provision_Ac_Code = data.selected_Record_data.Provision_Ac;
        Provision_Ac_Name = data.labels.provisionAcName;
        GroupCode = data.selected_Record_data.Group_Code;
        GroupName = data.labels.groupName;

        setFormData({
          ...formData,
          ...data.selected_Record_data,
        });
        setIsEditing(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  //Navigation Buttons
  const handleFirstButtonClick = async () => {
    try {
      const response = await fetch(`${API_URL}/get-first-OtherPurchase?Company_Code=${companyCode}&Year_Code=${Year_Code}`);
      if (response.ok) {
        const data = await response.json();
        SupplierName = data.labels.SupplierName;
        SupplierCode = data.first_OtherPurchase_data.Supplier_Code;
        Exp_Ac_Name = data.labels.ExpAcName;
        Exp_Ac_Code = data.first_OtherPurchase_data.Exp_Ac;
        TDSCutAcName = data.labels.TDSCutAcName;
        TDSCutAcCode = data.first_OtherPurchase_data.TDS_Cutt_AcCode;
        TDSAcName = data.labels.tdsacname;
        TDSAcCodeNew = data.first_OtherPurchase_data.TDS_AcCode;
        GStrateName = data.labels.GST_Name;
        GStrateCode = data.first_OtherPurchase_data.GST_RateCode;
        Provision_Ac_Code = data.first_OtherPurchase_data.Provision_Ac;
        Provision_Ac_Name = data.labels.provisionAcName;
        GroupCode = data.first_OtherPurchase_data.Group_Code;
        GroupName = data.labels.groupName;
        setFormData({
          ...formData,
          ...data.first_OtherPurchase_data,
        });
      } else {
        console.error(
          "Failed to fetch first record:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handlePreviousButtonClick = async () => {
    try {
      const response = await fetch(
        `${API_URL}/get-previous-OtherPurchase?Company_Code=${companyCode}&Year_Code=${Year_Code}&Doc_No=${formData.Doc_No}`
      );
      if (response.ok) {
        const data = await response.json();
        SupplierName = data.labels.SupplierName;
        SupplierCode = data.previous_OtherPurchase_data.Supplier_Code;
        Exp_Ac_Name = data.labels.ExpAcName;
        Exp_Ac_Code = data.previous_OtherPurchase_data.Exp_Ac;
        TDSCutAcName = data.labels.TDSCutAcName;
        TDSCutAcCode = data.previous_OtherPurchase_data.TDS_Cutt_AcCode;
        TDSAcName = data.labels.tdsacname;
        TDSAcCodeNew = data.previous_OtherPurchase_data.TDS_AcCode;
        GStrateName = data.labels.GST_Name;
        GStrateCode = data.previous_OtherPurchase_data.GST_RateCode;
        Provision_Ac_Code = data.previous_OtherPurchase_data.Provision_Ac;
        Provision_Ac_Name = data.labels.provisionAcName;
        GroupCode = data.previous_OtherPurchase_data.Group_Code;
        GroupName = data.labels.groupName;
        setFormData({
          ...formData,
          ...data.previous_OtherPurchase_data,
        });
      } else {
        console.error(
          "Failed to fetch previous record:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleNextButtonClick = async () => {
    try {
      const response = await fetch(
        `${API_URL}/get-next-OtherPurchase?Company_Code=${companyCode}&Year_Code=${Year_Code}&Doc_No=${formData.Doc_No}`
      );
      if (response.ok) {
        const data = await response.json();
        SupplierName = data.labels.SupplierName;
        SupplierCode = data.next_OtherPurchase_data.Supplier_Code;
        Exp_Ac_Name = data.labels.ExpAcName;
        Exp_Ac_Code = data.next_OtherPurchase_data.Exp_Ac;
        TDSCutAcName = data.labels.TDSCutAcName;
        TDSCutAcCode = data.next_OtherPurchase_data.TDS_Cutt_AcCode;
        TDSAcName = data.labels.tdsacname;
        TDSAcCodeNew = data.next_OtherPurchase_data.TDS_AcCode;
        GStrateName = data.labels.GST_Name;
        GStrateCode = data.next_OtherPurchase_data.GST_RateCode;
        Provision_Ac_Code = data.next_OtherPurchase_data.Provision_Ac;
        Provision_Ac_Name = data.labels.provisionAcName;
        GroupCode = data.next_OtherPurchase_data.Group_Code;
        GroupName = data.labels.groupName;

        setFormData({
          ...formData,
          ...data.next_OtherPurchase_data,
        });
      } else {
        console.error(
          "Failed to fetch next record:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleLastButtonClick = async () => {
    try {
      const response = await fetch(`${API_URL}/get-OtherPurchase-lastRecord?Company_Code=${companyCode}&Year_Code=${Year_Code}`);
      if (response.ok) {
        const data = await response.json();
        SupplierName = data.labels.SupplierName;
        SupplierCode = data.last_OtherPurchase_data.Supplier_Code;
        Exp_Ac_Name = data.labels.ExpAcName;
        Exp_Ac_Code = data.last_OtherPurchase_data.Exp_Ac;
        TDSCutAcName = data.labels.TDSCutAcName;
        TDSCutAcCode = data.last_OtherPurchase_data.TDS_Cutt_AcCode;
        TDSAcName = data.labels.tdsacname;
        TDSAcCodeNew = data.last_OtherPurchase_data.TDS_AcCode;
        GStrateName = data.labels.GST_Name;
        GStrateCode = data.last_OtherPurchase_data.GST_RateCode;
        Provision_Ac_Code = data.last_OtherPurchase_data.Provision_Ac;
        Provision_Ac_Name = data.labels.provisionAcName;
        GroupCode = data.last_OtherPurchase_data.Group_Code;
        GroupName = data.labels.groupName;
        setFormData({
          ...formData,
          ...data.last_OtherPurchase_data,
        });
      } else {
        console.error(
          "Failed to fetch last record:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  //Helper Compoents Function For manage the labels 
  const handleSupplier = async (code, accoid, name) => {
    setSupplier(code);
    setTDSCutAcCodeName(name)
    let updatedFormData = {
      ...formData,
      Supplier_Code: code,
      sc: accoid,
    };
    if (!isTDSACCodeManually) {
      setTDSCuttAcCode(code);
      setFormData((prevFormData) => ({
        ...prevFormData,
        TDS_Cutt_AcCode: code,
        tca: accoid
      }));
    }
    try {
      const matchStatusResult = await checkMatchStatus(
        code,
        companyCode,
        Year_Code
      );
      setMatchStatus(matchStatusResult);
      let gstRate = GstRate;

      if (!gstRate || gstRate === 0) {
        const cgstRate = parseFloat(formData.CGST_Rate) || 0;
        const sgstRate = parseFloat(formData.SGST_Rate) || 0;
        const igstRate = parseFloat(formData.IGST_Rate) || 0;

        gstRate = igstRate > 0 ? igstRate : cgstRate + sgstRate;
      }
      updatedFormData = await calculateDependentValues(
        "GST_RateCode",
        GstRate,
        updatedFormData,
        matchStatusResult,
        gstRate
      );
      setFormData((prevState) => ({
        ...updatedFormData,
        TDS_Cutt_AcCode: isTDSACCodeManually ? prevState.TDS_Cutt_AcCode : code,
        tca: isTDSACCodeManually ? prevState.tca : accoid
      }));
    } catch (error) {
      console.error("Error in handleBillFrom:", error);
    }
  }


  const handleExpAc = (code, accoid) => {
    setExp_Ac(code);
    setFormData({
      ...formData,
      Exp_Ac: code,
      ea: accoid
    });
  }

  const handleProvisionAc = (code, accoid) => {
    setExp_Ac(code);
    setFormData({
      ...formData,
      Provision_Ac: code,
      pa: accoid
    });
  }

  const handleGroupCode = (code, accoid) => {
    setGroupCode(code);
    setFormData({
      ...formData,
      Group_Code: code,
      gcid: accoid
    });
  };
  const handleTDSCutting = (code, accoid) => {
    setIsTDSACCodeManually(true)
    setTDSCuttAcCode(code);
    setFormData({
      ...formData,
      TDS_Cutt_AcCode: code,
      tca: accoid
    });
  }
  const handleTDSAc = (code, accoid) => {
    setTDSAcCode(code);
    setFormData({
      ...formData,
      TDS_AcCode: code,
      tac: accoid
    });
  }

  const handleGstRateCode = async (code, Rate) => {
    setgstRateCode(code);
    let rate = parseFloat(Rate);
    setFormData({
      ...formData,
      GST_RateCode: code,
    });


    const updatedFormData = {
      ...formData,
      GST_RateCode: code,
    };
    setGstRate(rate);

    try {
      const matchStatusResult = await checkMatchStatus(
        updatedFormData.Supplier_Code,
        companyCode,
        Year_Code
      );
      setMatchStatus(matchStatusResult);

      const newFormData = await calculateDependentValues(
        "GST_RateCode",
        rate,
        updatedFormData,
        matchStatusResult,
        rate
      );

      setFormData(newFormData);
    } catch (error) { }
  };


  return (
    <>
      <UserAuditInfo
        createdBy={formData.Created_By}
        modifiedBy={formData.Modified_By}
      />
      <div>
        <Typography
          variant="h5"
          style={{ marginTop: "10px", fontWeight: "bold", fontSize: "24px" }}
        >
          Other Purchase
        </Typography>
        <ToastContainer autoClose={500} />
        <ActionButtonGroup
          handleAddOne={handleAddOne}
          addOneButtonEnabled={addOneButtonEnabled}
          handleSaveOrUpdate={handleSaveOrUpdate}
          saveButtonEnabled={saveButtonEnabled}
          isEditMode={isEditMode}
          handleEdit={handleEdit}
          editButtonEnabled={editButtonEnabled}
          handleDelete={handleDelete}
          deleteButtonEnabled={deleteButtonEnabled}
          handleCancel={handleCancel}
          cancelButtonEnabled={cancelButtonEnabled}
          handleBack={handleBack}
          backButtonEnabled={backButtonEnabled}
        />
        <div>
          <NavigationButtons
            handleFirstButtonClick={handleFirstButtonClick}
            handlePreviousButtonClick={handlePreviousButtonClick}
            handleNextButtonClick={handleNextButtonClick}
            handleLastButtonClick={handleLastButtonClick}
            highlightedButton={highlightedButton}
            isEditing={isEditing}
          />
        </div>
      </div>
      <br></br>
      <div >
        <form >
          <div class="otherpurchaseform-container">
            <label htmlFor="changeNo">Change No:</label>
            <div>
              <input
                type="text"
                id="changeNo"
                Name="changeNo"
                autoComplete="off"
                onKeyDown={handleKeyDown}
                disabled={!addOneButtonEnabled}
              />
            </div>

            <label htmlFor="Doc_No">Entry No:</label>
            <div>
              <input
                type="text"
                id="Doc_No"
                Name="Doc_No"
                value={formData.Doc_No}
                onChange={handleChange}
                disabled
              />
            </div>

            <label htmlFor="Doc_Date">Date:</label>
            <div>
              <input
                type="date"
                id="Doc_Date"
                Name="Doc_Date"
                ref={inputRef}
                value={formData.Doc_Date}
                onChange={handleChange}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={1}
              />
            </div>
          </div>
          <div className="otherpurchase-row">
            <label htmlFor="Supplier_Code">Supplier :</label>
            <div className="otherpurchase-formgroup-item">
              <AccountMasterHelp
                onAcCodeClick={handleSupplier}
                CategoryName={SupplierName}
                CategoryCode={SupplierCode}
                name="Supplier_Code"
                Ac_type={""}
                tabIndexHelp={2}
                disabledFeild={!isEditing && addOneButtonEnabled}
              />
            </div>
          </div>

          <div className="otherpurchase-row">
            <label htmlFor="Exp_Ac">Exp A/C :</label>
            <div className="otherpurchase-formgroup-item">
              <AccountMasterHelp
                onAcCodeClick={handleExpAc}
                CategoryName={Exp_Ac_Name}
                CategoryCode={Exp_Ac_Code}
                name="Exp_Ac"
                Ac_type={""}
                tabIndexHelp={4}
                disabledFeild={!isEditing && addOneButtonEnabled}
              />
            </div>

          </div>
          <div className="otherpurchase-row">
            <label htmlFor="Provision_Ac">Provision A/C :</label>
            <div className="otherpurchase-formgroup-item">
              <AccountMasterHelp
                onAcCodeClick={handleProvisionAc}
                CategoryName={Provision_Ac_Name}
                CategoryCode={Provision_Ac_Code}
                name="Provision_Ac"
                Ac_type={""}
                tabIndexHelp={5}
                disabledFeild={!isEditing && addOneButtonEnabled}
              />
            </div>

          </div>
          <div className="otherpurchase-row">
            <label htmlFor="Group_Code">Group Code :</label>
            <div className="otherpurchase-formgroup-item">
              <GroupMasterHelp
                onAcCodeClick={handleGroupCode}
                CategoryName={GroupName}
                CategoryCode={GroupCode}
                SystemType="C"
                name="Group_Code"
                tabIndexHelp={6}
                disabledField={!isEditing && addOneButtonEnabled}
              />
            </div>

          </div>
          <div className="otherpurchase-row">
            <label htmlFor="GST_RateCode">GSTCode :</label>
            <div className="otherpurchase-formgroup-item">
              <GSTRateMasterHelp
                onAcCodeClick={handleGstRateCode}
                GstRateName={GStrateName}
                GstRateCode={GStrateCode}
                name="GST_RateCode"
                tabIndexHelp={7}
                disabledFeild={!isEditing && addOneButtonEnabled}
              />
            </div>
          </div>
          <div className="otherpurchaseform-container">
            <div>
              <label htmlFor="ProvisionAmt">Provision Amount:</label>
              <input
                type="number"
                id="ProvisionAmt"
                Name="ProvisionAmt"
                autoComplete="off"
                value={formData.ProvisionAmt !== null ? formData.ProvisionAmt : 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={8}
              />
            </div>
            <div>
              <label htmlFor="ExpensisAmt">Exp Amount:</label>
              <input
                type="number"
                id="ExpensisAmt"
                Name="ExpensisAmt"
                autoComplete="off"
                value={formData.ExpensisAmt !== null ? formData.ExpensisAmt : 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={9}
              />
            </div>

            <div>
              <label htmlFor="Taxable_Amount">Taxable Amount:</label>
              <input
                type="number"
                id="Taxable_Amount"
                Name="Taxable_Amount"
                autoComplete="off"
                value={formData.Taxable_Amount !== null ? formData.Taxable_Amount : 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={10}
              />
            </div>
          </div>

          <br></br>
          <div className="otherpurchaseform-container">
            <div style={{ gap: "5px" }} >
              <label htmlFor="CGST_Rate">CGST % :</label>
              <input
                type="text"
                id="CGST_Rate"
                Name="CGST_Rate"
                autoComplete="off"
                value={formData.CGST_Rate !== null ? formData.CGST_Rate : 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled
                tabIndex={11}
              />
              <input
                type="text"
                id="CGST_Amount"
                Name="CGST_Amount"
                autoComplete="off"
                value={formData.CGST_Amount !== null ? formData.CGST_Amount : 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled
                tabIndex={12}
              />
            </div>

            <div style={{ gap: "5px" }} >
              <label htmlFor="SGST_Rate">SGST % :</label>
              <input
                type="text"
                id="SGST_Rate"
                Name="SGST_Rate"
                autoComplete="off"
                value={formData.SGST_Rate !== null ? formData.SGST_Rate : 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled
                tabIndex={13}
              />
              <input
                type="text"
                id="SGST_Amount"
                Name="SGST_Amount"
                autoComplete="off"
                value={formData.SGST_Amount !== null ? formData.SGST_Amount : ""}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled
                tabIndex={14}
              />
            </div>

            <div style={{ gap: "5px" }}>
              <label htmlFor="IGST_Rate">IGST % :</label>
              <input
                type="text"
                id="IGST_Rate"
                Name="IGST_Rate"
                autoComplete="off"
                value={formData.IGST_Rate !== null ? formData.IGST_Rate : 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled
                tabIndex={15}
              />
              <input
                type="text"
                id="IGST_Amount"
                Name="IGST_Amount"
                autoComplete="off"
                value={formData.IGST_Amount !== null ? formData.IGST_Amount : 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled
                tabIndex={16}
              />
            </div>
          </div>
          <br></br>
          <div className="otherpurchaseform-container">
            <div >
              <label htmlFor="Other_Amount">Other Amount :</label>
              <input
                type="number"
                id="Other_Amount"
                Name="Other_Amount"
                autoComplete="off"
                value={formData.Other_Amount !== null ? formData.Other_Amount : 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={17}
              />
            </div>

            <div >
              <label htmlFor="Bill_Amount">Bill Amount :</label>
              <input
                type="number"
                id="Bill_Amount"
                Name="Bill_Amount"
                autoComplete="off"
                value={formData.Bill_Amount !== null ? formData.Bill_Amount : 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={18}
              />
            </div>

            <div>
              <label htmlFor="TDS_Amt">TDS Amount :</label>
              <input
                type="number"
                id="TDS_Amt"
                Name="TDS_Amt"
                autoComplete="off"
                value={parseFloat(formData.TDS_Amt) || 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={19}
              />
            </div>

            <div >
              <label htmlFor="TDS_Per">TDS % :</label>
              <input
                type="number"
                id="TDS_Per"
                Name="TDS_Per"
                autoComplete="off"
                value={formData.TDS_Per || 0.00}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={20}
              />
            </div>

            <div >
              <label htmlFor="TDS">TDS :</label>
              <input
                type="number"
                id="TDS"
                Name="TDS"
                autoComplete="off"
                value={formData.TDS}
                onChange={handleChange}
                onKeyDown={handleKeyDownCalculations}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={21}
              />
            </div>
          </div>

          <div className="otherpurchase-row">
            <label htmlFor="TDS_Ac_Cutt">TDS Cut Ac :</label>
            <div className="otherpurchase-formgroup-item">
              <AccountMasterHelp
                onAcCodeClick={handleTDSCutting}
                CategoryName={TDSCutAcName || tdsCutAcCodeName}
                CategoryCode={TDSCutAcCode ? TDSCutAcCode : formData.TDS_Cutt_AcCode}
                name="TDS_Ac_Cutt"
                Ac_type={""}
                tabIndexHelp={22}
                disabledFeild={!isEditing && addOneButtonEnabled}
              />
            </div>

          </div>
          <div className="otherpurchase-row">
            <label htmlFor="TDS_Ac">TDS Ac :</label>
            <div className="otherpurchase-formgroup-item">
              <AccountMasterHelp
                onAcCodeClick={handleTDSAc}
                CategoryName={TDSAcName}
                CategoryCode={TDSAcCodeNew}
                name="TDS_Ac"
                Ac_type={""}
                tabIndexHelp={23}
                disabledFeild={!isEditing && addOneButtonEnabled}
              />
            </div>
          </div>

          <div className="otherpurchaseform-container">
            <div>
              <label htmlFor="billno">Bill No :</label>
              <input
                type="text"
                id="billno"
                Name="billno"
                autoComplete="off"
                value={formData.billno}
                onChange={handleChange}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={24}
              />
            </div>
            <div >
              <label htmlFor="ASN_No">ASN No :</label>
              <input
                type="text"
                id="ASN_No"
                Name="ASN_No"
                autoComplete="off"
                value={formData.ASN_No}
                onChange={handleChange}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={25}
              />
            </div>
            <div >
              <label htmlFor="einvoiceno">EInvoice No :</label>
              <input
                type="text"
                id="einvoiceno"
                Name="einvoiceno"
                autoComplete="off"
                value={formData.einvoiceno}
                onChange={handleChange}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={26}
              />
            </div>

            <div >
              <label htmlFor="Narration">Narration :</label>
              <textarea
                id="Narration"
                name="Narration"
                autoComplete="off"
                value={formData.Narration}
                onChange={handleChange}
                disabled={!isEditing && addOneButtonEnabled}
                tabIndex={27}
                rows="2"
                cols="100"
                placeholder=""
                className="narration-textarea"
              />
            </div>
          </div>

          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner-container">
                <HashLoader color="#007bff" loading={isLoading} size={80} />
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};
export default OtherPurchase;
