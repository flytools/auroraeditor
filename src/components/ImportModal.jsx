import React, { useEffect } from "react"
import { useState } from "react"
import axios from 'axios'
import WaypointFplList from "./WaypointFplList";
import { useRef } from "react";
import WaypointList from "./WaypointList";
import { toast } from "react-toastify";
import { forwardRef, useImperativeHandle } from 'react';

export default function ImportModal({ innerRef, children, LoadRouteAndWaypoints, Map, defaultShowModal }) {
    const [showModal, setShowModal] = useState((localStorage.getItem("showfpl") !== 'false'));
    const [minimizeModal, setMinimizeModal] = useState((localStorage.getItem("minimizefpl") !== 'false'));
    const [expandFpl, setExpandFpl] = useState((localStorage.getItem("expandfpl") === 'true'));
    const [showDropdown, setShowDropdown] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);


    const [route, setRoute] = useState(localStorage.getItem("route"));
    const [altitude, setAltitude] = useState((localStorage.getItem("altitude") != null) ? localStorage.getItem("altitude") : 3000);
    const [speed, setSpeed] = useState((localStorage.getItem("speed") != null) ? localStorage.getItem("speed") : 100);

    const [waypoints, setWaypoint] = useState([]);
    const inputRoute = useRef(null);
    const [copyText, setCopyText] = useState('');

    useEffect(() => {
        if ((localStorage.getItem("expandfpl") === 'true')) {
            handleSave(localStorage.getItem("route"), false)
        }
    }, [])

    useImperativeHandle(innerRef, () => ({
        OpenCloseFpl() {
            setShowModal((showModal) ? false : true)
        }
    }));

    const handleShowModal = (value) => {
        localStorage.setItem("showfpl", value)

        handleSave(localStorage.getItem("route"), false)
        setShowModal(value)

        localStorage.setItem("showfplmodal", 0);
    }

    const handleMinimizeModal = (value) => {
        localStorage.setItem("minimizefpl", value)
        setMinimizeModal(value)
    }

    const handleAltitude = (event) => {
        setAltitude(event.target.value);
    }

    const handleSpeed = (event) => {
        setSpeed(event.target.value);
    }

    const handleSave = (routeString, reloadMap=true) => {
        if (routeString == null) {
            routeString = inputRoute.current.value.toUpperCase()

            inputRoute.current.value = inputRoute.current.value.toUpperCase()
        }
        localStorage.setItem("route", routeString)
        localStorage.setItem("altitude", altitude)
        localStorage.setItem("speed", speed)

        if (typeof Map !== 'undefined') {
            LoadRouteAndWaypoints(routeString, altitude, speed, reloadMap).then(data => {
                setWaypoint(data.waypoints.data.features);
                //inputRoute.current.value = routeString.toUpperCase();

                if (reloadMap) {
                    Map.addSource('route-source', data.route);

                    Map.addLayer({
                        'id': 'route',
                        'type': 'line',
                        'source': 'route-source',
                        'layout': {
                            'line-cap': 'round',
                        },
                        'paint': {
                            'line-color': '#581c87',
                            'line-opacity': 0.75,
                            'line-width': 8,
                        }
                    });

                    Map.addLayer({
                        'id': 'labels',
                        'type': 'symbol',
                        'source': 'route-source',
                        'layout': {
                            'symbol-placement': 'line-center',
                            'text-field': ['get', 'ident'],
                            "icon-allow-overlap": true,
                            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                            "text-size": 14,
                            "text-transform": "uppercase",
                            "text-letter-spacing": 0.001,
                        },
                        "paint": {
                            "text-color": "#fff",
                            "text-halo-color": "#581c87",
                            "text-halo-width": 10
                        },
                    });

                    //add waypoints
                    Map.addSource('waypoint-source', data.waypoints);

                    Map.addLayer({
                        'id': 'waypoints',
                        'type': 'symbol',
                        'source': 'waypoint-source',
                        'layout': {
                            'text-field': ['get', 'ident'],
                            'text-variable-anchor': ['bottom'],
                            'text-radial-offset': 0.75,
                            'text-justify': 'auto',
                            'icon-image': 'dot-image',
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
                            "text-halo-color": "#581c87",
                            "text-halo-width": 100
                        }
                    });

                    Map.moveLayer('route');
                    Map.moveLayer('labels');
                    Map.moveLayer('waypoints');
                }
            })
        }
    }

    const handleExpandFpl = () => {
        localStorage.setItem("expandfpl", (expandFpl) ? false : true)
        //if(Fpl == null || expandfpl == null) handleSave(route, false)
        setExpandFpl((expandFpl) ? false : true)
    }

    const handleCopyCoordinate = (text) => {
        try {
            navigator.clipboard.writeText(text)
            setCopyText(text)
            toast('Coordenada ' + text + ' copiada para a área de transferência!', {
                theme: "dark",
                position: toast.POSITION.BOTTOM_RIGHT,
                className: "map-toast bg-zinc-900  outline-none focus:outline-none p-4 backdrop-blur bg-black/70",
            });
            return true
        } catch (error) {
            console.warn('Copy failed', error)
            setCopyText(null)
            return false
        }
    }

    const handleDelete = (index) => {
        var newRoute = ''

        if (localStorage.getItem("route").indexOf(' ') > -1) {
            localStorage.getItem("route").split(' ').map((waypoint, i) => {
                if (index != i) {
                    newRoute += waypoint + ' '
                }
            })
        } else {
            handleClearRoute()
            return;
        }

        handleSave(newRoute.trim())

        setRoute(newRoute.trim())
    }

    const handleUp = (index) => {
        if (index > 0) {
            var newRoute = ''

            var waypointsList = localStorage.getItem("route").split(' ');

            waypointsList.map((waypoint, i) => {
                if (index - 1 == i) {
                    newRoute += waypointsList[index] + ' '
                }
                if (index != i) {
                    newRoute += waypoint + ' '
                }
            })

            handleSave(newRoute.trim())

            setRoute(newRoute.trim())
        }
    }

    const handleDown = (index) => {
        var waypointsList = localStorage.getItem("route").split(' ');

        if (index < waypointsList.length-1) {
            var newRoute = ''

            waypointsList.map((waypoint, i) => {
                if (index != i) {
                    newRoute += waypoint + ' '
                }
                if (index+1 == i) {
                    newRoute += waypointsList[index] + ' '
                }
            })

            handleSave(newRoute.trim())

            setRoute(newRoute.trim())
        }
    }

    //drag drop
    const [dragItemIndex, setDragItemIndex] = useState();
    const [dragOverItemIndex, setDragOverItemIndex] = useState();

    const handleDragStart = index => {
        setDragItemIndex(index)
    };

    const handleDragOver = event => {
        event.preventDefault();
    }

    const handleDrop = () => {
        const _waypoints = [...waypoints];
        const dragItem = _waypoints.splice(dragItemIndex, 1)[0];
        _waypoints.splice(dragOverItemIndex, 0, dragItem);

        let routeString = '';
        _waypoints.map(waypoint => {
            routeString += waypoint.properties.ident + ' '
        })
        handleSave(routeString.trim())

    }

    const handleDragEnter = index => {
        setDragOverItemIndex(index)
    }

    const handleDragLeave = (event) => {
        //setDragOverItemIndex(undefined)
    }

    const handleDragEnd = event => {
        setDragItemIndex(undefined);
        setDragOverItemIndex(undefined);
    }

    //dropdown
    const handleCopyAllCoordinates = () => {
        setShowDropdown(false)

        let text = '';
        waypoints.map(waypoint => {
            text += waypoint.properties.coordinate + ' '
        })

        try {
            navigator.clipboard.writeText(text.trim())
            setCopyText(text.trim())
            toast('Coordenadas ' + text.trim() + ' copiadas para a área de transferência!', {
                theme: "dark",
                position: toast.POSITION.BOTTOM_RIGHT,
                className: "map-toast bg-zinc-900  outline-none focus:outline-none p-4 backdrop-blur bg-black/70",
            });
            return true
        } catch (error) {
            console.warn('Copy failed', error)
            setCopyText(null)
            return false
        }
    }

    const handleCopyRoute = () => {
        setShowDropdown(false)

        var text = inputRoute.current.value

        try {
            navigator.clipboard.writeText(text.trim())
            setCopyText(text.trim())
            toast('Rota ' + text.trim() + ' copiada para a área de transferência!', {
                theme: "dark",
                position: toast.POSITION.BOTTOM_RIGHT,
                className: "map-toast bg-zinc-900  outline-none focus:outline-none p-4 backdrop-blur bg-black/70",
            });
            return true
        } catch (error) {
            console.warn('Copy failed', error)
            setCopyText(null)
            return false
        }
    }

    const handleClearRoute = () => {
        setShowDropdown(false)

        inputRoute.current.value = ''

        localStorage.setItem("route", "")

        setWaypoint([])

        handleSave('', true)
    }

    const handleShare = () => {
        setShowDropdown(false)

        var text = 'http://127.0.0.1:8000/map/' + altitude + '/' + speed + '/' + inputRoute.current.value.trim().toUpperCase() + '/';

        try {
            navigator.clipboard.writeText(text.trim())
            setCopyText(text.trim())
            toast('Link ' + text.trim() + ' copiado para a área de transferência!', {
                theme: "dark",
                position: toast.POSITION.BOTTOM_RIGHT,
                className: "map-toast bg-zinc-900  outline-none focus:outline-none p-4 backdrop-blur bg-black/70",
            });
            return true
        } catch (error) {
            console.warn('Copy failed', error)
            setCopyText(null)
            return false
        }
    }


    //export
    const handleExportGpx = () => {
        setShowDropdown(false)
        setShowExportDropdown(false)

        var fileName = localStorage.getItem("route").split(' ').shift() + '-' + localStorage.getItem("route").split(' ').splice(-1)
        axios.get(`/api/v3/export/gpx/${localStorage.getItem("altitude")}/${localStorage.getItem("speed")}/${localStorage.getItem("route")}/`).then(res => {
            dataDownload(res.data, fileName + ".gpx", "text/plain");
        })
    }

    const handleExportFms = () => {
        setShowDropdown(false)
        setShowExportDropdown(false)

        var fileName = localStorage.getItem("route").split(' ').shift() + '-' + localStorage.getItem("route").split(' ').splice(-1)
        axios.get(`/api/v3/export/fms/${localStorage.getItem("altitude") }/${localStorage.getItem("speed")}/${localStorage.getItem("route")}/`).then(res => {
            dataDownload(res.data, fileName + ".fms", "text/plain");
        })
    }

    const handleExportPln = () => {
        setShowDropdown(false)
        setShowExportDropdown(false)

        var fileName = localStorage.getItem("route").split(' ').shift() + '-' + localStorage.getItem("route").split(' ').splice(-1)
        axios.get(`/api/v3/export/pln/${localStorage.getItem("altitude")}/${localStorage.getItem("speed")}/${localStorage.getItem("route")}/`).then(res => {
            dataDownload(res.data, fileName + ".pln", "text/plain");
        })
    }


    function dataDownload(data, filename, type) {
        var file = new Blob([data], { type: type });
        if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, filename);
        else {
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    };


    return (
        <div>
            <a className="flex items-center hover:text-zinc-200 hover:bg-zinc-800 p-1 rounded-md transition" href="#" alt="Plano de voo detalhado" title="Plano de voo detalhado" onClick={()=> handleShowModal((showModal) ? false:true)}>
                {children}
            </a>
            {showModal ? (
                <div>
                        <div className="absolute my-2 w-10/12 md:w-3/4 lg:w-6/12 xl:w-5/12 2xl:w-3/12 right-5 top-20">
                            <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-zinc-900  outline-none focus:outline-none p-4 backdrop-blur bg-black/70">
                                <button onClick={() => handleShowModal(false)} type="button" className="absolute top-3 left-2.5 text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-800 dark:hover:text-white" data-modal-toggle="crypto-modal">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>

                                <button onClick={() => handleMinimizeModal((minimizeModal) ? false : true)} type="button" className="absolute top-3 left-12 text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-800 dark:hover:text-white" data-modal-toggle="crypto-modal">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                    <span className="sr-only">Minimize modal</span>
                                </button>

                                <button onClick={() => setShowDropdown((showDropdown)?false:true)} type="button" className="absolute top-3 right-2.5 text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-md text-sm p-0.5 ml-auto inline-flex items-center dark:hover:bg-zinc-800 dark:hover:text-white" data-modal-toggle="crypto-modal">
                                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                                    <span className="sr-only">Menu</span>
                                </button>

                                {showDropdown ? (

                                <div id="dropdownDotsHorizontal" className="absolute right-5 top-10 z-10 w-auto bg-white rounded divide-y divide-zinc-100 shadow dark:bg-zinc-900 dark:divide-zinc-600">
                                    <ul className="py-1 text-md text-zinc-700 dark:text-zinc-300" arialabelledby="dropdownMenuIconHorizontalButton">
                                        <li>
                                            <a onClick={handleShare} href="#" className="block py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white">Compartilhar</a>
                                        </li>
                                        <li>
                                            <a onClick={(showExportDropdown) ?()=> setShowExportDropdown(false) : ()=>setShowExportDropdown(true)} href="#" className="block py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white">Exportar</a>
                                        </li>
                                        {showExportDropdown ? (
                                            <>
                                                <li>
                                                    <a onClick={handleExportGpx} href="#" className="block py-2 px-8 bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white text-sm">GARMIN GPS (.gpx)</a>
                                                </li>
                                                <li>
                                                    <a onClick={handleExportFms} href="#" className="block py-2 px-8 bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white text-sm">XPLANE 11/12 (.fms)</a>
                                                </li>
                                                <li>
                                                    <a onClick={handleExportPln} href="#" className="block py-2 px-8 bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white text-sm">FSX/P3D (.pln)</a>
                                                </li>
                                                <li>
                                                    <a onClick={handleExportPln} href="#" className="block py-2 px-8 bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white text-sm">MSFS2020 (.pln)</a>
                                                </li>
                                            </>
                                        ): null}
                                        <li>
                                            <a onClick={handleClearRoute} href="#" className="block py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white">Limpar rota</a>
                                        </li>
                                        <li>
                                            <a onClick={handleCopyRoute} href="#" className="block py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white">Copiar rota</a>
                                        </li>
                                        <li>
                                            <a onClick={handleCopyAllCoordinates} href="#" className="block py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white">Copiar coordenadas</a>
                                        </li>
                                    </ul>
                                </div>

                                ) : null}


                                <div className="rounded-t dark:border-zinc-600">
                                    <h3 className="text-base font-semibold text-zinc-900 lg:text-xl dark:text-zinc-200 text-center">
                                        PLANO DE VOO
                                    </h3>
                                </div>

                                <p>{minimizeModal}</p>

                                {minimizeModal ? (
                                <div>
                                    <div className="p-2 flex flex-row space-x-2">
                                        <div className="w-32">
                                            <div className="relative w-full">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-500 dark:text-zinc-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                                    </svg>
                                                </div>
                                                <input onChange={handleSpeed} type="number" min={50} autoComplete="off" className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-purple-800 focus:border-purple-800 block w-full pl-10 p-1.5  dark:bg-zinc-800 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-purple-800 dark:focus:border-purple-800" placeholder="Velocidade" value={speed} />
                                            </div>
                                        </div>
                                        <div className="w-32">
                                            <div className="relative w-full">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-500 dark:text-zinc-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                                    </svg>
                                                </div>
                                                <input onChange={handleAltitude} type="number" min={1000} autoComplete="off" className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-purple-800 focus:border-purple-800 block w-full pl-10 p-1.5  dark:bg-zinc-800 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-purple-800 dark:focus:border-purple-800" placeholder="Altitude" value={altitude} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2" key={route}>
                                        <textarea
                                            id="route"
                                            rows="4"
                                            className="block p-2.5 w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-purple-800 focus:border-purple-800 dark:bg-zinc-800 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-purple-800 dark:focus:border-purple-800"
                                            placeholder="Insira a rota aqui..."
                                            defaultValue={route}
                                            ref={inputRoute}
                                        />
                                    </div>

                                    <div className="p-2 relative h-auto w-full">
                                        <button id="expand" onClick={handleExpandFpl} className="items-center p-0 px-2 w-auto text-md font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-zinc-700 cursor-pointer hover:text-zinc-300 hover:border-purple-800">ROTA DETALHADA</button>
                                        <button id="save" onClick={()=>handleSave(null)} className="absolute right-2 p-0 px-2 w-auto text-md font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-purple-800 cursor-pointer hover:text-zinc-300 hover:border-purple-800">SALVAR</button>
                                    </div>

                                    {expandFpl ? (
                                    <div className="p-2 flex-col">
                                        <div className="flow-root">
                                            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-96 overflow-y-auto overflow-x-hidden">
                                                    {waypoints.map((waypoint, index) =>
                                                        <li
                                                            key={index}
                                                            className="p-3 sm:p-2 hover:bg-zinc-800 rounded-sm cursor-move"
                                                            draggable
                                                            onDragStart={() => handleDragStart(index)}
                                                            onDragOver={handleDragOver}
                                                            onDrop={() => handleDrop(index)}
                                                            onDragEnter={() => handleDragEnter(index)}
                                                            onDragLeave={handleDragLeave}
                                                            onDragEnd={handleDragEnd}
                                                        >
                                                            <div className="flex items-center space-x-4" href="#">
                                                                <div className="flex-shrink-0 text-white">
                                                                    <img className="w-8 h-8" src={`assets/images/${waypoint.properties.type}.png`} />
                                                                </div>
                                                                <div className="flex-1 min-w-32">

                                                                    <div className="flex min-w-0 space-x-2 cursor-default">
                                                                        <p className="text-lg uppercase font-bold text-zinc-900 truncate dark:text-white">
                                                                            {(waypoint.properties.type == 'coordinate') ? 'COORD' : waypoint.properties.ident} <span className="text-xs text-zinc-500 truncate dark:text-zinc-400">({waypoint.properties.coordinate})</span>
                                                                        </p>
                                                                    </div>

                                                                    <div className="flex min-w-0 space-x-2">
                                                                        {(index + 1 != waypoints.length) ? (
                                                                            <ul className="flex flex-wrap justify-center items-center text-zinc-300 text-sm cursor-default">
                                                                                <li id="direction">
                                                                                    <span className="mr-4 hover:text-zinc-200 md:mr-6 ">{waypoint.properties.direction}MAG</span>
                                                                                </li>
                                                                                <li id="time">
                                                                                    <span className="mr-4 hover:text-zinc-200 md:mr-6 ">{waypoint.properties.time}</span>
                                                                                </li>
                                                                                <li id="distance">
                                                                                    <span className="mr-4 hover:text-zinc-200 md:mr-6 ">{waypoint.properties.distance}NM</span>
                                                                                </li>
                                                                            </ul>
                                                                        ) :
                                                                            <ul className="flex flex-wrap justify-center items-center text-zinc-300 text-sm cursor-default">
                                                                                <li id="direction2">
                                                                                    <span className="mr-4 hover:text-zinc-200 md:mr-6 ">Total:</span>
                                                                                </li>
                                                                                <li id="time2">
                                                                                    <span className="mr-4 hover:text-zinc-200 md:mr-6 ">{waypoint.properties.accumulated_time}</span>
                                                                                </li>
                                                                                <li id="distance2">
                                                                                    <span className="mr-4 hover:text-zinc-200 md:mr-6 ">{waypoint.properties.accumulated_distance}NM</span>
                                                                                </li>
                                                                            </ul>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="inline-flex items-center text-base font-semibold text-zinc-900 dark:text-white">
                                                                    <button onClick={() => handleCopyCoordinate(waypoint.properties.coordinate)} className="flex items-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 p-1 rounded-md transition" title="Copiar coordenada">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                                                        </svg>
                                                                    </button>

                                                                    {(index != 0) ? (
                                                                        <button onClick={() => handleUp(index)} className="flex items-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 p-1 rounded-md transition" title="Mover para cima">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                                                                            </svg>
                                                                        </button>
                                                                    ) :
                                                                        <button disabled className="flex items-center text-zinc-600 p-1 rounded-md transition" title="Mover para cima">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                                                                            </svg>
                                                                        </button>
                                                                    }

                                                                    {(index + 1 != waypoints.length) ? (
                                                                        <button onClick={() => handleDown(index)} className="flex items-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 p-1 rounded-md transition" title="Mover para baixo">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                                                                            </svg>
                                                                        </button>
                                                                    ) :
                                                                        <button disabled className="flex items-center text-zinc-600  p-1 rounded-md transition" title="Mover para baixo">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                                                                            </svg>
                                                                        </button>
                                                                    }
                                                                    <button onClick={() => handleDelete(index)} className="flex items-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 p-1 rounded-md transition" title="Excluir">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )}
                                            </ul>
                                        </div>
                                    </div>
                                    ) : null}
                                </div>
                                ) : null}
                            </div>
                        </div>
                </div>
            ) : null}
        </div>

    );
}
