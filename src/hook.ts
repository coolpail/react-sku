import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { promiseFn, keyItem, skuType, resultItem, cashResult } from './type/index';
import getPriceAndCount from './tool';

export const useRequest = (fns: Promise<any>[], dependencies: any[], defaultValue: any) => {
    const [data, setData] = useState(defaultValue);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const request = () => {
        let cancel = false;
        setLoading(true);
        !cancel &&
            Promise.all(fns)
                .then(res => {
                    setData(res);
                })
                .catch(() => {
                    setError(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        return () => {
            cancel = true;
        };
    };
    useEffect(() => {
        const cancelRequest = request();
        return () => {
            cancelRequest();
        };
    }, dependencies);
    return {
        data,
        setData,
        loading,
        error,
        request,
    };
};

export function useWithLoading(fn: (...arg: any[]) => Promise<any>) {
    const [loading, setLoading] = useState(false);
    const func = (...args: any[]) => {
        setLoading(true);
        return fn(...args).finally(() => {
            setLoading(false);
        });
    };
    return { func, loading };
}

export function useSku(skuList: string[], key: keyItem[], sku: skuType) {
    //只有一种sku
    const [onlySkuList, setOnlySkuList] = useState<string[]>([]);
    const [disableList, setDisableList] = useState<number[][]>([]);
    //每种情况的sku结果
    const [result, setResult] = useState<resultItem<number>>({} as any);
    //维护一份缓存的结果结合
    const [cashResult, setCashResult] = useState<cashResult<number>>({} as any);
    //转成字符串用于正则匹配
    const skuStr = useMemo(() => skuList.join(';'), [skuList]);
    const handleDisableList = (skuList: string[], key: keyItem[]) => {
        let idx = -1;
        const num = skuList.filter((el, index) =>
            el !== (undefined || '[^;]*') ? true : ((idx = index), false)
        ).length;
        if (num === key.length - 1) {
            key[idx].item.forEach((i: string, y: number) => {
                let _pre = [...skuList];
                _pre[idx] = i;
                const res = getPriceAndCount(_pre.join(';'), sku, key.length);
                if (res.count === 0) {
                    let initDisableList = Array.from(key, (): number[] => []);
                    initDisableList[idx].push(y);
                    setDisableList([...initDisableList]);
                }
            });
        } else if (num === key.length) {
            let initDisableList = Array.from(key, (): number[] => []);
            key.forEach((el: keyItem, idx: number) => {
                el.item.forEach((i: string, y: number) => {
                    let _pre = [...skuList];
                    _pre[idx] = i;
                    const res = getPriceAndCount(_pre.join(';'), sku, key.length);
                    if (res.count === 0) {
                        if (!initDisableList[idx].includes(y)) {
                            initDisableList[idx].push(y);
                        }
                    }
                });
            });
            setDisableList([...initDisableList]);
        }
    };
    useEffect(() => {
        if (skuList.length && skuList.every(el => el !== '[^;]*')) {
            handleDisableList(skuList, key);
        }
        if (skuList.length) {
            let res: resultItem<number> = {} as any;
            if (cashResult[skuStr]) {
                res = cashResult[skuStr];
            } else {
                res = getPriceAndCount(skuStr, sku, key.length);
                if (res.skuStr) {
                    setOnlySkuList(res.skuStr);
                }
                cashResult[skuStr] = res;
                setCashResult({ ...cashResult });
            }
            setResult(res);
        }
    }, [skuList]);
    return { disableList, setDisableList, result, cashResult, onlySkuList };
}
