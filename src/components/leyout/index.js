import React, { useState, useEffect, useInterval } from 'react'
import logoPEA from '../../img/logo-pea.jpg'
import bannerLogo from '../../img/logo-banner.png'
import objLogo from '../../img/obj.png'
import transformerLogo from '../../img/i-transformer.svg'
import reportLogo from '../../img/i-export.svg'
import meterOff from '../../img/Meter-off.svg'
import meterOn from '../../img/Meter.svg'
import axios from 'axios'
import HighchartsReact from 'highcharts-react-official'
import Highcharts, { wrap } from 'highcharts'
import { Menu, Checkbox, Table, Spin } from 'antd';
import { CSVLink } from "react-csv";
import GaugeChart from 'react-gauge-chart'
import DatePicker from 'react-datepicker'
import {
    BrowserRouter as Router, Link
} from 'react-router-dom'
import 'antd/dist/antd.css';
import './index.css'
import "react-datepicker/dist/react-datepicker.css";
import MapForGoogleMap from '../googlemap'
const { SubMenu } = Menu;
const { Column } = Table;


const Layout = (props) => {
    const [loadingMeter, setLoadingMeter] = useState(true)
    const [pageLoading, setPageLoading] = useState(false)
    const [meterDetailFlag, setMeterDetailFlag] = useState("")
    const [hamberger, setHamberger] = useState(true);
    const [page, setPage] = useState("home")
    const [tranformers, setTranformer] = useState([])
    const [meters, setMeters] = useState([])
    const [startDate, setStartDate] = useState(new Date().setDate(new Date().getDate() - 1));
    const [endDate, seEndDate] = useState(new Date());
    const [meterDetail, setMeterdetail] = useState({})
    const [TranformerIDReport, SetTranformerIDReport] = useState(0)
    const [MeterIDReport, setMeterIDReport] = useState(0)
    const [MeterSetReport, setMeterSetReport] = useState([])
    const [headerTable, setHeaderTable] = useState([])
    const [tableHeader, setTableHeader] = useState(["TransformerID", "MeterID", 'MeterType', 'RateType', 'Location', 'Date/Time', 'Voltage L1', 'Voltage L2', 'Voltage L3', 'Active power', 'Reactive power', 'Active energy', 'Reactive energy'])
    const [tableHeaderSet, setTableHeaderSet] = useState(["TransformerID", "MeterID", 'MeterType', 'RateType', 'Location', 'Date/Time', 'Voltage L1', 'Voltage L2', 'Voltage L3', 'Active power', 'Reactive power', 'Active energy', 'Reactive energy'])
    const [dataExport, setDataExport] = useState([])
    const [dataAvailability, setDataAvailability] = useState(0)
    const [systemAvailability, setSystemAvailability] = useState(0)
    const [startDateSet, setStartDateSet] = useState("")
    const [endDateSet, setEndDateSet] = useState("")
    const [activePower, setActivePower] = useState(0)
    const [activeEnergy, setAllActiveEnergy] = useState(0)
    const [loadingTable, setLoadingTable] = useState(false)
    const [graphV1, setGraphV1] = useState([])
    const [graphV2, setGraphV2] = useState([])
    const [graphV3, setGraphV3] = useState([])
    const [ActivePower, setActivePowerGraph] = useState([])
    const [ReactivePower, setReactivePower] = useState([])
    const [ActiveEnergy, setActiveEnergy] = useState([])
    const [ReactiveEnergy, setReactiveEnergy] = useState([])
    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');
    const [zoom, setZoom] = useState(11)
    const [defaultCenter, setDefaultCenter] = useState({ lat: 13.53139, lng: 100.92252 })
    const [tranfomerLocation, setTranformerLocation] = useState([])
    useEffect(() => {
        // axios.get('http://localhost:44000/api/User/checkToken?token=' + localStorage.getItem("token"), {withCredentials: true} //correct
        // )
        axios.get('http://52.163.210.101:44000/api/User/checkToken?token=' + localStorage.getItem("token"))
            .then(res => console.log(res))
            .catch(err => {
                localStorage.clear("token")
                props.history.push("/login")
            }
            )
        setTranformerLocation([13.53139, 100.92252])
        axios.get('http://52.163.210.101:44000/apiRoute/tranformers/InquiryTranformer')
            .then(async res => {
                let data = []
                await res.data.map(item => item.MeterInfo.map(meter => {
                    meter["status"] = meterOff
                    data.push(meter)
                }
                ))
                await setTranformer(res.data)
                await setMeters(data)
                await setLoadingMeter(false)
                await setHeaderTable([
                    { title: 'TransformerID', label: 'Transformer ID', key: 'TranfomerID', dataIndex: "TranfomerID", status: true },
                    { title: 'MeterID', label: 'Meter ID', key: 'MeterID', dataIndex: "MeterID", status: true },
                    { title: 'MeterType', label: 'Meter Type', key: 'MeterType', dataIndex: "MeterType", status: true },
                    { title: 'RateType', label: 'Rate Type', key: 'RateType', dataIndex: "RateType", status: true },
                    { title: 'Location', label: 'Location', key: 'Location', dataIndex: "Location", status: true },
                    { title: 'Date/Time', label: 'Date/Time', key: 'created', dataIndex: "created", status: true },
                    { title: 'Voltage L1', label: 'Voltage L1', key: 'Sensors.V1', dataIndex: "V1", status: true },
                    { title: 'Voltage L2', label: 'Voltage L2', key: 'Sensors.V2', dataIndex: "V2", status: true },
                    { title: 'Voltage L3', label: 'Voltage L3', key: 'Sensors.V3', dataIndex: "V3", status: true },
                    { title: 'Active power', label: 'Active power', key: 'Sensors.KW', dataIndex: "KW", status: true },
                    { title: 'Reactive power', label: 'Reactive power', key: 'Sensors.KVAR', dataIndex: "KVAR", status: true },
                    { title: 'Active energy', label: 'Active energy', key: 'Sensors.KWH', dataIndex: "KWH", status: true },
                    { title: 'Reactive energy', label: 'Reactive energy', key: 'Sensors.KVARH', dataIndex: "KVARH", status: true },
                ])
                await setLoad(true);
                InquirySensorAll(data)
                inquiryDataAvailability()
                inquirySystemAvailability()
                inquiryallActivePower()
                inquiryallActiveEnergy()

                setInterval(() => InquirySensorAll(data), 60000)
                setInterval(() => inquiryDataAvailability(), 60000);
                setInterval(() => inquirySystemAvailability(), 60000);
                setInterval(() => inquiryallActivePower(), 60000)
                setInterval(() => inquiryallActiveEnergy(), 60000)
            })
            .catch(err => {
                setError(err.message);
                setLoad(true)
            })
        let endDate = new Date()
        let startDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        setStartDateSet(startDate.toISOString())
        setEndDateSet(endDate.toISOString())
    }, []);
    // window.addEventListener("beforeunload", (ev) => {
    //     ev.preventDefault();
    //     localStorage.clear("token")
    //     localStorage.clear("firstName")
    //     localStorage.clear("lastName")
    //     localStorage.clear("role")
    // });
    const VoltageOption = {
        title: {
            text: null
        }, chart: {
            type: "spline",
            zoomType: 'x'
        },
        time: {
            timezoneOffset: -420
        },
        title: {
            text: ""
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e  %b'
            },
            min: new Date(startDateSet).getTime(),
            max: new Date(endDateSet).getTime()
        },
        yAxis: {
            title: {
                text: "Voltage Profile (V)"
            }
        },
        plotOptions: {
            spline: {
                lineWidth: 3,
                states: {
                    hover: {
                        lineWidth: 4
                    }
                },
                marker: {
                    enabled: false
                },
            }
        },
        series:
            [
                {
                    name: 'Voltage L1',
                    data: graphV1,
                    color: "#8085e9",
                    tooltip: {
                        valueSuffix: " V"
                    },
                },
                {
                    name: 'Voltage L2',
                    data: graphV2,
                    color: "#f7a35c",
                    tooltip: {
                        valueSuffix: " V"
                    },
                },
                {
                    name: 'Voltage L3',
                    data: graphV3, color: "#f15c80",
                    tooltip: {
                        valueSuffix: " V"
                    },
                },

            ], credits: {
                enabled: false
            }, responsive: true,

    }
    const loadprofileOptions = {
        chart: {
            type: "spline",
            zoomType: 'x'
        },
        time: {
            timezoneOffset: -420
        },
        plotOptions: {
            spline: {
                lineWidth: 3,
                states: {
                    hover: {
                        lineWidth: 4
                    }
                },
                marker: {
                    enabled: false
                },
            }
        },
        series: [
            {
                name: 'Active Power',
                data: ActivePower,
                color: "#f45b5b",
                tooltip: {
                    valueSuffix: " kW"
                },
            },
            {
                name: 'Reactive Power',
                data: ReactivePower,
                color: "#2b908f",
                tooltip: {
                    valueSuffix: " kVar"
                },
            }
        ],
        title: {
            text: ""
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e  %b'
            },
            min: new Date(startDateSet).getTime(),
            max: new Date(endDateSet).getTime()
        },
        yAxis: {
            title: {
                text: "Load Profile (kW, kVar)"
            },
            // alternateGridColor: '#FDFFD5',
        },
        credits: {
            enabled: false
        }, responsive: true,
    }
    const EnergyOptions = {
        chart: {
            type: "spline",
            zoomType: 'x'
        },
        time: {
            timezoneOffset: -420
        },
        title: {
            text: ""
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e  %b'
            },
            min: new Date(startDateSet).getTime(),
            max: new Date(endDateSet).getTime()
        },
        yAxis: {
            title: {
                text: "Energy Profile (kWh, kVarh)"
            }
        },
        plotOptions: {
            spline: {
                lineWidth: 3,
                states: {
                    hover: {
                        lineWidth: 4
                    }
                },
                marker: {
                    enabled: false
                },
            }
        },
        series: [
            {
                name: 'Active Energy',
                data: ActiveEnergy,
                color: "#f45b5b",
                tooltip: {
                    valueSuffix: " kWh"
                },
            },
            {
                name: 'Reactive Energy',
                data: ReactiveEnergy,
                color: "#2b908f",
                tooltip: {
                    valueSuffix: " kVarh"
                },
            }
        ], credits: {
            enabled: false
        }, responsive: true
    }
    const onCheckTableHeader = async (data) => {
        await headerTable.forEach((v1, i1) => data.includes(v1.title) ? headerTable[i1].status = true : headerTable[i1].status = false)
        await setHeaderTable([])
        await setHeaderTable(headerTable)
    }
    const InquirySensorAll = (data) => {
        axios.get('http://52.163.210.101:44000/apiRoute/Things/checkOnline')
            .then(async res => {
                await data.map(meter =>
                    res.data.map(rec => {
                        if (meter.MeterIMEI == rec) meter.status = meterOn
                    }))
                await setMeters(data)
            }).catch(err => {
                console.log("err", err)

            })
    }
    const InquiryGraph = (data) => {
        axios.get('http://52.163.210.101:44000/apiRoute/Things/InquiryGrahp?IMEI=' + data)
            .then(async res => {
                res.data.created = res.data.created.map(d => new Date(d).getTime())
                let datav1 = []
                let datav2 = []
                let datav3 = []
                let datavKW_LP = []
                let datavKVAR_LP = []
                let datavKWH_LP = []
                let datavKVARH_LP = []

                await res.data.created.forEach((date, i) => {
                    datav1.push([date, res.data.V1_LP[i]])
                    datav2.push([date, res.data.V2_LP[i]])
                    datav3.push([date, res.data.V3_LP[i]])
                    datavKW_LP.push([date, res.data.KW_LP[i]])
                    datavKVAR_LP.push([date, res.data.KVAR_LP[i]])
                    datavKWH_LP.push([date, res.data.KWH_LP[i]])
                    datavKVARH_LP.push([date, res.data.KVARH_LP[i]])
                })
                await setGraphV1(datav1)
                await setGraphV2(datav2)
                await setGraphV3(datav3)
                await setActivePowerGraph(datavKW_LP)
                await setReactivePower(datavKVAR_LP)
                await setActiveEnergy(datavKWH_LP)
                await setReactiveEnergy(datavKVARH_LP)
            }).catch(err => {
                console.log("err", err)

            })
    }
    const handleClickLogout = () => {
        localStorage.clear("token")
        localStorage.clear("firstName")
        localStorage.clear("lastName")
        localStorage.clear("role")

    }
    const onSelectTranformerIDReportChange = (e) => {
        let meterList = tranformers.filter(item => item.TranformerID === e)[0]
        SetTranformerIDReport(e)
        setMeterIDReport(0)
        if (meterList != undefined) {
            setMeterSetReport(meterList.MeterInfo)
        } else {
            setMeterSetReport([])
        }
    }
    const inquiryDataAvailability = () => {
        axios.get('http://52.163.210.101:44000/dataAVA/dataAvailability')
            .then(res => {
                setDataAvailability(res.data.value)
            })
            .catch(err => {
                setLoad(true)
            })
    }

    const inquirySystemAvailability = () => {
        axios.get('http://52.163.210.101:44000/dataAVA/systemAvailability')
            .then(res => {
                setSystemAvailability(res.data.value)
            })
            .catch(err => {
                setLoad(true)
            })
    }
    const inquiryallActivePower = () => {
        axios.get('http://52.163.210.101:44000/dataAVA/allActivePower')
            .then(res => {
                setActivePower(res.data.value)
            })
            .catch(err => {
                setLoad(true)
            })
    }
    const inquiryallActiveEnergy = () => {
        axios.get('http://52.163.210.101:44000/dataAVA/allActiveEnergy')
            .then(async res => {
                setAllActiveEnergy(res.data.value)
            })
            .catch(err => {
                setLoad(true)
            })
    }
    const openMeterDetail = async (meter) => {
        await setPageLoading(true)
        await clearInterval(meterDetailFlag)
        axios.get('http://52.163.210.101:44000/apiRoute/Things/InquirySensors?IMEI=' + meter.MeterIMEI)
            .then(async res => {
                if (res.data?.created) {
                    let date1m = new Date(res.data.created).getTime()
                    let dateCurrent = new Date().getTime()
                    let dateDef = Math.floor((((dateCurrent - date1m) / 1000) / 60) / 60) / 24
                    if (dateDef > 1) {
                        meter["detail"] = null
                    } else {
                        meter["detail"] = res.data
                    }
                } else {
                    meter["detail"] = res.data
                }
                // meter["detail"] = res.data
                await setMeterdetail(meter)
                await setLoad(true);
                await InquiryGraph(meter.MeterIMEI)
                await setPage("meterdetail")
                await setPageLoading(false)
            })
            .catch(err => {
                console.log(err)
                setPageLoading(false)

            })
        var myVar = setInterval(function () {
            axios.get('http://52.163.210.101:44000/apiRoute/Things/InquirySensors?IMEI=' + meter.MeterIMEI)
                .then(async res => {
                    if (res.data?.created) {
                        let date1m = new Date(res.data.created)
                        let dateCurrent = new Date()
                        let dateDef = Math.floor((((dateCurrent - date1m) / 1000) / 60) / 60) / 24
                        if (dateDef > 1) {
                            meter["detail"] = null
                        } else {
                            meter["detail"] = res.data
                        }
                    } else {
                        meter["detail"] = res.data
                    }
                    await setMeterdetail(meter)
                })
                .catch(err => {
                    setLoad(true)
                })
        }, 60000)
        await setMeterDetailFlag(myVar)
    }
    const searchHistiry = () => {
        setLoadingTable(true)
        axios.get('http://52.163.210.101:44000/apiRoute/Things/history?' + "tranformerID=" + TranformerIDReport + "&&" + "MeterID=" + MeterIDReport + "&&" + "startDate=" + new Date(new Date(startDate).setHours(0, 0, 0, 0)).toISOString() + "&&" + "endDate=" + new Date(endDate).toISOString())
            .then(async res => {
                res.data.history.map(item => {
                    return (
                        item["address"] = res.data.thingDetail.address,
                        item["MeterID"] = res.data.thingDetail.MeterID,
                        item["MeterType"] = res.data.thingDetail.MeterType,
                        item["RateType"] = res.data.thingDetail.RateType,
                        item["Location"] = res.data.thingDetail.Location[0] + "," + res.data.thingDetail.Location[1],
                        item["TranfomerID"] = TranformerIDReport,
                        item["V1"] = item.Sensors.V1_LP,
                        item["V2"] = item.Sensors.V2_LP,
                        item["V3"] = item.Sensors.V3_LP,
                        item["KVAR"] = item.Sensors.KVAR_LP,
                        item["KW"] = item.Sensors.KW_LP,
                        item["KWH"] = item.Sensors.KWH_LP,
                        item["KVARH"] = item.Sensors.KVARH_LP,
                        item["created"] = new Date(new Date(item.created).toLocaleString("en-US", { timeZone: "Asia/Bangkok" })).toLocaleString() //new Date(item.created)
                    )
                }
                )
                setDataExport(res.data.history)
                setLoadingTable(false)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const renderCSV = props => {
        let header = []
        headerTable.map(item => { if (item.status == true) header.push(item) })
        if (dataExport.length > 0 && header.length > 0) {
            return (
                <div class="row justify-content-end">
                    <div class=" col-md-3 col-sm-12">
                        <CSVLink asyncOnClick={true}
                            data={dataExport} headers={header} filename="meter.csv"> <button class="btn btn-primary btn-block mb-2"> CSV Export </button></CSVLink>
                    </div>
                </div >)
        } else {
            return null
        }
    }
    const onSubMenuClick = a => {
        setZoom(14)
        setDefaultCenter({ lat: a[0], lng: a[1] })
        // setTranformerLocation([a[0], a[1]])
        setPage("home")
    }
    const onLocoClick = () => {
        setZoom(11)
        setPage("home")
        setDefaultCenter({ lat: 13.53139, lng: 100.92252 })
        // setTranformerLocation([13.53139, 100.92252])
    }
    const renderSwitch = (page) => {
        switch (page) {
            case 'home':
                return (
                    <Spin spinning={pageLoading}>

                        <span>
                            <div style={{ display: "flex", flexWrap: 'wrap', justifyContent: "space-between" }}>
                                {/* , border: " 4px solid #7C67C8", borderRadius: "12px", padding: 1 */}
                                <div style={{ display: "flex", flexWrap: 'wrap' }}>
                                    <div className="cardDisplay" style={{ marginRight: 2 }}>
                                        <div class="card" >
                                            <div class="card-body text-center">
                                                <h4 class=""> All Active Power </h4>
                                                <h5 class="text-primary">{activePower} KW</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cardDisplay" style={{ marginRight: 2 }}>
                                        <div class="card" >
                                            <div class="card-body text-center">
                                                <h4 class=""> All Active Energy </h4>
                                                <h5 class="text-primary">{activeEnergy} KWH</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* , border: " 4px solid #FFCC00", borderRadius: "12px", padding: 1  */}
                                <div style={{ display: "flex", flexWrap: 'wrap' }}>
                                    <div className="cardDisplay" style={{ marginRight: 2 }}>
                                        <div class="card" >
                                            <div class="card-body text-center">
                                                <h4 class=""> Data Availability </h4>
                                                <h5 class="text-primary">{dataAvailability}%</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cardDisplay" style={{ marginRight: 2 }}>
                                        <div class="card" >
                                            <div class="card-body text-center">
                                                <h4 class="">System Availability</h4>
                                                <h5 class="text-primary">{systemAvailability}%</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div>
                                <div class="overlay">
                                    About Status <br />
                                    <div style={{}}>
                                        <div class="dotGreen"></div> Connected <br />
                                        <div class="dotRed"></div> Disconnected
                                    </div>
                                </div>
                                <br />
                                <MapForGoogleMap
                                    containerElement={<div style={{ height: '500px', width: '100%', padding: " 5px 5px 5px 10px " }} />}
                                    mapElement={<div style={{ height: '100%' }} />}
                                    mark={meters}
                                    defaultCenter={defaultCenter}
                                    zoom={zoom}
                                    openMeterDetail={openMeterDetail}
                                    isMarkerShown
                                />
                            </div>
                        </span >
                    </Spin>
                )
            case 'report':
                return (
                    <Spin spinning={pageLoading}>
                        <span>
                            <div class="row" style={{ marginRight: 0, marginLeft: 0 }}>
                                <h5 class="pt-3">Report</h5>
                            </div>
                            <hr />
                            {/* <div class="col-md-8 offset-md-2  pl-5"> */}
                            <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                                <div class=" form-group row" style={{ display: "flex", marginLeft: 15, flexWrap: "wrap", }}>
                                    <div style={{ marginRight: 5, width: 350 }}>
                                        <div class="form-group">
                                            <label class="control-label"> Transformer ID</label>
                                            <select class="form-control custom-select" data-placeholder="Choose a Category" tabindex="1" value={TranformerIDReport} onChange={(e) => onSelectTranformerIDReportChange(e.target.value)}>
                                                <option value={0}>{"Choose a TranformerID"}</option>
                                                {tranformers.map(item =>
                                                    <option value={item.tranformerID}>{item.TranformerID}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ marginRight: 5, width: 350 }}>
                                        <div class="form-group">
                                            <label class="control-label">Meter ID</label>
                                            <select class="form-control custom-select" data-placeholder="Choose a MeterID" tabindex="1" value={MeterIDReport} onChange={(e) => setMeterIDReport(e.target.value)}>
                                                <option value={0}>{"Choose a MeterID"}</option>
                                                {MeterSetReport.map(item =>
                                                    <option value={item.MeterIMEI}>{item.MeterID}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class=" form-group row" style={{ display: "flex", marginLeft: 20, flexWrap: "wrap", }}>
                                    <div style={{ marginRight: 5 }}>
                                        <label for="text" class="text-left">Start Date</label>
                                        <div class="input-group">
                                            <DatePicker class="form-control" selected={startDate} onChange={date => setStartDate(date)} dateFormat="dd/MM/yyyy" style={{ width: "100%" }} />
                                            <i class="material-icons">
                                                calendar_today</i>
                                        </div>
                                    </div>
                                    {/* <div style={{
                                    marginLeft: 5, marginRight: 5, verticalAlign: "middle"
                                }}><label class="pt-4">  to</label></div> */}
                                    <div style={{ marginRight: 5, flexWrap: "wrap" }}>
                                        <label for="text" class="text-left">End Date</label>
                                        <div class="input-group">
                                            <DatePicker class="form-control" selected={endDate} onChange={date => seEndDate(date)} dateFormat="dd/MM/yyyy" />
                                            <i class="material-icons">
                                                calendar_today</i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <br />
                                <h5>Select Header Report   </h5><span class="small text-secondary">*defualt Show all </span> <br /><br />
                                <form class="form-inline" style={{ width: '100%' }}>
                                    <Checkbox.Group options={tableHeader} defaultValue={tableHeaderSet} onChange={(e) => onCheckTableHeader(e)} />
                                </form>
                                <br />
                                <div class="col-md-4 p-0">
                                    <button class="btn btn-primary btn-block mb-2" id="btn-search" onClick={() => searchHistiry()}> Search</button>
                                </div>
                            </div>
                            <div id="ShowSearch">
                                <div class="table-responsive ">
                                    <Table dataSource={dataExport} loading={loadingTable} className="myTable" >
                                        {headerTable.map(item => {
                                            if (item.status === true) {
                                                return <Column title={item.title} dataIndex={item.dataIndex} key={item.key} style={{ backgroundColor: 'yellow' }} />
                                            }
                                        })}
                                    </Table>
                                </div>
                                <div class="w-100 clearfix"></div>
                                {renderCSV()}
                                {/* {dataExport.length > 0 && headerTable.length > 0 ?
                                <div class="row justify-content-end">
                                    <div class=" col-md-3 col-sm-12">
                                        <CSVLink asyncOnClick={true}
                                            data={dataExport} headers={headerTable} filename="meter.csv"> <button class="btn btn-primary btn-block mb-2"> CSV Export </button></CSVLink>
                                    </div> */}
                                {/* <div class="col-md-3  col-sm-12">
                                        <button class="btn btn-primary btn-block mb-2" disabled>Excel Export</button>

                                    </div> */}
                                {/* </div>
                                : null} */}
                            </div >
                        </span >
                    </Spin>)
            case "meterdetail":
                return (
                    <Spin spinning={pageLoading}>
                        <div class="row">
                            <div class="col-lg-4 col-md-6 ">
                                <div class="card h-100">
                                    <div class="card-body text-left pb-4 pb-4">
                                        <h4 class=""> More Info</h4>
                                        <p> Owner : <span class="text-Primary">{meterDetail.Owner}</span></p>
                                        <p> Meter01 ID : <span class="text-Primary">{meterDetail.MeterID}</span></p>
                                        <p> Meter type : <span class="text-Primary">{meterDetail.MeterType}</span></p>
                                        <p>Rate type : <span class="text-Primary">{meterDetail.RateType}</span></p>
                                        <p> Location : <span class="text-Primary">{meterDetail.Location[0]},{meterDetail.Location[1]}</span></p>
                                        <p>Address : <span class="text-Primary">{meterDetail.Address}</span></p>
                                        <p></p>
                                    </div>
                                </div>
                            </div>
                            {console.log(meterDetail)}
                            <div class="col-lg-4 col-md-6 ">
                                <div class="card h-100">
                                    <div class="card-body text-left">
                                        <h4 class=""> Instantaneous value : </h4>
                                        <div style={{ display: 'flex', flexWrap: "wrap" }}>
                                            <div style={{ width: '50%' }}>
                                                <div style={{ display: "flex", justifyContent: 'center', flexWrap: "wrap" }}>
                                                    <div>  <h5 style={{ textAlign: "center", fontSize: 14, color: "black" }}>Voltage Line1</h5>
                                                        <GaugeChart id="gauge-chart2"
                                                            style={{ width: 120 }}
                                                            nrOfLevels={440}
                                                            arcPadding={0}
                                                            cornerRadius={0}
                                                            percent={meterDetail.detail ? (((meterDetail.detail?.Sensors.V1 * 100) / 440) / 100) : 0}
                                                            arcsLength={[0.40, 0.20, 0.40]}
                                                            colors={['#ff5454', '#3dcc5b', '#efd613']}
                                                            textColor={"#000000"}
                                                            hideText={true}
                                                            formatTextValue={value => value + 'V'}
                                                        />
                                                        <span style={{ display: 'flex', justifyContent: 'center', fontSize: 15, marginTop: -10 }}>{meterDetail.detail?.Sensors.V1 ? meterDetail.detail?.Sensors.V1 : 0} V</span>
                                                    </div>
                                                    <div>
                                                        <h5 style={{ textAlign: "center", fontSize: 14, color: "black" }}>Voltage Line2</h5>
                                                        <GaugeChart id="gauge-chart5"
                                                            style={{ width: 120 }}
                                                            nrOfLevels={440}
                                                            arcPadding={0}
                                                            cornerRadius={0}
                                                            arcsLength={[0.40, 0.20, 0.40]}
                                                            colors={['#ff5454', '#3dcc5b', '#efd613']}
                                                            hideText={true}
                                                            percent={meterDetail.detail ? (((meterDetail.detail?.Sensors.V2 * 100) / 440) / 100) : 0}
                                                            textColor={"#000000"}
                                                            formatTextValue={value => value + 'V'}
                                                        />
                                                        <span style={{ display: 'flex', justifyContent: 'center', fontSize: 15, marginTop: -10 }}>{meterDetail.detail?.Sensors.V2 ? meterDetail.detail?.Sensors.V2 : 0} V</span>
                                                    </div>
                                                    <div>
                                                        <h5 style={{ textAlign: "center", fontSize: 14, color: "black" }}>Voltage Line3</h5>
                                                        <GaugeChart id="gauge-chart1"
                                                            style={{ width: 120 }}
                                                            nrOfLevels={440}
                                                            arcPadding={0}
                                                            cornerRadius={0}
                                                            hideText={true}
                                                            arcsLength={[0.40, 0.20, 0.40]}
                                                            colors={['#ff5454', '#3dcc5b', '#efd613']}
                                                            percent={meterDetail.detail ? (((meterDetail.detail?.Sensors.V3 * 100) / 440) / 100) : 0}
                                                            textColor={"#000000"}
                                                            formatTextValue={value => value + 'V'}
                                                        />
                                                        <span style={{ display: 'flex', justifyContent: 'center', fontSize: 15, marginTop: -10 }}>{meterDetail.detail?.Sensors.V3 ? meterDetail.detail?.Sensors.V3 : 0} V</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ width: '50%' }}>
                                                <div style={{ display: "flex", justifyContent: 'center', flexWrap: "wrap" }}>
                                                    <div> <h5 style={{ textAlign: "center", fontSize: 14, color: "black" }}>Current Line1</h5>
                                                        <GaugeChart id="gauge-chart7"
                                                            style={{ width: 120 }}
                                                            nrOfLevels={100}
                                                            arcPadding={0}
                                                            cornerRadius={0}
                                                            hideText={true}
                                                            percent={meterDetail.detail ? ((meterDetail.detail?.Sensors.I1 / 100) / 100) : 0}
                                                            arcsLength={[0.8, 0.2]}
                                                            colors={['#3dcc5b', '#ff5454']}
                                                            textColor={"#000000"}
                                                            formatTextValue={value => value + 'V'}
                                                        />
                                                        <span style={{ display: 'flex', justifyContent: 'center', fontSize: 15, marginTop: -10 }}>{meterDetail.detail?.Sensors.I1 ? meterDetail.detail?.Sensors.I1 : 0} A</span>
                                                    </div>
                                                    <div>
                                                        <h5 style={{ textAlign: "center", fontSize: 14, color: "black" }}>Current Line2</h5>
                                                        <GaugeChart id="gauge-chart8"
                                                            style={{ width: 120 }}
                                                            nrOfLevels={100}
                                                            arcPadding={0}
                                                            cornerRadius={0}
                                                            hideText={true}
                                                            arcsLength={[0.8, 0.2]}
                                                            colors={['#3dcc5b', '#ff5454']}
                                                            percent={meterDetail.detail ? ((meterDetail.detail?.Sensors.I2 / 100) / 100) : 0}
                                                            textColor={"#000000"}
                                                            formatTextValue={value => value + 'V'}
                                                        />
                                                        <span style={{ display: 'flex', justifyContent: 'center', fontSize: 15, marginTop: -10 }}>{meterDetail.detail?.Sensors.I2 ? meterDetail.detail?.Sensors.I2 : 0} A</span>
                                                    </div>
                                                    <div>
                                                        <h5 style={{ textAlign: "center", fontSize: 14, color: "black" }}>Current Line3</h5>
                                                        <GaugeChart id="gauge-chart9"
                                                            style={{ width: 120 }}
                                                            nrOfLevels={100}
                                                            arcPadding={0}
                                                            cornerRadius={0}
                                                            hideText={true}
                                                            arcsLength={[0.8, 0.2]}
                                                            colors={['#3dcc5b', '#ff5454']}
                                                            percent={meterDetail.detail ? ((meterDetail.detail?.Sensors.I3 / 100) / 100) : 0}
                                                            textColor={"#000000"}
                                                            formatTextValue={value => value + 'V'}
                                                        />
                                                        <span style={{ display: 'flex', justifyContent: 'center', fontSize: 15, marginTop: -10 }}>{meterDetail.detail?.Sensors.I3 ? meterDetail.detail?.Sensors.I3 : 0} A</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 ">
                                <div class="card h-100">
                                    <div class="card-body text-center">
                                        <div class="row">
                                            <div class="col">
                                                <h4 class="">  Total Active Power <br /> </h4>
                                                <h5 class="text-Primary">{meterDetail.detail ? meterDetail.detail?.Sensors.KW : 0} kw</h5>
                                                <hr />
                                                <h4 class="">  Total Active Energy <br /> </h4>
                                                <h5 class="text-Primary">{meterDetail.detail ? meterDetail.detail?.Sensors.KWH : 0} kWh</h5>

                                            </div>


                                            <div class="col">
                                                <h4 class="">  Total Reactive Power <br /> </h4>
                                                <h5 class="text-Primary">{meterDetail.detail ? meterDetail.detail?.Sensors.KVAR : 0} kVar</h5>
                                                <hr />
                                                <h4 class="">  Total Reactive Energy <br /> </h4>
                                                <h5 class="text-Primary">{meterDetail.detail ? meterDetail.detail?.Sensors.KVARH : 0} kVarh</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ alignContent: 'center' }}>
                            <div style={{ width: '100%' }}>
                                <HighchartsReact
                                    style={{
                                        width: "100%", height: 400, display: "block", float: "right"
                                    }}
                                    highcharts={Highcharts}
                                    options={VoltageOption}
                                />
                            </div>
                            <div style={{ width: '100%' }}>
                                <HighchartsReact
                                    style={{
                                        width: "100%", height: 400, display: "block", alignContent: 'center'
                                    }}
                                    highcharts={Highcharts}
                                    options={loadprofileOptions}
                                />
                            </div>
                            <div style={{ width: '100%' }}>
                                <HighchartsReact
                                    style={{
                                        width: "100%", height: 400, display: "block", alignContent: 'center'
                                    }}
                                    highcharts={Highcharts}
                                    options={EnergyOptions}
                                />
                            </div>
                        </div>

                    </Spin>

                )
            default:
                return 'foo';
        }
    }
    return (
        <div style={{ display: 'flex', height: "100% auto" }}>
            <div style={{
                width: hamberger ? 300 : 0, zIndex: 999999
            }}>
                {!hamberger
                    ? <a id="show-sidebar" class="btn btn-sm btn-primary pt-2" onClick={() => setHamberger(!hamberger)}>
                        <i class="material-icons">menu</i>
                    </a>
                    :
                    <div style={{ height: "100%", overflow: "scroll" }}>
                        <span style={{ display: "flex" }}>
                            <div class="sidebar-header" style={{ padding: "20px", cursor: "pointer" }} onClick={() => onLocoClick()}>
                                <img src={logoPEA} class="mx-auto d-flex" />
                            </div>
                            <div style={{ textAlign: "right", cursor: 'pointer', padding: "10px 20px", display: 'block' }}>
                                <a id="show-sidebar" onClick={() => setHamberger(!hamberger)}>
                                    <i class="material-icons text-primary">clear</i>
                                </a>
                            </div>

                        </span>
                        <div class="sidebar-menu">
                            <h6 class="ml-4"> ยินดีต้อนรับ </h6>
                            <Menu
                                style={{ width: "100%" }}
                                mode="inline"
                            >
                                <SubMenu
                                    style={{ width: "230px" }}
                                    key="sub1"
                                    title={
                                        <span>
                                            <span>{localStorage.getItem("firstName")} {localStorage.getItem("lastName")}</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item style={{ width: "230px" }} key="1" onClick={() => handleClickLogout()}>  <Link to="/login">Logout</Link></Menu.Item>
                                </SubMenu>
                            </Menu>
                        </div>
                        <hr />

                        <div class="sidebar-menu">
                            <span>
                            </span>
                            <Menu
                                style={{ width: "100%" }}
                                mode="inline"
                            >
                                {tranformers.map(item => {
                                    return (
                                        <SubMenu
                                            key={item.TranformerID}
                                            style={{ width: "230px" }}
                                            onTitleClick={() => onSubMenuClick(item.Location)}
                                            title={
                                                <span>
                                                    <img src={transformerLogo} height="18" width="auto" style={{ marginRight: 5 }} />
                                                    <span>ID : {item.TranformerID}</span>
                                                </span>
                                            }
                                        >
                                            {item.MeterInfo.map(item => {
                                                return (
                                                    <Menu.Item style={{ width: "230px" }} key={item.MeterID}><li onClick={() => openMeterDetail(item)}>
                                                        <span>MeterID: {item.MeterID}
                                                        </span>
                                                    </li></Menu.Item>
                                                )
                                            })}
                                        </SubMenu>
                                    )
                                })}
                                {localStorage.getItem("role") == "admin" ? < Menu.Item style={{ width: "230px" }} key="report" onClick={() => setPage("report")}>
                                    <span>
                                        <img src={reportLogo} height="18" width="auto" class="ml-1" style={{ marginRight: 5 }} />
                                        <a> Report</a>
                                    </span>
                                </Menu.Item> : null}

                            </Menu>
                        </div></div>
                }
            </div>
            <div class="container-fluid">
                <div class="bg-banner bg-white p-0 " style={{ height: 200 }} >
                    <img src={bannerLogo} class="img-fluid float-right" style={{ height: 50 }} />
                    <br />
                    <div class="clearfix"></div>
                    <img src={objLogo} class="img-fluid mx-auto d-flex" alt="Responsive image" style={{ height: 150 }} />
                </div>
                <div class="w-100 mt-4 "></div>
                {renderSwitch(page)}
            </div>
        </div >
    )
}
export default Layout;
