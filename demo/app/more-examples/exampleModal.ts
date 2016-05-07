import {Observable, PropertyChangeData} from "data/observable";
import {Page} from "ui/page";

var onClose: Function;
var thisPage: Page;

export function onShownModally(args: any) {
    thisPage = <Page>args.object;

    onClose = args.closeCallback;

    thisPage.bindingContext = new Observable({
        items: args.context.items,
        selectedItem: null
    });
}

export function onItemIndexChange(arg: any) {
    let items: string[] = thisPage.bindingContext.get('items'),
        selectedItem = items[arg.index];

    thisPage.bindingContext.set('selectedItem', selectedItem);
}

export function closeModal() {
    thisPage.closeModal();
}

export function saveItem() {
    onClose(thisPage.bindingContext.get('selectedItem'));
}