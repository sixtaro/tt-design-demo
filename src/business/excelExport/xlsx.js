// import XLSX from 'xlsx-js-style';
import moment from 'moment';

const exportTable = async options => {
    // eslint-disable-next-line no-unused-vars
    const { data, headerData, sheetName, total } = options;
    const tableData = headerData ? data.map(item => {
        const record = {};
        headerData.forEach(header => {
            record[header.exportName] = item[header.colName];
            if (header.basicData) {
                const bd = header.basicData.find(b => String(b.key) === String(item[header.colName]));
                record[header.exportName] = bd ? bd.value : item[header.colName];
            }
        });
        return record;
    }) : data;
    const wscols = headerData.map(header => ({wpx: header.width}));
    // for (const item of data) {
    //     const row = [];
    //     for (const key in item) {
    //         row.push(item[key]);
    //     }
    //     tableData.push(row);
    // }

    const { default: XLSX } = await import('xlsx-js-style');

    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(tableData, { cellDates: true, origin: "A3" });
    const borderStyle = {style: 'thin', color: {rgb: "000000"}};
    const border = {top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle};
    ws['!cols'] = wscols;
    ws['!merges'] = [ XLSX.utils.decode_range(`A1:${XLSX.utils.encode_col(headerData.length - 1)}1`),XLSX.utils.decode_range(`A2:${XLSX.utils.encode_col(headerData.length - 1)}2`) ];
    Object.keys(ws).forEach(key => {
        if (ws[key].t) {
            ws[key].s = {
                border,
                font: {sz: 9}
            }
        }
    });
    ws["A1"] = {v: sheetName,t: 's', s: {border,fill: {fgColor: {rgb: "848484"}}, alignment: {horizontal: 'center'}, font: {sz: 12}}};
    ws["A2"] = {v: `导出时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`,t: 's', s: {border, fill: {fgColor: {rgb: "CAC6BC"}}, alignment: {horizontal: 'center'}, font: {sz: 10}}};
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // 导出文件
    XLSX.writeFile(wb, `${sheetName}_${moment().format('YYYYMMDDHHmmss')}.xlsx`);
};
export { exportTable };
