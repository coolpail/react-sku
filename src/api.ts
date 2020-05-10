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
    '白;32G;联通': { price: 117, count: 27 },
};

const _sku = {
    '黑;16G;电信': { price: 100, count: 0 },
    '黑;16G;移动': { price: 101, count: 11 },
    '黑;16G;联通': { price: 102, count: 0 },
    '黑;32G;电信': { price: 103, count: 0 },
    '黑;32G;移动': { price: 104, count: 0 },
    '黑;32G;联通': { price: 105, count: 0 },
    '金;16G;电信': { price: 106, count: 0 },
    '金;16G;移动': { price: 107, count: 0 },
    '金;16G;联通': { price: 108, count: 0 },
    '金;32G;电信': { price: 109, count: 0 },
    '金;32G;移动': { price: 110, count: 0 },
    '金;32G;联通': { price: 111, count: 0 },
    '白;16G;电信': { price: 112, count: 0 },
    '白;16G;移动': { price: 113, count: 0 },
    '白;16G;联通': { price: 114, count: 0 },
    '白;32G;电信': { price: 115, count: 0 },
    '白;32G;移动': { price: 116, count: 0 },
    '白;32G;联通': { price: 117, count: 0 },
};

const key = [
    { name: '颜色', item: ['黑', '金', '白'] },
    { name: '内存', item: ['16G', '32G'] },
    { name: '运营商', item: ['电信', '移动', '联通'] },
];

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const withDelay = (fn: (...params: any[]) => any) => async (...args: any[]) => {
    await delay(1000);
    return fn(...args);
};

export const getAllSku = withDelay(() => sku);

export const _getAllSku = withDelay(() => _sku);

export const getAllKey = withDelay(() => key);
