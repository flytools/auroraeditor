import { latitudeDMStoDec, longitudeDMStoDec } from './Convert'

export default function ImportData(data, type) {
  if (type == 'vrt') {
    var lines = [];
    data.split('\n')
      .reduce((obj, line) => {
        if (line.includes(';')) {
          var cols = line.split(';');
          lines.push(cols);
        }
      }, {});

    var count = 0
    var elements = []
    for (const line of lines) {
      if ((elements.length == 0) || (lines[count][0] != lines[count - 1][0])) {
        elements.push({ label: line[0], coordinates: [[longitudeDMStoDec(line[2]), latitudeDMStoDec(line[1])]] })
      } else {
        elements[elements.length - 1].coordinates.push([longitudeDMStoDec(line[2]), latitudeDMStoDec(line[1])])
      }
      count++
    }

    return elements
  }

  if (type == 'vfi') {
    var lines = [];
    data.split('\n')
      .reduce((obj, line) => {
        if (line.includes(';')) {
          var cols = line.split(';');
          lines.push(cols);
        }
      }, {});

    var elements = []
    for (const line of lines) {
      elements.push({ label: line[0], description: line[1], coordinates: [latitudeDMStoDec(line[2]), longitudeDMStoDec(line[3])] })
    }

    return elements
  }

  return null
}
