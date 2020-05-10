# react-sku

基于 react-hook 实现的 sku 选择

## 前言

之前在项目中写过 sku 的选择需求；这次想用 react-hook+TypeScript 来写一下，体验一下感受

## 功能

1. 不同的属性选择后显示不同的价格和数量
2. 当 sku 数量为 0 时，该属性不可点击
3. 当只有一种 sku 有数量时怎么默认选中

## 写完的感受和收获

1. 用 react 写当业务逻辑写完后，还不算完事还需要优化一下是否有重复渲染

## 怎么写呢

服务端给我们数据基本是这样

```
const sku = {
    '黑;16G;电信': { price: 100, count: 10 },
    '黑;16G;移动': { price: 101, count: 11 },
    '黑;16G;联通': { price: 102, count: 0 },
    '黑;32G;电信': { price: 103, count: 13 },
    '黑;32G;移动': { price: 104, count: 14 },
    '黑;32G;联通': { price: 105, count: 0 },
    '金;16G;电信': { price: 106, count: 16 },
    '金;16G;移动': { price: 107, count: 17 },
    '金;16G;联通': { price: 108, count: 18 },
    '金;32G;电信': { price: 109, count: 0 },
    '金;32G;移动': { price: 110, count: 20 },
    '金;32G;联通': { price: 111, count: 21 },
    '白;16G;电信': { price: 112, count: 0 },
    '白;16G;移动': { price: 113, count: 23 },
    '白;16G;联通': { price: 114, count: 24 },
    '白;32G;电信': { price: 115, count: 0 },
    '白;32G;移动': { price: 116, count: 26 },
    '白;32G;联通': { price: 117, count: 27 }
};

const key = [
    { name: '颜色', item: ['黑', '金', '白'] },
    { name: '内存', item: ['16G', '32G'] },
    { name: '运营商', item: ['电信', '移动', '联通'] }
];
```

## 解决第一个功能点

1. 我会创建`skuList`,用来记录当前选中的属性值；

```
//属性集合
const [skuList, setSkuList] = useState<string[]>([])
```

2. 每当用户点击是更新`skuList`

```
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>, fIndex: number, sIndex: number) => {
    const val = e.currentTarget.innerText;
    skuList[fIndex] = val
    setSkuList([...skuList])
  }
```

3. 怎么去匹配取值，我这边用正则匹配，第二次去数据缓存中取。

```
//tool.ts
export default function getPriceAndCount(str: string, arr: skuType, keyNum: number) {
    const r = new RegExp(`^${str}$`);
    let result: resultItem<number> = {} as any;
    const _list: number[] = [];
    return Object.keys(arr).reduce((p: resultItem<number>, c: string) => {
        if (r.test(c)) {
            p.count = (p.count || 0) + arr[c].count;
            const _p = arr[c].price || 0;
            _list.push(_p);
        }
        p.price = [Math.min.apply(null, _list), Math.max.apply(null, _list)];
        return p;
    }, result);
}

//hook.ts
const [disableList, setDisableList] = useState<number[][]>([]);
useEffect(() => {
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
```

这样基本实现了点击属性返回 sku 的结果值

## 解决第二个功能点

1. 需要一份禁用的数组 list，

```
const [disableList, setDisableList] = useState<number[][]>([]);
```

2. 处理两种情况；例如我们有颜色，内存，运营商，3 个商品属性，当用户点了 2 个时，和 3 个时取计算数量为 0 的 sku，将其置为`disable`

```
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
                //注意初始化的位置
                let initDisableList = Array.from(key, (): number[] => []);
                initDisableList[idx].push(y);
                setDisableList([...initDisableList]);
            }
        });
    } else if (num === key.length) {
        //注意初始化的位置
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
}, [skuList]);

//template
return (
    <div>
        <p>{el.name}: </p>
        {
            el.item.map((i: string, sIndex: number) => (
                <span
                    className={`${activeStr === i ? 'item active' : 'item'} ${disableList.includes(sIndex) ? 'disable' : ''}`}
                    key={i}
                    onClick={(e) => handlItemClick(e, fIndex, sIndex)}
                >
                    {i}
                </span>
            ))
        }
    </div>
)
```

## 解决第三个功能点

1. 当且仅当第一次初始化时以及最后 result 的 count 与第一次 count 不为 0 时的值一样，那就说明后面一值在加 0，这就是我们要的结果，我们只要改造一下`getPriceAndCount`函数就可以了

```
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
            //新增
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
```

2. 拿到结果怎么利用呢？因为我有返回`firstData.skuStr`这个就是`skuList`我只要`setSkuList(firstData.skuStr)`就可以了。剩下就会自动默认选中以及禁用

## 最后就是函数组件的优化了

1. 针对`skuItem`组件

```
    const handlItemClick: handleClick = (e, fIndex, sIndex) => {
        if (disableList.includes(sIndex)) return
        handleClick(e, fIndex, sIndex)
    }
    return (
        <div>
            <p>{el.name}: </p>
            {
                el.item.map((i: string, sIndex: number) => (
                    <span
                        className={`${activeStr === i ? 'item active' : 'item'} ${disableList.includes(sIndex) ? 'disable' : ''}`}
                        key={i}
                        onClick={(e) => handlItemClick(e, fIndex, sIndex)}
                    >
                        {i}
                    </span>
                ))
            }
        </div>
    )
```

可以看到我这边主要变化的`activeStr`和`disableList`，所以可以通过`React.meno`处理避免不必要的 re-render

```
// memo优化策略
function areEqual(prevProps: PropsSkuItem, nextProps: PropsSkuItem) {
    // console.log(nextProps.disableList)
    return (
        prevProps.activeStr === nextProps.activeStr &&
        // prevProps.activeNum === nextProps.activeNum &&
        prevProps.disableList.toString() === nextProps.disableList.toString()
    )
}
```

2. 同理`Result`组件

```
    return (
        <div>
            <p>价格：
                {
                    result.price
                        ? (result.price[0] === result.price[1] || result.price.length === 1)
                            ? result.price[0]
                            : `${result.price[0]} - ${result.price[1]}`
                        : ''
                }
            </p>
            <p>数量： {result.count}</p>
        </div>
    )
```

可以看到我这边主要变化的`result`

```
// memo优化策略
function areEqual(prevProps: PropsResult, nextProps: PropsResult) {
    return (
        prevProps.result === nextProps.result
    )
}
```
