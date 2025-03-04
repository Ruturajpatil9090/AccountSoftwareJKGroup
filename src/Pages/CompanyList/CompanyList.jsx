import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './CompanyList.css';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [accountingYears, setAccountingYears] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedAccountingYear, setSelectedAccountingYear] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [selectedIndex, setSelectedIndex] = useState(0);
  const companyRefs = useRef([]);
  const firstCompanyRef = useRef(null);
  const usernameRef = useRef(null);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_company_data_All`);
        setCompanies(response.data.Company_Data);
        if (response.data.Company_Data && response.data.Company_Data.length > 0) {
          setCompanies(response.data.Company_Data);
          if (firstCompanyRef.current) {
            firstCompanyRef.current.focus();
          }
        } else {
          navigate('/create-company');
        }
      } catch (error) {
        console.error('Failed to fetch companies', error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchAccountingYears(selectedCompany.Company_Code);
    }
  }, [selectedCompany]);

  const fetchAccountingYears = async (companyCode) => {
    try {
      const response = await axios.get(`${API_URL}/get_accounting_years?Company_Code=${companyCode}`);
      const years = response.data;

      years.sort((a, b) => b.yearCode - a.yearCode);
      setAccountingYears(years);
      if (years.length > 0) {
        setSelectedAccountingYear(years[0]);
      } else {
        navigate('/create-accounting-year');
      }
    } catch (error) {
      console.error('Failed to fetch accounting years', error);
      setAccountingYears([]);
      setSelectedAccountingYear(null);
    }
  };

  const handleCompanyClick = (company) => {
    sessionStorage.setItem('Company_Code', company.Company_Code);
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedCompany(null);
    setUsername('');
    setPassword('');
  };

  let formattedAccountingYear = null;

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Both Login Name and Password are required!');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/userlogin`, {
        User_Name: username,
        User_Password: password,
        Company_Code: selectedCompany.Company_Code,
      });
      if (selectedAccountingYear) {
        sessionStorage.setItem('Year_Code', selectedAccountingYear.yearCode);
        sessionStorage.setItem('username', username);
        formattedAccountingYear = `${selectedAccountingYear.Start_Date} - ${selectedAccountingYear.End_Date}`;
        sessionStorage.setItem('Accounting_Year', formattedAccountingYear);
        sessionStorage.setItem('Company_Name', selectedCompany.Company_Name_E);
        sessionStorage.setItem('Company_Address', selectedCompany.Address_E);
        sessionStorage.setItem('Company_GSTNO', selectedCompany.GST);
        sessionStorage.setItem('Company_PanNo', selectedCompany.Pan_No);
        sessionStorage.setItem('uid', response.data.user_id);
      }

      const selfAcResponse = await axios.get(`${API_URL}/get_self_ac?Company_Code=${selectedCompany.Company_Code}`);
      sessionStorage.setItem('SELF_AC', selfAcResponse.data.SELF_AC);
      sessionStorage.setItem('Self_acid', selfAcResponse.data.Self_acid);

      sessionStorage.setItem('Year_Code', selectedAccountingYear.yearCode);
      sessionStorage.setItem('username', username);
      formattedAccountingYear = `${selectedAccountingYear.Start_Date} - ${selectedAccountingYear.End_Date}`;
      sessionStorage.setItem('Accounting_Year', formattedAccountingYear);
      sessionStorage.setItem('Company_Name', selectedCompany.Company_Name_E);

      setIsLoggedIn(true);
      toast.success('Logged in successfully!');
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || 'Invalid login credentials');
      } else if (error.request) {
        setLoginError('No response from server');
      } else {
        setLoginError('Error: ' + error.message);
      }
    }
  };

  useEffect(() => {
    if (companyRefs.current[selectedIndex]) {
      companyRefs.current[selectedIndex].focus();
    }
  }, [selectedIndex]);

  companyRefs.current = companies.map((_, i) => companyRefs.current[i]);

  const handleKeyDown = (event, company, index) => {
    switch (event.keyCode) {
      case 13:
        handleCompanyClick(company);
        break;
      case 38:
        if (selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        }
        break;
      case 40:
        if (selectedIndex < companies.length - 1) {
          setSelectedIndex(selectedIndex + 1);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        if (usernameRef.current) {
          usernameRef.current.focus();
        }
      }, 100);
    }
  }, [showModal]);

  const handleKeyDownModal = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <>
      <div className="companyListContainer">
        <ToastContainer autoClose={500} />
        <div className="companyList">
          {companies.map((company, index) => (
            <div
              key={company.Company_Code}
              className={`companyItem ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleCompanyClick(company)}
              onKeyDown={(event) => handleKeyDown(event, company, index)}
              tabIndex={0}
              ref={index === 0 ? firstCompanyRef : null}
            >
              <span>{company.Company_Code}</span>
              <span>{company.Company_Name_E}</span>
            </div>
          ))}
        </div>

        <Dialog open={showModal} onClose={handleClose} style={{ marginTop: "-80px" }} >
          <DialogTitle>
            <Typography style={{ textAlign: 'center' }} variant="h5">
              Company Login
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {loginError && <p className="text-danger">{loginError}</p>}

            <form onSubmit={(e) => e.preventDefault()}>
              <TextField
                label="User Name"
                variant="outlined"
                autoComplete='off'
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                inputRef={usernameRef}
                margin="normal"
                onKeyDown={handleKeyDownModal}
              />

              <TextField
                label="User Password"
                variant="outlined"
                type="password"
                autoComplete='off'
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                onKeyDown={handleKeyDownModal}
              />
              <TextField
                select
                label="Account Year"
                value={selectedAccountingYear ? selectedAccountingYear.yearCode : ''}
                fullWidth
                required
                onChange={(e) => {
                  const newSelectedYear = accountingYears.find((year) => year.yearCode.toString() === e.target.value);
                  setSelectedAccountingYear(newSelectedYear);
                  sessionStorage.setItem('Year_Code', newSelectedYear.yearCode);
                }}
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                {accountingYears.map((year) => (
                  <option key={year.yearCode} value={year.yearCode}>
                    {year.year}
                  </option>
                ))}
              </TextField>
              <TextField
                select
                label="Current Branch"
                fullWidth
                autoComplete='off'
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              ></TextField>
            </form>
          </DialogContent>
          <DialogActions sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default CompanyList;