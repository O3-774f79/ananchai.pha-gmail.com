import React from 'react'
const fetch = require("isomorphic-fetch");
const { compose, withProps, withHandlers, withStateHandlers } = require("recompose");
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
        isOpen: false,
    }), {
        onToggleOpen: ({ isOpen }) => () => ({
            isOpen: !isOpen,
        })
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
    >
        <Marker
            position={{ lat: -34.395, lng: 150.644 }}
            onClick={props.onToggleOpen}
        >
            <Marker
                position={{ lat: -34.397, lng: 150.644 }}
                onClick={props.onToggleOpen}
            ></Marker>
            {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
                <div>
                    Controlled zoom
       </div>
            </InfoWindow>}
        </Marker>
    </GoogleMap>
);

class DemoApp extends React.PureComponent {
    componentWillMount() {
        this.setState({ markers: [] })
    }

    componentDidMount() {
        const url = [
            // Length issue
            `https://gist.githubusercontent.com`,
            `/farrrr/dfda7dd7fccfec5474d3`,
            `/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json`
        ].join("")

        fetch(url)
            .then(res => res.json())
            .then(data => {
                this.setState({ markers: data.photos });
            });
    }

    render() {
        return (
            <MapWithAMarkerClusterer markers={this.state.markers}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD2CgOkigvSSaZgqJho8HJ1vtUyGxFvK1g"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        )
    }
}

export default DemoApp