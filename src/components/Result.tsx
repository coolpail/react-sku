import React from 'react'
import { PropsResult } from '../type/index'


// memo优化策略
function areEqual(prevProps: PropsResult, nextProps: PropsResult) {
    return (
        prevProps.result === nextProps.result
    )
}

const Result: React.FC<PropsResult> = React.memo(({ result }) => {
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
}, areEqual)

export default Result
