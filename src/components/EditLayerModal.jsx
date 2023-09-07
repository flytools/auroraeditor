import React from "react";
import { useState, ChangeEvent } from "react";
import { useImperativeHandle } from "react";

export default function EditLayerModal({
  innerRef,
  children,
  handleDrawText,
  mapRef,
  vfrRouteLayer,
  auroraEditGroupRef,
}) {
  const [showModal, setShowModal] = React.useState(false);

  useImperativeHandle(innerRef, () => ({
    OpenCloseModal(force = null) {
      if (force == null) {
        setShowModal(showModal ? false : true);
      } else {
        setShowModal(force);
      }
    },
  }));


  const handleDrawPolygon = () => {
    var polygonDrawer = new L.Draw.Polygon(mapRef.current);

    polygonDrawer.setOptions({
      shapeOptions: {
        color: "#0ea5e9",
        type: "temp",
        properties: {
          label: "undefined",
        },
      },
    });

    polygonDrawer.enable();
  };

  const handleDrawPolyline = (e) => {
    var featureDrawer = new L.Draw.Polyline(mapRef.current);

    featureDrawer.setOptions({
      shapeOptions: {
        color: "#0ea5e9",
        type: "temp",
        properties: {
          label: "undefined",
        },
      },
    });

    featureDrawer.enable();
  };

  const handleDrawPoint = (e) => {
    var featureDrawer = new L.Draw.CircleMarker(mapRef.current);

    featureDrawer.setOptions({
      shapeOptions: {
        color: "#0ea5e9",
        type: "temp",
        properties: {
          label: "undefined",
        },
      },
    });

    featureDrawer.enable();
  };

  const handleEditFeatures = (e) => {
    //a resposta está em adicionar um new drawcontrol


    var drawnItems = new L.FeatureGroup();
    mapRef.current.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
      position: "topright",
      draw:{
        rectangle: false,
        circle: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
        enable: true,
      },
    });
    mapRef.current.addControl(drawControl);
    
    var edit = new L.EditToolbar.Edit(mapRef.current, {
      featureGroup: drawControl.options.edit.featureGroup,
      selectedPathOptions: drawControl.options.edit.selectedPathOptions,
    });

    edit.enable();
  };

  

  const handleClose = (e) => {
    setShowModal(false);
  };

  const handleSave = (e) => {
    mapRef.current.eachLayer(function (layer) {
      if (layer.options.type === "temp") {
        console.log(layer);
        //layer.remove();
        //layer.addTo(vfrRouteLayer);
      }
    });
  };

  return (
    <div>
      <a
        className="flex items-center hover:text-neutral-200 hover:bg-neutral-800 p-1 rounded-md transition"
        href="#"
        alt="Pesquisar"
        title="Pesquisar"
        onClick={() => setShowModal(true)}
      >
        {children}
      </a>
      {showModal ? (
        <div>
          <div className="absolute my-6 w-9/12 md:w-3/4 lg:w-2/5 top-16">
            <div className="p-2 border-0 rounded-md shadow-lg relative flex flex-col w-full bg-neutral-900  outline-none focus:outline-none backdrop-blur bg-black/70">
              <div className="block">
                <div className="flex-1 flex">
                  <span className="w-full py-1 pr-2 text-neutral-200 text-center text-lg">
                    EDIT LAYER
                  </span>
                </div>
                <div className="p-2 pb-6 relative h-auto w-full">
                  <button
                    onClick={handleDrawPoint}
                    className="p-0 px-2 mr-2 w-32 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-neutral-800 cursor-pointer hover:text-neutral-300 hover:border-emerald-800"
                  >
                    DRAW A POINT
                  </button>
                  <button
                    onClick={handleDrawPolyline}
                    className="p-0 px-2 mr-2 w-32 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-neutral-800 cursor-pointer hover:text-neutral-300 hover:border-emerald-800"
                  >
                    DRAW A POLYLINE
                  </button>
                  <button
                    onClick={handleDrawPolygon}
                    className="p-0 px-2 mr-2 w-32 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-neutral-800 cursor-pointer hover:text-neutral-300 hover:border-emerald-800"
                  >
                    DRAW A POLYGON
                  </button>

                  <button
                    onClick={handleEditFeatures}
                    className="p-0 px-2 mr-2 w-32 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-neutral-800 cursor-pointer hover:text-neutral-300 hover:border-emerald-800"
                  >
                    EDIT FEATURES
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-0 px-2 mr-2 w-32 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-neutral-800 cursor-pointer hover:text-neutral-300 hover:border-emerald-800"
                  >
                    DELETE FEATURES
                  </button>
                </div>

                <div className="p-2 pb-6 relative h-auto w-full">
                  <button
                    onClick={handleClose}
                    className="p-0 px-2 mr-2 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-neutral-800 cursor-pointer hover:text-neutral-300 hover:border-neutral-800"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-0 px-2 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-emerald-800 cursor-pointer hover:text-neutral-300 hover:border-emerald-800"
                  >
                    SAVE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
