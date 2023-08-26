import React from "react";
import { useState } from "react";
import { useImperativeHandle } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function ExportModal({
  innerRef,
  children,
  Map,
  defaultShowModal,
  handleExportData,
}) {
  const [showModal, setShowModal] = useState(false);

  const [content, setcontent] = useState("");
  const [typeOfFile, setTypeOfFile] = useState("");

  useImperativeHandle(innerRef, () => ({
    OpenCloseModal() {
      setShowModal(showModal ? false : true)
    }
  }))

  const handleShowModal = (value) => {
    setShowModal(value)
  }

  const handleTypeOfFileChange = (e) => {
    setTypeOfFile(e.target.value)
  }

  const handleSave = () => {
    setcontent(handleExportData(typeOfFile))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast("Copied to clipboard!");
  }

  return (
    <div>
      <a
        className="flex items-center hover:text-neutral-200 hover:bg-neutral-800 p-1 rounded-md transition"
        href="#"
        alt="Plano de voo detalhado"
        title="Plano de voo detalhado"
        onClick={() => handleShowModal(showModal ? false : true)}
      >
        {children}
      </a>
      {showModal ? (
        <div>
          <div className="absolute my-2 w-10/12 md:w-3/4 lg:w-6/12 xl:w-5/12 2xl:w-4/12 right-5 top-20">
            <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-neutral-900  outline-none focus:outline-none p-4 backdrop-blur bg-black/70">
              <button
                onClick={() => handleShowModal(false)}
                type="button"
                className="absolute top-3 left-2.5 text-neutral-400 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-neutral-800 dark:hover:text-white"
                data-modal-toggle="crypto-modal"
              >
                <svg
                  className="w-6 h-6"
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
                <span className="sr-only">Close modal</span>
              </button>

              <div className="rounded-t dark:border-neutral-600">
                <h3 className="text-base font-semibold text-neutral-900 lg:text-xl dark:text-neutral-200 text-center">
                  EXPORT
                </h3>
              </div>

              <div>
                <div className="p-2">type of file</div>

                <div className="p-2">
                  <select
                    onChange={(e) => handleTypeOfFileChange(e)}
                    id="typeOfFile"
                    className="block p-2.5 w-full text-sm text-neutral-900 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-emerald-800 focus:border-emerald-800 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
                    value={typeOfFile}
                  >
                    <option value="">Choose a file type</option>
                    <option value="vrt">VFR TRACK (.vrt)</option>
                    <option value="vfi">VFR INFO POINT (.vfi)</option>
                  </select>
                </div>
                <div className="p-2"></div>

                <div className="p-2 pb-12 relative h-auto w-full">
                  <button
                    id="save"
                    onClick={() => handleSave()}
                    className="absolute right-2 p-0 px-2 w-auto text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-emerald-800 cursor-pointer hover:text-neutral-300 hover:border-emerald-800"
                  >
                    EXPORT
                  </button>
                </div>

                <div className="p-2">
                  <textarea
                    id="content"
                    rows="15"
                    className="block p-2.5 w-full text-sm text-neutral-900 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-emerald-800 focus:border-emerald-800 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
                    placeholder="Result data here..."
                    defaultValue={content}
                  />
                </div>

                <div className="p-2 pb-6 relative h-auto w-full">
                  <button
                    id="copy"
                    onClick={() => handleCopy()}
                    className="absolute right-2 p-0 px-2 w-auto text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-neutral-800 cursor-pointer hover:text-neutral-300 hover:border-neutral-800"
                  >
                    COPY TO CLIPBOARD
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
