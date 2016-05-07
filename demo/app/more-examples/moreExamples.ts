import * as observable from 'data/observable';
import * as pages from 'ui/page';
import {View} from 'ui/core/view';

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    var page = <pages.Page>args.object;
    page.bindingContext = new observable.Observable({
        colors: ['red', 'blue', 'green', 'yellow', 'orange', 'brown', 'silver'],
        selectedColorIndex: 1,
        shapes: ['circle', 'oval', 'triangle', 'square', 'pentagon', 'hexagon', 'octagon'],
        selectedShapeIndex: 6
    });

    // page.bindingContext.set('selectedShape', page.bindingContext.get('shapes')[6]);

    (<observable.Observable>page.bindingContext).addEventListener(observable.Observable.propertyChangeEvent,
        (pcd: observable.PropertyChangeData) => {
            // if (pcd.propertyName === 'selectedShapeIndex') {
            //     page.bindingContext.set('selectedShape', page.bindingContext.get('shapes')[pcd.value]);
            // }
        });
}

export function openModal(arg: observable.EventData) {
    let thisPage: pages.Page = <pages.Page>(<View>arg.object).page;
    thisPage.showModal('more-examples/exampleModal',
            {items: ['Ball', 'Basket', 'Sammich', 'Zebra']},
            (selectedItem) => {
                console.log(`selectedItem = ${selectedItem}`);
                thisPage.bindingContext.set('selectedItem', selectedItem);
            }
        );
}