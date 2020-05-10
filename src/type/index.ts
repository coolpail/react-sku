export type resultItem<T> = {
    price: T[];
    count: T;
    skuStr?: string[];
};

export interface cashResult<T> {
    [str: string]: resultItem<T>;
}

export interface Item<T> {
    price: T;
    count: T;
}

export interface skuType {
    [key: string]: Item<number>;
}

export type keyItem = {
    name: string;
    item: string[];
};

export type promiseFn = (...args: any[]) => Promise<any>;

export interface PropsResult {
    result: resultItem<number>;
}
export type handleClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    fIndex: number,
    sIndex: number
) => void;

export interface PropsSkuItem {
    el: keyItem;
    fIndex: number;
    disableList: number[];
    handleClick: handleClick;
    activeStr: string;
}
