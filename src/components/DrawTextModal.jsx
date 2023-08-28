import React from "react"
import { useState, ChangeEvent } from "react"
import { useImperativeHandle } from 'react';


export default function DrawTextModal({ innerRef, children, handleDrawText }) {
    const [showModal, setShowModal] = React.useState(false);

    const [text, setText] = useState('');
    const [size, setSize] = useState(1);
    const [rotate, setRotate] = useState(0);

    const [arrowLeft, setArrowLeft] = useState(false);
    const [arrowRight, setArrowRight] = useState(false);
    const [baseLine, setBaseLine] = useState(false);
    const [topLine, setTopLine] = useState(false);

    const handleChangeText = (e) => {
        setText(e.target.value.toUpperCase())
        handleDrawText({
            text: e.target.value.toUpperCase(),
            size: size,
            rotate: rotate,
            arrowLeft: arrowLeft,
            arrowRight: arrowRight,
            topLine: topLine,
            baseLine: baseLine,
            execute: false
        })
    }
    const handleChangeSize = (e) => {
        setSize(e.target.value)
        handleDrawText({
            text: text,
            size: e.target.value,
            rotate: rotate,
            arrowLeft: arrowLeft,
            arrowRight: arrowRight,
            topLine: topLine,
            baseLine: baseLine,
            execute: false
        })
    }
    const handleChangeRotate = (e) => {
        setRotate(e.target.value)
        handleDrawText({
            text: text,
            size: size,
            rotate: e.target.value,
            arrowLeft: arrowLeft,
            arrowRight: arrowRight,
            topLine: topLine,
            baseLine: baseLine,
            execute: false
        })
    }


    
    const handleChangeArrowLeft = (e) => {
        handleDrawText({
            text: text,
            size: size,
            rotate: rotate,
            arrowLeft: e,
            arrowRight: arrowRight,
            topLine: topLine,
            baseLine: baseLine,
            execute: false
        })
    }
    const handleChangeArrowRight = (e) => {
        handleDrawText({
            text: text,
            size: size,
            rotate: rotate,
            arrowLeft: arrowLeft,
            arrowRight: e,
            topLine: topLine,
            baseLine: baseLine,
            execute: false
        })
    }
    const handleChangeTopLine = (e) => {
        handleDrawText({
            text: text,
            size: size,
            rotate: rotate,
            arrowLeft: arrowLeft,
            arrowRight: arrowRight,
            topLine: e,
            baseLine: baseLine,
            execute: false
        })
    }
    const handleChangeBaseLine = (e) => {
        handleDrawText({
            text: text,
            size: size,
            rotate: rotate,
            arrowLeft: arrowLeft,
            arrowRight: arrowRight,
            topLine: topLine,
            baseLine: e,
            execute: false
        })
    }


    useImperativeHandle(innerRef, () => ({
        OpenCloseModal(force=null) {
            if (force == null) {
                setShowModal((showModal) ? false : true)
            } else {
                setShowModal(force)
            }
        }
    }));

    const handleClose = (e) => {
        setShowModal(false);
    }

    const handleAdd = (e) => {
        handleDrawText({
            text: text,
            size: size,
            rotate: rotate,
            arrowLeft: arrowLeft,
            arrowRight: arrowRight,
            topLine: topLine,
            baseLine: baseLine,
            execute: true
        })
        //setShowModal(false);
    }

    return (
        <div>
            <a className="flex items-center hover:text-neutral-200 hover:bg-neutral-800 p-1 rounded-md transition" href="#" alt="Pesquisar" title="Pesquisar" onClick={()=> setShowModal(true)}>
                {children}
            </a>
            {showModal ? (
                <div>
                    <div className="absolute my-6 w-9/12 md:w-3/4 lg:w-2/5 top-16">
                        <div className="p-2 border-0 rounded-md shadow-lg relative flex flex-col w-full bg-neutral-900  outline-none focus:outline-none backdrop-blur bg-black/70">
                            <div className="block">
                                <div className="flex-1 flex">
                                    <span className="w-full py-1 pr-2 text-neutral-200 text-center text-lg">DRAW TEXT</span>
                                </div>
                                <div className="flex-1 flex flex-col md:flex-row">
                                    <div className="w-full flex-1 mx-1">
                                        <div className="flex">
                                            <span className="py-1 pr-2 text-neutral-500">TEXT:</span>
                                            <input type="text" onChange={e => handleChangeText(e)} className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-emerald-800 focus:border-emerald-800 block w-full p-1 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800" placeholder="Text" autoFocus />
                                        </div>
                                    </div>
                                    <div className="w-full flex-1 mx-1">
                                        <div className="flex">
                                            <span className="py-1 pr-2 text-neutral-500">SIZE:</span>
                                            <input type="number" onChange={e => handleChangeSize(e)} min={0.1} max={30} step={0.1} defaultValue={1} className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-emerald-800 focus:border-emerald-800 block w-full p-1 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800" placeholder="Size" />
                                        </div>
                                    </div>
                                    <div className="w-full flex-1 mx-1">
                                        <div className="flex">
                                            <span className="py-1 pr-2 text-neutral-500">ROTATE:</span>
                                            <input type="number" onChange={e => handleChangeRotate(e)} min={-360} max={360} defaultValue={0} className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-emerald-800 focus:border-emerald-800 block w-full p-1 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800" placeholder="Rotate" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col md:flex-row mt-3">
                                    <div className="w-full flex-1 mx-1">
                                        <span id="base-modal-action" className="flex w-auto pb-3 mb-1 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 rounded-md cursor-pointer" alt="Camada base do mapa" title="Camada base do mapa">
                                            <label className="inline-flex relative items-top ml-1 mt-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={arrowLeft}
                                                    readOnly
                                                />
                                                <div
                                                    onClick={(e) => {
                                                        setArrowLeft(!arrowLeft)
                                                        handleChangeArrowLeft(!arrowLeft);
                                                    }}
                                                    className="w-11 h-6 bg-neutral-700 rounded-full peer  peer-focus:ring-emerald-500  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"
                                                ></div>
                                                <span className="ml-2">ARROW LEFT</span>
                                            </label>
                                        </span>
                                    </div>
                                    <div className="w-full flex-1 mx-1">
                                        <span id="base-modal-action" className="flex w-auto pb-3 mb-1 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 rounded-md cursor-pointer" alt="Camada base do mapa" title="Camada base do mapa">
                                            <label className="inline-flex relative items-top ml-1 mt-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={arrowRight}
                                                    readOnly
                                                />
                                                <div
                                                    onClick={() => {
                                                        setArrowRight(!arrowRight);
                                                        handleChangeArrowRight(!arrowRight);
                                                    }}
                                                    className="w-11 h-6 bg-neutral-700 rounded-full peer  peer-focus:ring-emerald-500  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"
                                                ></div>
                                                <span className="ml-2">ARROW RIGHT</span>
                                            </label>
                                        </span>
                                    </div>
                                    <div className="w-full flex-1 mx-1">
                                        <span id="base-modal-action" className="flex w-auto pb-3 mb-1 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 rounded-md cursor-pointer" alt="Camada base do mapa" title="Camada base do mapa">
                                            <label className="inline-flex relative items-top ml-1 mt-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={topLine}
                                                    readOnly
                                                />
                                                <div
                                                    onClick={() => {
                                                        setTopLine(!topLine);
                                                        handleChangeTopLine(!topLine);
                                                    }}
                                                    className="w-11 h-6 bg-neutral-700 rounded-full peer  peer-focus:ring-emerald-500  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"
                                                ></div>
                                                <span className="ml-2">TOP LINE</span>
                                            </label>
                                        </span>
                                    </div>
                                    <div className="w-full flex-1 mx-1">
                                        <span id="base-modal-action" className="flex w-auto pb-3 mb-1 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 rounded-md cursor-pointer" alt="Camada base do mapa" title="Camada base do mapa">
                                            <label className="inline-flex relative items-top ml-1 mt-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={baseLine}
                                                    readOnly
                                                />
                                                <div
                                                    onClick={() => {
                                                        setBaseLine(!baseLine);
                                                        handleChangeBaseLine(!baseLine);
                                                    }}
                                                    className="w-11 h-6 bg-neutral-700 rounded-full peer  peer-focus:ring-emerald-500  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"
                                                ></div>
                                                <span className="ml-2">BASE LINE</span>
                                            </label>
                                        </span>
                                    </div>
                                </div>
                                <div className="p-2 pb-6 relative h-auto w-full">
                                    <button onClick={handleClose} className="p-0 px-2 mr-2 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-neutral-800 cursor-pointer hover:text-neutral-300 hover:border-neutral-800">CANCEL</button>
                                    <button onClick={handleAdd} className="p-0 px-2 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-emerald-800 cursor-pointer hover:text-neutral-300 hover:border-emerald-800">ADD TEXT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>

    );
}
