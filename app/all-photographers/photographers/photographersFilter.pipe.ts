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
        if (item._id.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
          newItems.push(item);
        }
      });
    }

    if (nested) {
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

        item.photographers.forEach(function (photographer:any) {
          if (photographer.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
            if (index) {
              newItems[index].photographers.push(photographer);
              return;
            }

            newItems.push({
              _id: item._id,
              photographers: [photographer]
            })
          }
        });
      });
    }

    return newItems;
  }
}
