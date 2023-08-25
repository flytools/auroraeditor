import React, { useEffect } from "react"
import { useState, ChangeEvent } from "react"
import axios from 'axios'
import { useRef } from "react";
import { useImperativeHandle } from 'react';
import ReactFileReader from 'react-file-reader';


export default function ImportModal({ innerRef, children, Map, defaultShowModal, handleImportData }) {
    const [showModal, setShowModal] = useState((localStorage.getItem("showfpl") !== 'false'));

    const [content, setcontent] = useState("");
    const [typeOfFile, setTypeOfFile] = useState("");
    const [clear, setClear] = useState(true);

    useImperativeHandle(innerRef, () => ({
        OpenCloseModal() {
            setShowModal((showModal) ? false : true)
        }
    }));

    const handleShowModal = (value) => {
        //localStorage.setItem("showfpl", value)

        //handleSave(localStorage.getItem("content"), false)
        setShowModal(value)

        //localStorage.setItem("showfplmodal", 0);
    }

    const handleTypeOfFileChange = (e)=>{
        setTypeOfFile(e.target.value)
    }


    const handleSave = () => {
        //console.log("saveee", typeOfFile)
        
        handleImportData(content, typeOfFile, clear)
        
    }

    const handleFile = (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => { 
            const text = (e.target.result)
            setcontent(text)
        };
        reader.readAsText(e.target.files[0])

        const extension = e.target.files[0].name.split('.')[1]
        setTypeOfFile(extension)
    }




    return (
        <div>
            <a className="flex items-center hover:text-neutral-200 hover:bg-neutral-800 p-1 rounded-md transition" href="#" alt="Plano de voo detalhado" title="Plano de voo detalhado" onClick={()=> handleShowModal((showModal) ? false:true)}>
                {children}
            </a>
            {showModal ? (
                <div>
                    <div className="absolute my-2 w-10/12 md:w-3/4 lg:w-6/12 xl:w-5/12 2xl:w-4/12 right-5 top-20">
                        <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-neutral-900  outline-none focus:outline-none p-4 backdrop-blur bg-black/70">
                            <button onClick={() => handleShowModal(false)} type="button" className="absolute top-3 left-2.5 text-neutral-400 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-neutral-800 dark:hover:text-white" data-modal-toggle="crypto-modal">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>

                            <div className="rounded-t dark:border-neutral-600">
                                <h3 className="text-base font-semibold text-neutral-900 lg:text-xl dark:text-neutral-200 text-center">
                                    IMPORTAR
                                </h3>
                            </div>

                        <div>

                            <div className="p-2">
                                <input onChange={e => handleFile(e)} className="block p-2.5 w-full text-sm text-neutral-900 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-emerald-800 focus:border-emerald-800 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800" id="file_input" type="file"></input>
                            </div>
                            
                            <div className="p-2">
                                or insert text
                            </div>

                                <div className="p-2">
                                    <textarea
                                        id="content"
                                        rows="15"
                                        className="block p-2.5 w-full text-sm text-neutral-900 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-emerald-800 focus:border-emerald-800 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
                                        placeholder="Insert sectorfile data here..."
                                        defaultValue={content}
                                    />
                                </div>

                                

                                <div className="p-2">
                                    type of file
                                </div>
                                
                                <div className="p-2">
                                    <select 
                                        onChange={e => handleTypeOfFileChange(e)}
                                        id="typeOfFile" 
                                        className="block p-2.5 w-full text-sm text-neutral-900 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-emerald-800 focus:border-emerald-800 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
                                        value={typeOfFile}
                                    >
                                        <option value="">Choose a file type</option>
                                        <option value="vrt">VFR TRACK (.vrt)</option>
                                        <option value="vfi">VFR INFO POINT (.vfi)</option>
                                    </select>
                            </div>
                            
                            <div className="p-2">
                                <label className="inline-flex relative items-center mr-5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={clear}
                                        readOnly
                                    />
                                    <div
                                        onClick={() => {
                                            setClear(!clear);
                                        }}
                                        className="w-11 h-6 bg-neutral-700 rounded-full peer  peer-focus:ring-emerald-500  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"
                                    ></div>
                                    <span className="ml-2">
                                        Clear layer
                                    </span>
                                </label>
                            </div>

                                <div className="p-2"></div>

                                <div className="p-2 pb-6 relative h-auto w-full">
                                    <button id="save" onClick={()=>handleSave()} className="absolute right-2 p-0 px-2 w-auto text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-emerald-800 cursor-pointer hover:text-neutral-300 hover:border-emerald-800">IMPORTAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>

    );
}
