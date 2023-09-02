import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import LayersModal from "./components/LayersModal";
import ImportModal from "./components/ImportModal";
import ExportModal from "./components/ExportModal";
import DrawTextModal from "./components/DrawTextModal";
import LoadImageModal from "./components/LoadImageModal";
import "./App.css";
//https://github.com/naturalatlas/geomagnetism
import geomagnetism from "geomagnetism";

import ImportData from "./helpers/ImportData";
import { GetCharacter, GetLine } from "./helpers/Characters";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LatitudeDECtoDMS, LongitudeDECtoDMS, CalculateDirection, CalculateDistance, RandomString } from "./helpers/Convert";

var Map = null;
var IsMensure = false;
var MensureMagVarDirection = 0;
var MensureStartCoordinate = null;

var MensureStartMarker = L.layerGroup([]);
var MensureEndMarker = L.layerGroup([]);
var MensureRoute = L.layerGroup([]);

var AuroraVfrRoute = L.featureGroup([]);
var AuroraVfrFix = L.featureGroup([]);

var AuroraMarkerTemp = L.featureGroup([]);
var AuroraPolylinesTemp = L.featureGroup([]);

var AuroraLoadImage = L.featureGroup([]);

var IsDelete = false

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import { useMap, Rectangle } from "react-leaflet";

var IsDrawText = false;
var DrawTextCoordinate = null;
var DrawTextOptions = null;

const innerBounds = [
  [49.505, -2.09],
  [53.505, 2.09],
];
const outerBounds = [
  [50.505, -29.09],
  [52.505, 29.09],
];

const redColor = { color: "red" };
const whiteColor = { color: "white" };

function SetBoundsRectangles(refz) {
  return null;
  const [bounds, setBounds] = useState(outerBounds);
  const map = useMap();

  const innerHandlers = useMemo(
    () => ({
      click() {
        setBounds(innerBounds);
        map.fitBounds(innerBounds);
      },
    }),
    [map]
  );
  const outerHandlers = useMemo(
    () => ({
      click() {
        setBounds(outerBounds);
        map.fitBounds(outerBounds);
      },
    }),
    [map]
  );

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
  );
}

function App() {
  //map
  const mapRef = useRef(null);

  //baselayer
  const tileLayerRef = useRef(null);
  const basemap =
    localStorage.getItem("baselayerurl") == null
      ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      : localStorage.getItem("baselayerurl");

  useEffect(() => {
    if (tileLayerRef.current) {
      SetBaseLayer(localStorage.getItem("baselayer"));
    }
  }, []);

  const SetBaseLayer = (value) => {
    var url = "";

    switch (value) {
      case "sat":
        url =
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        break;
      case "topo":
        url =
          "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png";
        break;
      case "dark":
        url =
          "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
        break;
      default:
        url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        break;
    }

    localStorage.setItem("baselayer", value);
    localStorage.setItem("baselayerurl", url);

    tileLayerRef.current.setUrl(url);
  };

  //mensure
  const SetMensure = (value) => {
    IsMensure = value;

    if (!value) {
      MensureStartCoordinate = null;
      MensureStartMarker.clearLayers();
      MensureEndMarker.clearLayers();
      MensureRoute.clearLayers();
    }
  };

  function SetMensureOnClick() {
    const map = useMapEvent("click", (e) => {
      if (IsMensure) {
        if (MensureStartCoordinate == null) {
          MensureStartMarker.clearLayers();
          MensureEndMarker.clearLayers();

          MensureStartCoordinate = e.latlng;

          var marker = L.circleMarker(e.latlng, {
            radius: 7,
            color: "white",
            fill: true,
            fillOpacity: 1,
            fillColor: "#991b1b",
          });
          marker.addTo(MensureStartMarker);
        } else {
          MensureStartCoordinate = null;
          //map.removeLayer(MensureStartMarker)
        }
      }
    });

    const map2 = useMapEvent("mousemove", (e2) => {
      if (MensureStartCoordinate != null) {
        MensureEndMarker.clearLayers();
        MensureRoute.clearLayers();
        var marker = new L.circleMarker(e2.latlng, {
          radius: 7,
          color: "white",
          fill: true,
          fillOpacity: 1,
          fillColor: "#991b1b",
        });

        const info = geomagnetism.model().point([e2.latlng.lng, e2.latlng.lat]);
        MensureMagVarDirection = info.decl;

        let distance = CalculateDistance(
          MensureStartCoordinate.lat,
          MensureStartCoordinate.lng,
          e2.latlng.lat,
          e2.latlng.lng
        ).toFixed(1);
        let direction = parseInt(
          CalculateDirection(
            MensureStartCoordinate.lat,
            MensureStartCoordinate.lng,
            e2.latlng.lat,
            e2.latlng.lng,
            MensureMagVarDirection
          )
        );

        marker.bindTooltip(distance + "NM   " + direction + "DEG", {
          permanent: true,
          offset: [10, 10],
          className: "label-mensure",
        });
        marker.addTo(MensureEndMarker);

        // draw the line between points
        L.polyline([MensureStartCoordinate, e2.latlng], {
          color: "#991b1b",
          strokeWidth: "10px",
          weight: 7,
        }).addTo(MensureRoute);
      }
    });

    return null;
  }

  //draw text
  const DrawTextRef = useRef();
  const SetDrawText = (value) => {
    IsDrawText = value;
    DrawTextRef.current.OpenCloseModal(value);

    if (!value) {
      AuroraMarkerTemp.clearLayers();
      AuroraPolylinesTemp.clearLayers();
    } else {
      toast("Click on the map to mark the landmark");
    }
  };

  function SetDrawTextOnClick() {
    const map = useMapEvent("click", (e) => {
      AuroraMarkerTemp.clearLayers();

      if (IsDrawText) {
        DrawTextRef.current.OpenCloseModal(true);
        DrawTextCoordinate = e.latlng;
        var marker = L.circleMarker(e.latlng, {
          radius: 7,
          fill: true,
          opacity: 0,
          fillOpacity: 1,
          fillColor: "red",
          draggable: true,
        });
        marker.addTo(AuroraMarkerTemp);
      }

      if (DrawTextOptions != null) {
        handleDrawText(DrawTextOptions);
      }
    });

    return null;
  }

  const handleDrawText = (options) => {
    DrawTextOptions = options;
    AuroraPolylinesTemp.clearLayers();

    //toast("Wow so easy !")
    var startCoordinate = [DrawTextCoordinate.lat, DrawTextCoordinate.lng];
    var width = options.size;
    var angle = options.rotate;
    var characterSpace = options.size * 0.25;
    var color = options.execute ? "#f59e0b" : "#0ea5e9";

    var string = options.text; //"0123456789°+-<>"

    if (options.arrowLeft) string = "<" + string;
    if (options.arrowRight) string = string + ">";

    var secondLine = false
    var containsSecondLine = (string.includes('_')) ? true : false
    var index = 0;
    string.split("").forEach((char) => {
      if (char == "_") {
        secondLine = true
        index = (options.arrowLeft) ? 1 : 0
        console.log('is second')
      }

      if (!"ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890+-<>°_".includes(char)) {
        toast("Invalid Character '" + char + "'");
      } else if(char != '_') {
        var coordinates = GetCharacter(
          char,
          startCoordinate,
          index,
          width,
          angle,
          characterSpace,
          secondLine,
          containsSecondLine
        );

        var polyline = L.polyline(coordinates, {
          color: color,
          strokeWidth: "10px",
          weight: 3,
          properties: {
            text: string,
            label: string + "_" + char,
          },
        });

        polyline
          .addTo(options.execute ? AuroraVfrRoute : AuroraPolylinesTemp)
          .on("click", (e) => {
            if (IsDelete) e.target.options.delete = true
            if (IsDelete) e.target.remove();
          });

        index++;
      }
    });

    if (options.baseLine) {
      var coordinates = GetLine(
        startCoordinate,
        index,
        width,
        angle,
        characterSpace
      );
      var polyline = L.polyline(coordinates, {
        color: color,
        strokeWidth: "10px",
        weight: 3,
        properties: {
          text: string,
          label: string + ":BASELINE",
        },
      });
      polyline
        .addTo(options.execute ? AuroraVfrRoute : AuroraPolylinesTemp)
        .on("click", (e) => {
          if (IsDelete) e.target.options.delete = true;
          if (IsDelete) e.target.remove();
        });
    }

    if (options.topLine) {
      var coordinates = GetLine(
        startCoordinate,
        index,
        width,
        angle,
        characterSpace,
        true,
        secondLine
      );
      var polyline = L.polyline(coordinates, {
        color: color,
        strokeWidth: "10px",
        weight: 3,
        properties: {
          text: string,
          label: string + ":TOPLINE",
        },
      });
      polyline
        .addTo(options.execute ? AuroraVfrRoute : AuroraPolylinesTemp)
        .on("click", (e) => {
          if (IsDelete) e.target.options.delete = true;
          if (IsDelete) e.target.remove();
        });
    }

    if (options.execute) {
      AuroraMarkerTemp.clearLayers();
      //IsDrawText = false
      DrawTextCoordinate = null;
      DrawTextOptions.execute = false;
    }
  };

  const LoadImageRef = useRef()
  const setLoadImage = (value) => {
    LoadImageRef.current.OpenCloseModal();
  }

  const handleLoadImage = (options) => {
    AuroraLoadImage.clearLayers();

    var topLeft = [options.latitudeN, options.longitudeW];
    var bottomRight = [options.latitudeS, options.longitudeE];

    var markerTopLeft = L.circleMarker(topLeft, {
      radius: 10,
      fill: true,
      opacity: 0,
      fillOpacity: 1,
      fillColor: "red",
      draggable: true,
    });
    markerTopLeft.addTo(AuroraLoadImage);

    var markerBottomRight = L.circleMarker(bottomRight, {
      radius: 10,
      fill: true,
      opacity: 0,
      fillOpacity: 1,
      fillColor: "red",
      draggable: true,
    });
    markerBottomRight.addTo(AuroraLoadImage);

    var imageUrl = options.url,
      imageBounds = [bottomRight, topLeft];

    L.imageOverlay(imageUrl, imageBounds, {opacity: options.opacity}).addTo(
      AuroraLoadImage
    );

    mapRef.current.fitBounds(AuroraLoadImage.getBounds());
  };

  //delete feature
  const SetDeleteFeature = (value) => {
    IsDelete = value
  }

  const SetDeleteFeatureOnClick = () => {
    return null
  }

  //import
  const importRef = useRef();

  const handleOpenCloseImport = () => {
    importRef.current.OpenCloseModal()
    exportRef.current.OpenCloseModal(false)
    SetDrawText(false)
    SetMensure(false)
  };

  const handleImportData = (data, type, clear) => {
    if (type == "vrt") {
      if (clear) AuroraVfrRoute.clearLayers();

      var features = ImportData(data, type);

      features.forEach((feature) => {
        var points = [];
        feature.coordinates.forEach((coordinate) => {
          points.push(new L.LatLng(coordinate[1], coordinate[0]));
        });
        L.polyline(points, {
          color: "#f59e0b",
          strokeWidth: "10px",
          weight: 7,
          properties: {
            label: feature.label,
          },
        })
          .addTo(AuroraVfrRoute)
          .on("click", (e) => {
            if (IsDelete) e.target.options.delete = true;
            if (IsDelete) e.target.remove();
          });
      });
      mapRef.current.fitBounds(AuroraVfrRoute.getBounds());
    }

    if (type == "vfi") {
      if (clear) AuroraVfrFix.clearLayers();

      var features = ImportData(data, type);

      features.forEach((feature) => {
        var marker = new L.circleMarker(feature.coordinates, {
          radius: 7,
          color: "white",
          fill: true,
          fillOpacity: 1,
          fillColor: "#f59e0b",
          properties: {
            label: feature.label,
            description: feature.description
          }
        });

        marker.bindTooltip(feature.label + "<br>" + feature.description, {
          permanent: true,
          offset: [10, 10],
          className: "label-vfr-route",
        });
        marker.addTo(AuroraVfrFix)
          .on("click", (e) => {
            if (IsDelete) e.target.options.delete = true;
            if (IsDelete) e.target.remove();
          });
      });
      mapRef.current.fitBounds(AuroraVfrFix.getBounds());
    }
    toast("Data successfully imported!");
  };

  //export
  const exportRef = useRef();

  const handleOpenCloseExport = () => {
    exportRef.current.OpenCloseModal()
    importRef.current.OpenCloseModal(false);
    SetDrawText(false)
    SetMensure(false)
  };

  const handleExportData = (type) => {
    var lines = "";

    var lastLabel = ""
    if (type == "vrt") {
      AuroraVfrRoute.eachLayer(function (feature) {
        if (!feature.options.delete) {
          var label = feature.options.properties.label

          if (label == lastLabel) label = label + "_" + RandomString(2)

          lastLabel = label
          
          var coordinates = feature._latlngs;

          lines += "//" + label + "\r\n";

          coordinates.forEach((coordinate) => {
            lines +=
              label +
              ";" +
              LatitudeDECtoDMS(coordinate.lat) +
              ";" +
              LongitudeDECtoDMS(coordinate.lng) +
              ";\r\n";
          });

          lines += "\r\n";
        }
      });

      lines +=
        "//© CREATED WITH AURORAEDITOR " +
        new Date().toUTCString().slice(5, 16).toUpperCase();
    }

    if (type == "vfi") {
      AuroraVfrFix.eachLayer(function (feature) {
        var label = feature.options.properties.label

        if (label == lastLabel) label = label + "_" + RandomString(2)
        lastLabel = label
        
        var description = feature.options.properties.description
        var coordinate = feature._latlng

        lines += label + ";" + description + ";" + LatitudeDECtoDMS(coordinate.lat) + ";" + LongitudeDECtoDMS(coordinate.lng) + ";\r\n"
      })

      lines += "\r\n"

      lines +=
        "//© CREATED WITH AURORAEDITOR " +
        new Date().toUTCString().slice(5, 16).toUpperCase()
    }

    return lines;
  };

  function handleExport() {
    //toast("Wow so easy !")
    var startCoordinate = [-4, -38.5];
    var width = 30;
    var angle = 0;
    var characterSpace = 10;

    var string = "0123456789°+-<>";

    var index = 0;
    string.split("").forEach((char) => {
      var coordinates = GetCharacter(
        char,
        startCoordinate,
        index,
        width,
        angle,
        characterSpace
      );
      L.polyline(coordinates, {
        color: "#f59e0b",
        strokeWidth: "5px",
        weight: 3,
        properties: {
          text: string,
          label: string + "_" + char,
        },
      }).addTo(AuroraMarkerTemp);

      index++;
    });
  }

  return (
    <>
      <header
        id="page-header"
        className="flex flex-none items-center h-16 bg-neutral-900 shadow-sm fixed top-0 right-0 left-0 z-30"
      >
        <div className="flex justify-between container xl:max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex items-center">
            <a
              href=""
              className="group inline-flex items-center space-x-2 font-street text-2xl tracking-wide text-white hover:text-blue-500"
            >
              <span className="hidden sm:inline">AuroraEditor 1.1</span>
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <nav className="hidden lg:flex lg:items-center lg:space-x-2 text-sm">
              <a
                href=""
                className="font-medium flex items-center space-x-2 px-3 py-2 rounded text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
                  <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
                  <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
                  <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
                </svg>
                <span>Clear</span>
              </a>

              <a
                onClick={handleOpenCloseImport}
                className="font-medium flex items-center space-x-2 px-3 py-2 rounded text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M9.97.97a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72v3.44h-1.5V3.31L8.03 5.03a.75.75 0 01-1.06-1.06l3-3zM9.75 6.75v6a.75.75 0 001.5 0v-6h3a3 3 0 013 3v7.5a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-7.5a3 3 0 013-3h3z" />
                  <path d="M7.151 21.75a2.999 2.999 0 002.599 1.5h7.5a3 3 0 003-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 01-4.5 4.5H7.151z" />
                </svg>
                <span>Import</span>
              </a>
              <a
                onClick={handleOpenCloseExport}
                className="font-medium flex items-center space-x-2 px-3 py-2 rounded text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.75 6.75h-3a3 3 0 00-3 3v7.5a3 3 0 003 3h7.5a3 3 0 003-3v-7.5a3 3 0 00-3-3h-3V1.5a.75.75 0 00-1.5 0v5.25zm0 0h1.5v5.69l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V6.75z"
                    clipRule="evenodd"
                  />
                  <path d="M7.151 21.75a2.999 2.999 0 002.599 1.5h7.5a3 3 0 003-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 01-4.5 4.5H7.151z" />
                </svg>
                <span>Export</span>
              </a>
              {/*<a
                href=""
                className="font-medium flex items-center space-x-2 px-3 py-2 rounded text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 cursor-pointer bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
                </svg>
                <span>Layers</span>
              </a>*/}
            </nav>

            <div className="lg:hidden">
              <button
                type="button"
                className="text-sm font-medium inline-flex justify-center items-center space-x-2 px-3 py-2 rounded text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 focus:outline-none focus:ring"
                x-on:click="mobileNavOpen = !mobileNavOpen"
              >
                <svg
                  className="hi-solid hi-menu inline-block w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="map"
        className="items-center h-full bg-neutral-900 shadow-sm fixed top-0 right-0 left-0 mt-16"
      ></div>

      <MapContainer
        ref={mapRef}
        className="h-full fixed top-0 right-0 left-0 mt-16"
        center={[-23.5, -46.5] /*[-10, -60]*/}
        zoom={8 /*5*/}
        scrollWheelZoom={true}
        maxZoom={22}
        minZoom={2}
        //onClick={(alert("vida"))}
        /*eventHandlers={{
          click: (e) => {
            console.log(IsMensure)
          },
        }}*/
        layers={[
          MensureStartMarker,
          MensureEndMarker,
          MensureRoute,
          AuroraVfrRoute,
          AuroraVfrFix,
          AuroraMarkerTemp,
          AuroraPolylinesTemp,
          AuroraLoadImage,
        ]}
      >
        <TileLayer
          ref={tileLayerRef}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={basemap}
          maxNativeZoom={18}
          minZoom={0}
          maxZoom={22}
        />
        <Marker position={[52.5134, 13.4225]} />
        <SetMensureOnClick />
        <SetBoundsRectangles />
        <SetDrawTextOnClick />
        <SetDeleteFeatureOnClick />
      </MapContainer>

      <LayersModal
        className="flex flex-none items-center h-full bg-neutral-900 shadow-sm fixed top-0 right-0 left-0 mt-16 z-50"
        SetBaseLayer={SetBaseLayer}
        SetMensure={SetMensure}
        SetDrawText={SetDrawText}
        setLoadImage={setLoadImage}
        SetDeleteFeature={SetDeleteFeature}
        href="#"
      ></LayersModal>

      <ImportModal
        innerRef={importRef}
        className="flex flex-none items-center h-full bg-neutral-900 shadow-sm fixed top-0 right-0 left-0 mt-16 z-50"
        Map={Map}
        handleImportData={handleImportData}
        href="#"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </ImportModal>

      <ExportModal
        innerRef={exportRef}
        className="flex flex-none items-center h-full bg-neutral-900 shadow-sm fixed top-0 right-0 left-0 mt-16 z-50"
        Map={Map}
        handleExportData={handleExportData}
        href="#"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </ExportModal>

      <DrawTextModal
        innerRef={DrawTextRef}
        handleDrawText={handleDrawText}
      ></DrawTextModal>

      <LoadImageModal
        innerRef={LoadImageRef}
        handleLoadImage={handleLoadImage}
      ></LoadImageModal>

      <h1 className="">AuroraEditor 1</h1>

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
  );
}

export default App;
