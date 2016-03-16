import {Pipe} from 'angular2/core';

@Pipe({
  name: 'PhotographersFilter'
})

export class PhotographersFilter {
  transform(value, args) {
    let [text, nested] = args;

    if (!text) {
      return value;
    }

    var items:any = value;
    var newItems:any = [];

    if (!nested) {
      items.forEach(function (item:any) {
        if (item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
          newItems.push(item);
        }
      });
    }

    if (nested) {
      items.forEach(function (item:any) {
        let itemsName = newItems.map(function (newItem:any) {
          return newItem.name;
        });

        let index = null;

        if (itemsName.length) {
          if (itemsName.indexOf(item.name) !== -1) {
            index = itemsName.indexOf(item.name);
          }
        }

        item.photographers.forEach(function (photographer:any) {
          if (photographer.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
            if (index) {
              newItems[index].photographers.push(photographer);
              return;
            }

            newItems.push({
              name: item.name,
              photographers: [photographer]
            })
          }
        });
      });
    }

    return newItems;
  }
}
