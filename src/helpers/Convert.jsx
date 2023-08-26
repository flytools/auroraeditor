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


export const LatitudeDMStoDec = (latitude) => {
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

export const LongitudeDMStoDec = (latitude) => {
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

export const LatitudeDECtoDMS = (latitude) => {
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

export const LongitudeDECtoDMS = (longitude) => {
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

export const MilesToDecimalDegrees = (miles, latitude) => {
  return (miles * 1609.34) / (111.32 * 1000 * Math.cos(latitude * (Math.PI / 180)))
}

export const RotatePoint = (pointToRotate, centerPoint, angleInDegrees) => {
  var angleInRadians = angleInDegrees * (Math.PI / 180);
  var cosTheta = Math.cos(angleInRadians);
  var sinTheta = Math.sin(angleInRadians);

  var latitude = (sinTheta * (pointToRotate.Longitude - centerPoint.Longitude) +
    cosTheta * (pointToRotate.Latitude - centerPoint.Latitude) + centerPoint.Latitude)

  var longitude = (cosTheta * (pointToRotate.Longitude - centerPoint.Longitude) -
    sinTheta * (pointToRotate.Latitude - centerPoint.Latitude) + centerPoint.Longitude)

  return [latitude, longitude]
}



export const CalculateDistance = (lat1, lon1, lat2, lon2) => {
  var R = 6371000
  var dLat = toRadians(lat2 - lat1)
  var dLon = toRadians(lon2 - lon1)
  var lat1 = toRadians(lat1)
  var lat2 = toRadians(lat2)

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c
  return d * 0.000539957
}

export const CalculateDirection = (lat1, lon1, lat2, lon2, mag) => {
  var direction = 0

  lat1 = toRadians(lat1)
  lon1 = toRadians(lon1)
  lat2 = toRadians(lat2)
  lon2 = toRadians(lon2)

  var y = Math.sin(lon2 - lon1) * Math.cos(lat2)
  var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
  var brng = Math.atan2(y, x)
  brng = toDegrees(brng)
  direction = (brng + 360) % 360

  direction = direction - mag

  if (direction > 360) {
    direction = direction - 360
  }

  return direction
}

export const toRadians = (degrees) => {
  return degrees * Math.PI / 180
}

export const toDegrees = (radians) => {
  return radians * 180 / Math.PI
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1
  return Array(+(zero > 0 && zero)).join("0") + num
}