"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var proxy = require("ui/core/proxy");
var dependencyObservable = require("ui/core/dependency-observable");
var layoutBaseModule = require("ui/layouts/layout-base");
var viewModule = require("ui/core/view");
var utils = require("utils/utils");
var listViewModule = require("ui/list-view");
var enums = require("ui/enums");
var platform = require("platform");
var gridLayout = require("ui/layouts/grid-layout");
var absoluteLayout = require("ui/layouts/absolute-layout");
var types = require("utils/types");
var labelModule = require("ui/label");
var observableArray = require("data/observable-array");
var weakEvents = require("ui/core/weak-event-listener");
var ITEM_VIEW = 'selectedItemView', ITEMS = 'items', ITEMS_TEMPLATE = 'itemsTemplate', ITEMS_SEP_COLOR = 'itemsSeparatorColor', ITEMS_ROW_HEIGHT = 'itemsRowHeight', SELECTED_INDEX = 'selectedIndex', MDL = 'materialDropdownList', LBL_VAL_ID = 'mdlSelectedValue', LBL_ICON_ID = 'mdlIcon', LBL_UNDERLINE_ID = 'mdlUnderline', OFFSET_ACTIONBAR_PROP = 'offsetActionBarHeight', ICON_TEXT_PROP = 'iconText', DEFAULT_ICON_TEXT = '\ue5c5', DEFAULT_SELECTED_VIEW_ID = 'mdlLayout', BACKDROP_ID = 'mdlBackdrop', PICKER_CLASS = 'mdl-pickerList', PICKER_WRAPPER_CLASS = 'mdl-pickerList-wrapper', SCREEN_WIDTH = platform.screen.mainScreen.widthDIPs, SCREEN_HEIGHT = platform.screen.mainScreen.heightDIPs, TARGET_VIEW_ID_PROP = 'targetViewId';
function onItemsPropertyChanged(data) {
    var mdl = data.object;
    mdl._onItemsPropertyChanged(data);
}
function onListItemsTemplatePropertyChanged(data) {
    var mdl = data.object;
    mdl._onListItemsTemplatePropertyChanged(data);
}
function onListItemsSeparatorPropertyChanged(data) {
    var mdl = data.object;
    mdl._onListItemsSeparatorColorPropertyChanged(data);
}
function onListItemsRowHeightPropertyChanged(data) {
    var mdl = data.object;
    mdl._onListItemsRowHeightPropertyChanged(data);
}
function onSelectedItemViewPropertyChanged(data) {
    var mdl = data.object;
    mdl._onSelectedItemTemplatePropertyChanged(data);
}
function onSelectedIndexPropertyChanged(data) {
    var mdl = data.object;
    mdl._onSelectedIndexPropertyChanged(data);
}
function onIconTextPropertyChanged(data) {
    var mdl = data.object;
    mdl._onIconTextPropertyChanged(data);
}
var knownTemplates;
(function (knownTemplates) {
    knownTemplates.itemsTemplate = ITEMS_TEMPLATE;
})(knownTemplates = exports.knownTemplates || (exports.knownTemplates = {}));
var MaterialDropdownList = (function (_super) {
    __extends(MaterialDropdownList, _super);
    function MaterialDropdownList() {
        _super.call(this);
        this._isDirty = false;
        var gv = new gridLayout.GridLayout();
        gv.id = DEFAULT_SELECTED_VIEW_ID;
        this.selectedItemView = gv;
        this.offsetActionBarHeight = false;
    }
    MaterialDropdownList.prototype.onLoaded = function () {
        if (this._isDirty) {
            this.refresh();
        }
        _super.prototype.onLoaded.call(this);
    };
    MaterialDropdownList.prototype.onUnloaded = function () {
        if (this._backdrop) {
            this._backdrop._removeView(this._listPicker);
            this._getTargetView()._removeView(this._backdrop);
            delete this._backdrop;
            delete this._listPicker;
        }
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(MaterialDropdownList.prototype, "selectedItemView", {
        get: function () {
            return this._getValue(MaterialDropdownList.selectedItemViewProperty);
        },
        set: function (value) {
            this._setValue(MaterialDropdownList.selectedItemViewProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDropdownList.prototype, "items", {
        get: function () {
            return this._getValue(MaterialDropdownList.itemsProperty);
        },
        set: function (value) {
            this._setValue(MaterialDropdownList.itemsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDropdownList.prototype, "itemsTemplate", {
        get: function () {
            return this._getValue(MaterialDropdownList.itemsTemplateProperty);
        },
        set: function (value) {
            this._setValue(MaterialDropdownList.itemsTemplateProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDropdownList.prototype, "itemsSeparatorColor", {
        get: function () {
            return this._getValue(MaterialDropdownList.itemsSeparatorColorProperty);
        },
        set: function (value) {
            this._setValue(MaterialDropdownList.itemsSeparatorColorProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDropdownList.prototype, "itemsRowHeight", {
        get: function () {
            return this._getValue(MaterialDropdownList.itemsRowHeightProperty);
        },
        set: function (value) {
            this._setValue(MaterialDropdownList.itemsRowHeightProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDropdownList.prototype, "selectedIndex", {
        get: function () {
            return this._getValue(MaterialDropdownList.selectedIndexProperty);
        },
        set: function (value) {
            this._setValue(MaterialDropdownList.selectedIndexProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDropdownList.prototype, "iconText", {
        get: function () {
            return this._getValue(MaterialDropdownList.iconTextProperty);
        },
        set: function (value) {
            this._setValue(MaterialDropdownList.iconTextProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDropdownList.prototype, "targetViewId", {
        get: function () {
            return this._getValue(MaterialDropdownList.targetViewIdProperty);
        },
        set: function (value) {
            this._setValue(MaterialDropdownList.targetViewIdProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialDropdownList.prototype, "offsetActionBarHeight", {
        get: function () {
            return this._getValue(MaterialDropdownList.offsetActionBarHeightProperty);
        },
        set: function (value) {
            this._setValue(MaterialDropdownList.offsetActionBarHeightProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    MaterialDropdownList.prototype._onItemsChanged = function (data) {
        if (this._listPicker) {
            this._listPicker.items = this.items;
            this._listPicker.refresh();
        }
        this._requestRefresh();
    };
    MaterialDropdownList.prototype._onItemsPropertyChanged = function (data) {
        if (data.oldValue instanceof observableArray.ObservableArray) {
            weakEvents.removeWeakEventListener(data.oldValue, observableArray.ObservableArray.changeEvent, this._onItemsChanged, this);
        }
        if (data.newValue instanceof observableArray.ObservableArray) {
            weakEvents.addWeakEventListener(data.newValue, observableArray.ObservableArray.changeEvent, this._onItemsChanged, this);
        }
        this._onItemsChanged();
    };
    MaterialDropdownList.prototype._onListItemsTemplatePropertyChanged = function (data) {
        if (this._listPicker) {
            this._listPicker.itemTemplate = data.newValue;
            this._listPicker.refresh();
        }
    };
    MaterialDropdownList.prototype._onListItemsSeparatorColorPropertyChanged = function (data) {
        if (this._listPicker) {
            this._listPicker.separatorColor = data.newValue;
            this._listPicker.refresh();
        }
    };
    MaterialDropdownList.prototype._onListItemsRowHeightPropertyChanged = function (data) {
        if (this._listPicker) {
            this._listPicker.rowHeight = data.newValue;
        }
    };
    MaterialDropdownList.prototype._onIconTextPropertyChanged = function (data) {
        if (this.selectedItemView.id === DEFAULT_SELECTED_VIEW_ID) {
            this.selectedItemView.getViewById(LBL_ICON_ID).text = data.newValue;
        }
    };
    MaterialDropdownList.prototype._onSelectedIndexPropertyChanged = function (data) {
        this._requestRefresh();
    };
    MaterialDropdownList.prototype._onSelectedItemTemplatePropertyChanged = function (pcd) {
        if (pcd.oldValue instanceof layoutBaseModule.LayoutBase) {
            pcd.oldValue.off('tap', this.expandList);
            this._removeView(pcd.oldValue);
        }
        if (pcd.newValue instanceof layoutBaseModule.LayoutBase) {
            pcd.newValue.on('tap', this.expandList, this);
            if (pcd.newValue.id === 'mdlLayout') {
                this._generateDefaultLayoutContent();
            }
            this._addView(pcd.newValue);
        }
        this._requestRefresh();
    };
    MaterialDropdownList.prototype._requestRefresh = function () {
        this._isDirty = true;
        if (this.isLoaded) {
            this.refresh();
        }
    };
    MaterialDropdownList.prototype.refresh = function () {
        if (types.isNullOrUndefined(this.items) || !types.isNumber(this.items.length)) {
            return;
        }
        if (this.selectedItemView.id === DEFAULT_SELECTED_VIEW_ID && types.isDefined(this.selectedIndex)) {
            this.selectedItemView.getViewById(LBL_VAL_ID).text =
                this._getDataItem(this._getValue(MaterialDropdownList.selectedIndexProperty));
        }
        this._isDirty = false;
    };
    MaterialDropdownList.prototype.expandList = function (arg) {
        var _this = this;
        var pageLocation = this.page.getLocationOnScreen(), srcLocation = this.selectedItemView.getLocationOnScreen(), pageSize = this.page.getActualSize(), selectedItemViewSize = this.selectedItemView.getActualSize(), x = srcLocation.x - pageLocation.x, y = srcLocation.y - pageLocation.y, actionBarHeight = this.page.actionBar.visibility === enums.Visibility.visible ?
            this.page.actionBar.getActualSize().height : 0;
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
            this._listPicker.on(listViewModule.ListView.itemTapEvent, function (arg) { return _this.onSelectionChange(arg.index); });
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
        this._listPicker.translateX = Math.max(x, 0);
        this._listPicker.translateY = Math.max(y - this.selectedItemView.getMeasuredHeight() + this._listPicker.borderWidth, 0);
        this._listPicker.width = Math.max(selectedItemViewSize.width, this._listPicker.minWidth);
        var totalX = this._listPicker.translateX + this._listPicker.width + (this._listPicker.borderWidth * 2), totalY = this._listPicker.translateY + this._listPicker.height + (this._listPicker.borderWidth * 2), maxX = Math.min(SCREEN_WIDTH, pageSize.width + pageLocation.x), maxY = Math.min(SCREEN_HEIGHT, pageSize.height + pageLocation.y);
        if (totalX > maxX) {
            this._listPicker.translateX = Math.max(0, this._listPicker.translateX - (totalX - maxX) - (this._listPicker.borderWidth * 2));
        }
        if (totalY > (maxY)) {
            this._listPicker.translateY = Math.max(0, this._listPicker.translateY - this._listPicker.height +
                selectedItemViewSize.height + (this._listPicker.borderWidth * 2));
        }
        this._listPicker.visibility = enums.Visibility.visible;
        this._listPicker.opacity = 0;
        this._listPicker.animate({
            opacity: 1,
            duration: 300
        });
    };
    MaterialDropdownList.prototype.onSelectionChange = function (idx) {
        var _this = this;
        setTimeout(function () {
            _this.selectedIndex = idx;
            _this.closeList();
        }, 80);
    };
    MaterialDropdownList.prototype.closeList = function () {
        var _this = this;
        this._listPicker.animate({
            opacity: 0,
            duration: 300
        }).then(function () {
            _this._backdrop.visibility = enums.Visibility.collapse;
            _this._listPicker.visibility = enums.Visibility.collapse;
        });
    };
    MaterialDropdownList.prototype._getTargetView = function () {
        if (types.isDefined(this.targetViewId)) {
            var target = this.page.getViewById(this.targetViewId);
            if (target) {
                return target;
            }
            else {
                console.log("MaterialDropdownList: Unable to find view \"" + this.targetViewId + "\"");
            }
        }
        return this.page;
    };
    MaterialDropdownList.prototype._getDataItem = function (index) {
        if (!types.isDefined(this.items)) {
            return '';
        }
        return this.items.getItem ? this.items.getItem(index) : this.items[index];
    };
    Object.defineProperty(MaterialDropdownList.prototype, "_childrenCount", {
        get: function () {
            var count = 0;
            if (this.selectedItemView) {
                count++;
            }
            return count;
        },
        enumerable: true,
        configurable: true
    });
    MaterialDropdownList.prototype._eachChildView = function (callback) {
        if (this.selectedItemView) {
            callback(this.selectedItemView);
        }
    };
    MaterialDropdownList.prototype.onLayout = function (left, top, right, bottom) {
        viewModule.View.layoutChild(this, this.selectedItemView, 0, 0, right - left, bottom - top);
    };
    MaterialDropdownList.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var result = viewModule.View.measureChild(this, this.selectedItemView, widthMeasureSpec, heightMeasureSpec);
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var widthAndState = viewModule.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = viewModule.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    MaterialDropdownList.prototype._generateDefaultLayoutContent = function () {
        var gl = this.selectedItemView, col1 = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.star), col2 = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto), row1 = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto), row2 = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto), lblValue = new labelModule.Label(), lblUnderline = new labelModule.Label(), lblIcon = new labelModule.Label();
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
    };
    MaterialDropdownList.itemsProperty = new dependencyObservable.Property(ITEMS, MDL, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onItemsPropertyChanged));
    MaterialDropdownList.itemsTemplateProperty = new dependencyObservable.Property(ITEMS_TEMPLATE, MDL, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onListItemsTemplatePropertyChanged));
    MaterialDropdownList.itemsSeparatorColorProperty = new dependencyObservable.Property(ITEMS_SEP_COLOR, MDL, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, onListItemsSeparatorPropertyChanged));
    MaterialDropdownList.itemsRowHeightProperty = new dependencyObservable.Property(ITEMS_ROW_HEIGHT, MDL, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, onListItemsRowHeightPropertyChanged));
    MaterialDropdownList.selectedItemViewProperty = new dependencyObservable.Property(ITEM_VIEW, MDL, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onSelectedItemViewPropertyChanged));
    MaterialDropdownList.selectedIndexProperty = new dependencyObservable.Property(SELECTED_INDEX, MDL, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onSelectedIndexPropertyChanged));
    MaterialDropdownList.iconTextProperty = new dependencyObservable.Property(ICON_TEXT_PROP, MDL, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onIconTextPropertyChanged));
    MaterialDropdownList.targetViewIdProperty = new dependencyObservable.Property(TARGET_VIEW_ID_PROP, MDL, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None));
    MaterialDropdownList.offsetActionBarHeightProperty = new dependencyObservable.Property(OFFSET_ACTIONBAR_PROP, MDL, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout));
    return MaterialDropdownList;
}(viewModule.CustomLayoutView));
exports.MaterialDropdownList = MaterialDropdownList;
//# sourceMappingURL=materialDropdownList.js.map