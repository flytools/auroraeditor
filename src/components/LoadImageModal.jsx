import React from "react";
import { useState, ChangeEvent } from "react";
import { useImperativeHandle } from "react";
import LoadImagePng from "../images/load-image.png";
import { LatitudeDMStoDec, LongitudeDMStoDec } from "../helpers/Convert";

export default function LoadImageModal({
  innerRef,
  children,
  handleLoadImage,
}) {
  const [showModal, setShowModal] = React.useState(false);

  const [url, setUrl] = useState(
    "https://upnow-prod.ff45e40d1a1c8f7e7de4e976d0c9e555.r2.cloudflarestorage.com/tKkQi97RvlPrCUPYC1LOh9ERkDq2/ac6fa676-d61c-4479-b347-955a6be2502b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cdd12e35bbd220303957dc5603a4cc8e%2F20230828%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20230828T022939Z&X-Amz-Expires=43200&X-Amz-Signature=f0be63e21c1709ea40720943929110f63b73130f8841e74f08ce258b7ceffb69&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22SP.png%22"
  );
  const [opacity, setOpacity] = useState(0.5);
  const [latitudeN, setLatitudeN] = useState(-22.163667);
  const [latitudeS, setLatitudeS] = useState(-24.663667);
  const [longitudeE, setLongitudeE] = useState(-44.02);
  const [longitudeW, setLongitudeW] = useState(-48.02);

  const handleChangeUrl = (e) => {
    setUrl(e.target.value);
  };

  const handleChangeOpacity = (e) => {
    setOpacity(e.target.value);
  };

  const handleChangeLatitudeN = (e) => {
    var value = e.target.value;
    if (value.includes("N") || value.includes("S")) {
      value = LatitudeDMStoDec(value)
    }
    setLatitudeN(value);
  };
  const handleChangeLatitudeS = (e) => {
    var value = e.target.value;
    if (value.includes("N") || value.includes("S")) {
      value = LatitudeDMStoDec(value);
    }
    setLatitudeS(value);
  };

  const handleChangeLongitudeE = (e) => {
    var value = e.target.value;
    if (value.includes("E") || value.includes("W")) {
      value = LongitudeDMStoDec(value);
    }
    setLongitudeE(value);
  };

  const handleChangeLongitudeW = (e) => {
    var value = e.target.value;
    if (value.includes("E") || value.includes("W")) {
      value = LongitudeDMStoDec(value);
    }
    setLongitudeW(value);
    console.log(e.target.value)
  };

  useImperativeHandle(innerRef, () => ({
    OpenCloseModal(force = null) {
      if (force == null) {
        setShowModal(showModal ? false : true);
      } else {
        setShowModal(force);
      }
    },
  }));

  const handleClose = (e) => {
    setShowModal(false);
  };

  const handleAdd = (e) => {
    handleLoadImage({
      url: url,
      opacity: opacity,
      latitudeN: latitudeN,
      latitudeS: latitudeS,
      longitudeE: longitudeE,
      longitudeW: longitudeW,
    });
    //setShowModal(false);
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
                    LOAD IMAGE
                  </span>
                </div>

                <div className="flex-1 flex flex-col md:flex-row">
                  <div className="w-full flex-1 mx-1">
                    <div className="flex">
                      <span className="py-1 pr-2 text-neutral-500">
                        IMAGEURL:
                      </span>
                      <input
                        type="text"
                        onChange={(e) => handleChangeUrl(e)}
                        className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-emerald-800 focus:border-emerald-800 block w-full p-1 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
                        placeholder="Image Url"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="w-full flex-1 mx-1">
                    <div className="flex">
                      <span className="py-1 pr-2 text-neutral-500">
                        OPACITY:
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={(e) => handleChangeOpacity(e)}
                        className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-emerald-800 focus:border-emerald-800 block w-full p-1 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
                        placeholder="Opacity"
                        defaultValue={0.5}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row">
                  <div className="w-full flex-1 mx-1">
                    <p>
                      <small>
                        Use some image upload service to get a link, such as:{" "}
                        <a href="https://uploadnow.io/" target="_blanc">
                          https://uploadnow.io/
                        </a>
                      </small>
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row pt-5">
                  <div className="w-full flex-1 mx-1">
                    <div className="flex">
                      <span className="py-1 pr-2 text-neutral-500">LAT:</span>
                      <input
                        type="text"
                        onChange={(e) => handleChangeLatitudeN(e)}
                        className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-emerald-800 focus:border-emerald-800 block w-full p-1 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
                        placeholder="Latitude N"
                      />
                    </div>
                    <div className="flex">
                      <span className="py-1 pr-2 text-neutral-500">LNG:</span>
                      <input
                        type="text"
                        onChange={(e) => handleChangeLongitudeW(e)}
                        className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-emerald-800 focus:border-emerald-800 block w-full p-1 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
                        placeholder="Longitude W"
                      />
                    </div>
                  </div>

                  <div className="w-full flex-1 mx-1">
                    <div className="flex">
                      <img src={LoadImagePng} className="w-full h-auto"></img>
                    </div>
                  </div>

                  <div className="w-full flex-1 mx-1">
                    <div className="flex pt-24">
                      <span className="py-1 pr-2 text-neutral-500">LAT:</span>
                      <input
                        type="text"
                        onChange={(e) => handleChangeLatitudeS(e)}
                        className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-emerald-800 focus:border-emerald-800 block w-full p-1 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
                        placeholder="Latitude S"
                      />
                    </div>
                    <div className="flex">
                      <span className="py-1 pr-2 text-neutral-500">LNG:</span>
                      <input
                        type="text"
                        onChange={(e) => handleChangeLongitudeE(e)}
                        className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-emerald-800 focus:border-emerald-800 block w-full p-1 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
                        placeholder="Longitude E"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-2 pb-6 relative h-auto w-full">
                  <button
                    onClick={handleClose}
                    className="p-0 px-2 mr-2 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-neutral-800 cursor-pointer hover:text-neutral-300 hover:border-neutral-800"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleAdd}
                    className="p-0 px-2 text-md font-semibold text-neutral-400 bg-neutral-900 rounded-md border-2 border-emerald-800 cursor-pointer hover:text-neutral-300 hover:border-emerald-800"
                  >
                    ADD IMAGE
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
