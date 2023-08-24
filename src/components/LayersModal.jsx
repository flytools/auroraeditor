import React from "react"
import { useState } from "react"

export default function LayersModal({SetBaseLayer, SetMensure }) {
    const [showModal, setShowModal] = React.useState(true);

    const [showBaseLayersModal, setShowBaseLayersModal] = React.useState(false);
    const [baseLayerValue, setBaseLayerValue] = useState((localStorage.getItem('baselayer') != 'sat' && localStorage.getItem('baselayer') != 'topo' && localStorage.getItem('baselayer') != 'dark') ? 'STRE' : localStorage.getItem('baselayer'));

    const [mensure, setMensure] = useState(false)

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

    return (
        <div>
            {showModal ? (
                <div>
                    {showBaseLayersModal ? (
                        <div className="absolute my-2 w-72 left-32 top-20">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-zinc-900  outline-none focus:outline-none p-2 backdrop-blur bg-black/70 text-center items-center">
                                <button onClick={() => handleShowBaseLayersModal(false)} type="button" className="absolute top-1 right-1 text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-800 dark:hover:text-white" data-modal-toggle="crypto-modal">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
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
                                            {(baseLayerValue != 'sat' && baseLayerValue != 'topo' && baseLayerValue != 'dark') ? (
                                                <span id="streets" onClick={handleBaseLayerClick} className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-300 bg-zinc-800 rounded-md border-2 border-emerald-600 cursor-pointer hover:text-zinc-300 select-none" alt="Estradas" title="Estradas">STREETS</span>
                                            ) : (
                                                <span id="streets" onClick={handleBaseLayerClick} className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none">STREETS</span>
                                            )}
                                        </li>
                                        <li>
                                            {(baseLayerValue == 'sat') ? (
                                                <span id="sat" onClick={handleBaseLayerClick} className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-300 bg-zinc-800 rounded-md border-2 border-emerald-600 cursor-pointer hover:text-zinc-300 select-none">SAT</span>
                                            ) : (
                                                <span id="sat" onClick={handleBaseLayerClick} className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none">SAT</span>
                                            )}
                                        </li>
                                        <li>
                                            {(baseLayerValue == 'topo') ? (
                                                <span id="topo" onClick={handleBaseLayerClick} className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-300 bg-zinc-800 rounded-md border-2 border-emerald-600 cursor-pointer hover:text-zinc-300 select-none">TOPO</span>
                                            ) : (
                                                <span id="topo" onClick={handleBaseLayerClick} className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none">TOPO</span>
                                            )}
                                        </li>
                                        <li>
                                            {(baseLayerValue == 'dark') ? (
                                                <span id="dark" onClick={handleBaseLayerClick} className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-300 bg-zinc-800 rounded-md border-2 border-emerald-600 cursor-pointer hover:text-zinc-300 select-none">DARK</span>
                                            ) : (
                                                <span id="dark" onClick={handleBaseLayerClick} className="inline-flex justify-between items-center p-2 w-full text-sm font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none">DARK</span>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : null}


                    <div className="absolute my-2 w-20 left-5 top-20">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-zinc-900  outline-none focus:outline-none p-2 backdrop-blur bg-black/70 text-center">
                            <div className="py-0">
                                <p className="text-base font-semibold text-zinc-900 text-xs dark:text-zinc-100 w-full text-center">
                                    SETTINGS
                                </p>
                            </div>
                            <div className="p-0">
                                <ul className="flex flex-col space-y-0">
                                    <li>
                                        <span onClick={handleShowBaseLayersModal} id="base-modal-action" className="block w-auto py-2 text-xs font-semibold text-zinc-400 bg-zinc-900 hover:bg-zinc-800 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none" alt="Camada base do mapa" title="Camada base do mapa">BASE MAP</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-0">
                                <ul className="flex flex-col space-y-1">
                                    <li>
                                        {(mensure) ? (
                                            <span onClick={handleMensure} id="base-modal-action" className="block w-auto py-2 text-xs font-semibold text-emerald-500 bg-zinc-900 hover:bg-zinc-800 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-emerald-400 select-none text-emerald-700" alt="Camada base do mapa" title="Camada base do mapa">MENSURE</span>
                                        ) : (
                                            <span onClick={handleMensure} id="base-modal-action" className="block w-auto py-2 text-xs font-semibold text-zinc-400 bg-zinc-900 hover:bg-zinc-800 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 select-none" alt="Camada base do mapa" title="Camada base do mapa">MENSURE</span>                                            
                                        )}
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
