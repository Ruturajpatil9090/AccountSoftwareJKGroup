import axios from "axios"
//GET Values from session
const companyCode = sessionStorage.getItem("Company_Code");
const Year_Code = sessionStorage.getItem("Year_Code");

export const initialFormData = {
    tran_type: "DO",
    doc_no: "",
    desp_type: "DO",
    doc_date: new Date().toISOString().split("T")[0],
    mill_code : 0,
    grade : "",
    quantal : 0.0,
    packing: 50,
    bags: 0,
    mill_rate: 0.0,
    sale_rate: 0.0,
    Tender_Commission: 0.0,
    diff_rate: 0.0,
    diff_amount: 0.0,
    amount: 0.0,
    DO: 0,
    voucher_by: 0,
    broker: 0,
    company_code: companyCode,
    Year_Code: Year_Code,
    Branch_Code: 0,
    purc_no: 0,
    purc: 0,
    purc_order: 0,
    purc_type: "",
    truck_no: "",
    transport: 0,
    less: 0.0,
    less_amount: 0.0,
    final_amout: 0.0,
    vasuli: 0.0,
    narration1: "",
    narration2: "",
    narration3: "",
    narration4: "",
    narration5: "",
    excise_rate: 0.0,
    memo_no: 0,
    freight: 0.0,
    adv_freight1: 0.0,
    driver_no: "",
    driver_Name: "",
    voucher_no: "",
    voucher_type: "",
    GETPASSCODE: 0,
    tender_Remark: "",
    vasuli_rate: 0.0,
    vasuli_amount: 0.0,
    to_vasuli: 0,
    naka_delivery: "",
    send_sms: "",
    Itag: "",
    Ac_Code: 0,
    FreightPerQtl: 0.0,
    Freight_Amount: 0.0,
    Freight_RateMM: 0.0,
    Freight_AmountMM: 0.0,

    Paid_Rate1: 0.0,
    Paid_Amount1: 0.0,
    Paid_Narration1: "",
    Paid_Rate2: 0.0,
    Paid_Amount2: 0.0,
    Paid_Narration2: "",
    Paid_Rate3: 0.0,
    Paid_Amount3: 0.0,
    Paid_Narration3: "",
    MobileNo: "",
    Created_By: "",
    Modified_By: "",
    UTR_No: 0,
    UTR_Year_Code: 0,
    Carporate_Sale_No: 0,
    Carporate_Sale_Year_Code: 0,
    Delivery_Type: "",
    WhoseFrieght: "",
    SB_No: 0,
    Invoice_No: "",
    vasuli_rate1: 0.0,
    vasuli_amount1: 0.0,
    Party_Commission_Rate: 0.0,
    MM_CC: "",
    MM_Rate: 0.0,
    Memo_Advance: 0.0,
    Voucher_Brokrage: 0.0,
    Voucher_Service_Charge: 0.0,
    Voucher_RateDiffRate: 0.0,
    Voucher_RateDiffAmt: 0.0,
    Voucher_BankCommRate: 0.0,
    Voucher_BankCommAmt: 0.0,
    Voucher_Interest: 0.0,
    Voucher_TransportAmt: 0.0,
    Voucher_OtherExpenses: 0.0,
    CheckPost: "",
    SaleBillTo: 0,
    Pan_No: "",
    Vasuli_Ac: 0,
    LoadingSms: "",
    GstRateCode: 0,
    GetpassGstStateCode: 0,
    VoucherbyGstStateCode: 0,
    SalebilltoGstStateCode: 0.0,
    GstAmtOnMR: 0.0,
    GstAmtOnSR: 0.0,
    GstExlSR: 0.0,
    GstExlMR: 0.0,
    MillGSTStateCode: 0,
    TransportGSTStateCode: 0,
    EWay_Bill_No: "",
    Distance: 0.0,
    EWayBillChk: "",
    MillInvoiceNo: "",
    Purchase_Date: new Date().toISOString().split("T")[0],
    mc: 0,
    gp: 0,
    st: 0,
    sb: 0,
    tc: 0,
    itemcode: 0,
    cs: 0,
    ic: 0,
    tenderdetailid: 0,
    bk: 0,
    docd: 0,
    vb: 0,
    va: 0,
    carporate_ac: 0,
    ca: 0,
    mill_inv_date: new Date().toISOString().split("T")[0],
    mill_rcv: "",
    saleid: 0,
    MillEwayBill: "",
    TCS_Rate: 0.0,
    Sale_TCS_Rate: 0.0,
    Mill_AmtWO_TCS: 0.0,
    doidnew: 0,
    newsbno: 0,
    newsbdate: new Date().toISOString().split("T")[0],
    einvoiceno: "",
    ackno: "",
    commisionid: 0,
    brandcode: 0,
    Cash_diff: 0.0,
    CashDiffAc: "",
    TDSAc: 0,
    CashDiffAcId: 0,
    TDSAcId: 0,
    TDSRate: 0.0,
    TDSAmt: 0.0,
    TDSCut: "",
    tenderid: 0,
    MemoGSTRate: 0,
    RCMCGSTAmt: 0.0,
    RCMSGSTAmt: 0.0,
    RCMIGSTAmt: 0.0,
    RCMNumber: 0.0,
    EwayBillValidDate: new Date().toISOString().split("T")[0],
    SaleTDSRate: 0.0,
    PurchaseTDSRate: 0.0,
    PurchaseRate: 0.0,
    SBNarration: "",
    MailSend: "",
    ISEInvoice: "",
    IsPayment: "",
    Do_DATE: new Date().toISOString().split("T")[0],
    Insured: "",
    vehicle_reached: "",
    reached_date: new Date().toISOString().split("T")[0],
    Insurance: 0.0,
    ic1: 0,
    grade1: "",
    quantal1: 0.0,
    packing1: 0,
    bags1: 0,
    mill_rate1: 0.0,
    sale_rate1: 0.0,
    purc_no1: 0,
    purc_order1: 0,
    itemcode1: 0,
    PurchaseRate1: 0.0,
    mill_amount1: 0.0,
    mill_amountTCS1: 0.0,
    tenderdetailid1: 0,
    GT_Remark: "",
    SB_Other_Amount: 0.0,
    LockRecord: "",
    LockedUser: "",
    gstid: 0,
    purchaseid: 0,
    orderid: 0
  };


  //Common Check Status Function
  export const checkMatchStatus = async (ac_code, company_code, year_code) => {
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

  //Account Name
  export const Acname = async (ac_code, company_code) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/get_self_acname`,
        {
          params: {
            Ac_Code: ac_code,
            Company_Code: company_code,
          },
        }
      );
      return data.match_status;
    } catch (error) {
      console.error("Error:", error);
      return error;
    }
  };
