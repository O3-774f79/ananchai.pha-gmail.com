import React from 'react'
const fetch = require("isomorphic-fetch");
const { compose, withProps, withHandlers } = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const MapWithAMarkerClusterer = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2CgOkigvSSaZgqJho8HJ1vtUyGxFvK1g",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withHandlers({
        onMarkerClustererClick: () => (markerClusterer) => {
            const clickedMarkers = markerClusterer.getMarkers()
            console.log(`Current clicked markers length: ${clickedMarkers.length}`)
            console.log(clickedMarkers)
        },
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={3}
        defaultCenter={{ lat: 13.53139, lng: 100.92252 }}
    >
        <MarkerClusterer
            onClick={props.onMarkerClustererClick}
            averageCenter
            enableRetinaIcons
            gridSize={60}
        >
            <Marker position={{ lat: 13.53139, lng: 100.92252 }} />
            {/* {props.markers.map(marker => (
        <Marker
          key={marker.photo_id}
          position={{ lat: marker.latitude, lng: marker.longitude }}
        />
      ))} */}
        </MarkerClusterer>
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
            <MapWithAMarkerClusterer markers={this.state.markers} />
        )
    }
}

export default DemoApp