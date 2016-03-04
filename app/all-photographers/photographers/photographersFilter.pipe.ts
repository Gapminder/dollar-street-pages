import {Pipe} from 'angular2/core';

@Pipe({
  name: 'PhotographersFilter'
})

export class PhotographersFilter {
  transform(value, args) {
    let [text] = args;

    if (!text) {
      return value;
    }

    var items:any = value;
    var newItems:any = [];

    items.forEach(function (item:any) {
      let itemsName = newItems.map(function (newItem:any) {
        return newItem._id;
      });

      let index = null;

      if (itemsName.length) {
        if (itemsName.indexOf(item._id) !== -1) {
          index = itemsName.indexOf(item._id);
        }
      }

      if (item._id && item._id.indexOf(text) !== -1) {
        if (index) {
          newItems[index].push(item);
          return;
        }

        newItems.push(item)
      }

      if (item.name && item.name.indexOf(text) !== -1) {
        if (index) {
          newItems[index].push(item);
          return;
        }

        newItems.push(item)
      }
    });

    return newItems;
  }
}
