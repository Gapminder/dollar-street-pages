import { ContentfulCommon } from 'ng2-contentful';

// this will be the part of ng2-contentful tools
/**
 * Transforms response to usable form by resolving all includes objects
 * @param response
 * @param depth
 * @returns {T[]}
 */
export function transformResponse<T extends ContentfulCommon<any>>(response:any, depth:number = 1):T[] {
  let currentDepth = 0;

  // collect all includes
  let includes = {};
  for (let key in response.includes) {
    if (response.includes.hasOwnProperty(key)) {
      for (let item of response.includes[key]) {
        includes[item.sys.id] = item;
      }
    }
  }

  for (let item of response.items) {
    includes[item.sys.id] = item;
  }

  /**
   * Replace `sys` reference with full contentful's object for one item
   * @param item
   * @returns {ContentfulCommon<any>}
   */
  function extendObjectWithFields(item:ContentfulCommon<any>):ContentfulCommon<any> {
    if (item.hasOwnProperty('sys') && includes.hasOwnProperty(item.sys.id)) {
      item.fields = includes[item.sys.id].fields;
      item.sys = includes[item.sys.id].sys;
    }
    return item;
  }

  /**
   * Replace `sys` references with full contentful's objects for item's array
   * @param items
   * @returns {Array<ContentfulCommon<any>>}
   */
  function extendArrayWithFields(items:Array<ContentfulCommon<any>>):Array<ContentfulCommon<any>> {
    let replacedItems:Array<ContentfulCommon<any>> = [];
    for (let item of items) {
      replacedItems.push(extendObjectWithFields(item));
    }
    return replacedItems;
  }

  /**
   * Analyze the contentful object for relations with other objects and tries to resolve it
   * @param item
   * @returns {Array<ContentfulCommon<any>>}
   */
  function replaceInItem(item:ContentfulCommon<any>):Array<ContentfulCommon<any>> {
    let replacedItems:Array<ContentfulCommon<any>> = [];
    for (let key in item.fields) {
      if (item.fields.hasOwnProperty(key)) {
        let value = item.fields[key];
        if (value instanceof Array) {
          replacedItems.push(...extendArrayWithFields(value));
        }
        if (value instanceof Object && value.hasOwnProperty('sys')) {
          replacedItems.push(extendObjectWithFields(value));
        }
      }
    }
    return replacedItems;
  }

  function replaceInItems(items:Array<ContentfulCommon<any>>):void {
    currentDepth++;
    let replacedItems:Array<any> = [];
    for (let item of items) {
      replacedItems.push(...replaceInItem(item));
    }
    if (currentDepth < depth) {
      replaceInItems(replacedItems);
    }
  }

  replaceInItems(response.items);

  return response.items as T[];
}
