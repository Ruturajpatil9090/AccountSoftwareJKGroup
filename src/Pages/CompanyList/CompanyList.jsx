import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import ForgotPasswordModal from './Modal/ForgotPassword';
import ChangePasswordModal from './Modal/ChangePassword';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const usernameRef = useRef(null); // Ref for the username input

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
        }
        else {
          navigate('/create-company')
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
      }
      else {
        navigate("/create-accounting-year");
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
      toast.error("Both Login Name and Password are required!");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/userlogin`, {
        User_Name: username,
        User_Password: password,
        Company_Code: selectedCompany.Company_Code
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
      toast.success("Logged in successfully!");
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

  // Focus on the username input when the modal is shown
  useEffect(() => {
    if (showModal && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, [showModal]);

  // Handle "Enter" key press inside the modal
  const handleKeyDownModal = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
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

        <Modal
          show={showModal}
          onHide={handleClose}
          onKeyDown={handleKeyDownModal}
          className="custom-modal"

        >
          <Modal.Header closeButton>
            <Modal.Title >Company Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => e.preventDefault()}>
              {loginError && <p className="text-danger">{loginError}</p>}

              <Form.Group controlId="formBasicEmail">
                <Form.Label>User Name <span className="required-star">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter User Name"
                  autoComplete='off'
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  ref={usernameRef}

                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>User Password <span className="required-star">*</span> </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  autoComplete='off'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="accountYearSelect">
                <Form.Label>Account Year <span className="required-star">*</span></Form.Label>
                <Form.Control
                  as="select"
                  value={selectedAccountingYear ? selectedAccountingYear.yearCode : ''}
                  onChange={(e) => {
                    const newSelectedYear = accountingYears.find(year => year.yearCode.toString() === e.target.value);
                    setSelectedAccountingYear(newSelectedYear);
                    sessionStorage.setItem('Year_Code', newSelectedYear.yearCode);
                  }}
                >
                  {accountingYears.map((year) => (
                    <option key={year.yearCode} value={year.yearCode}>{year.year}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="currentBranchSelect">
                <Form.Label>Current Branch</Form.Label>
                <Form.Control as="select">
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ForgotPasswordModal show={showForgotPassword} handleClose={() => setShowForgotPassword(false)} />
            <ChangePasswordModal show={showChangePassword} handleClose={() => setShowChangePassword(false)} />
            <Link onClick={() => setShowForgotPassword(true)}>Forgot Password?</Link>
            <Button variant="primary" style={{ width: "80px" }} onClick={handleLogin} type="submit">Login</Button>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Link onClick={() => setShowChangePassword(true)}>Change Password</Link>
          </Modal.Footer>
        </Modal>

      </div>
    </>
  );
};

export default CompanyList;
