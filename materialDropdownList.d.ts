
/**
 * MaterialDropdownList class
 */
declare module "md-dropdownlist" {
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");
    import layoutBaseModule = require("ui/layouts/layout-base");
    import observable = require("data/observable");

    /**
     * Represents a UI MaterialDropdownList component.
     */
    export class MaterialDropdownList extends view.View {
        /**
         * Represents the observable property backing the items property.
         */
        public static itemsProperty: dependencyObservable.Property;

        /**
         * Represents the observable property backing the items template property.
         */
        public static itemsTemplateProperty: dependencyObservable.Property;

        /**
         * Represents the observable property backing the item separator color property.
         */
        public static itemSeparatorColorProperty: dependencyObservable.Property;

        /**
         * Represents the observable property backing the items row height property.
         */
        public static itemRowHeightProperty: dependencyObservable.Property;

        /**
         * Represents the selected item view property - this is the container the selected value will appear in.
         */
        public static selectedItemViewProperty: dependencyObservable.Property;

        /**
         * Represents the selected index property
         */
        public static selectedIndexProperty: dependencyObservable.Property;

        /**
         * String value used when hooking into indexChange event
         */
        public static indexChangeEvent: string;

        /**
         * Represents the observable property backing the icon text to use for the icon label.
         */
        public static iconTextProperty: dependencyObservable.Property;

        /**
         * Gets or set the items collection of the Dropdown.
         * The items property can be set to an array or an object defining length and getItem(index) method.
         */
        items: any;

        /**
         * Gets or set the selected item view. Default value is GridLayout with a label, a bottom line, and an icon on the right.
         */
        selectedItemView: layoutBaseModule.LayoutBase;

        /**
         * Gets or sets the template to use for each item in the select list
         */
        itemsTemplate: string | view.Template;

        /**
         * Gets or sets the separator color to use for each item in the select list
         */
        itemsSeparatorColor: any;

        /**
         * Gets or sets the row height to use for each item in the select list
         */
        itemsRowHeight: number;

        /**
         * Gets or sets the selected index
         */
        selectedIndex: number;

        /**
         * Gets or sets the text to put in the icon label
         */
        iconText: string;

        /**
         * Gets or sets the target view where the backdrop will be added
         */
        targetViewId: string;

        /**
         * Forces the Dropdown to reload all its items.
         */
        refresh();

        /**
         * A basic method signature to hook an event listener (shortcut alias to the addEventListener method).
         * @param eventNames - String corresponding to events (e.g. "propertyChange"). Optionally could be used more events separated by `,` (e.g. "propertyChange", "change").
         * @param callback - Callback function which will be executed when event is raised.
         * @param thisArg - An optional parameter which will be used as `this` context for callback execution.
         */
        on(eventNames: string, callback: (data: observable.EventData) => void, thisArg?: any);

        /**
         * Raised when the selected index changes.
         */
        on(event: "indexChange", callback: (args: ISelectedIndexChangeData) => void, thisArg?: any);
    }

    export interface ISelectedIndexChangeData extends observable.EventData {

        /**
         * Index of the item that was selected
         */
        index: number;
    }
}