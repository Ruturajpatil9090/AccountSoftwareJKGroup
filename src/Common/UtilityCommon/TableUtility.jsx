import React, { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Grid, Paper, Typography, FormControl, Select, MenuItem, InputLabel, CircularProgress, Box } from "@mui/material";
import Pagination from "../../Common/UtilityCommon/Pagination";
import SearchBar from "../../Common/UtilityCommon/SearchBar";
import PerPageSelect from "../../Common/UtilityCommon/PerPageSelect";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageNotFound from "./../PageNotFound/PageNotFound";
import { RingLoader } from 'react-spinners';
import BackButton from "../Buttons/BackButton";

const styles = {
    tableHeaderCell: {
      backgroundColor: '#f4f4f4',
      fontSize: '26px',
      fontWeight: '800',
      padding: '10px',
      cursor: 'pointer',
    },
  };

function TableUtility({
    title,
    apiUrl,
    columns,
    rowKey,
    addUrl,
    detailUrl,
    permissionUrl,
    dropdownOptions = null,
    dropdownValue,
    onDropdownChange,
    queryParams = {},
    includeYearCode,
}) {
    const companyCode = sessionStorage.getItem('Company_Code');
    const Year_Code = sessionStorage.getItem('Year_Code');
    const uid = sessionStorage.getItem('uid');

    const [fetchedData, setFetchedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [canView, setCanView] = useState(null);
    const [permissionsData, setPermissionData] = useState({});
    const [localDropdownValue, setLocalDropdownValue] = useState(dropdownValue);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const inputRef = useRef(null)

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const userCheckUrl = `${process.env.REACT_APP_API}/get_user_permissions?Company_Code=${companyCode}&Program_Name=${permissionUrl}&uid=${uid}`;
                const response = await axios.get(userCheckUrl);
                setPermissionData(response.data?.UserDetails);
                if (response.data?.UserDetails?.canView === 'Y') {
                    setCanView(true);
                    fetchData();
                    setTimeout(()=>{
                        inputRef.current.focus();
                    },0)
                } else {
                    setCanView(false);
                }
            } catch (error) {
                console.error("Error fetching user permissions:", error);
                setCanView(false);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    Company_Code: companyCode,
                    ...queryParams
                });

                if (includeYearCode) {
                    params.append('Year_Code', Year_Code);
                }
                const response = await axios.get(`${apiUrl}?${params.toString()}`);
                if (response.data) {
                    const dataKey = Object.keys(response.data)[0];
                    setFetchedData(response.data[dataKey]);
                    setFilteredData(response.data[dataKey]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        checkPermissions();
    }, [apiUrl, JSON.stringify(queryParams)]);


    useEffect(() => {
        const filtered = fetchedData.filter(post => {
            const searchTermLower = searchTerm.toLowerCase();
            const matchesSearch = Object.keys(post).some(key =>
                String(post[key]).toLowerCase().includes(searchTermLower)
            );

            const matchesDropdown = localDropdownValue
                ? post.tran_type === localDropdownValue
                : true;

            return matchesSearch && matchesDropdown;
        });

        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, fetchedData, localDropdownValue]);

    if (canView === false) {
        return <PageNotFound />;
    }

    const handlePerPageChange = (event) => {
        setPerPage(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (rowId) => {
        const selectedRecord = filteredData.find(record => record[rowKey] === rowId);
        navigate(detailUrl, { state: { selectedRecord, permissionsData } });
    };

    const handleAddClick = () => {
        const stateData = { permissionsData };

        if (localDropdownValue) {
            stateData.selectedfilter = localDropdownValue;
        }

        navigate(addUrl, { state: stateData });
    };

    const handleBackClick = () => {
        navigate("/dashboard");
    };

    const pageCount = Math.ceil(filteredData.length / perPage);
    const paginatedPosts = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);

    return (
        <div>
            <Typography variant="h6" style={{ textAlign: 'center', fontSize: "24px", fontWeight: "bold", marginTop:"10px" }}>{title}</Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleAddClick} ref= {inputRef} disabled={permissionsData.canSave === "N"}>Create New</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleBackClick}>Back</Button>
                </Grid>
                <Grid item>
                    <PerPageSelect value={perPage} onChange={handlePerPageChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SearchBar value={searchTerm} onChange={handleSearchTermChange} />
                </Grid>
                {dropdownOptions && (
                    <Grid item xs={3} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Filter by Type</InputLabel>
                            <Select
                                value={localDropdownValue}
                                onChange={(e) => {
                                    setLocalDropdownValue(e.target.value);
                                    onDropdownChange(e);
                                }}
                            >
                                {dropdownOptions.map((option, index) => (
                                    <MenuItem key={index} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )}
             
                <Grid item xs={12}>
                    <Paper elevation={20}>
                        <TableContainer>
                            {loading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                                    <RingLoader />
                                </Box>
                            ) : (
                                <Table>
                                    <TableHead>
                                        <TableRow style={styles.tableHeaderCell}>
                                            {columns.map((column, index) => (
                                                <TableCell key={index}>{column.label}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedPosts.map((post) => (
                                            <TableRow
                                                key={post[rowKey]}
                                                style={{ cursor: "pointer" }}
                                                onDoubleClick={() => handleRowClick(post[rowKey])}
                                                sx={{
                                                    '&:hover': {
                                                      backgroundColor: '#f3f388',
                                                    },
                                                  }}
                                            >
                                                {columns.map((column, index) => (
                                                    <TableCell key={index}>{post[column.key]}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Pagination
                        pageCount={pageCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default TableUtility;
