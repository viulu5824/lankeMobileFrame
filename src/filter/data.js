
import Vue from "vue";
import { cloneDeep } from "lodash-es";
//列表转树结构过滤器
Vue.filter("list2tree", function (listData = [], {
    topLabelName = "name",
    topParentName = "parent",
    topIdName = "id",
    topCustomFieldArr = [],
    remainLength = 0,
    rootParentFilter = "!e.parent",
    childFilter = "false",
    listName = "childList",
    hasChildEmptyArr = true
} = {}, {
    childLabelName = "name",
    childParentName = "parent",
    childIdName = "id",
    childCustomDataArr = [],
} = {}) {
    listData = cloneDeep(listData)
    let TreeData = [];
    //先筛选一次list,将最高级数据放入TreeData
    listData.filter(e => {
        if (eval(rootParentFilter)) {
            let customData = {};
            let obj = {
                ...(topCustomFieldArr.reduce((prev, cur) => {
                    return { [cur]: e[cur], ...prev };
                }, customData)),
                label: e[topLabelName],
                parent: e[topParentName],
                id: e[topIdName],
                children: []
            };
            //如果有根子级，直接放入
            e[listName] && e[listName].length > 0 && putChildList(obj, e[listName]);
            TreeData.push(obj);
            return false;
        }
    })
    //递归构成树结构
    function toTree(data) {
        data.forEach((dataItem, i) => {
            listData.filter(item => {
                if (dataItem[topIdName] === item[topParentName]) {
                    if (eval(childFilter)) {
                        return false;
                    }
                    let customData = {};
                    let obj = {
                        ...(topCustomFieldArr.reduce((prev, cur) => {
                            return { [cur]: item[cur], ...prev };
                        }, customData)),
                        label: item[topLabelName],
                        parent: item[topParentName],
                        id: item[topIdName],
                        children: []
                    };
                    //如果有根子级，直接放入
                    item[listName] && item[listName].length > 0 && putChildList(obj, item[listName]);
                    cloneDeep(obj, item);
                    dataItem.children.push(obj);
                    return false;
                }
            })
            //递归至剩余几项
            if (listData.length > remainLength) {
                toTree(data[i].children);
            }
        })
    }
    //根子级列表，直接放入
    function putChildList(parentObj = {}, childList = []) {
        childList.forEach((childItem) => {
            let customData = {};
            let cobj = {
                ...childCustomDataArr.reduce((prev, cur) => {
                    return { [cur]: childItem[cur], ...prev };
                }, customData),
                id: childItem[childIdName],
                parent: childItem[
                    childParentName
                ],
                label: childItem[childLabelName],
                children: []
            };
            parentObj.children.push(cobj);
        })
    }
    //所有children空数组变为undefined
    function clearNullArray(data = []) {
        data.forEach(e => {
            if (e.children.length < 1) {
                e.children = undefined;
            } else {
                clearNullArray(e.children);
            }
        })
    }
    toTree(TreeData), !hasChildEmptyArr && clearNullArray(TreeData);
    return TreeData;
});



