import React from "react"
import { useState } from "react"

export default function LayersModal({SetBaseLayer, SetMensure, SetDrawText, setLoadImage }) {
    const [showModal, setShowModal] = React.useState(true);

    const [showBaseLayersModal, setShowBaseLayersModal] = React.useState(false);
    const [baseLayerValue, setBaseLayerValue] = useState((localStorage.getItem('baselayer') != 'sat' && localStorage.getItem('baselayer') != 'topo' && localStorage.getItem('baselayer') != 'dark') ? 'STRE' : localStorage.getItem('baselayer'));

    const [mensure, setMensure] = useState(false)
    const [drawText, setDrawText] = useState(false)

    const handleBaseLayerClick = (e) => {
        SetBaseLayer(e.target.id)

        if (e.target.id != 'sat' && e.target.id != 'topo' && e.target.id != 'dark') {
            setBaseLayerValue('STRE')
        } else {
            setBaseLayerValue(e.target.id)
        }

        setShowBaseLayersModal(false)
    }
    
    //layers modals
    const handleShowBaseLayersModal = (e) => {
        setShowBaseLayersModal((showBaseLayersModal) ? false : true)
    }

    //positions
    const handleMensure = () => {
        setMensure((mensure) ? false : true)
        SetMensure((mensure) ? false : true)
    }

    const handleDrawText = () => {
        setDrawText((drawText) ? false : true)
        SetDrawText((drawText) ? false : true)
    }
  
    const handleLoadImage = () => {
      setLoadImage()
    };

    //layers
    let layers = [
        { name: "vrt", label: "VFR ROUTE", color: "amber-600", visible: true },
        { name: "vfi", label: "VFR FIXES", color: "red-600", visible: true },
    ]

    return (
      <div>
        {showModal ? (
          <div>
            {showBaseLayersModal ? (
              <div className="absolute my-2 w-72 left-52 top-20">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-zinc-900  outline-none focus:outline-none p-2 backdrop-blur bg-black/70 text-center items-center">
                  <button
                    onClick={() => handleShowBaseLayersModal(false)}
                    type="button"
                    className="absolute top-1 right-1 text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-800 dark:hover:text-white"
                    data-modal-toggle="crypto-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>

                  <div className="py-0">
                    <p className="text-base font-semibold text-zinc-900 text-xxs dark:text-zinc-100 w-full">
                      BASE MAP
                    </p>
                  </div>
                  <div className="p-0">
                    <ul className="flex space-x-2">
                      <li>
                        {baseLayerValue != "sat" &&
                        baseLayerValue != "topo" &&
                        baseLayerValue != "dark" ? (
                          <span
                            id="streets"
                            onClick={handleBaseLayerClick}
                            className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-300 bg-zinc-800 rounded-md border-2 border-emerald-600 cursor-pointer hover:text-zinc-300 select-none"
                            alt="Estradas"
                            title="Estradas"
                          >
                            STREETS
                          </span>
                        ) : (
                          <span
                            id="streets"
                            onClick={handleBaseLayerClick}
                            className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none"
                          >
                            STREETS
                          </span>
                        )}
                      </li>
                      <li>
                        {baseLayerValue == "sat" ? (
                          <span
                            id="sat"
                            onClick={handleBaseLayerClick}
                            className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-300 bg-zinc-800 rounded-md border-2 border-emerald-600 cursor-pointer hover:text-zinc-300 select-none"
                          >
                            SAT
                          </span>
                        ) : (
                          <span
                            id="sat"
                            onClick={handleBaseLayerClick}
                            className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none"
                          >
                            SAT
                          </span>
                        )}
                      </li>
                      <li>
                        {baseLayerValue == "topo" ? (
                          <span
                            id="topo"
                            onClick={handleBaseLayerClick}
                            className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-300 bg-zinc-800 rounded-md border-2 border-emerald-600 cursor-pointer hover:text-zinc-300 select-none"
                          >
                            TOPO
                          </span>
                        ) : (
                          <span
                            id="topo"
                            onClick={handleBaseLayerClick}
                            className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none"
                          >
                            TOPO
                          </span>
                        )}
                      </li>
                      <li>
                        {baseLayerValue == "dark" ? (
                          <span
                            id="dark"
                            onClick={handleBaseLayerClick}
                            className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-300 bg-zinc-800 rounded-md border-2 border-emerald-600 cursor-pointer hover:text-zinc-300 select-none"
                          >
                            DARK
                          </span>
                        ) : (
                          <span
                            id="dark"
                            onClick={handleBaseLayerClick}
                            className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none"
                          >
                            DARK
                          </span>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="absolute my-2 w-44 left-5 top-20">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-zinc-900  outline-none focus:outline-none p-2 backdrop-blur bg-black/70 text-center">
                <div className="py-2">
                  <p className="text-base font-semibold text-zinc-900 text-xs dark:text-zinc-100 w-full text-center">
                    SETTINGS
                  </p>
                </div>
                <div className="p-0">
                  <ul className="flex flex-col space-y-0">
                    <li>
                      <span
                        onClick={handleShowBaseLayersModal}
                        id="base-modal-action"
                        className="block w-auto py-2 text-xs font-semibold text-zinc-400 bg-zinc-900 hover:bg-zinc-800 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none"
                        alt="Camada base do mapa"
                        title="Camada base do mapa"
                      >
                        BASE MAP
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-0">
                  <ul className="flex flex-col space-y-1">
                    <li>
                      {mensure ? (
                        <span
                          onClick={handleMensure}
                          id="base-modal-action"
                          className="block w-auto py-2 text-xs font-semibold text-emerald-500 bg-zinc-900 hover:bg-zinc-800 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-emerald-400 select-none text-emerald-700"
                          alt="Camada base do mapa"
                          title="Camada base do mapa"
                        >
                          MENSURE
                        </span>
                      ) : (
                        <span
                          onClick={handleMensure}
                          id="base-modal-action"
                          className="block w-auto py-2 text-xs font-semibold text-zinc-400 bg-zinc-900 hover:bg-zinc-800 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none"
                          alt="Camada base do mapa"
                          title="Camada base do mapa"
                        >
                          MENSURE
                        </span>
                      )}
                    </li>
                  </ul>
                </div>
                <div className="py-2 pt-5">
                  <p className="text-base font-semibold text-zinc-900 text-xs dark:text-zinc-100 w-full text-center">
                    TOOLS
                  </p>
                </div>
                <div className="p-0">
                  <ul className="flex flex-col space-y-1">
                    <li>
                      {drawText ? (
                        <span
                          onClick={handleDrawText}
                          className="block w-auto py-2 text-xs font-semibold text-emerald-500 bg-zinc-900 hover:bg-zinc-800 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-emerald-400 select-none text-emerald-700"
                        >
                          DRAW TEXT
                        </span>
                      ) : (
                        <span
                          onClick={handleDrawText}
                          className="block w-auto py-2 text-xs font-semibold text-zinc-400 bg-zinc-900 hover:bg-zinc-800 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none"
                        >
                          DRAW TEXT
                        </span>
                      )}
                    </li>

                    <li>
                        <span
                          onClick={handleLoadImage}
                          className="block w-auto py-2 text-xs font-semibold text-zinc-400 bg-zinc-900 hover:bg-zinc-800 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none"
                        >
                          LOAD IMAGE
                        </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
}

/*

<div className="py-2 pt-5">
                  <p className="text-base font-semibold text-zinc-900 text-xs dark:text-zinc-100 w-full text-center">
                    LAYERS
                  </p>
                </div>
                <div className="p-0">
                  <ul className="flex flex-col space-y-1">
                    {layers.map((layer) => (
                      <li key={layer.name}>
                        <span
                          onClick={null}
                          id="base-modal-action"
                          className="flex w-auto pb-3 mb-1 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 rounded-md border-2 border-zinc-700 cursor-pointer"
                          alt="Camada base do mapa"
                          title="Camada base do mapa"
                        >
                          <label className="inline-flex relative items-top ml-1 mt-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={null}
                              readOnly
                            />
                            <div
                              onClick={() => {
                                setClear(!null);
                              }}
                              className={
                                "w-7 h-4 bg-neutral-700 rounded-full peer peer-focus:ring-red-500  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-" +
                                layer.color
                              }
                            ></div>
                            <span className="ml-2">{layer.label}</span>
                          </label>
                          <span
                            onClick={null}
                            className="block w-6 py-2 right-2 absolute text-xs font-semibold cursor-pointer hover:bg-zinc-700 rounded-md"
                            alt="Camada base do mapa"
                            title="Camada base do mapa"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                              />
                            </svg>
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                */