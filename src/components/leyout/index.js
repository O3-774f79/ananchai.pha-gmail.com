import React, { useState, useEffect, useInterval } from 'react'
import logoPEA from '../../img/logo-pea.jpg'
import bannerLogo from '../../img/logo-banner.png'
import objLogo from '../../img/obj.png'
import transformerLogo from '../../img/i-transformer.svg'
import reportLogo from '../../img/i-export.svg'
import meterOff from '../../img/Meter-off.svg'
import meterOn from '../../img/Meter.svg'
import imgNotFound from '../../img/img-not-found.png'
import axios from 'axios'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { Menu, Checkbox, Table, Row, Col } from 'antd';
import { withGoogleMap, GoogleMap, Marker, InfoWindow, } from 'react-google-maps';
import { CSVLink, CSVDownload } from "react-csv";
import GaugeChart from 'react-gauge-chart'
import DatePicker from 'react-datepicker'
import {
    BrowserRouter as Router, Link
} from 'react-router-dom'
import 'antd/dist/antd.css';
import './index.css'
import "react-datepicker/dist/react-datepicker.css";
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
const { SubMenu } = Menu;

function Layout(props) {
    const [hamberger, setHamberger] = useState(true);
    const [page, setPage] = useState("home")
    const [openWindow, setOpenWindow] = useState(false)
    const [tranformers, setTranformer] = useState([])
    const [meters, setMeters] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, seEndDate] = useState(new Date());
    const [meterDetail, setMeterdetail] = useState({})
    const [MeterDataArray, setMeterDataArray] = useState([])
    const [TranformerIDReport, SetTranformerIDReport] = useState(0)
    const [MeterIDReport, setMeterIDReport] = useState(0)
    const [MeterSetReport, setMeterSetReport] = useState([])
    const [headerTable, setHeaderTable] = useState([])
    const [tableHeader, setTableHeader] = useState(["TranfomerID", "MeterID", 'MeterType', 'Rate Type', 'Location', 'Date/Time', 'Voltage L1', 'Voltage L2', 'Voltage L3', 'Active power', 'Reactive power', 'Active energy', 'Reactive energy'])
    const [tableHeaderSet, setTableHeaderSet] = useState(["TranfomerID", "MeterID", 'MeterType', 'Rate Type', 'Location', 'Date/Time', 'Voltage L1', 'Voltage L2', 'Voltage L3', 'Active power', 'Reactive power', 'Active energy', 'Reactive energy'])
    const [tableHeaderSelect, setTableHeaderSelect] = useState([])
    const [dataExport, setDataExport] = useState([])
    const [dataAvailability, setDataAvailability] = useState(0)
    const [systemAvailability, setSystemAvailability] = useState(0)
    const [startDateSet, setStartDateSet] = useState("")
    const [endDateSet, setEndDateSet] = useState("")
    const [activePower, setActivePower] = useState(0)
    const [activeEnergy, setAllActiveEnergy] = useState(0)
    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');
    const onMarkerClick = (evt) => {
        console.log(evt);
    };
    useEffect(() => {
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
                await setHeaderTable([
                    { label: 'Transformer ID', key: 'TranfomerID', dataIndex: "TranfomerID", status: true },
                    { label: 'Meter ID', key: 'MeterID', dataIndex: "MeterID", status: true },
                    { label: 'Meter Type', key: 'MeterType', dataIndex: "MeterType", status: true },
                    { label: 'Rate Type', key: 'RateType', dataIndex: "RateType", status: true },
                    { label: 'Location', key: 'Location', dataIndex: "Location", status: true },
                    { label: 'Date/Time', key: 'created', dataIndex: "created", status: true },
                    { label: 'Voltage L1', key: 'Sensors.V1', dataIndex: "Sensors.V1", status: true },
                    { label: 'Voltage L2', key: 'Sensors.V2', dataIndex: "TranfomerID", status: true },
                    { label: 'Voltage L3', key: 'Sensors.V3', dataIndex: "TranfomerID", status: true },
                    { label: 'Active power', key: 'Sensors.KW', dataIndex: "TranfomerID", status: true },
                    { label: 'Reactive power', key: 'Sensors.KVAR', dataIndex: "TranfomerID", status: true },
                    { label: 'Active energy', key: 'Sensors.KWH', dataIndex: "TranfomerID", status: true },
                    { label: 'Reactive energy', key: 'Sensors.KVARH', dataIndex: "TranfomerID", status: true },
                ])
                await setLoad(true);
                setInterval(inquiryDataAvailability, 60000);
                setInterval(InquirySensorAll(data), 60000)
                setInterval(inquirySystemAvailability, 60000);
                setInterval(inquiryallActivePower, 60000)
                setInterval(inquiryallActiveEnergy, 60000)
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
                    data: [],
                    color: "#8085e9",
                    tooltip: {
                        valueSuffix: " V"
                    },
                },
                {
                    name: 'Voltage L2',
                    data: [],
                    color: "#f7a35c",
                    tooltip: {
                        valueSuffix: " V"
                    },
                },
                {
                    name: 'Voltage L3',
                    data: [], color: "#f15c80",
                    tooltip: {
                        valueSuffix: " V"
                    },
                },

            ], credits: {
                enabled: false
            },
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
                // pointInterval: 3600000, // one hour
                // pointStart: Date.UTC(2018, 1, 13, 0, 0, 0)
            }
        },
        series: [
            {
                name: 'Active Power',
                data: [],
                color: "#f45b5b",
                tooltip: {
                    valueSuffix: " kW"
                },
            },
            {
                name: 'Reactive Power',
                data: [],
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
        },
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
                // pointInterval: 3600000, // one hour
                // pointStart: Date.UTC(2018, 1, 13, 0, 0, 0)
            }
        },
        series: [
            {
                name: 'Active Energy',
                data: [],
                color: "#f45b5b",
                tooltip: {
                    valueSuffix: " kWh"
                },
            },
            {
                name: 'Reactive Energy',
                data: [],
                color: "#2b908f",
                tooltip: {
                    valueSuffix: " kVarh"
                },
            }
        ], credits: {
            enabled: false
        }
    }
    const GoogleMapExample = withGoogleMap(props => (
        <GoogleMap
            defaultCenter={{ lat: 13.752801, lng: 100.501587 }}
            defaultZoom={10}
        >
            {/* <MarkerClusterer
                averageCenter
                enableRetinaIcons
                gridSize={10}
                maxZoom={10}
            // defaultMinimumClusterSize={19}
            > */}
            {props.mark.map(loca => {
                return (
                    <Marker key={loca.MeterID} options={{ icon: meterOff, scaledSize: { width: 32, height: 32 } }} position={{ lat: loca.Location[0], lng: loca.Location[1] }} onClick={() => openMeterDetail(loca)} onMouseOver={() => setOpenWindow(true)}>
                        {/* {openWindow && <InfoWindow onCloseClick={() => setOpenWindow(false)}>
                            <div>
                                {" "}
                                    Controlled zoom:
                                </div>
                        </InfoWindow>} */}
                    </Marker>
                )
            })}
            {/* </MarkerClusterer> */}
            {/* {props.mark.map(loca => {
                return (
                    <Marker key={loca.MeterID} options={{ icon: loca.status, scaledSize: { width: "20px", height: "20px" } }} position={{ lat: loca.Location[0], lng: loca.Location[1] }} onClick={() => openMeterDetail(loca)} onMouseOver={() => setOpenWindow(true)}> */}
            {/* {openWindow && <InfoWindow onCloseClick={() => setOpenWindow(false)}>
                            <div>
                                {" "}
          Controlled zoom: {props.zoom}
                            </div>
                        </InfoWindow>} */}

            {/* </Marker> */}
        </GoogleMap>
    ));
    const InquirySensorAll = (data) => {
        axios.get('http://52.163.210.101:44000/apiRoute/Things/checkOnline')
            .then(res => {
                console.log(res.data);
                data.map(meter =>
                    res.data.map(rec => {
                        if (meter.MeterIMEI == rec) meter.status = meterOn
                    }))
                setMeters(data)
                console.log("res", data)
            }).catch(err => {
                console.log("err", err)

            })
    }
    const handleClickLogout = () => {
        localStorage.clear("login")
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
    const onHeaderReportChange = (checkedValues) => {
        setTableHeader(checkedValues)
        // headerTable.map(item => { if (item.key === value) { item.status = !status; return item } })
        // setHeaderTable(headerTable)
        // headerTable.map(item => { if (item.key == value) { item.status == !text; return item } })
        // let updateHeader = headerTable.map(item => {
        //     if (text == item.text) {
        //         dataExport.map(item => delete item[text])
        //         console.log(dataExport)
        //         item.show = !item.show
        //     }
        //     return item
        // })
    }
    const inquiryDataAvailability = () => {
        axios.get('http://52.163.210.101:44000/dataAVA/dataAvailability')
            .then(async res => {
                setDataAvailability(res.data.value)
            })
            .catch(err => {
                // setError(err.message);
                setLoad(true)
            })
    }

    const inquirySystemAvailability = () => {
        axios.get('http://52.163.210.101:44000/dataAVA/systemAvailability')
            .then(async res => {
                setSystemAvailability(res.data.value)
            })
            .catch(err => {
                // setError(err.message);
                setLoad(true)
            })
    }
    const inquiryallActivePower = () => {
        axios.get('http://52.163.210.101:44000/dataAVA/allActivePower')
            .then(async res => {
                setActivePower(res.data.value)
            })
            .catch(err => {
                // setError(err.message);
                setLoad(true)
            })
    }
    const inquiryallActiveEnergy = () => {
        axios.get('http://52.163.210.101:44000/dataAVA/allActiveEnergy')
            .then(async res => {
                setAllActiveEnergy(res.data.value)
            })
            .catch(err => {
                // setError(err.message);
                setLoad(true)
            })
    }
    const openMeterDetail = (meter) => {
        axios.get('http://52.163.210.101:44000/apiRoute/Things/InquirySensors?IMEI=' + meter.MeterIMEI)
            .then(async res => {
                meter["detail"] = res.data
                await setMeterdetail(meter)
                await setLoad(true);
                setPage("meterdetail")
            })
            .catch(err => {
                // setError(err.message);
                setLoad(true)
            })
    }
    const searchHistiry = () => {
        axios.get('http://52.163.210.101:44000/apiRoute/Things/history?' + "tranformerID=" + TranformerIDReport + "&&" + "MeterID=" + MeterIDReport + "&&" + "startDate=" + startDate.toISOString() + "&&" + "endDate=" + endDate.toISOString())
            .then(async res => {
                res.data.history.map(item => {
                    return (
                        item["address"] = res.data.thingDetail.address,
                        item["MeterID"] = res.data.thingDetail.MeterID,
                        item["MeterType"] = res.data.thingDetail.MeterType,
                        item["RateType"] = res.data.thingDetail.RateType,
                        item["Location"] = res.data.thingDetail.Location,
                        item["TranfomerID"] = TranformerIDReport,
                        item["V1"] = item.Sensors.V1,
                        item["V2"] = item.Sensors.V2,
                        item["V3"] = item.Sensors.V3,
                        item["KVAR"] = item.Sensors.KVAR,
                        item["KW"] = item.Sensors.KW,
                        item["KWH"] = item.Sensors.KWH,
                        item["KVARH"] = item.Sensors.KVARH
                    )
                }
                )
                setDataExport(res.data.history)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const renderSwitch = (page) => {
        switch (page) {
            case 'home':
                return (
                    <span>
                        <div style={{ display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                            <div style={{ width: "24%", marginRight: 2 }}>
                                <div class="card" >
                                    <div class="card-body text-center">
                                        <h4 class=""> All Active Power </h4>
                                        <h5 class="text-primary">{activePower} MW</h5>
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: "24%", marginRight: 20 }}>
                                <div class="card">
                                    <div class="card-body text-center">
                                        <h4 class=""> All Active Energy </h4>
                                        <h5 class="text-primary">{activeEnergy} MW</h5>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: "24%", marginRight: 2 }}>
                                <div class="card">
                                    <div class="card-body text-center">
                                        <h4 class=""> Data Availability </h4>
                                        <h5 class="text-primary">{dataAvailability}%</h5>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: "24%", marginRight: 2 }}>
                                <div class="card">
                                    <div class="card-body text-center">
                                        <h4 class="">System Availability</h4>
                                        <h5 class="text-primary">{systemAvailability}%</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{ marginBottom: -160, display: "block" }}>
                                <div style={{ position: "relative", zIndex: 1,top:70,left:20,width:100,backgroundColor:"#FAF7F7"}}>
                                    About Status <br />
                                    <div style={{}}>
                                        <div style={{ marginRight: 10 }}><img src={meterOn} height={50} /> <div>Connect</div></div>
                                        <div><img src={meterOff} height={50} /> <div>Disconnected</div></div>
                                    </div>
                                </div>
                            </div>
                            <GoogleMapExample
                                containerElement={<div style={{ height: `500px`, width: '100%', padding: " 5px 5px 5px 10px " }} />}
                                mapElement={<div style={{ height: `100%` }} />}
                                mark={meters}
                                isMarkerShown
                            />
                        </div>
                    </span >
                )
            case 'report':
                return (
                    <div class="col-md-12 bg-white text-left pt-2 pb-5">
                        <h5 class="pt-3">Report</h5>
                        <hr />
                        <div class="col-md-8 offset-md-2  pl-5">
                            <div class=" form-group row">
                                <div class="col-md-4 mb-3">
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
                                <div class="col-md-1"></div>
                                <div class="col-md-4 mb-3">
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
                            <div class=" form-group row">
                                <div class="col-md-4 ">
                                    <label for="text" class="text-left">Start Date</label>
                                    <div class="input-group">
                                        <DatePicker class="form-control" selected={startDate} onChange={date => setStartDate(date)} dateFormat="dd/MM/yyyy" style={{ width: "100%" }} />
                                        <i class="material-icons">
                                            calendar_today</i>
                                    </div>
                                </div>
                                <div class="col-md-1 pt-2 "><label class="pt-4">  to</label></div>
                                <div class="col-md-4 ">
                                    <label for="text" class="text-left">End Date</label>
                                    <div class="input-group">
                                        <DatePicker class="form-control" selected={endDate} onChange={date => seEndDate(date)} dateFormat="dd/MM/yyyy" />
                                        <i class="material-icons">
                                            calendar_today</i>
                                    </div>
                                </div>
                            </div>

                            <div class="w-100"></div>
                            <div class="col-md-9 justify-content-center">
                                <br />
                                <h3>Select Header Report   </h3><span class="small text-secondary">*defualt Show all </span> <br /><br />
                                <form class="form-inline">
                                    <Checkbox.Group options={tableHeader} defaultValue={tableHeaderSet} onChange={(e) => setTableHeaderSelect(e)} />
                                    {/* {headerTable.map(item =>
                                        <div class="custom-control custom-checkbox custom-control-inline">
                                            <input type="checkbox" class="custom-control-input" id={item.key} value={item.key} statue={item.status} checked={item.status} onChange={(e) => onHeaderReportChange(item.status, e.target.value)} />
                                            <label class="custom-control-label" for={item.key}>{item.label}</label>
                                        </div>
                                    )} */}
                                </form>
                                <br />
                                <div class="col-md-4 p-0">
                                    <button class="btn btn-primary btn-block mb-2" id="btn-search" onClick={() => searchHistiry()}> Search</button>
                                </div>
                            </div>
                        </div>
                        <div id="ShowSearch">
                            <div class="table-responsive ">
                                <table class="table mt-5" >
                                    <thead class="thead-violet">
                                        <tr class="text-center">
                                            {headerTable.map(item => {
                                                // if (item.show) {
                                                return (
                                                    <th scope="col" class="text-left">{item.label}</th>)
                                                // }
                                            }
                                            )}
                                        </tr>
                                    </thead>
                                    {dataExport.length == 0
                                        ? <img src={imgNotFound} width={'100%'} />
                                        : <tbody>
                                            {dataExport.map(item =>
                                                <tr class="text-center">
                                                    <td>{item.TranfomerID}</td>
                                                    <td>{item.MeterID}</td>
                                                    <td>{item.MeterType}</td>
                                                    <td>{item.RateType}</td>
                                                    <td>{item.Location[0]},{item.Location[1]}</td>
                                                    <th scope="row">{item.created}</th>
                                                    <td>{item.V1}</td>
                                                    <td>{item.V2}</td>
                                                    <td>{item.V3}</td>
                                                    <td>{item.KW}</td>
                                                    <td>{item.KVAR}</td>
                                                    <td>{item.KWH}</td>
                                                    <td>{item.KVARH}</td>
                                                </tr>
                                            )}

                                        </tbody>
                                    }

                                </table>
                            </div>
                            <div class="w-100 clearfix"></div>
                            {dataExport.length > 0 ?
                                <div class="row justify-content-end">
                                    <div class=" col-md-3 col-sm-12">
                                        <CSVLink data={dataExport} headers={headerTable} filename="meter.csv"> <button class="btn btn-primary btn-block mb-2"> CSV Export </button></CSVLink>
                                    </div>
                                    <div class="col-md-3  col-sm-12">
                                        <button class="btn btn-primary btn-block mb-2" disabled>   Excel Export  </button>

                                    </div>
                                </div>
                                : null}
                        </div >
                    </div >)
            case "meterdetail":
                return (
                    <div>
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
                            <div class="col-lg-4 col-md-6 ">
                                <div class="card h-100">
                                    <div class="card-body text-left">
                                        <h4 class=""> Instantaneous value : </h4>
                                        <div style={{ display: "flex", justifyContent: 'center', flexWrap: "wrap" }}>
                                            <div> <div style={{ textAlign: "center" }}>Voltage Line1</div>
                                                <GaugeChart id="gauge-chart2"
                                                    style={{ width: 120 }}
                                                    nrOfLevels={20}
                                                    percent={meterDetail.detail ? (meterDetail.detail?.Sensors.V1 / 100) : 0}
                                                    arcPadding={0.02}
                                                    arcsLength={[0.4, 0.2, 0.4]}
                                                    textColor={"#000000"}
                                                    formatTextValue={value => value + 'V'}
                                                />
                                            </div>
                                            <div>
                                                <div style={{ textAlign: "center" }}>Voltage Line2</div>
                                                <GaugeChart id="gauge-chart5"
                                                    style={{ width: 120 }}
                                                    nrOfLevels={420}
                                                    arcsLength={[0.3, 0.5, 0.2]}
                                                    colors={['#5BE12C', '#F5CD19', '#EA4228']}
                                                    percent={meterDetail.detail ? meterDetail.detail?.Sensors.V2 / 100 : 0}
                                                    textColor={"#000000"}
                                                    formatTextValue={value => value + 'V'}
                                                    arcPadding={0.02}
                                                />
                                            </div>
                                            <div>
                                                <div style={{ textAlign: "center" }}>Voltage Line3</div>
                                                <GaugeChart id="gauge-chart1"
                                                    style={{ width: 120 }}
                                                    nrOfLevels={420}
                                                    arcsLength={[0.3, 0.5, 0.2]}
                                                    colors={['#5BE12C', '#F5CD19', '#EA4228']}
                                                    percent={meterDetail.detail ? meterDetail.detail?.Sensors.V3 / 100 : 0}
                                                    textColor={"#000000"}
                                                    formatTextValue={value => value + 'V'}
                                                    arcPadding={0.02}
                                                />
                                            </div>
                                            {/* </div>
                                        <div style={{ display: "flex", justifyContent: 'center', padding: 3 }}> */}
                                            <div> <div style={{ textAlign: "center" }}>Current Line1</div>
                                                <GaugeChart id="gauge-chart7"
                                                    style={{ width: 120 }}
                                                    nrOfLevels={20}
                                                    percent={meterDetail.detail ? (meterDetail.detail?.Sensors.I1 / 100) : 0}
                                                    arcPadding={0.02}
                                                    arcsLength={[0.4, 0.2, 0.4]}
                                                    textColor={"#000000"}
                                                    formatTextValue={value => value + 'V'}
                                                />
                                            </div>
                                            <div>
                                                <div style={{ textAlign: "center" }}>Current Line2</div>
                                                <GaugeChart id="gauge-chart8"
                                                    style={{ width: 120 }}
                                                    nrOfLevels={420}
                                                    arcsLength={[0.3, 0.5, 0.2]}
                                                    colors={['#5BE12C', '#F5CD19', '#EA4228']}
                                                    percent={meterDetail.detail ? meterDetail.detail?.Sensors.I2 / 100 : 0}
                                                    textColor={"#000000"}
                                                    formatTextValue={value => value + 'V'}
                                                    arcPadding={0.02}
                                                />
                                            </div>
                                            <div>
                                                <div style={{ textAlign: "center" }}>Current Line3</div>
                                                <GaugeChart id="gauge-chart9"
                                                    style={{ width: 120 }}
                                                    nrOfLevels={420}
                                                    arcsLength={[0.3, 0.5, 0.2]}
                                                    colors={['#5BE12C', '#F5CD19', '#EA4228']}
                                                    percent={meterDetail.detail ? meterDetail.detail?.Sensors.I3 / 100 : 0}
                                                    textColor={"#000000"}
                                                    formatTextValue={value => value + 'V'}
                                                    arcPadding={0.02}
                                                />
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
                                                <h5 class="text-Primary">{meterDetail.detail ? meterDetail.detail?.Sensors.KW : 0} kW</h5>
                                                <hr />
                                                <h4 class="">  Total Active Energy <br /> </h4>
                                                <h5 class="text-Primary">{meterDetail.detail ? meterDetail.detail?.Sensors.KWH : 0} kW</h5>

                                            </div>


                                            <div class="col">
                                                <h4 class="">  Total Reactive Power <br /> </h4>
                                                <h5 class="text-Primary">{meterDetail.detail ? meterDetail.detail?.Sensors.KVAR : 0} Kvar</h5>
                                                <hr />
                                                <h4 class="">  Total Reactive Energy <br /> </h4>
                                                <h5 class="text-Primary">{meterDetail.detail ? meterDetail.detail?.Sensors.KVARH : 0} Kvarh</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={VoltageOption}
                            />
                        </div>
                        <div>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={loadprofileOptions}
                            />
                        </div>
                        <div>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={EnergyOptions}
                            />
                        </div>
                    </div>
                )
            default:
                return 'foo';
        }
    }
    return (
        <div style={{ display: 'flex', height: "100vh" }}>
            <div style={{
                width: hamberger ? 350 : 0, zIndex: 999999
            }}>
                {!hamberger
                    ? <a id="show-sidebar" class="btn btn-sm btn-primary pt-2" onClick={() => setHamberger(!hamberger)}>
                        <i class="material-icons">menu</i>
                    </a>
                    :
                    <div style={{ height: "100%", overflow: "scroll" }}>
                        <div style={{ textAlign: "right", cursor: 'pointer', padding: "10px 20px", display: 'block' }}>
                            <a id="show-sidebar" onClick={() => setHamberger(!hamberger)}>
                                <i class="material-icons text-primary">clear</i>
                            </a>
                        </div>
                        <div class="sidebar-header" style={{ padding: "20px", cursor: "pointer" }} onClick={() => setPage("home")}>
                            <img src={logoPEA} class="mx-auto d-flex" />
                        </div>
                        <div class="sidebar-menu">
                            <h6 class="ml-4"> ยินดีต้อนรับ </h6>
                            <Menu
                                style={{ width: "100%" }}
                                mode="inline"
                            >
                                <SubMenu
                                    key="sub1"
                                    title={
                                        <span>
                                            <span>Admin</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="1" onClick={() => handleClickLogout()}>  <Link to="/login">Logout</Link></Menu.Item>
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
                                            title={
                                                <span>
                                                    <img src={transformerLogo} height="18" width="auto" style={{ marginRight: 5 }} />
                                                    <span>ID : {item.TranformerID}</span>
                                                </span>
                                            }
                                        >
                                            {item.MeterInfo.map(item => {
                                                return (
                                                    <Menu.Item key={item.MeterID}><li onClick={() => openMeterDetail(item)}>
                                                        <span>MeterID: {item.MeterID}
                                                        </span>
                                                    </li></Menu.Item>

                                                )
                                            })}
                                        </SubMenu>
                                    )
                                })}
                                <Menu.Item key="report" onClick={() => setPage("report")}>
                                    <span>
                                        <img src={reportLogo} height="18" width="auto" class="ml-1" style={{ marginRight: 5 }} />
                                        <a> Report</a>
                                    </span>
                                </Menu.Item>
                            </Menu>
                        </div></div>
                }
            </div>
            <div class="container-fluid">
                <div class="bg-banner bg-white p-0 " >
                    <img src={bannerLogo} class="img-fluid float-right" />
                    <br />
                    <div class="clearfix"></div>
                    <img src={objLogo} class="img-fluid mx-auto d-flex" alt="Responsive image" />
                </div>
                <div class="w-100 mt-4 "></div>
                {renderSwitch(page)}
            </div>




        </div>

    )
}
export default Layout;
