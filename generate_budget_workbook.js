const fs = require('fs');
const zlib = require('zlib');

const crcTable = new Uint32Array(256);
(function makeCrcTable() {
  let c;
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c >>> 0;
  }
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function deflateRaw(data) {
  return zlib.deflateRawSync(Buffer.from(data, 'utf8'));
}

function zipEntry(name, data) {
  const nameBuf = Buffer.from(name, 'utf8');
  const contentBuf = Buffer.from(data, 'utf8');
  const compressed = deflateRaw(contentBuf);
  const crc = crc32(contentBuf);
  const localHeader = Buffer.alloc(30);
  localHeader.writeUInt32LE(0x04034b50, 0);
  localHeader.writeUInt16LE(20, 4);
  localHeader.writeUInt16LE(0, 6);
  localHeader.writeUInt16LE(8, 8);
  localHeader.writeUInt16LE(0, 10);
  localHeader.writeUInt16LE(0, 12);
  localHeader.writeUInt32LE(crc, 14);
  localHeader.writeUInt32LE(compressed.length, 18);
  localHeader.writeUInt32LE(contentBuf.length, 22);
  localHeader.writeUInt16LE(nameBuf.length, 26);
  localHeader.writeUInt16LE(0, 28);

  const centralHeader = Buffer.alloc(46);
  centralHeader.writeUInt32LE(0x02014b50, 0);
  centralHeader.writeUInt16LE(20, 4);
  centralHeader.writeUInt16LE(20, 6);
  centralHeader.writeUInt16LE(0, 8);
  centralHeader.writeUInt16LE(8, 10);
  centralHeader.writeUInt16LE(0, 12);
  centralHeader.writeUInt16LE(0, 14);
  centralHeader.writeUInt16LE(0, 16);
  centralHeader.writeUInt16LE(0, 18);
  centralHeader.writeUInt32LE(crc, 20);
  centralHeader.writeUInt32LE(compressed.length, 24);
  centralHeader.writeUInt32LE(contentBuf.length, 28);
  centralHeader.writeUInt16LE(nameBuf.length, 32);
  centralHeader.writeUInt16LE(0, 34);
  centralHeader.writeUInt16LE(0, 36);
  centralHeader.writeUInt16LE(0, 38);
  centralHeader.writeUInt32LE(0, 40);
  centralHeader.writeUInt32LE(0, 42);

  return {
    nameBuf,
    localHeader,
    compressed,
    centralHeader,
    crc,
    uncompressedSize: contentBuf.length,
    compressedSize: compressed.length,
  };
}

function makeZip(entries) {
  const buffers = [];
  const centralBuffers = [];
  let offset = 0;
  entries.forEach(entry => {
    const lf = entry.localHeader;
    lf.writeUInt32LE(entry.crc, 14);
    lf.writeUInt32LE(entry.compressedSize, 18);
    lf.writeUInt32LE(entry.uncompressedSize, 22);
    buffers.push(lf, entry.nameBuf, entry.compressed);
    const ch = entry.centralHeader;
    ch.writeUInt32LE(offset, 42);
    buffers.push(ch, entry.nameBuf);
    centralBuffers.push(ch, entry.nameBuf);
    offset += lf.length + entry.nameBuf.length + entry.compressed.length;
  });

  const centralSize = centralBuffers.reduce((sum, b) => sum + b.length, 0);
  const centralOffset = offset;
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(centralOffset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...buffers, end]);
}

function makeInlineStringCell(value) {
  return `<is><t>${value}</t></is>`;
}

function makeCell(col, row, value, type = 'inlineStr') {
  const ref = `${col}${row}`;
  if (type === 'inlineStr') {
    return `<c r="${ref}" t="inlineStr"><is><t>${value}</t></is></c>`;
  }
  return `<c r="${ref}"><v>${value}</v></c>`;
}

function makeRow(rowNum, cells) {
  return `<row r="${rowNum}">${cells.join('')}</row>`;
}

function makeWorksheet(title, rows) {
  const sheetRows = rows.map((row, idx) => makeRow(idx + 1, row.map(cell => {
    if (cell === null || cell === undefined || cell === '') return '';
    if (typeof cell === 'number') {
      const col = String.fromCharCode(65 + row.indexOf(cell));
      return makeCell(col, idx + 1, cell, 'n');
    }
    const col = String.fromCharCode(65 + row.indexOf(cell));
    return makeCell(col, idx + 1, cell, 'inlineStr');
  }))).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${sheetRows}
  </sheetData>
</worksheet>`;
}

function makeWorksheetFromMatrix(matrix) {
  const rows = matrix.map((row, rowIndex) => {
    const cells = [];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const value = row[colIndex];
      if (value === null || value === undefined || value === '') continue;
      const col = String.fromCharCode(65 + colIndex);
      if (typeof value === 'number') {
        cells.push(`<c r="${col}${rowIndex+1}"><v>${value}</v></c>`);
      } else {
        const escaped = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        cells.push(`<c r="${col}${rowIndex+1}" t="inlineStr"><is><t>${escaped}</t></is></c>`);
      }
    }
    return `<row r="${rowIndex+1}">${cells.join('')}</row>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${rows.join('\n    ')}
  </sheetData>
</worksheet>`;
}

const januaryRows = [
  ['January Budget', '', '', 'Juan\'s Spending Record', '', '', '', ''],
  ['Income', 'Goal', 'Actual', '', 'Date', 'Source/Destination', 'Details', 'Amount', 'Income/Outgoing', 'Expense Category', 'Payment Method'],
  ['Job', 41000, 41000, '', '1/3', 'My Boss', 'paycheck', 41000, 'Income', 'Income Job', 'Cash'],
  ['Other', 0, 750, '', '1/3', 'Market', 'groceries', 1080, 'Outgoing', 'Groceries', 'Cash'],
  ['Total Income', 41000, 41750, '', '1/3', 'Bus', 'going to work', 100, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '1/3', 'Landlord', 'rent', 10500, 'Outgoing', 'Housing', 'Cash'],
  ['', '', '', '', '1/3', 'Utilities Office', 'pay water and electricity', 3474.18, 'Outgoing', 'Utilities', 'Cash'],
  ['', '', '', '', '1/3', 'Put in Safe Place', 'save money for tuition', 680, 'Outgoing', 'Tuition', 'Cash'],
  ['', '', '', '', '1/5', 'Bus', 'going to church', 100, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '1/5', 'The Church of Jesus Christ', 'tithing', 4100, 'Outgoing', 'Tithing', 'Cash'],
  ['', '', '', '', '1/5', 'The Church of Jesus Christ', 'fast offering', 300, 'Outgoing', 'Fast Offering', 'Cash'],
  ['', '', '', '', '1/6', 'Bus', 'going to work', 500, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '1/6', 'Street Vendor', 'lunch', 150, 'Outgoing', 'Other', 'Cash'],
  ['', '', '', '', '1/10', 'Market', 'groceries', 1600, 'Outgoing', 'Groceries', 'Cash'],
  ['', '', '', '', '1/11', 'Tax Office', 'pay taxes', 3933.31, 'Outgoing', 'Taxes', 'Cash'],
  ['', '', '', '', '1/11', 'Street Vendor', 'sweets', 150, 'Outgoing', 'Other', 'Cash'],
  ['', '', '', '', '1/12', 'Bus', 'going to church', 100, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '1/12', 'Friend', 'income for service provided', 750, 'Income', 'Other Income', 'Cash'],
  ['', '', '', '', '1/12', 'The Church of Jesus Christ', 'tithing', 75, 'Outgoing', 'Tithing', 'Cash'],
  ['', '', '', '', '1/13', 'Bus', 'going to work', 400, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '1/17', 'Market', 'groceries', 1470, 'Outgoing', 'Groceries', 'Cash'],
  ['', '', '', '', '1/18', 'Phone Place', 'cell phone bill', 3345.97, 'Outgoing', 'Cell Phone', 'Cash'],
  ['', '', '', '', '1/18', 'Wireless', 'internet for home', 5565.13, 'Outgoing', 'Internet', 'Cash'],
  ['', '', '', '', '1/18', 'Tailor', 'new pants', 1200, 'Outgoing', 'Other', 'Cash'],
  ['', '', '', '', '1/19', 'Bus', 'going to church', 100, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '1/20', 'Bus', 'going to work', 500, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '1/24', 'Market', 'groceries', 1050, 'Outgoing', 'Groceries', 'Cash'],
  ['', '', '', '', '1/25', 'Bus', 'going to movie', 100, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '1/25', 'Movie Theater', 'movie with friend', 370, 'Outgoing', 'Other', 'Cash'],
  ['', '', '', '', '1/26', 'Bus', 'going to church', 100, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '1/27', 'Bus', 'going to work', 400, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '1/28', 'Street Vendor', 'sweets', 200, 'Outgoing', 'Other', 'Cash'],
  ['', '', '', '', '1/28', 'Savings', 'emergency fund deposit', 181, 'Outgoing', 'Emergency Fund', 'Cash'],
  ['', '', '', '', '', '', '', '', '', '', ''],
  ['Expenses', 'Goal', 'Actual', '', '', '', '', '', '', '', ''],
  ['Tithing', 4100, 4175, '', '', '', '', '', '', '', ''],
  ['Fast Offering', 300, 300, '', '', '', '', '', '', '', ''],
  ['Taxes', 3933.31, 3933.31, '', '', '', '', '', '', '', ''],
  ['Tuition', 680, 680, '', '', '', '', '', '', '', ''],
  ['Housing', 10500, 10500, '', '', '', '', '', '', '', ''],
  ['Utilities', 3300, 3474.18, '', '', '', '', '', '', '', ''],
  ['Cell Phone', 3626.64, 3345.97, '', '', '', '', '', '', '', ''],
  ['Internet', 5400, 5565.13, '', '', '', '', '', '', '', ''],
  ['Transportation', 2500, 2300, '', '', '', '', '', '', '', ''],
  ['Groceries', 5000, 5200, '', '', '', '', '', '', '', ''],
  ['Other', 1500, 2070, '', '', '', '', '', '', '', ''],
  ['Emergency Fund', 160, 181, '', '', '', '', '', '', '', ''],
  ['Total Expenses', 40999.95, 32154.59, '', '', '', '', '', '', '', ''],
  ['Cash Flow Summary', '', '', '', '', '', '', '', '', '', ''],
  ['Total Income', 41000, 41750, '', '', '', '', '', '', '', ''],
  ['Total Expenses', 40999.95, 32154.59, '', '', '', '', '', '', '', ''],
  ['Monthly Cash Flow', 0.05, 9595.41, '', '', '', '', '', '', '', ''],
];

const februaryRows = [
  ['February Budget', '', '', 'February Spending Record', '', '', '', ''],
  ['Income', 'Goal', 'Actual', '', 'Date', 'Source/Destination', 'Details', 'Amount', 'Income/Outgoing', 'Expense Category', 'Payment Method'],
  ['Job', 41000, 41000, '', '', '', '', '', '', '', ''],
  ['Other', 0, 0, '', '', '', '', '', '', '', ''],
  ['Total Income', 41000, 41000, '', '2/1', 'Landlord', 'rent', 10500, 'Outgoing', 'Housing', 'Cash'],
  ['', '', '', '', '2/1', 'Utilities Store', 'utilities', 3611.39, 'Outgoing', 'Utilities', 'Cash'],
  ['', '', '', '', '2/3', 'The Church of Jesus Christ', 'tithing', 4100, 'Outgoing', 'Tithing', 'Cash'],
  ['', '', '', '', '2/3', 'The Church of Jesus Christ', 'fast offering', 300, 'Outgoing', 'Fast Offering', 'Cash'],
  ['', '', '', '', '2/4', 'Bus', 'going to work', 500, 'Outgoing', 'Transportation', 'Cash'],
  ['', '', '', '', '2/4', 'Market', 'groceries', 1293.75, 'Outgoing', 'Groceries', 'Cash'],
  ['', '', '', '', '', '', '', '', '', '', ''],
  ['Expenses', 'Goal', 'Actual', '', '', '', '', '', '', '', ''],
  ['Tithing', 4100, 4100, '', '', '', '', '', '', '', ''],
  ['Fast Offering', 300, 300, '', '', '', '', '', '', '', ''],
  ['Taxes', 3933.31, 0, '', '', '', '', '', '', '', ''],
  ['Tuition', 680, 0, '', '', '', '', '', '', '', ''],
  ['Housing', 10500, 10500, '', '', '', '', '', '', '', ''],
  ['Utilities', 3300, 3611.39, '', '', '', '', '', '', '', ''],
  ['Cell Phone', 3626.64, 0, '', '', '', '', '', '', '', ''],
  ['Internet', 5400, 0, '', '', '', '', '', '', '', ''],
  ['Transportation', 2500, 500, '', '', '', '', '', '', '', ''],
  ['Groceries', 5000, 1293.75, '', '', '', '', '', '', '', ''],
  ['Other', 1500, 0, '', '', '', '', '', '', '', ''],
  ['Emergency Fund', 500, 0, '', '', '', '', '', '', '', ''],
  ['Total Expenses', 40999.95, 16605.14, '', '', '', '', '', '', '', ''],
  ['Cash Flow Summary', '', '', '', '', '', '', '', '', '', ''],
  ['Total Income', 41000, 41000, '', '', '', '', '', '', '', ''],
  ['Total Expenses', 40999.95, 16605.14, '', '', '', '', '', '', '', ''],
  ['Monthly Cash Flow', 0.05, 24394.86, '', '', '', '', '', '', '', ''],
];

const januaryXml = makeWorksheetFromMatrix(januaryRows);
const februaryXml = makeWorksheetFromMatrix(februaryRows);

const contentTypes = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

const rels = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="/xl/workbook.xml"/>
</Relationships>`;

const workbookRels = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

const workbookXml = `<?xml version="1.0" encoding="UTF-8"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="January" sheetId="1" r:id="rId1"/>
    <sheet name="February" sheetId="2" r:id="rId2"/>
  </sheets>
</workbook>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"/>`;

const entries = [
  zipEntry('[Content_Types].xml', contentTypes),
  zipEntry('_rels/.rels', rels),
  zipEntry('xl/workbook.xml', workbookXml),
  zipEntry('xl/_rels/workbook.xml.rels', workbookRels),
  zipEntry('xl/worksheets/sheet1.xml', januaryXml),
  zipEntry('xl/worksheets/sheet2.xml', februaryXml),
  zipEntry('xl/styles.xml', stylesXml),
];

const xlsxData = makeZip(entries);
fs.writeFileSync('Juan_Budget_Case_Study.xlsx', xlsxData);
console.log('Created Juan_Budget_Case_Study.xlsx');
