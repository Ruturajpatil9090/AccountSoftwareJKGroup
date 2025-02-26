import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GSTutility.css';

import { useNavigate } from 'react-router-dom';
import SaleBillSummary from './SaleBillSummary';
import PurchaseBillSummary from './PurchaseBillSummary';
import RetailSaleBillSummary from './RetailSaleBillSummary';
import FrieghtSummary from './FrieghtSummary';
import DebitNoteSummary from './DebitNoteSummary';
import CreditnoteSummary from './CreditNoteSummary';
import ServiceBillSummary from './ServiceBillSummary';
import OtherPurchaseSummary from './OtherPurchaseSummary';
import SaleTCSSummary from './SaleTCSSummary';
import SaleTDSSummary from './SaleTDSSummary';
import PurchaseTCSSummary from './PurchaseTCSSummary';
import PurchaseTDSSummary from './PurchaseTDSSummary';
import HSNWiseSummary from './HSNWiseSummary';
import GSTRateWiseSummary from './GSTRateWiseSumamry';
import SaleTCSTDSSummary from './SaleTCSTDSSummary';
import PurchaseTCSTDSSummary from './PurchaseTCSTDSSummary';
import DebitCreditNoteSummary from './DebitCreditNoteSummaray';
import CreateB2BFile from './CreateB2BFile';
import CreateB2ClFile from './CreateB2CL';
import CreateB2CSFile from './CreateB2CS';
import ShowEntryNo from './ShowEntryNo';
import { Typography } from "@mui/material";

const GStUtilities = () => {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const AccountYear = sessionStorage.getItem('Accounting_Year');
    const Year_Code = sessionStorage.getItem('Year_Code');
    const Company_Code = sessionStorage.getItem('Company_Code');
    const [accountType, setAccountType] = useState('AL');
    const [PurchaseType, setPurchaseType] = useState('AL');
    const [GSTRateType, setGSTRateType] = useState('');
    const [GSTRateTypes, setGSTRateTypes] = useState([]);
    const [DebitType, setDebitType] = useState('AL');

    const API_URL = process.env.REACT_APP_API;

    useEffect(() => {
        if (AccountYear) {
            const dates = AccountYear.split(' - ');
            if (dates.length === 2) {
                setFromDate(dates[0]);
                setToDate(dates[1]);
            }
        }
    }, [AccountYear]);

    useEffect(() => {
        const fetchGSTRate = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/GettingGSTRateWise?Company_Code=${Company_Code}`
                )
                const data = await response.data;
                setGSTRateTypes(data);
            } catch (error) {
                console.error('Error fetching group types:', error);
            }
        };
        fetchGSTRate();
    }, []);

    const handleChange = (event) => {
        setAccountType(event.target.value);
    };
    const handleChangePurchaseType = (event) => {
        setPurchaseType(event.target.value);
    };
    const handleChangeGSTRate = (event) => {
        setGSTRateType(event.target.value);
    };

    const handleChangeDebitType = (event) => {
        setDebitType(event.target.value);
    };

    return (
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <Typography
                variant="h6"
                style={{
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginTop: "10px",
                }}
            >
                GST Utilities
            </Typography>

            <div className="grid-container">
                <label htmlFor="fromDate" className="form-label">From Date</label>
                <input
                    type="date"
                    id="fromDate"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />

                <label htmlFor="toDate" className="form-label">To Date</label>
                <input
                    type="date"
                    id="toDate"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </div>

            <div className="grid-container">
                <label htmlFor="SaleTCSTDS">Sale Type:</label>
                <select
                    id="SaleTCSTDS"
                    name="SaleTCSTDS"
                    value={accountType}
                    onChange={handleChange}
                    className="form-select"
                    style={{ maxWidth: '200px', padding: '5px', fontSize: '14px' }}
                >
                    <option value="AL">All Bill</option>
                    <option value="SB">Sale Bill</option>
                    <option value="SC">Sale Bill Corporate</option>
                    <option value="NC">Sale Bill Non Corporate</option>
                    <option value="RS">Sale Return Sale</option>
                    <option value="RR">Retail Sale</option>
                    <option value="LV">Commission Bill</option>
                    <option value="CB">Cold Storage Sale</option>
                    <option value="RB">Rent Bill</option>
                </select>
            </div>

            <div className="grid-container">
                <label htmlFor="PurchaseTCSTDS">Purchase Type:</label>
                <select
                    id="PurchaseTCSTDS"
                    name="PurchaseTCSTDS"
                    value={PurchaseType}
                    onChange={handleChangePurchaseType}
                    className="form-select"
                    style={{ maxWidth: '200px', padding: '5px', fontSize: '14px' }}
                >
                    <option value="AL">All Bill</option>
                    <option value="PS">Purchase Bill</option>
                    <option value="RP">Retail Purchase</option>
                </select>
            </div>
            <div className="grid-container">
                <label htmlFor="GSTRate">GST Rate</label>
                <select
                    id="GSTRate"
                    name="GSTRate"
                    value={GSTRateType}
                    onChange={handleChangeGSTRate}
                    className="form-select"
                    style={{ maxWidth: '200px', padding: '5px', fontSize: '14px' }}

                >
                    <option value="" disabled>
                        GST Rate
                    </option>
                    {GSTRateTypes.map((type) => (
                        <option key={type.Doc_no} value={type.Rate}>
                            {type.Rate}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid-container">
                <label htmlFor="PurchaseTCSTDS">Debit Credit Note</label>
                <select
                    id="PurchaseTCSTDS"
                    name="PurchaseTCSTDS"
                    value={DebitType}
                    onChange={handleChangeDebitType}
                    className="form-select"
                    style={{ maxWidth: '200px', padding: '5px', fontSize: '14px' }}
                >
                    <option value="AL">All</option>
                    <option value="DN">Debit Note to Customer</option>
                    <option value="CN">Credit Note to Customer</option>
                    <option value="DS">Debit Note to Supplier</option>
                    <option value="CS">Credit Note to Supplier</option>
                </select>
            </div>

            <div className="grid-container">
                <div><SaleBillSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>
                <div><SaleTCSSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} Tran_type={accountType} /></div>
                <div><SaleTDSSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} Tran_type={accountType} /></div>
                <div><SaleTCSTDSSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>

                <div><PurchaseBillSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>
                <div><PurchaseTCSSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} Tran_type={PurchaseType} /></div>
                <div><PurchaseTDSSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} Tran_type={PurchaseType} /></div>
                <div><PurchaseTCSTDSSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>

                <div><RetailSaleBillSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>
                <div><FrieghtSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>

                <div><DebitNoteSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>
                <div><CreditnoteSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>
                <div><OtherPurchaseSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>
                <div><ServiceBillSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>

                <div><HSNWiseSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>
                <div><GSTRateWiseSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} GSTRate={GSTRateType} /></div>
              
                <div><DebitCreditNoteSummary fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} Tran_Type={DebitType} /></div>
                <div><CreateB2BFile fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>
                <div><CreateB2ClFile fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>
                <div><CreateB2CSFile fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>

                <div><ShowEntryNo fromDate={fromDate} toDate={toDate} companyCode={Company_Code} yearCode={Year_Code} /></div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );

};

export default GStUtilities;