import { space } from 'postcss/lib/list'
import { LatitudeDMStoDec, LongitudeDMStoDec, MilesToDecimalDegrees } from './Convert'

export const GetCharacter = (char, referenceCoordinate, index, width, angle = 0, characterSpace, secondLine=false) => {
  var x = referenceCoordinate[1]
  var y = referenceCoordinate[0]

  var width = MilesToDecimalDegrees(width, y)
  var height = width

  x = x + (index * (width + MilesToDecimalDegrees(characterSpace, y)))

  if (secondLine) {
    y = y + height + (MilesToDecimalDegrees(characterSpace, y) * 2)
  }

  var coordinates = GetCharCoordinates(char, y, x, width, height)

  var finalCoordinates = []
  coordinates.forEach(coordinate => {
    finalCoordinates.push(RotatePoint(coordinate, referenceCoordinate, angle))
  })

  return finalCoordinates
}


export const GetLine = (
  referenceCoordinate,
  index,
  width,
  angle = 0,
  characterSpace,
  isTop = false,
  secondLine = false
) => {
  var x = referenceCoordinate[1];
  var y = referenceCoordinate[0];

  var width = MilesToDecimalDegrees(width, y);
  var space = MilesToDecimalDegrees(characterSpace, y);

  var totalWidth = (width + space) * index - space;

  if (secondLine) {
    y = y + width + MilesToDecimalDegrees(characterSpace, y) * 2;
  }

  var coordinates = [
    [y - space, x],
    [y - space, x + totalWidth],
  ];

  if (isTop) {
    coordinates = [
      [y + width + space, x],
      [y + width + space, x + totalWidth],
    ];
  }

  var finalCoordinates = [];
  coordinates.forEach((coordinate) => {
    finalCoordinates.push(RotatePoint(coordinate, referenceCoordinate, angle));
  });

  return finalCoordinates;
};


export const RotatePoint = (pointToRotate, centerPoint, angleInDegrees) => {
  var angleInRadians = angleInDegrees * (Math.PI / 180);
  var cosTheta = Math.cos(angleInRadians);
  var sinTheta = Math.sin(angleInRadians);

  var latitude = (sinTheta * (pointToRotate[1] - centerPoint[1]) +
    cosTheta * (pointToRotate[0] - centerPoint[0]) + centerPoint[0])
  
  var longitude = (cosTheta * (pointToRotate[1] - centerPoint[1]) -
    sinTheta * (pointToRotate[0] - centerPoint[0]) + centerPoint[1])
  
  return [latitude, longitude]
}

export const GetCharCoordinates = (char, y, x, width, height) => {
  var coordinates = []

  if (char == 'A') {
    coordinates = [
      [y, x],
      [y + (height / 2), x + (width / 4)],
      [y + (height / 2), x + ((width / 4) * 3)],
      [y + (height / 2), x + (width / 4)],
      [y + height, x + (width / 2)],
      [y, x + width],
    ]
    return coordinates
  }

  if (char == 'B') {
    coordinates = [
      [y, x],
      [y + height, x],
      [y + height, x + (width * 3 / 4)],
      [y + (height * 3 / 4), x + width],
      [y + (height / 2), x + (width * 3 / 4)],
      [y + (height / 2), x],
      [y + (height / 2), x + (width * 3 / 4)],
      [y + (height / 4), x + width],
      [y, x + (width * 3 / 4)],
      [y, x],
    ]
    return coordinates
  }

  if (char == 'C') {
    coordinates = [
      [y, x + width],
      [y, x + width / 4],
      [y + height / 4, x],
      [y + height * 3 / 4, x],
      [y + height, x + width / 4],
      [y + height, x + width],

    ]
    return coordinates
  }

  if (char == 'D') {
    coordinates = [
      [y, x],
      [y + height, x],
      [y + height, x + (width * 3 / 4)],
      [y + (height * 3 / 4), x + width],
      [y + (height / 4), x + width],
      [y, x + (width * 3 / 4)],
      [y, x],
    ]
    return coordinates
  }

  if (char == 'E') {
    coordinates = [
      [y, x + width],
      [y, x],
      [y + height / 2, x],
      [y + height / 2, x + width * 3 / 4],
      [y + height / 2, x],
      [y + height, x],
      [y + height, x + width],
    ]
    return coordinates
  }

  if (char == 'F') {
    coordinates = [
      [y, x],
      [y + height / 2, x],
      [y + height / 2, x + width * 3 / 4],
      [y + height / 2, x],
      [y + height, x],
      [y + height, x + width],

    ]
    return coordinates
  }

  if (char == 'G') {
    coordinates = [
      [y + height / 2, x + width * 3 / 4],
      [y + height / 2, x + width],
      [y + height / 3, x + width],
      [y, x + width * 3 / 4],
      [y, x + width / 4],
      [y + height / 4, x],
      [y + height * 3 / 4, x],
      [y + height, x + width / 4],
      [y + height, x + width * 3 / 4],
      [y + height * 3 / 4, x + width],
    ]
    return coordinates
  }

  if (char == 'H') {
    coordinates = [
      [y, x],
      [y + height, x],
      [y + height / 2, x],
      [y + height / 2, x + width],
      [y + height, x + width],
      [y, x + width],
    ]
    return coordinates
  }

  if (char == 'I') {
    coordinates = [
      [y, x + width / 4],
      [y, x + width * 3 / 4],
      [y, x + width / 2],
      [y + height, x + width / 2],
      [y + height, x + width / 4],
      [y + height, x + width * 3 / 4],
    ]
    return coordinates
  }

  if (char == 'J') {
    coordinates = [
      [y + height / 4, x],
      [y, x],
      [y, x + width * 3 / 4],
      [y + height / 4, x + width],
      [y + height, x + width],
      [y + height, x + width * 3 / 4],
    ]
    return coordinates
  }

  if (char == 'K') {
    coordinates = [
      [y, x],
      [y + height, x],
      [y + height / 2, x],
      [y + height, x + width],
      [y + height / 2, x],
      [y, x + width],
    ]
    return coordinates
  }

  if (char == 'L') {
    coordinates = [
      [y + height, x],
      [y, x],
      [y, x + width],
      [y + height / 3, x + width],
    ]
    return coordinates
  }

  if (char == 'M') {
    coordinates = [
      [y, x],
      [y + height, x],
      [y + height / 2, x + width / 2],
      [y + height, x + width],
      [y, x + width],
    ]
    return coordinates
  }

  if (char == 'N') {
    coordinates = [
      [y, x],
      [y + height, x],
      [y, x + width],
      [y + height, x + width],
    ]
    return coordinates
  }

  if (char == 'O') {
    coordinates = [
      [y + height * 3 / 4, x + width],
      [y + height / 3, x + width],
      [y, x + width * 3 / 4],
      [y, x + width / 4],
      [y + height / 4, x],
      [y + height * 3 / 4, x],
      [y + height, x + width / 4],
      [y + height, x + width * 3 / 4],
      [y + height * 3 / 4, x + width],
    ]
    return coordinates
  }

  if (char == 'P') {
    coordinates = [
      [y, x],
      [y + height, x],
      [y + height, x + (width * 3 / 4)],
      [y + (height * 3 / 4), x + width],
      [y + (height / 2), x + (width * 3 / 4)],
      [y + (height / 2), x],
    ]
    return coordinates
  }

  if (char == 'Q') {
    coordinates = [
      [y + height * 3 / 4, x + width],
      [y + height / 3, x + width],
      [y + height / 8, x + width * 7 / 8],
      [y + height / 4, x + width * 6 / 8],
      [y + height / 8, x + width * 7 / 8],
      [y, x + width],
      [y + height / 8, x + width * 7 / 8],
      [y, x + width * 3 / 4],
      [y, x + width / 4],
      [y + height / 4, x],
      [y + height * 3 / 4, x],
      [y + height, x + width / 4],
      [y + height, x + width * 3 / 4],
      [y + height * 3 / 4, x + width],
    ]
    return coordinates
  }

  if (char == 'R') {
    coordinates = [
      [y, x],
      [y + height, x],
      [y + height, x + (width * 3 / 4)],
      [y + (height * 3 / 4), x + width],
      [y + (height / 2), x + (width * 3 / 4)],
      [y + (height / 2), x],
      [y + (height / 2), x + (width * 3 / 4)],
      [y, x + width],
    ]
    return coordinates
  }

  if (char == 'S') {
    coordinates = [
      [y + height / 4, x],
      [y, x],
      [y, x + width],
      [y + height / 2, x + width],
      [y + height / 2, x],
      [y + height, x],
      [y + height, x + width],
      [y + height * 3 / 4, x + width],
    ]
    return coordinates
  }

  if (char == 'T') {
    coordinates = [
      [y, x + width / 2],
      [y + height, x + width / 2],
      [y + height, x],
      [y + height * 3 / 4, x],
      [y + height, x],
      [y + height, x + width / 2],
      [y + height, x + width],
      [y + height * 3 / 4, x + width],
    ]
    return coordinates
  }

  if (char == 'U') {
    coordinates = [
      [y + height, x],
      [y + height / 4, x],
      [y, x + width / 4],
      [y, x + width * 3 / 4],
      [y + height / 4, x + width],
      [y + height, x + width],
    ]
    return coordinates
  }

  if (char == 'W') {
    coordinates = [
      [y + height, x],
      [y, x + width / 4],
      [y + height / 2, x + width / 2],
      [y, x + width * 3 / 4],
      [y + height, x + width],
    ]
    return coordinates
  }

  if (char == 'V') {
    coordinates = [
      [y + height, x],
      [y, x + width / 2],
      [y + height, x + width],
    ]
    return coordinates
  }

  if (char == 'X') {
    coordinates = [
      [y, x],
      [y + height, x + width],
      [y + height / 2, x + width / 2],
      [y + height, x],
      [y, x + width],
    ]
    return coordinates
  }

  if (char == 'Y') {
    coordinates = [
      [y + height, x],
      [y + height / 2, x + width / 2],
      [y, x + width / 2],
      [y + height / 2, x + width / 2],
      [y + height, x + width],
    ]
    return coordinates
  }

  if (char == 'Z') {
    coordinates = [
      [y + height * 3 / 4, x],
      [y + height, x],
      [y + height, x + width],
      [y, x],
      [y, x + width],
      [y + height / 4, x + width],
    ]
    return coordinates
  }

  if (char == '0') {
    coordinates = [
      [y, x],
      [y + height, x],
      [y + height, x + width],
      [y, x + width],
      [y, x],
      [y + height, x + width],
    ]
    return coordinates
  }

  if (char == '1') {
    coordinates = [
      [y, x],
      [y, x + width],
      [y, x + width / 2],
      [y + height, x + width / 2],
      [y + height / 2, x],
    ]
    return coordinates
  }

  if (char == '2') {
    coordinates = [
      [y + height * 3 / 4, x],
      [y + height, x],
      [y + height, x + width],
      [y + height * 3 / 4, x + width],
      [y, x],
      [y, x + width],
      [y + height / 4, x + width],
    ]
    return coordinates
  }

  if (char == '3') {
    coordinates = [
      [y + height, x],
      [y + height, x + width],
      [y + height / 2, x + width],
      [y + height / 2, x + width / 2],
      [y + height / 2, x + width],
      [y, x + width],
      [y, x],
    ]
    return coordinates
  }

  if (char == '4') {
    coordinates = [
      [y, x],
      [y, x + width],
      [y, x + width / 2],
      [y + height, x + width / 2],
      [y + height / 4, x],
      [y + height / 4, x + width],
    ]
    return coordinates
  }

  if (char == '5') {
    coordinates = [
      [y + height, x + width],
      [y + height, x],
      [y + height / 2, x],
      [y + height / 2, x + width],
      [y, x + width],
      [y, x],
    ]
    return coordinates
  }

  if (char == '6') {
    coordinates = [
      [y + height, x + width],
      [y + height / 2, x],
      [y, x],
      [y, x + width],
      [y + height / 2, x + width],
      [y + height / 2, x],
    ]
    return coordinates
  }

  if (char == '7') {
    coordinates = [
      [y, x],
      [y + height / 2, x + width / 2],
      [y + height / 2, x],
      [y + height / 2, x + width],
      [y + height / 2, x + width / 2],
      [y + height, x + width],
      [y + height, x],
    ]
    return coordinates
  }

  if (char == '8') {
    coordinates = [
      [y + height / 2, x + width],
      [y + height / 2, x],
      [y, x],
      [y, x + width],
      [y + height, x + width],
      [y + height, x],
      [y + height / 2, x],
    ]
    return coordinates
  }

  if (char == '9') {
    coordinates = [
      [y, x + width / 2],
      [y + height / 2, x + width],
      [y + height, x + width],
      [y + height, x],
      [y + height / 2, x],
      [y + height / 2, x + width],
    ]
    return coordinates
  }

  if (char == '°') {
    var elev = height * 3 / 4;
    width = width / 4;
    height = height / 4;
    coordinates = [
      [y + elev + height * 3 / 4, x + width],
      [y + elev + height / 3, x + width],
      [y + elev, x + width * 3 / 4],
      [y + elev, x + width / 4],
      [y + elev + height / 4, x],
      [y + elev + height * 3 / 4, x],
      [y + elev + height, x + width / 4],
      [y + elev + height, x + width * 3 / 4],
      [y + elev + height * 3 / 4, x + width],
    ]
    return coordinates
  }

  if (char == '+') {
    coordinates = [
      [y + height / 2, x],
      [y + height / 2, x + width],
      [y + height / 2, x + width / 2],
      [y + height, x + width / 2],
      [y, x + width / 2],
    ]
    return coordinates
  }

  if (char == '-') {
    coordinates = [
      [y + height / 2, x],
      [y + height / 2, x + width],
    ]
    return coordinates
  }

  if (char == '>') {
    coordinates = [
      [y + height / 4, x + width / 2],
      [y + height / 2, x + width],
      [y + height / 2, x],
      [y + height / 2, x + width],
      [y + height * 3 / 4, x + width / 2],
    ]
    return coordinates
  }

  if (char == '<') {
    coordinates = [
      [y + height / 4, x + width / 2],
      [y + height / 2, x],
      [y + height / 2, x + width],
      [y + height / 2, x],
      [y + height * 3 / 4, x + width / 2],
    ]
    return coordinates
  }

  if (char == "_") {
    coordinates = [
      [0, 0],
      [0,0]
    ];
    return coordinates;
  }
}