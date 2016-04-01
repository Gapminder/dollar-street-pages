import {Pipe} from 'angular2/core';

@Pipe({
  name: 'SearchFilter'
})

export class SearchFilter {
  transform(value, args) {
    let [text, field, inside] = args;

    if (!text) {
      return value;
    }

    var items:any = value;
    var newItems:any = [];

    if (!inside) {
      items.forEach(function (item:any) {
        var fieldItem = item[field];

        if (!field) {
          fieldItem = item;
        }

        if (fieldItem.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
          newItems.push(item);
        }
      });
    }

    if (inside) {
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

        item.things.forEach(function (thing:any) {
          if (thing.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
            if (index) {
              newItems[index].things.push(thing);
              return;
            }

            newItems.push({
              _id: item._id,
              things: [thing]
            });
          }
        });
      });
    }

    return newItems;
  }
}
