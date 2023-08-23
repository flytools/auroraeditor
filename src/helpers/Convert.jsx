export const DMStoDec = (coordinate) => {
  //N038.10.04.627;E024.33.34.904;
  var coord = [];

  var parts = coordinate.split(';');

  if (coordinate.includes('S') || coordinate.includes('N')) {
    for (var i = 0; i < 2; i++) {
      var direction = parts[i].substring(0, 1);
      var degrees = parseFloat(parts[i].substring(1, 4));
      var minutes = parseFloat(parts[i].substring(5, 7));
      var seconds = parseFloat(parts[i].substring(8, 14));
      var dd = degrees + minutes / 60 + seconds / (60 * 60);

      if (direction == "S" || direction == "W") {
        dd = dd * -1;
      }

      coord.push(dd);
    }
  } else {
    for (var i = 0; i < 2; i++) {
      var degrees = parseFloat(parts[i]);
      coord.push(degrees);
    }
  }

  return coord;
}


export const latitudeDMStoDec = (latitude) => {
  //N038.10.04.627

  var direction = latitude.substring(0, 1);
  var degrees = parseFloat(latitude.substring(1, 4));
  var minutes = parseFloat(latitude.substring(5, 7));
  var seconds = parseFloat(latitude.substring(8, 14));
  var dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  }

  return dd
}

export const longitudeDMStoDec = (latitude) => {
  //N038.10.04.627

  var direction = latitude.substring(0, 1);
  var degrees = parseFloat(latitude.substring(1, 4));
  var minutes = parseFloat(latitude.substring(5, 7));
  var seconds = parseFloat(latitude.substring(8, 14));
  var dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  }

  return dd
}



export const DECtoDMS = (coordinate) => {
  var coord = [];

  for(var i=0; i<2; i++){
      var d = Math.floor (coordinate[i]);
      var minfloat = (coordinate[i]-d)*60;
      var m = Math.floor(minfloat);
      var secfloat = (minfloat-m)*60;
      var s = Math.floor(secfloat);
      var ss = Math.floor((secfloat - s) *1000);
      // After rounding, the seconds might become 60. These two
      // if-tests are not necessary if no rounding is done.
      if(d<0){
          d = d*-1;
      }
      if (s==60) {
          m++;
          s=0;
      }
      if (m==60) {
          d++;
          m=0;
      }

      var prefix = "";
      if(i==0){
          prefix = (coordinate[i]<0)?"S":"N";
      }else{
          prefix = (coordinate[i]<0)?"W":"E";
      }

      coord += prefix + ("" + zeroPad(d, 3) + "." + zeroPad(m, 2) + "." + zeroPad(s, 2) + "." + zeroPad(ss, 3)) + ";";
  }

  return coord;
}

export const latitudeDECtoDMS = (latitude) => {
  var coord = [];

  var absDd = Math.abs(latitude);
  var deg = absDd | 0;
  var frac = absDd - deg;
  var min = (frac * 60) | 0;
  var sec0 = frac * 3600 - min * 60;
  // Round it to 2 decimal points.
  var sec = Math.floor(Math.round(sec0 * 100) / 100);

  var ss = Math.floor(((Math.round(sec0 * 100) / 100) - sec) *1000);

      var prefix = (latitude<0)?"S":"N";

      coord += prefix + ("" + zeroPad(deg, 3) + "." + zeroPad(min, 2) + "." + zeroPad(sec, 2) + "." + zeroPad(ss, 3));

  return coord;
}

export const longitudeDECtoDMS = (longitude) => {
  var coord = [];

  var absDd = Math.abs(longitude);
  var deg = absDd | 0;
  var frac = absDd - deg;
  var min = (frac * 60) | 0;
  var sec0 = frac * 3600 - min * 60;
  // Round it to 2 decimal points.
  var sec = Math.floor(Math.round(sec0 * 100) / 100);

  var ss = Math.floor(((Math.round(sec0 * 100) / 100) - sec) *1000);

      var prefix = (longitude<0)?"W":"E";

      coord += prefix + ("" + zeroPad(deg, 3) + "." + zeroPad(min, 2) + "." + zeroPad(sec, 2) + "." + zeroPad(ss, 3));

  return coord;
}