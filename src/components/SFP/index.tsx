import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { ToastContainer, toast } from 'react-toastify';

import { api } from '../../services/api';

import gbmx from '../../assets/gbmx.png';

import styles from './styles.module.scss';
import 'react-toastify/dist/ReactToastify.css';
// import { request } from 'http';

const override = css`
  margin: 8px auto;
`;

type Response = {
  error: Number;
  priceQuotation: PriceQuotation;
  message?: string;
}

type ResponseCurrency = {
  value: string;
}

type PriceQuotation = {
  sfp: string;
  approved: boolean;
  primaryInfo: {
    freightCar: string;
    customer: string;
    quotationVolume: string;
    quantityEmployeeOnProject: string;
    freightCarsPerShift: string;
    rate: string;
    manHours: string;
    fabricationHours: string;
    totalProjectValue: string;
    profitabilityTotal: string;
    economicLevel: string;
    netPrice: string;
    profitability: string;
    grossMargin: string;
  };
  industrialCosts: {
    bogies: IndustrialCost;
    draftGearSystem: IndustrialCost;
    brakeSystem: IndustrialCost;
    superstructure: IndustrialCost;
    outsorcing: IndustrialCost;
    prototype: IndustrialCost;
    rampup: IndustrialCost;
    totals: IndustrialCost
  },
  administrativeExpenses: {
    financeExpenses: AdministrativeExpense;
    sgaOthers: AdministrativeExpense;
    totals: AdministrativeExpense;
  },
  additionalExpenses: {
    commission: AdditionalExpense;
    warranty: AdditionalExpense;
    freight: AdditionalExpense;
    logisticsCosts: AdditionalExpense;
    engineeringHours: AdditionalExpense;
    structuralCalculation: AdditionalExpense;
    gadgetsMaterial: AdditionalExpense;
    gadgetsHours: AdditionalExpense;
    tests: AdditionalExpense;
    total: string;
  }
}

type IndustrialCost = {
  hours: string;
  value: string;
  cost: string;
  total: string;
}

type AdministrativeExpense = {
  percent: string;
  total: string;
}

type AdditionalExpense = {
  value: string;
  total: string;
}

type RequestBody = {
  [lib: string]: string;
  code: string;
  currency: string;
  profitability: string;
  netPrice: string;
  quotationVolume: string;
  laborHoursBogies: string;
  laborHoursDraftGearSystem: string;
  laborHoursBrakeSystem: string;
  laborHoursSuperstructure: string;
  laborHoursOutsorcing: string;
  laborHoursPrototype: string;
  laborHoursRampup: string;
  rawMaterialCostsBogies: string;
  rawMaterialCostsDraftGearSystem: string;
  rawMaterialCostsBrakeSystem: string;
  rawMaterialCostsSuperstructure: string;
  rawMaterialCostsOutsorcing: string;
  rawMaterialCostsPrototype: string;
  rawMaterialCostsRampup: string;
  financeExpensesPercent: string;
  sgaOthersPercent: string;
  comission: string;
  warranty: string;
  freightCost: string;
  logisticsCost: string;
  engineeringHours: string;
  structuralCalculation: string;
  gadgetsMaterial: string;
  gadgetsHours: string;
  tests: string;
  freightCarsPerShift: string;
  rate: string;
  handled: string;
}

const initialPriceQuotation: PriceQuotation = {
  sfp: '',
  approved: false,
  primaryInfo: {
    freightCar: '',
    customer: '',
    quotationVolume: '',
    quantityEmployeeOnProject: '',
    freightCarsPerShift: '',
    rate: '',
    manHours: '',
    fabricationHours: '',
    totalProjectValue: '',
    profitabilityTotal: '',
    economicLevel: '',
    netPrice: '',
    profitability: '',
    grossMargin: '',
  },
  industrialCosts: {
    bogies: {
      hours: '',
      value: '',
      cost: '',
      total: '',
    },
    draftGearSystem: {
      hours: '',
      value: '',
      cost: '',
      total: '',
    },
    brakeSystem: {
      hours: '',
      value: '',
      cost: '',
      total: '',
    },
    superstructure: {
      hours: '',
      value: '',
      cost: '',
      total: '',
    },
    outsorcing: {
      hours: '',
      value: '',
      cost: '',
      total: '',
    },
    prototype: {
      hours: '',
      value: '',
      cost: '',
      total: '',
    },
    rampup: {
      hours: '',
      value: '',
      cost: '',
      total: '',
    },
    totals: {
      hours: '',
      value: '',
      cost: '',
      total: '',
    },
  },
  administrativeExpenses: {
    financeExpenses: {
      percent: '',
      total: '',
    },
    sgaOthers: {
      percent: '',
      total: '',
    },
    totals: {
      percent: '',
      total: '',
    },
  },
  additionalExpenses: {
    commission: {
      value: '',
      total: '',
    },
    warranty: {
      value: '',
      total: '',
    },
    freight: {
      value: '',
      total: '',
    },
    logisticsCosts: {
      value: '',
      total: '',
    },
    engineeringHours: {
      value: '',
      total: '',
    },
    structuralCalculation: {
      value: '',
      total: '',
    },
    gadgetsMaterial: {
      value: '',
      total: '',
    },
    gadgetsHours: {
      value: '',
      total: '',
    },
    tests: {
      value: '',
      total: ''
    },
    total: '',
  }
}

const initialRequestBody: RequestBody = {
  lib: "pricing",
  code: "",
  currency: "",
  profitability: "",
  netPrice: "",
  quotationVolume: "",
  laborHoursBogies: "",
  laborHoursDraftGearSystem: "",
  laborHoursBrakeSystem: "",
  laborHoursSuperstructure: "",
  laborHoursOutsorcing: "",
  laborHoursPrototype: "",
  laborHoursRampup: "",
  rawMaterialCostsBogies: "",
  rawMaterialCostsDraftGearSystem: "",
  rawMaterialCostsBrakeSystem: "",
  rawMaterialCostsSuperstructure: "",
  rawMaterialCostsOutsorcing: "",
  rawMaterialCostsPrototype: "",
  rawMaterialCostsRampup: "",
  financeExpensesPercent: "",
  sgaOthersPercent: "",
  comission: "",
  warranty: "",
  freightCost: "",
  logisticsCost: "",
  engineeringHours: "",
  structuralCalculation: "",
  gadgetsMaterial: "",
  gadgetsHours: "",
  tests: "",
  freightCarsPerShift: "",
  rate: "",
  handled: ""
}

type Rate = {
  description: string;
  value: string;
}

type RateList = Array<Rate>;

type RateResponse = {
  error: Number;
  rates: RateList;
  message?: string;
}

type Props = {
  index: number;
  closeSFP: (index: number) => void;
}

const params = new URLSearchParams(document.location.search.substring(1));
var sfpCode = params.get('code');
var user = params.get('user');
var name = params.get('name');

export function SFP({ closeSFP, index }: Props) {
  const [priceQuotationCode, setPriceQuotationCode] = useState(sfpCode ?? '');
  const [priceQuotation, setPriceQuotation] = useState<PriceQuotation>(initialPriceQuotation);
  const [currency, setCurrency] = useState('R$');
  const [currencyValue, setCurrencyValue] = useState('1,00');
  const [profitabilityValue, setProfitabilityValue] = useState('1,00');
  const [requestBody, setRequestBody] = useState<RequestBody>(initialRequestBody);
  const [isLoading, setIsLoading] = useState(false);
  const [ratesList, setRatesList] = useState<RateList>([]);
  // const [netPrice, setNetPrice] = useState<string>();


  async function handleGetPriceQuotation(reset?: boolean, handled?: string) {
    if (priceQuotationCode === '') {
      setPriceQuotation(initialPriceQuotation);
      return;
    }



    let body = requestBody;

    if (reset) {
      body = {
        lib: "pricing",
        code: "",
        currency: "",
        profitability: "",
        netPrice: "",
        quotationVolume: "",
        laborHoursBogies: "",
        laborHoursDraftGearSystem: "",
        laborHoursBrakeSystem: "",
        laborHoursSuperstructure: "",
        laborHoursOutsorcing: "",
        laborHoursPrototype: "",
        laborHoursRampup: "",
        rawMaterialCostsBogies: "",
        rawMaterialCostsDraftGearSystem: "",
        rawMaterialCostsBrakeSystem: "",
        rawMaterialCostsSuperstructure: "",
        rawMaterialCostsOutsorcing: "",
        rawMaterialCostsPrototype: "",
        rawMaterialCostsRampup: "",
        financeExpensesPercent: "",
        sgaOthersPercent: "",
        comission: "",
        warranty: "",
        freightCost: "",
        logisticsCost: "",
        engineeringHours: "",
        structuralCalculation: "",
        gadgetsMaterial: "",
        gadgetsHours: "",
        tests: "",
        freightCarsPerShift: "",
        rate: "",
        handled: ""
      };
    }

    body.code = priceQuotationCode;
    if (handled) body.handled = handled;
    else body.handled = '';

    setRequestBody(body);

    setIsLoading(true);

    setPriceQuotation(initialPriceQuotation);

    await api.get<Response>('/', {
      params: body
    }).then((response) => {
      const { data } = response;

      if (data.error) {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        return;
      }

      setProfitabilityValue(data.priceQuotation.primaryInfo.profitability);

      setPriceQuotation(data.priceQuotation);
      let body = requestBody;
      body.code = data.priceQuotation.sfp;
      // body.comission = '';
      // body.currency = '';
      // body.engineeringHours = '';
      body.financeExpensesPercent = data.priceQuotation.administrativeExpenses.financeExpenses.percent;
      body.freightCarsPerShift = data.priceQuotation.primaryInfo.freightCarsPerShift;
      // body.freightCost = '';
      // body.gadgetsHours = '';
      // body.gadgetsMaterial = '';
      // body.laborHoursBogies = '';
      // body.laborHoursBrakeSystem = '';
      // body.laborHoursDraftGearSystem = '';
      // body.laborHoursOutsorcing = '';
      // body.laborHoursPrototype = '';
      // body.laborHoursRampup = '';
      // body.laborHoursSuperstructure = '';
      // body.logisticsCost = '';
      // body.netPrice = data.priceQuotation.primaryInfo.netPrice;
      body.profitability = data.priceQuotation.primaryInfo.profitability;
      body.quotationVolume = data.priceQuotation.primaryInfo.quotationVolume;
      body.rate = data.priceQuotation.primaryInfo.rate;
      // body.rawMaterialCostsBogies = '';
      // body.rawMaterialCostsBrakeSystem = '';
      // body.rawMaterialCostsDraftGearSystem = '';
      // body.rawMaterialCostsOutsorcing = '';
      // body.rawMaterialCostsPrototype = '';
      // body.rawMaterialCostsRampup = '';
      // body.rawMaterialCostsSuperstructure = '';
      body.sgaOthersPercent = data.priceQuotation.administrativeExpenses.sgaOthers.percent;
      // body.structuralCalculation = '';
      // body.tests = '';
      body.warranty = data.priceQuotation.additionalExpenses.warranty.value;
      setRequestBody(body);
      handleGetRateList();
    }).catch((error) => {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setPriceQuotation(initialPriceQuotation);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  async function handleGetRateList() {
    await api.get<RateResponse>('/', {
      params: {
        lib: 'rates',
        sfp: params.get('code')
      }
    }).then((response) => {
      const { data } = response;

      if (data.error) {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        return;
      }

      setRatesList(data.rates);
    }).catch((error) => {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  }


  function openCurrency(event: any) {
    const value = event.target.innerText;
    if (value !== '1,00') {
      window.open('http://172.30.0.94/greenbrier/handleCurrency', '_blank', "toolbar,scrollbars,resizable,top=500,left=500,width=600,height=400");
      toast.info('Necessário recarregar a página', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => window.location.href = `http://172.30.0.94/greenbrier/sfp-price-quotation/?code=${params.get('code')}&user=&name=`,
      });
    }
  }


  function openScrap(event: any) {
    const value = event.target.innerText;
    if (value !== '1,00') {
      window.open(`http://172.30.0.94/greenbrier/controle_sucata_sfp/?sfp=${params.get('code')}`, '_blank');
      toast.info('Necessário recarregar a página', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => window.location.href = `http://172.30.0.94/greenbrier/sfp-price-quotation/?code=${params.get('code')}&user=&name=`,
      });
    }
  }


  function openObservations(event: any) {
    const value = event.target.innerText;
    window.open(`http://172.30.0.94/greenbrier/sfp_gbmx/form_obs.php?etapa=CONTROL&sfp=${params.get('code')}&minificado=yes`, '_blank');
  }

  async function findCurrency(selectedCurrency: string) {
    const response = await api.get<ResponseCurrency>(`http://172.30.0.94/greenbrier/sfp-price-quotation-webservice/?lib=currency&currency=${selectedCurrency}`);

    return response.data.value;
  }

  async function handleCurrency(event: any) {
    let body = requestBody;
    const selectedCurrency = event.target.value;

    if (selectedCurrency === 'R$') {
      body.currency = '1,0';
    } else {
      // body.currency = '3,8';
      let value = await (findCurrency(selectedCurrency));
      body.currency = value.replace('.', ',');
    };




    setCurrency(selectedCurrency);
    setCurrencyValue(body.currency);

    setRequestBody(body);

    handleGetPriceQuotation();
  }

  function handleRate(event: React.ChangeEvent<HTMLSelectElement>) {
    let body = requestBody;
    const selectedRate = event.target.value;

    body.rate = selectedRate;

    setRequestBody(body);

    handleGetPriceQuotation();
  }

  function handleFreightCarPerShift(event: React.ChangeEvent<HTMLSelectElement>) {
    let body = requestBody;
    const selectedFreightCardPerShift = event.target.value;
    body.freightCarsPerShift = selectedFreightCardPerShift;

    setRequestBody(body);

    handleGetPriceQuotation();
  }

  function handleRequestBodyFields(event: React.ChangeEvent<HTMLInputElement>, field: string) {
    let body = requestBody;

    body[field] = event.target.value;

    if (field === 'profitability') handleGetPriceQuotation(false, 'profitability');
    else handleGetPriceQuotation();

    setRequestBody(body);
  }

  async function handleApprove() {
    await api.get<Response>('/', {
      params: {
        lib: 'approve',
        code: priceQuotationCode,
        user: `${user}-${name}`,
        rate: priceQuotation.primaryInfo.rate,
      }
    }).then((response) => {
      const { data } = response;

      if (data.error) {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        return;
      }

      saveData();

      toast.success(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => window.location.href = `http://172.30.0.94/greenbrier/sfp_gbmx/lista_geral.php?etapa=CONTROL`,
      });
    }).catch((error) => {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).finally(() => {
      setPriceQuotation(initialPriceQuotation);
      setIsLoading(false);
    });
  }

  function handleExportData() {
    let materialTotal = priceQuotation.industrialCosts.totals.total;
    let paramGrossMargin = priceQuotation.primaryInfo.grossMargin;
    let paramProfitabilityValue = profitabilityValue;
    let paramRate = priceQuotation.primaryInfo.rate;
    let paramCost = priceQuotation.industrialCosts.totals.cost;
    let paramEngIndustrial = priceQuotation.additionalExpenses.gadgetsHours.value;
    let paramEngIndustrialUnit = priceQuotation.additionalExpenses.gadgetsHours.total;
    let paramCostTotal = parseFloat(priceQuotation.industrialCosts.totals.total.replaceAll('.', '').replaceAll(',', '.')) + parseFloat(priceQuotation.administrativeExpenses.totals.total.replaceAll('.', '').replaceAll(',', '.')) + parseFloat(priceQuotation.additionalExpenses.warranty.total.replaceAll('.', '').replaceAll(',', '.')) + parseFloat(priceQuotation.additionalExpenses.total.replaceAll('.', '').replaceAll(',', '.'));
    let v_total = priceQuotation.primaryInfo.netPrice;

    window.open(`http://172.30.0.94/greenbrier/sfp_gbmx/export_sfp.php?id=${priceQuotationCode}&material=${materialTotal}&gMargin=${paramGrossMargin}&profi=${paramProfitabilityValue}&paramRate=${paramRate}&paramCost=${paramCost}&paramEngIndustrial=${paramEngIndustrial}&paramEngIndustrialUnit=${paramEngIndustrialUnit}&paramCostTotal=${paramCostTotal}&v_total=${v_total}`, 'sharer', 'toolbar=0,status=0,width=548,height=325');
  }

  function changeNetPrice(event: React.ChangeEvent<HTMLInputElement>) {
    const value = (event.target.value).replace('.', '').replace(',', '.');
    let body = requestBody;
    body.netPrice = value;

    setRequestBody(body);
    handleGetPriceQuotation(false, 'netPrice');
  }

  async function saveData() {
    await api.post('/saveData/', {
      priceQuotation,
      currency: currency
    });
  }


  async function redirectStage(stage: string) {
    await saveData();
    let redirect = '';
    if (stage === 'vendas') redirect = `http://172.30.0.94/greenbrier/sfp_gbmx/formulario4.php?sfpCode=${priceQuotationCode}&editing_by_control=yes`;
    else if (stage === 'eng-prod') redirect = `http://172.30.0.94/greenbrier/sfp_gbmx/lista_truque2.php?id=${priceQuotationCode}&editing_by_control=yes`;
    else if (stage === 'eng-proc') redirect = `http://172.30.0.94/greenbrier/sfp_gbmx/lista_processo3.php?id=${priceQuotationCode}&primeiroAcesso=sim&editing_by_control=yes`;
    else if (stage === 'cruzeiro') redirect = `http://172.30.0.94/greenbrier/sfp_gbmx/lista_crz.php?id=${priceQuotationCode}&editing_by_control=yes`;
    else if (stage === 'logistica') redirect = `http://172.30.0.94/greenbrier/sfp_gbmx/lista_logist.php?id=${priceQuotationCode}&editing_by_control=yes`;
    else if (stage === 'pcp') redirect = `http://172.30.0.94/greenbrier/sfp_gbmx/lista_vendas.php?id=${priceQuotationCode}&editing_by_control=yes`;
    else if (stage === 'qualidade') redirect = `http://172.30.0.94/greenbrier/sfp_gbmx/lista_processo2.php?teste1=QUALIDADE&id=${priceQuotationCode}&editing_by_control=yes`;
    else if (stage === 'compras') redirect = `http://172.30.0.94/greenbrier/sfp_gbmx/lista_compras2.php?id=${priceQuotationCode}&editing_by_control=yes`;

    if (redirect !== '') {
      window.location.replace(redirect);
    }
  }

  useEffect(() => {
    sfpCode = null;
    handleGetPriceQuotation();
  }, []);

  return (
    <div className={styles.container}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ToastContainer />
      {/* <div className={styles.closeContainer}>
        <button onClick={() => { closeSFP(index) }}>
          <FiXSquare size={20} />
        </button>
      </div> */}
      <div className={styles.header}>
        <img src={gbmx} alt="GBMX" />
        <div className={styles.side}>
          <div className={styles.sfp}>
            <p>SFP</p>
            <input
              type="text"
              id="code"
              value={priceQuotationCode}
              onBlur={() => { handleGetPriceQuotation(true) }}
              onChange={event => setPriceQuotationCode(event.target.value)}
            />
          </div>
          <h2 className="title">Price Quotation</h2>
        </div>
      </div>
      {
        isLoading
          ? <div className={styles.loaderContainer}>
            <PropagateLoader color={'#00833b'} css={override} />
          </div>
          : priceQuotation.sfp && <>
            <div className={styles.infoContainer}>
              <div className={styles.infoContent}>
                <h3 className={styles.title}>{priceQuotation.primaryInfo.freightCar}</h3>
                <p className={styles.info}>Customer: <span>
                  {priceQuotation.primaryInfo.customer}
                </span></p>
                <p className={styles.info}>Quotation volume: <span>
                  {priceQuotation.primaryInfo.quotationVolume}
                </span></p>
                <p className={styles.info}>Qty of employee on project: <span>
                  {priceQuotation.primaryInfo.quantityEmployeeOnProject}
                </span></p>
                <p className={styles.info}>Qty of freight cars per shift: <span>
                  <select
                    onChange={handleFreightCarPerShift}
                    value={priceQuotation.primaryInfo.freightCarsPerShift}
                    disabled={priceQuotation.approved}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </span></p>
                <p className={styles.info}>Rate: <span>
                  {
                    priceQuotation.approved
                      ? <input
                        type="text"
                        value={`R$ ${priceQuotation.primaryInfo.rate}`}
                        disabled
                      />
                      : <select
                        onChange={handleRate}
                        value={priceQuotation.primaryInfo.rate}
                        disabled={priceQuotation.approved}
                      >
                        {ratesList.map((item, index) => {
                          return <option key={index} value={item.value}>{`${item.description} (R$ ${item.value})`}</option>
                        })}
                      </select>
                  }
                </span></p>
                <p className={styles.info}>Man hours: <span>
                  {priceQuotation.primaryInfo.manHours} hours
                </span></p>
                <p className={styles.info}>Fabrication hours: <span>
                  {priceQuotation.primaryInfo.fabricationHours} hours
                </span></p>
              </div>
              <div className={styles.infoContent}>
                <p className={styles.info}> Total project value: <span>
                  {`${currency} ${priceQuotation.primaryInfo.totalProjectValue}`}
                </span></p>
                <p className={styles.info}>PROFITABILITY Total: <span>
                  {`${currency} ${priceQuotation.primaryInfo.profitabilityTotal}`}
                </span></p>
                <p className={styles.info}>Economic Level: <span>
                  {priceQuotation.primaryInfo.economicLevel}
                </span></p>
                <table>
                  <tbody>
                    <tr>
                      <td>Currency</td>
                      <td>
                        <select
                          onChange={handleCurrency}
                          value={currency === 'R$' ? 'R$' : '$'}
                          disabled={priceQuotation.approved}
                        >
                          <option value="R$">BRL</option>
                          <option value="$">USD</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td onClick={openCurrency}>{currencyValue}</td>
                    </tr>
                    <tr>
                      <td>NET PRICE</td>
                      <td>
                        {currency}<input
                          type="text"
                          defaultValue={`${priceQuotation.primaryInfo.netPrice}`}
                          maxLength={50}
                          width={'500px'}
                          onBlur={event => changeNetPrice(event)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>PROFITABILITY</td>
                      <td>
                        <input
                          type="text"
                          onBlur={(event) => handleRequestBodyFields(event, 'profitability')}
                          onChange={event => setProfitabilityValue(event.target.value)}
                          value={profitabilityValue}
                          disabled={priceQuotation.approved}
                        />%
                      </td>
                      {/* <td>{priceQuotation.primaryInfo.profitability}%</td> */}
                    </tr>
                    <tr>
                      <td>GROSS MARGIN</td>
                      <td>{priceQuotation.primaryInfo.grossMargin}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.costsContainer}>
              <span className={styles.linkText} onClick={openScrap}>Configure values for scrap</span>
              {/* <span className={styles.linkText} onClick={saveData}>Save Data</span> */}
              <table>
                <thead>
                  <tr>
                    <th className={styles.textAlignLeft}>INDUSTRIAL COSTS</th>
                    <th colSpan={2}>LABOR</th>
                    <th className={styles.textAlignRight}>RAW MATERIAL</th>
                    <th className={styles.textAlignRight}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.textAlignLeft}>Bogies</td>
                    {/* <td className={styles.textAlignCenter}>{priceQuotation.industrialCosts.bogies.hours}</td> */}
                    <td className={styles.textAlignLeft}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'laborHoursBogies')}
                        defaultValue={priceQuotation.industrialCosts.bogies.hours}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.bogies.value}`}</td>
                    {/* <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.bogies.cost}`}</td> */}
                    <td className={styles.textAlignCenter}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'rawMaterialCostsBogies')}
                        defaultValue={priceQuotation.industrialCosts.bogies.cost}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.bogies.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Draftgear System</td>
                    {/* <td className={styles.textAlignCenter}>{priceQuotation.industrialCosts.draftGearSystem.hours}</td> */}
                    <td className={styles.textAlignLeft}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'laborHoursDraftGearSystem')}
                        defaultValue={priceQuotation.industrialCosts.draftGearSystem.hours}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.draftGearSystem.value}`}</td>
                    {/* <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.draftGearSystem.cost}`}</td> */}
                    <td className={styles.textAlignCenter}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'rawMaterialCostsDraftGearSystem')}
                        defaultValue={priceQuotation.industrialCosts.draftGearSystem.cost}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.draftGearSystem.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Brake System</td>
                    {/* <td className={styles.textAlignCenter}>{priceQuotation.industrialCosts.brakeSystem.hours}</td> */}
                    <td className={styles.textAlignLeft}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'laborHoursBrakeSystem')}
                        defaultValue={priceQuotation.industrialCosts.brakeSystem.hours}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.brakeSystem.value}`}</td>
                    {/* <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.brakeSystem.cost}`}</td> */}
                    <td className={styles.textAlignCenter}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'rawMaterialCostsBrakeSystem')}
                        defaultValue={priceQuotation.industrialCosts.brakeSystem.cost}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.brakeSystem.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Superstructure</td>
                    {/* <td className={styles.textAlignCenter}>{priceQuotation.industrialCosts.superstructure.hours}</td> */}
                    <td className={styles.textAlignLeft}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'laborHoursSuperstructure')}
                        defaultValue={priceQuotation.industrialCosts.superstructure.hours}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.superstructure.value}`}</td>
                    {/* <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.superstructure.cost}`}</td> */}
                    <td className={styles.textAlignCenter}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'rawMaterialCostsSuperstructure')}
                        defaultValue={priceQuotation.industrialCosts.superstructure.cost}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.superstructure.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Outsorcing</td>
                    {/* <td className={styles.textAlignCenter}>{priceQuotation.industrialCosts.outsorcing.hours}</td> */}
                    <td className={styles.textAlignLeft}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'laborHoursOutsorcing')}
                        defaultValue={priceQuotation.industrialCosts.outsorcing.hours}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.outsorcing.value}`}</td>
                    {/* <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.outsorcing.cost}`}</td> */}
                    <td className={styles.textAlignCenter}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'rawMaterialCostsOutsorcing')}
                        defaultValue={priceQuotation.industrialCosts.outsorcing.cost}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.outsorcing.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Prototype</td>
                    {/* <td className={styles.textAlignCenter}>{priceQuotation.industrialCosts.prototype.hours} hours</td> */}
                    <td className={styles.textAlignLeft}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'laborHoursPrototype')}
                        defaultValue={priceQuotation.industrialCosts.prototype.hours}
                        disabled={priceQuotation.approved}
                      />hours
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.prototype.value}`}</td>
                    {/* <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.prototype.cost}`}</td> */}
                    <td className={styles.textAlignCenter}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'rawMaterialCostsPrototype')}
                        defaultValue={priceQuotation.industrialCosts.prototype.cost}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.prototype.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Ramp Up</td>
                    {/* <td className={styles.textAlignCenter}>{priceQuotation.industrialCosts.rampup.hours} hours</td> */}
                    <td className={styles.textAlignLeft}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'laborHoursRampup')}
                        defaultValue={priceQuotation.industrialCosts.rampup.hours}
                        disabled={priceQuotation.approved}
                      />hours
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.rampup.value}`}</td>
                    {/* <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.rampup.cost}`}</td> */}
                    <td className={styles.textAlignCenter}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'rawMaterialCostsRampup')}
                        defaultValue={priceQuotation.industrialCosts.rampup.cost}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.rampup.total}`}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className={styles.textAlignCenter}>{priceQuotation.industrialCosts.totals.hours} hours</td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.totals.value}`}</td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.totals.cost}`}</td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.industrialCosts.totals.total}`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.administrativeExpensesContainer}>
              <table>
                <thead>
                  <tr>
                    <th colSpan={5} className={styles.textAlignLeft}>ADMINISTRATIVE EXPENSES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.textAlignLeft}>Finance Expenses</td>
                    <td>30 days</td>
                    {/* <td className={styles.textAlignRight}>{priceQuotation.administrativeExpenses.financeExpenses.percent}%</td> */}
                    <td className={styles.textAlignCenter}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'financeExpensesPercent')}
                        defaultValue={priceQuotation.administrativeExpenses.financeExpenses.percent}
                        disabled={priceQuotation.approved}
                      />%
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.administrativeExpenses.financeExpenses.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>SG&A/Others</td>
                    <td></td>
                    {/* <td className={styles.textAlignRight}>{priceQuotation.administrativeExpenses.sgaOthers.percent}%</td> */}
                    <td className={styles.textAlignCenter}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'sgaOthersPercent')}
                        defaultValue={priceQuotation.administrativeExpenses.sgaOthers.percent}
                        disabled={priceQuotation.approved}
                      />%
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.administrativeExpenses.sgaOthers.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}></td>
                    <td></td>
                    <td className={styles.textAlignCenter}>{priceQuotation.administrativeExpenses.totals.percent}%</td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.administrativeExpenses.totals.total}`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.additionalExpensesContainer}>
              <table>
                <thead>
                  <tr>
                    <th colSpan={5} className={styles.textAlignLeft}>ADDITIONAL EXPENSES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.textAlignLeft}>Comission</td>
                    {/* <td className={styles.textAlignCenter}>{priceQuotation.additionalExpenses.commission.value}%</td> */}
                    <td className={styles.textAlignCenter}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'commission')}
                        defaultValue={priceQuotation.additionalExpenses.commission.value}
                        disabled={priceQuotation.approved}
                      />%
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.additionalExpenses.commission.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Warranty</td>
                    {/* <td className={styles.textAlignCenter}>{priceQuotation.additionalExpenses.warranty.value}%</td> */}
                    <td className={styles.textAlignCenter}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'warranty')}
                        defaultValue={priceQuotation.additionalExpenses.warranty.value}
                        disabled={priceQuotation.approved}
                      />%
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.additionalExpenses.warranty.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Freight</td>
                    <td className={styles.textAlignCenter}>{priceQuotation.additionalExpenses.freight.value}</td>
                    {/* <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.additionalExpenses.freight.total}`}</td> */}
                    <td className={styles.textAlignRight}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'freightCost')}
                        defaultValue={priceQuotation.additionalExpenses.freight.total}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Logistics Costs</td>
                    <td className={styles.textAlignCenter}>{priceQuotation.additionalExpenses.logisticsCosts.value}</td>
                    {/* <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.additionalExpenses.logisticsCosts.total}`}</td> */}
                    <td className={styles.textAlignRight}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'logisticsCost')}
                        defaultValue={priceQuotation.additionalExpenses.logisticsCosts.total}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Engineering Hours</td>
                    {/* <td className={styles.textAlignCenter}>{priceQuotation.additionalExpenses.engineeringHours.value} hours</td> */}
                    <td className={styles.textAlignCenter}>
                      <input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'engineeringHours')}
                        defaultValue={priceQuotation.additionalExpenses.engineeringHours.value}
                        disabled={priceQuotation.approved}
                      />hours
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.additionalExpenses.engineeringHours.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Additional Items</td>
                    <td className={styles.textAlignCenter}>{priceQuotation.additionalExpenses.structuralCalculation.value}</td>
                    {/* <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.additionalExpenses.structuralCalculation.total}`}</td> */}
                    <td className={styles.textAlignRight}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'structuralCalculation')}
                        defaultValue={priceQuotation.additionalExpenses.structuralCalculation.total}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Gadgets (Material)</td>
                    {/* <td className={styles.textAlignCenter}>{`${currency} ${priceQuotation.additionalExpenses.gadgetsMaterial.value}`}</td> */}
                    <td className={styles.textAlignCenter}>
                      {currency}<input className={styles.longValue}
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'gadgetsMaterial')}
                        defaultValue={priceQuotation.additionalExpenses.gadgetsMaterial.value}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.additionalExpenses.gadgetsMaterial.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Gadgets (Hours)</td>
                    {/* <td className={styles.textAlignCenter}>{`${currency} ${priceQuotation.additionalExpenses.gadgetsHours.value}`}</td> */}
                    <td className={styles.textAlignCenter}>
                      {currency}<input className={styles.longValue}
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'gadgetsHours')}
                        defaultValue={priceQuotation.additionalExpenses.gadgetsHours.value}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.additionalExpenses.gadgetsHours.total}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.textAlignLeft}>Tests</td>
                    <td className={styles.textAlignCenter}></td>
                    {/* <td className={styles.textAlignRight}>R$ 0,00</td> */}
                    <td className={styles.textAlignRight}>
                      {currency}<input
                        type="text"
                        onBlur={(event) => handleRequestBodyFields(event, 'tests')}
                        defaultValue={priceQuotation.additionalExpenses.tests.value}
                        disabled={priceQuotation.approved}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td className={styles.textAlignRight}>{`${currency} ${priceQuotation.additionalExpenses.total}`}</td>
                  </tr>
                </tbody>
              </table>
              <div className={styles.buttonContainer}>
                <button onClick={openObservations}>Assumptions</button>
                <button onClick={handleExportData}>Export data</button>
                {
                  !priceQuotation.approved
                  && <button onClick={handleApprove}>Approve</button>
                }
              </div>

              <div className={styles.buttonContainer}>
                <button onClick={() => redirectStage('vendas')}>Vendas</button>
                <button onClick={() => redirectStage('eng-prod')}>Eng. Prod.</button>
                <button onClick={() => redirectStage('eng-proc')}>Eng. Proc.</button>
                <button onClick={() => redirectStage('cruzeiro')}>CRZ</button>
                <button onClick={() => redirectStage('logistica')}>Logística</button>
                <button onClick={() => redirectStage('pcp')}>PCP</button>
                <button onClick={() => redirectStage('qualidade')}>Qualidade</button>
                <button onClick={() => redirectStage('compras')}>Compras</button>
              </div>
            </div>
          </>
      }
    </div>
  );
}