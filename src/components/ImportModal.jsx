import React, { useEffect } from "react"
import { useState, ChangeEvent } from "react"
import axios from 'axios'
import { useRef } from "react";
import { useImperativeHandle } from 'react';
import ReactFileReader from 'react-file-reader';

export default function ImportModal({ innerRef, children, Map, defaultShowModal }) {
    const [showModal, setShowModal] = useState((localStorage.getItem("showfpl") !== 'false'));

    const [Content, setContent] = useState("");
    const [typeOfFile, setTypeOfFile] = useState("");


    useEffect(() => {
        
    })

    useImperativeHandle(innerRef, () => ({
        OpenCloseImport() {
            setShowModal((showModal) ? false : true)
        }
    }));

    const handleShowModal = (value) => {
        localStorage.setItem("showfpl", value)

        handleSave(localStorage.getItem("Content"), false)
        setShowModal(value)

        localStorage.setItem("showfplmodal", 0);
    }

    const handleTypeOfFileChange = (e)=>{
        setTypeOfFile(e.target.value)
    }


    const handleSave = (ContentString, reloadMap=true) => {
        console.log("saveee", typeOfFile)
    }

    const handleFile = (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => { 
            const text = (e.target.result)
            setContent(text)
        };
        reader.readAsText(e.target.files[0])

        const extension = e.target.files[0].name.split('.')[1]
        setTypeOfFile(extension)
    }




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

                                <div className="rounded-t dark:border-zinc-600">
                                    <h3 className="text-base font-semibold text-zinc-900 lg:text-xl dark:text-zinc-200 text-center">
                                        IMPORTAR
                                    </h3>
                                </div>

                                <div>

                                    <div className="p-2">
                                        <textarea
                                            id="content"
                                            rows="15"
                                            className="block p-2.5 w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-purple-800 focus:border-purple-800 dark:bg-zinc-800 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-purple-800 dark:focus:border-purple-800"
                                            placeholder="Insert sectorfile data here..."
                                            defaultValue={Content}
                                        />
                                    </div>

                                    <div className="p-2">
                                        or import a file
                                    </div>

                                    <div className="p-2">
                                        <input onChange={e=>handleFile(e)} className="block p-2.5 w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-purple-800 focus:border-purple-800 dark:bg-zinc-800 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-purple-800 dark:focus:border-purple-800" id="file_input" type="file"></input>
                                    </div>

                                    <div className="p-2">
                                        type of file
                                    </div>
                                    
                                    <div className="p-2">
                                        <select 
                                        onChange={e => handleTypeOfFileChange(e)}
                                        id="typeOfFile" 
                                        className="block p-2.5 w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-purple-800 focus:border-purple-800 dark:bg-zinc-800 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-purple-800 dark:focus:border-purple-800"
                                        >
                                            <option value="" selected={typeOfFile == ""}>Choose a file type</option>
                                            <option value="vrt" selected={typeOfFile == "vrt"}>VFR TRACK (.vrt)</option>
                                            <option value="vfi" selected={typeOfFile == "vfi"}>VFR INFO POINT (.vfi)</option>
                                        </select>
                                    </div>

                                    <div className="p-2">
                                        actions
                                    </div>

                                    <div className="p-2 pb-6 relative h-auto w-full">
                                        <button id="save" onClick={()=>handleSave(null)} className="absolute right-2 p-0 px-2 w-auto text-md font-semibold text-zinc-400 bg-zinc-900 rounded-md border-2 border-purple-800 cursor-pointer hover:text-zinc-300 hover:border-purple-800">SALVAR</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            ) : null}
        </div>

    );
}
