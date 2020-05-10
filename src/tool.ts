import { resultItem, Item, skuType, keyItem } from './type/index';

export default function getPriceAndCount(str: string, arr: skuType, keyNum: number) {
    let isFirstInit = false;
    const r = new RegExp(`^${str}$`);
    let result: resultItem<number> = {} as any;
    const firstData: resultItem<number> = {} as any;
    const _list: number[] = [];
    if (new Array(keyNum).fill('[^;]*').join(';')) {
        isFirstInit = true;
    }
    result = Object.keys(arr).reduce((p: resultItem<number>, c: string) => {
        if (r.test(c)) {
            if (isFirstInit && arr[c].count) {
                firstData.price = [arr[c].price];
                firstData.count = arr[c].count;
                firstData.skuStr = c.split(';');
            }
            p.count = (p.count || 0) + arr[c].count;
            const _p = arr[c].price || 0;
            _list.push(_p);
        }
        p.price = [Math.min.apply(null, _list), Math.max.apply(null, _list)];
        return p;
    }, {} as resultItem<number>);
    //所有的结果只有一种情况有数量
    if (isFirstInit && firstData.count === result.count) {
        return firstData;
    } else {
        return result;
    }
}
