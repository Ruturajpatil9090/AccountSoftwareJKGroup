import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AccountMasterContext = createContext();

export const AccountMasterProvider = ({ children,hideNavbarPaths  }) => {
    const [accountData, setAccountData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        
        const CompanyCode = sessionStorage.getItem("Company_Code");
        const API_URL = process.env.REACT_APP_API;

        try {
            const response = await axios.get(`${API_URL}/account_master_all?Company_Code=${CompanyCode}`);
            setAccountData(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AccountMasterContext.Provider value={{ accountData, loading, error,hideNavbarPaths }}>
            {children}
        </AccountMasterContext.Provider>
    );
};

export const useAccountMaster = () => useContext(AccountMasterContext);