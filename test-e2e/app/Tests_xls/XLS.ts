'use strict';

export class XLS {
  public static getDataFromXLS(cellId: string): string {
    let fileNamePath = ('/home/vs/Downloads/Translation_UI.xls');
    if (typeof require !== 'undefined') {
      XLS = require('xlsjs');
    }
    let workbook = XLS.readFile(fileNamePath);
    let sheetNumberlist = workbook.SheetNames;
    return workbook.Sheets[sheetNumberlist['1']][cellId].v;
  };
}












