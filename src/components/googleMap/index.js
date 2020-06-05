import React from 'react'
const { compose, withState, withProps, withHandlers, withStateHandlers } = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
const MapWithAMarkerClusterer = compose(
    withStateHandlers(() => ({
        meterId: '',
        isOpen: false,
    }),
        {
            onToggleOpen: ({ isOpen }) => (props) => {
                return (
                    {
                        meterId: props.rb ? props.rb.target.offsetParent.title : props.tb.target.offsetParent.title,
                        isOpen: true,
                    }
                )
            },
            onToggleClose: ({ isOpen }) => (props) => {
                return (
                    { isOpen: false }
                )
            }
        }),
    withState('zoom', 'onZoomChange', 8),
    withHandlers(() => {
        const refs = {
            map: undefined,
        }
        return {
            onMapMounted: () => ref => {
                refs.map = ref
            },
            onZoomChange: ({ onZoomChange }) => () => {
                // setZoom(refs.map.getZoom())
                onZoomChange(refs.map.getZoom())
            },
            onCenterChange: ({ onCenterChange }) => () => {
                let loc = refs.map.getCenter().toJSON()
                // setTranformerLocation([loc.lat, loc.lng])
                // console.log(loc.lat)
                // console.log(loc.lng)
            },
        }
    }),
    withGoogleMap)(props => {
        return (
            <GoogleMap
                // center={{ lat: tranfomerLocation[0], lng: tranfomerLocation[1] }}
                defaultCenter={props.defaultCenter}
                zoom={props.Defaultzoom}
                ref={props.onMapMounted}
                onZoomChanged={props.onZoomChange}
                onCenterChanged={props.onCenterChange}
                defaultOptions={{
                    scrollwheel: true,
                    mapTypeControl: false,
                    streetViewControl: false
                }}
            >
                <MarkerClusterer
                    averageCenter
                    enableRetinaIcons
                    gridSize={30}
                    maxZoom={14}
                >
                    {props.mark.map(loca =>
                        < Marker
                            label={{ color: 'white', fontSize: '5px', fontWeight: 'bold', text: loca.MeterName }} key={loca.MeterID} title={loca.MeterID} ownKey={loca.MeterID} options={{ icon: loca.status, scaledSize: { width: 20, height: 20 } }} position={{ lat: loca.Location[0], lng: loca.Location[1] }} onClick={() => props.openMeterDetail(loca)} onMouseOver={props.onToggleOpen} onMouseOut={props.onToggleClose}>
                            {props.meterId == loca.MeterID && props.isOpen &&
                                <InfoWindow
                                    defaultOptions={{ disableAutoPan: true }}
                                >

                                    <div>
                                        <p>Meter : {loca.MeterName}</p>
                                        <p>MeterID : {loca.MeterID}</p>
                                        <p>Meter Type : {loca.MeterType}</p>
                                        <p>Rate Type : {loca.RateType}</p>
                                        <p>Location : {loca.Location[0]},{loca.Location[1]}</p>
                                        <p>Owner: {loca.Owner}</p>
                                        <p>Address: {loca.Address}</p>
                                    </div>
                                </InfoWindow>
                            }
                        </Marker>)
                    }
                </MarkerClusterer>
            </GoogleMap >
        )

    });

class MapForGoogleMap extends React.PureComponent {
    componentWillMount() {
    }

    componentDidMount() {
    }

    render() {
        return (
            <MapWithAMarkerClusterer
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                                        mark={this.props.mark}
                                        defaultCenter={this.props.defaultCenter}
                                        Defaultzoom={this.props.zoom}
                                        openMeterDetail={this.props.openMeterDetail}
                                        isMarkerShown={this.props.isMarkerShown}

            />
        )
    }
}

export default MapForGoogleMap