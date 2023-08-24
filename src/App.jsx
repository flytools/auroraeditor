import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LayersModal from './components/LayersModal'
import ImportModal from './components/ImportModal'
import './App.css'
import axios from 'axios'
//https://github.com/naturalatlas/geomagnetism
import geomagnetism from 'geomagnetism'

import ImportData from './helpers/ImportData'
import {DMStoDec} from './helpers/Convert'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


var Map = null;
var BaseLayer = 'streets';
var IsMensure = false;
var MensureMagVarDirection = 0;
var MensureStartCoordinate = null;

var MensureStartMarker = L.layerGroup([]);;
var MensureEndMarker = L.layerGroup([]);;
var MensureRoute = L.layerGroup([]);;

var AuroraVfrRoute = L.featureGroup([]);;

import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet'
import { useMap, Rectangle } from "react-leaflet";



const innerBounds = [
  [49.505, -2.09],
  [53.505, 2.09],
]
const outerBounds = [
  [50.505, -29.09],
  [52.505, 29.09],
]

const redColor = { color: 'red' }
const whiteColor = { color: 'white' }

function SetBoundsRectangles(refz) {
  return null
  const [bounds, setBounds] = useState(outerBounds)
  const map = useMap()

  const innerHandlers = useMemo(
    () => ({
      click() {
        setBounds(innerBounds)
        map.fitBounds(innerBounds)
      },
    }),
    [map],
  )
  const outerHandlers = useMemo(
    () => ({
      click() {
        setBounds(outerBounds)
        map.fitBounds(outerBounds)
      },
    }),
    [map],
  )

  return (
    <>
      <Rectangle
        bounds={outerBounds}
        eventHandlers={outerHandlers}
        pathOptions={bounds === outerBounds ? redColor : whiteColor}
      />
      <Rectangle
        bounds={innerBounds}
        eventHandlers={innerHandlers}
        pathOptions={bounds === innerBounds ? redColor : whiteColor}
      />
    </>
  )
}

function App() {
  //map
  const mapRef = useRef(null)
  
  //baselayer
  const tileLayerRef = useRef(null)
  const basemap = (localStorage.getItem("baselayerurl") == null) ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : localStorage.getItem("baselayerurl")
  
  useEffect(() => {
    if (tileLayerRef.current) {
      SetBaseLayer(localStorage.getItem("baselayer"))
    }
  }, [])

  const SetBaseLayer = (value) => {
    var url = ""

    switch (value) {
      case 'sat':
        url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        break;
      case 'topo':
        url = "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
        break;
      case 'dark':
        url = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        break;
      default:
        url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        break;
    }

    localStorage.setItem("baselayer", value)
    localStorage.setItem("baselayerurl", url)

    tileLayerRef.current.setUrl(url)
  }

  //mensure
  const SetMensure = (value) => {
    IsMensure = value

    if (!value) {
      MensureStartCoordinate = null
      MensureStartMarker.clearLayers()
      MensureEndMarker.clearLayers()
      MensureRoute.clearLayers()
    }
  }


  const animateRef = useRef(false)

  function SetViewOnClick({ animateRef }) {
    const map = useMapEvent('click', (e) => {

      if (IsMensure) {
        if (MensureStartCoordinate == null) {
          MensureStartMarker.clearLayers()
          MensureEndMarker.clearLayers()

          MensureStartCoordinate = e.latlng

          var marker = L.circleMarker(e.latlng, {
            radius: 7,
            color: 'white',
            fill: true,
            fillOpacity: 1,
            fillColor: '#b91c1c'
          })
          marker.addTo(MensureStartMarker)
        } else {
          MensureStartCoordinate = null
          //map.removeLayer(MensureStartMarker)
        }
      }
    })

    const map2 = useMapEvent('mousemove', (e2) => {
      if (MensureStartCoordinate != null) {
        MensureEndMarker.clearLayers()
        MensureRoute.clearLayers()
        var marker = new L.circleMarker(e2.latlng, {
          radius: 7,
          color: 'white',
          fill: true,
          fillOpacity: 1,
          fillColor: '#b91c1c'
        })

        const info = geomagnetism.model().point([e2.latlng.lng, e2.latlng.lat]);
        MensureMagVarDirection = info.decl;

        let distance = calculateDistance(MensureStartCoordinate.lat, MensureStartCoordinate.lng, e2.latlng.lat, e2.latlng.lng).toFixed(1)
        let direction = parseInt(calculateDirection(MensureStartCoordinate.lat, MensureStartCoordinate.lng, e2.latlng.lat, e2.latlng.lng, MensureMagVarDirection))

        marker.bindTooltip(distance + "NM   " + direction + 'DEG', {
          permanent: true,
          offset: [10, 10],
          className: "label-mensure"
        });
        marker.addTo(MensureEndMarker)

        // draw the line between points
        L.polyline([MensureStartCoordinate, e2.latlng], {
          color: '#b91c1c',
          strokeWidth: '10px',
          weight: 7
        }).addTo(MensureRoute);
      }
    })

    return null
  }


  function SetViewOnClick2({ animateRef }) {
    

    return null
  }





  


  useEffect(() => {

  });


  function handleOnSetView() {
    toast("Wow so easy !")

    /*const { current = {} } = mapRef;
    const { leafletElement: map } = current;

    map.setView([-40,-5], 14);*/
  }



  /*BaseLayer = localStorage.getItem("baselayer");
  useLayoutEffect(() => {
    var bl = 'mapbox://styles/mapbox/streets-v12';
    if (BaseLayer == 'sat') bl = 'mapbox://styles/mapbox/satellite-v9';
    if (BaseLayer == 'topo') bl = 'mapbox://styles/mapbox/outdoors-v12';
    if (BaseLayer == 'dark') bl = 'mapbox://styles/mapbox/dark-v11';

    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9kcmlnb3NpbSIsImEiOiJjbGF2ZngwNzgwNWNhM29qdW9idjl4cWdhIn0.0w3YOTHP8hqYC15F6_D80A';
    Map = new mapboxgl.Map({
      container: 'map',
      style: bl,
      center: [-50, -15],
      zoom: 3,
    });






    Map.on('style.load', function () {
      LoadSourceAndLayers()
    });

    Map.on('mousemove', (e) => {
      if (IsMensure && MensureStartCoordinate != null) {
        var currentCoordinate = e.lngLat

        Map.getSource('mensure-route-source').setData({
          'type': 'FeatureCollection',
          'features': [{
            'geometry': {
              'type': 'LineString',
              'coordinates': [[MensureStartCoordinate.lng, MensureStartCoordinate.lat], [e.lngLat.lng, e.lngLat.lat]]
            }
          }]
        })

        let distance = calculateDistance(MensureStartCoordinate.lat, MensureStartCoordinate.lng, e.lngLat.lat, e.lngLat.lng).toFixed(1)
        let direction = parseInt(calculateDirection(MensureStartCoordinate.lat, MensureStartCoordinate.lng, e.lngLat.lat, e.lngLat.lng, MensureMagVarDirection))

        Map.getSource('mensure-end-source').setData({
          'type': 'FeatureCollection',
          'features': [{
            'geometry': {
              'type': 'Point',
              'coordinates': [e.lngLat.lng, e.lngLat.lat]
            },
            'properties': {
              'ident': distance + "NM/" + direction + 'DEG'
            }
          }]
        })
      }
    });

    Map.on('style.load', function () {
      Map.on('click', function (e) {
        if (IsMensure) {
          if (MensureStartCoordinate === null) {
            console.log("cord", e.lngLat)
            //axios.get(`http://127.0.0.1:8000/api/v3/direction/${e.lngLat.lat}/${e.lngLat.lng}`).then(response => {

            MensureStartCoordinate = e.lngLat;

            
            const info = geomagnetism.model().point([e.lngLat.lng, e.lngLat.lat]);
            MensureMagVarDirection = info.decl;

              //add start point
              Map.getSource('mensure-start-source').setData({
                'type': 'FeatureCollection',
                'features': [{
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [e.lngLat.lng, e.lngLat.lat]
                  },
                  'properties': {
                    'ident': 'teste'
                  }
                }]
              })

            //})
          } else {
            console.log("cord2", e.lngLat)

            MensureMagVarDirection = 0;
            MensureStartCoordinate = null;
          }
        }
      });
    });

    Map.on('mousemove', (e) => {
      if (IsMensure && MensureStartCoordinate != null) {
        var currentCoordinate = e.lngLat

        Map.getSource('mensure-route-source').setData({
          'type': 'FeatureCollection',
          'features': [{
            'geometry': {
              'type': 'LineString',
              'coordinates': [[MensureStartCoordinate.lng, MensureStartCoordinate.lat], [e.lngLat.lng, e.lngLat.lat]]
            }
          }]
        })

        let distance = calculateDistance(MensureStartCoordinate.lat, MensureStartCoordinate.lng, e.lngLat.lat, e.lngLat.lng).toFixed(1)
        let direction = parseInt(calculateDirection(MensureStartCoordinate.lat, MensureStartCoordinate.lng, e.lngLat.lat, e.lngLat.lng, MensureMagVarDirection))

        Map.getSource('mensure-end-source').setData({
          'type': 'FeatureCollection',
          'features': [{
            'geometry': {
              'type': 'Point',
              'coordinates': [e.lngLat.lng, e.lngLat.lat]
            },
            'properties': {
              'ident': distance + "NM/" + direction + 'DEG'
            }
          }]
        })
      }
    });

  });

  const LoadSourceAndLayers = () => {

    Map.addSource('vfr_route', { type: 'geojson', data: null });

    Map.addLayer({
      'id': 'vfr_route',
      'type': 'line',
      'source': 'vfr_route',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#ff0000',
        'line-width': 8
      }
    });


    Map.addSource('mensure-start-source', {
      'type': 'geojson',
      'data': null
    });

    Map.addSource('mensure-route-source', {
      'type': 'geojson',
      'data': null
    });

    Map.addSource('mensure-end-source', {
      'type': 'geojson',
      'data': null
    });

    Map.addLayer({
      'id': 'mensure-start',
      'type': 'symbol',
      'source': 'mensure-start-source',
      'layout': {
        'icon-image': 'dot-image-green',
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
      paint: {
        "text-color": '#fff',
        "text-halo-width": 1,
        "text-halo-color": "#b91c1c",
        "text-halo-width": 100
      }
    });

    Map.addLayer({
      'id': 'mensure-route',
      'type': 'line',
      'source': 'mensure-route-source',
      'layout': {
        'line-cap': 'round',
      },
      'paint': {
        'line-color': '#b91c1c',
        'line-opacity': 0.75,
        'line-width': 3,
      }
    });

    Map.addLayer({
      'id': 'mensure-end',
      'type': 'symbol',
      'source': 'mensure-end-source',
      'layout': {
        'icon-image': 'dot-image-green',
        'text-field': ['get', 'ident'],
        'text-variable-anchor': ['bottom'],
        'text-radial-offset': 0.75,
        'text-justify': 'auto',
        'icon-size': 1,

        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-size": 16,
        "text-letter-spacing": 0.05,
        "text-offset": [0, 10],
        "text-transform": "uppercase",

        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
      paint: {
        "text-color": '#fff',
        "text-halo-width": 1,
        "text-halo-color": "#b91c1c",
        "text-halo-width": 100
      }
    });

    const size = 100;
    const dot_purple = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = '#581c87';
        context.strokeStyle = 'white';
        context.lineWidth = 4;
        context.fill();
        context.stroke();

        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;
        return true;
      }
    };

    const dot_green = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = '#b91c1c';
        context.strokeStyle = 'white';
        context.lineWidth = 4;
        context.fill();
        context.stroke();

        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;
        return true;
      }
    };

    Map.addImage('dot-image-purple', dot_purple, { pixelRatio: 2 });

    Map.addImage('dot-image-green', dot_green, { pixelRatio: 2 });
  }*/


  

  

  //functions
  function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371000;
    var dLat = toRadians(lat2 - lat1);
    var dLon = toRadians(lon2 - lon1);
    var lat1 = toRadians(lat1);
    var lat2 = toRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 0.000539957;
  };

  function calculateDirection(lat1, lon1, lat2, lon2, mag) {
    var direction = 0;

    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);

    var y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    var brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    direction = (brng + 360) % 360;

    direction = direction - mag;

    if (direction > 360) {
      direction = direction - 360;
    }

    return direction;
  };

  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  };

  function toDegrees(radians) {
    return radians * 180 / Math.PI;
  };


  const importRef = useRef();

  const handleOpenCloseImport = () => {
    importRef.current.OpenCloseImport()
  }

  const handleImportData = (data, type, clear) => {
    if (type == 'vrt') {
      if (clear) AuroraVfrRoute.clearLayers()

      var features = ImportData(data, type);

      features.forEach(feature => {
        var points = []
        feature.coordinates.forEach(coordinate => {
          points.push(new L.LatLng(coordinate[1], coordinate[0]))
        })
        L.polyline(points, {
          color: '#b91c1c',
          strokeWidth: '10px',
          weight: 7,
          options: {
            label: feature.label
          }
        }).addTo(AuroraVfrRoute);
      });
    }

    toast("Data successfully imported!")
  }

  

  return (
    <>
      <header id="page-header" className="flex flex-none items-center h-16 bg-neutral-900 shadow-sm fixed top-0 right-0 left-0 z-30">
        <div className="flex justify-between container xl:max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex items-center">
            <a href="" className="group inline-flex items-center space-x-2 font-street text-2xl tracking-wide text-white hover:text-blue-500">
              <span className="hidden sm:inline">AuroraEditor 1.1</span>
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <nav className="hidden lg:flex lg:items-center lg:space-x-2 text-sm">
              <a href="" className="font-medium flex items-center space-x-2 px-3 py-2 rounded text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
                  <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
                  <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
                  <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
                </svg>
                <span>Clear</span>
              </a>

              <a onClick={handleOpenCloseImport} className="font-medium flex items-center space-x-2 px-3 py-2 rounded text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M9.97.97a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72v3.44h-1.5V3.31L8.03 5.03a.75.75 0 01-1.06-1.06l3-3zM9.75 6.75v6a.75.75 0 001.5 0v-6h3a3 3 0 013 3v7.5a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-7.5a3 3 0 013-3h3z" />
                  <path d="M7.151 21.75a2.999 2.999 0 002.599 1.5h7.5a3 3 0 003-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 01-4.5 4.5H7.151z" />
                </svg>
                <span>Import</span>
              </a>
              <a onClick={handleOnSetView} className="font-medium flex items-center space-x-2 px-3 py-2 rounded text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M9.75 6.75h-3a3 3 0 00-3 3v7.5a3 3 0 003 3h7.5a3 3 0 003-3v-7.5a3 3 0 00-3-3h-3V1.5a.75.75 0 00-1.5 0v5.25zm0 0h1.5v5.69l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V6.75z" clipRule="evenodd" />
                  <path d="M7.151 21.75a2.999 2.999 0 002.599 1.5h7.5a3 3 0 003-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 01-4.5 4.5H7.151z" />
                </svg>
                <span>Export</span>
              </a>
              <a href="" className="font-medium flex items-center space-x-2 px-3 py-2 rounded text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 cursor-pointer bg-neutral-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
                </svg>
                <span>Layers</span>
              </a>
            </nav>


            <div className="lg:hidden">
              <button type="button" className="text-sm font-medium inline-flex justify-center items-center space-x-2 px-3 py-2 rounded text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 focus:outline-none focus:ring" x-on:click="mobileNavOpen = !mobileNavOpen">
              <svg className="hi-solid hi-menu inline-block w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>  
              </button>
            </div>
          </div>
        </div>
      </header>

      <div id="map" className="items-center h-full bg-neutral-900 shadow-sm fixed top-0 right-0 left-0 mt-16">
      </div>

      <MapContainer
        ref={mapRef}
        className='h-full fixed top-0 right-0 left-0 mt-16'
        center={[-10, -60]}
        zoom={5}
        scrollWheelZoom={true}
        maxZoom={22}
        minZoom={2}
        //onClick={(alert("vida"))}
        /*eventHandlers={{
          click: (e) => {
            console.log(IsMensure)
          },
        }}*/
        layers={[MensureStartMarker, MensureEndMarker, MensureRoute, AuroraVfrRoute]}
      >
        <TileLayer ref={tileLayerRef}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={basemap}
          maxNativeZoom={18}
          minZoom={0}
          maxZoom={22}
        />
        <Marker
          position={[52.5134, 13.4225]}
        />
        <SetViewOnClick animateRef={animateRef} />
        <SetViewOnClick2 animateRef={animateRef} />
        <SetBoundsRectangles />
      </MapContainer>

      <LayersModal
        className="flex flex-none items-center h-full bg-neutral-900 shadow-sm fixed top-0 right-0 left-0 mt-16 z-50"
        SetBaseLayer={SetBaseLayer}
        SetMensure={SetMensure}
        href="#">
      </LayersModal>

      <ImportModal
        innerRef={importRef}
        className="flex flex-none items-center h-full bg-neutral-900 shadow-sm fixed top-0 right-0 left-0 mt-16 z-50"
        Map={Map}
        handleImportData={handleImportData}
        href="#">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </ImportModal>

      <h1 className="">
        AuroraEditor 1
      </h1>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App
