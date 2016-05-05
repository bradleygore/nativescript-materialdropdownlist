import definition = require("md-dropdownlist");
import proxy = require("ui/core/proxy");
import dependencyObservable = require("ui/core/dependency-observable");
import layoutBaseModule = require("ui/layouts/layout-base");
import viewModule = require("ui/core/view");
import * as pageModule from "ui/page";
import observable = require("data/observable");
import utils = require("utils/utils");
import listViewModule = require("ui/list-view");
import * as enums from "ui/enums";
import * as platform from "platform";
import * as gridLayout from "ui/layouts/grid-layout";
import * as absoluteLayout from "ui/layouts/absolute-layout";
import * as types from "utils/types";
import * as labelModule from "ui/label";
import * as observableArray from "data/observable-array";
import * as weakEvents from "ui/core/weak-event-listener";

const ITEM_VIEW: string = 'selectedItemView',
    ITEMS: string = 'items',
    ITEMS_TEMPLATE: string = 'itemsTemplate',
    ITEMS_SEP_COLOR: string = 'itemsSeparatorColor',
    ITEMS_ROW_HEIGHT: string = 'itemsRowHeight',
    SELECTED_INDEX: string = 'selectedIndex',
    MDL: string = 'materialDropdownList',
    LBL_VAL_ID: string = 'mdlSelectedValue',
    LBL_ICON_ID: string = 'mdlIcon',
    LBL_UNDERLINE_ID: string = 'mdlUnderline',
    OFFSET_ACTIONBAR_PROP: string = 'offsetActionBarHeight',
    ICON_TEXT_PROP: string = 'iconText',
    DEFAULT_ICON_TEXT: string = '\ue5c5',
    DEFAULT_SELECTED_VIEW_ID: string = 'mdlLayout',
    BACKDROP_ID: string = 'mdlBackdrop',
    PICKER_CLASS: string = 'mdl-pickerList',
    PICKER_WRAPPER_CLASS: string = 'mdl-pickerList-wrapper',
    SCREEN_WIDTH: number = platform.screen.mainScreen.widthDIPs,
    SCREEN_HEIGHT: number = platform.screen.mainScreen.heightDIPs,
    TARGET_VIEW_ID_PROP: string = 'targetViewId';

function onItemsPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var mdl = <MaterialDropdownList>data.object;
    mdl._onItemsPropertyChanged(data);
}

function onListItemsTemplatePropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var mdl = <MaterialDropdownList>data.object;
    mdl._onListItemsTemplatePropertyChanged(data);
}

function onListItemsSeparatorPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var mdl = <MaterialDropdownList>data.object;
    mdl._onListItemsSeparatorColorPropertyChanged(data);
}

function onListItemsRowHeightPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var mdl = <MaterialDropdownList>data.object;
    mdl._onListItemsRowHeightPropertyChanged(data);
}

function onSelectedItemViewPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var mdl = <MaterialDropdownList>data.object;
    mdl._onSelectedItemTemplatePropertyChanged(data);
}

function onSelectedIndexPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var mdl = <MaterialDropdownList>data.object;
    mdl._onSelectedIndexPropertyChanged(data);
}

function onIconTextPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var mdl = <MaterialDropdownList>data.object;
    mdl._onIconTextPropertyChanged(data);
}

export module knownTemplates {
    export var itemsTemplate = ITEMS_TEMPLATE;
}

export class MaterialDropdownList extends viewModule.CustomLayoutView implements definition.MaterialDropdownList {

    private _isDirty: boolean = false;
    private _backdrop: absoluteLayout.AbsoluteLayout;
    private _listPicker: listViewModule.ListView;
    private _targetViewId: string;

    public static itemsProperty = new dependencyObservable.Property(
        ITEMS,
        MDL,
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onItemsPropertyChanged
        )
    );

    public static itemsTemplateProperty = new dependencyObservable.Property(
        ITEMS_TEMPLATE,
        MDL,
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onListItemsTemplatePropertyChanged
        )
    );

    public static itemsSeparatorColorProperty = new dependencyObservable.Property(
        ITEMS_SEP_COLOR,
        MDL,
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.None,
            onListItemsSeparatorPropertyChanged
        )
    );

    public static itemsRowHeightProperty = new dependencyObservable.Property(
        ITEMS_ROW_HEIGHT,
        MDL,
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.None,
            onListItemsRowHeightPropertyChanged
        )
    );

    public static selectedItemViewProperty = new dependencyObservable.Property(
        ITEM_VIEW,
        MDL,
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onSelectedItemViewPropertyChanged
        )
    );

    public static selectedIndexProperty = new dependencyObservable.Property(
        SELECTED_INDEX,
        MDL,
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onSelectedIndexPropertyChanged
        )
    );

    public static iconTextProperty = new dependencyObservable.Property(
        ICON_TEXT_PROP,
        MDL,
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onIconTextPropertyChanged
        )
    );

    public static targetViewIdProperty = new dependencyObservable.Property(
        TARGET_VIEW_ID_PROP,
        MDL,
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.None
        )
    );

    public static offsetActionBarHeightProperty = new dependencyObservable.Property(
        OFFSET_ACTIONBAR_PROP,
        MDL,
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout
        )
    );

    constructor() {
        super();

        let gv: gridLayout.GridLayout = new gridLayout.GridLayout();
        gv.id = DEFAULT_SELECTED_VIEW_ID;
        this.selectedItemView = gv;
        this.offsetActionBarHeight = false;
    }

    public onLoaded() {
        if (this._isDirty) {
            this.refresh();
        }

        super.onLoaded();
    }

    public onUnloaded() {
        if (this._backdrop) {
            this._backdrop._removeView(this._listPicker);
            this._getTargetView()._removeView(this._backdrop);
            delete this._backdrop;
            delete this._listPicker;
        }

        super.onUnloaded();
    }

    get selectedItemView(): layoutBaseModule.LayoutBase {
        return this._getValue(MaterialDropdownList.selectedItemViewProperty);
    }
    set selectedItemView(value: layoutBaseModule.LayoutBase) {
        this._setValue(MaterialDropdownList.selectedItemViewProperty, value);
    }

    get items(): any {
        return this._getValue(MaterialDropdownList.itemsProperty);
    }
    set items(value: any) {
        this._setValue(MaterialDropdownList.itemsProperty, value);
    }

    get itemsTemplate(): string | viewModule.Template {
        return this._getValue(MaterialDropdownList.itemsTemplateProperty);
    }
    set itemsTemplate(value: string | viewModule.Template) {
        this._setValue(MaterialDropdownList.itemsTemplateProperty, value);
    }

    get itemsSeparatorColor(): any {
        return this._getValue(MaterialDropdownList.itemsSeparatorColorProperty);
    }
    set itemsSeparatorColor(value: any) {
        this._setValue(MaterialDropdownList.itemsSeparatorColorProperty, value);
    }

    get itemsRowHeight(): number {
        return this._getValue(MaterialDropdownList.itemsRowHeightProperty);
    }
    set itemsRowHeight(value: number) {
        this._setValue(MaterialDropdownList.itemsRowHeightProperty, value);
    }

    get selectedIndex(): number {
        return this._getValue(MaterialDropdownList.selectedIndexProperty);
    }
    set selectedIndex(value: number) {
        this._setValue(MaterialDropdownList.selectedIndexProperty, value);
    }

    get iconText() : string {
        return this._getValue(MaterialDropdownList.iconTextProperty);
    }
    set iconText(value : string) {
        this._setValue(MaterialDropdownList.iconTextProperty, value);
    }

    get targetViewId(): string {
        return this._getValue(MaterialDropdownList.targetViewIdProperty);
    }
    set targetViewId(value: string) {
        this._setValue(MaterialDropdownList.targetViewIdProperty, value);
    }

    get offsetActionBarHeight(): boolean {
        return this._getValue(MaterialDropdownList.offsetActionBarHeightProperty);
    }
    set offsetActionBarHeight(value: boolean) {
        this._setValue(MaterialDropdownList.offsetActionBarHeightProperty, value);
    }


    private _onItemsChanged(data: observable.EventData) {
        if (this._listPicker) {
            this._listPicker.items = this.items;
            this._listPicker.refresh();
        }
        this._requestRefresh();
    }

    _onItemsPropertyChanged(data: dependencyObservable.PropertyChangeData) {
        if (data.oldValue instanceof observableArray.ObservableArray) {
            weakEvents.removeWeakEventListener(data.oldValue, observableArray.ObservableArray.changeEvent, this._onItemsChanged, this);
        }

        if (data.newValue instanceof observableArray.ObservableArray) {
            weakEvents.addWeakEventListener(data.newValue, observableArray.ObservableArray.changeEvent, this._onItemsChanged, this);
        }

        this._requestRefresh();
    }

    _onListItemsTemplatePropertyChanged(data: dependencyObservable.PropertyChangeData) {
        if (this._listPicker) {
            this._listPicker.itemTemplate = data.newValue;
            this._listPicker.refresh();
        }
    }

    _onListItemsSeparatorColorPropertyChanged(data: dependencyObservable.PropertyChangeData) {
        if (this._listPicker) {
            this._listPicker.separatorColor = data.newValue;
            this._listPicker.refresh();
        }
    }

    _onListItemsRowHeightPropertyChanged(data: dependencyObservable.PropertyChangeData) {
        if (this._listPicker) {
            this._listPicker.rowHeight = data.newValue;
        }
    }

    _onIconTextPropertyChanged(data: dependencyObservable.PropertyChangeData) {
        if (this.selectedItemView.id === DEFAULT_SELECTED_VIEW_ID) {
            (<labelModule.Label>this.selectedItemView.getViewById(LBL_ICON_ID)).text = data.newValue;
        }
    }

    _onSelectedIndexPropertyChanged(data: dependencyObservable.PropertyChangeData) {
        this._requestRefresh();
    }

    _onSelectedItemTemplatePropertyChanged(pcd: dependencyObservable.PropertyChangeData) {
        if (pcd.oldValue instanceof layoutBaseModule.LayoutBase) {
            (<layoutBaseModule.LayoutBase>pcd.oldValue).off('tap', this.expandList);
            this._removeView((<layoutBaseModule.LayoutBase>pcd.oldValue));
        }

        if (pcd.newValue instanceof layoutBaseModule.LayoutBase) {
            (<layoutBaseModule.LayoutBase>pcd.newValue).on('tap', this.expandList, this);

            if (pcd.newValue.id === 'mdlLayout') {
                this._generateDefaultLayoutContent();
            }

            this._addView((<layoutBaseModule.LayoutBase>pcd.newValue));
        }

        this._requestRefresh();
    }

    private _requestRefresh() {
        this._isDirty = true;
        if (this.isLoaded) {
            this.refresh();
        }
    }

    public refresh() {
        if (types.isNullOrUndefined(this.items) || !types.isNumber(this.items.length)) {
            return;
        }

        if (this.selectedItemView.id === DEFAULT_SELECTED_VIEW_ID && types.isDefined(this.selectedIndex)) {
            (<labelModule.Label>this.selectedItemView.getViewById(LBL_VAL_ID)).text =
                this._getDataItem(this._getValue(MaterialDropdownList.selectedIndexProperty));
        }

        this._isDirty = false;
    }

    public expandList(arg: observable.EventData) {
        let pageLocation: { x: number, y: number } = (<any>this.page).getLocationOnScreen(),
            srcLocation: { x: number, y: number } = (<any>this.selectedItemView).getLocationOnScreen(),
            selectedItemViewSize = this.selectedItemView.getActualSize(),
            x: number = srcLocation.x - pageLocation.x,
            y: number = srcLocation.y - pageLocation.y,
            actionBarHeight: number = (<pageModule.Page>this.page).actionBar.visibility === enums.Visibility.visible ?
                (<pageModule.Page>this.page).actionBar.getActualSize().height : 0;

        if (this.offsetActionBarHeight) {
            y = y - actionBarHeight;
        }

        if (!types.isDefined(this._backdrop)) {
            this._backdrop = new absoluteLayout.AbsoluteLayout();
            this._backdrop.id = BACKDROP_ID;
            this._backdrop.visibility = enums.Visibility.collapse;
            this._backdrop.cssClass = 'mdl-backdrop';
            this._backdrop.on('tap', this.closeList, this);
            this._getTargetView()._addView(this._backdrop);
        }

        this._backdrop.height = this.page.height;
        this._backdrop.width = this.page.width;
        this._backdrop.visibility = enums.Visibility.visible;

        if (!this._listPicker) {
            this._listPicker = new listViewModule.ListView();
            this._listPicker.on(listViewModule.ListView.itemTapEvent,
                (arg: listViewModule.ItemEventData) => this.onSelectionChange(arg.index));
            this._listPicker.cssClass = PICKER_CLASS;
            this._listPicker.id = this.id + '_pickerList';

            if (types.isDefined(this.itemsRowHeight)) {
                this._listPicker.rowHeight = this.itemsRowHeight;
            }
            if (types.isDefined(this.itemsSeparatorColor)) {
                this._listPicker.separatorColor = this.itemsSeparatorColor;
            }

            this._backdrop.addChild(this._listPicker);

            this._listPicker.items = this.items;

            if (types.isDefined(this.itemsTemplate)) {
                this._listPicker.itemTemplate = this.itemsTemplate;
            }
        }

        if (types.isDefined(this.selectedIndex)) {
            this._listPicker.scrollToIndex(this.selectedIndex);
        }

        this._listPicker.translateX = x;
        this._listPicker.translateY =
            y - this.selectedItemView.getMeasuredHeight() - selectedItemViewSize.height +
                (this._listPicker.borderWidth * 2);
        this._listPicker.width = Math.max(selectedItemViewSize.width, this._listPicker.minWidth);

        //if wide enought to go off screen or if low enough to go off screen, handle
        let totalX: number = this._listPicker.translateX + this._listPicker.width,
            totalY: number = this._listPicker.translateY + this._listPicker.height;

        if (totalX > SCREEN_WIDTH) {
            this._listPicker.translateX = Math.max(
                0,
                this._listPicker.translateX - (totalX - SCREEN_WIDTH) - 2
            );
        }

        if (totalY > (SCREEN_HEIGHT - actionBarHeight)) {
            this._listPicker.translateY = Math.max(
                0,
                this._listPicker.translateY - this._listPicker.height +
                    selectedItemViewSize.height + (this._listPicker.borderWidth * 2)
            );
        }

        this._listPicker.visibility = enums.Visibility.visible;
        this._listPicker.opacity = 0;

        this._listPicker.animate({
            opacity: 1,
            duration: 300
        });
    }

    public onSelectionChange(idx) {
        setTimeout(() => {
            this.selectedIndex = idx;
            this.closeList();
        }, 80);
    }

    public closeList() {
        this._listPicker.animate({
            opacity: 0,
            duration: 300
        }).then(() => {
            this._backdrop.visibility = enums.Visibility.collapse;
            this._listPicker.visibility = enums.Visibility.collapse;
        });
    }

    private _getTargetView(): viewModule.View | pageModule.Page {
        if (types.isDefined(this.targetViewId)) {
            let target = this.page.getViewById(this.targetViewId);
            if (target) {
                return target;
            } else {
                console.log(`MaterialDropdownList: Unable to find view "${this.targetViewId}"`);
            }
        }

        return this.page;
    }

    private _getDataItem(index: number): any {
        if (!types.isDefined(this.items)) {
            return '';
        }

        return this.items.getItem ? this.items.getItem(index) : this.items[index];
    }


    get _childrenCount(): number {
        var count = 0;

        if (this.selectedItemView) {
            count++;
        }

        return count;
    }

    public _eachChildView(callback: (child: viewModule.View) => boolean) {
        if (this.selectedItemView) {
            callback(this.selectedItemView);
        }
    }

    public onLayout(left: number, top: number, right: number, bottom: number): void {
        viewModule.View.layoutChild(this, this.selectedItemView, 0, 0, right - left, bottom - top);
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        var result = viewModule.View.measureChild(this, this.selectedItemView, widthMeasureSpec, heightMeasureSpec);

        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);

        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);

        var widthAndState = viewModule.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = viewModule.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);

        this.setMeasuredDimension(widthAndState, heightAndState);
    }

    private _generateDefaultLayoutContent() {
        let gl: gridLayout.GridLayout = <gridLayout.GridLayout>this.selectedItemView,
            col1 = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.star),
            col2 = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto),
            row1 = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto),
            row2 = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto),
            lblValue = new labelModule.Label(),
            lblUnderline = new labelModule.Label(),
            lblIcon = new labelModule.Label();

        lblValue.id = LBL_VAL_ID;

        gl.cssClass = 'mdl-container';
        lblValue.cssClass = 'mdl-value';
        lblUnderline.id = LBL_UNDERLINE_ID;
        lblUnderline.cssClass = 'mdl-underline';
        lblIcon.id = LBL_ICON_ID;
        lblIcon.cssClass = 'mdl-icon';
        lblIcon.text = this.iconText || DEFAULT_ICON_TEXT;

        gl.addColumn(col1);
        gl.addColumn(col2);
        gl.addRow(row1);
        gl.addRow(row2);

        gl.addChild(lblValue);
        gl.addChild(lblUnderline);
        gl.addChild(lblIcon);

        gridLayout.GridLayout.setColumn(lblValue, 0);
        gridLayout.GridLayout.setRow(lblValue, 0);

        gridLayout.GridLayout.setRow(lblIcon, 0);
        gridLayout.GridLayout.setColumn(lblIcon, 1);

        gridLayout.GridLayout.setColumn(lblUnderline, 0);
        gridLayout.GridLayout.setRow(lblUnderline, 1);
        gridLayout.GridLayout.setColumnSpan(lblUnderline, 2);
    }
}