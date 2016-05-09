import * as observable from 'data/observable';
import * as pages from 'ui/page';
import * as frame from 'ui/frame';

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    var page = <pages.Page>args.object;
    page.bindingContext = new observable.Observable({
        colors: ['red', 'blue', 'green', 'yellow', 'orange', 'brown', 'silver'],
        selectedColorIndex: 1,
        shapes: ['circle', 'oval', 'triangle', 'square', 'pentagon', 'hexagon', 'octagon'],
        selectedShapeIndex: 6,
        authors: [
            { name: 'Stephen King' },
            { name: 'Mark Twain' },
            { name: 'Nathan Lowell' },
            {name: 'Brandon Sanderson'},
        ],
        customDdlIcon: '\uE5C6',
        isLastDdlEnabled: true
    });

    page.bindingContext.set('selectedShape', page.bindingContext.get('shapes')[6]);

    (<observable.Observable>page.bindingContext).addEventListener(observable.Observable.propertyChangeEvent,
        (pcd: observable.PropertyChangeData) => {
            if (pcd.propertyName === 'selectedShapeIndex') {
                page.bindingContext.set('selectedShape', page.bindingContext.get('shapes')[pcd.value]);
            }
            if (pcd.propertyName === 'selectedAuthorIndex') {
                page.bindingContext.set('selectedAuthor', page.bindingContext.get('authors')[pcd.value]);
            }
        });
}

export function onColorIndexChange(arg: any) {
    console.log(`onColorIndexChange ${arg.index}`);
}

export function showMore() {
    frame.topmost().navigate('more-examples/moreExamples');
}
