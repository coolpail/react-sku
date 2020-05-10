import React from 'react'
import { handleClick, PropsSkuItem } from '../type/index'


// memo优化策略
function areEqual(prevProps: PropsSkuItem, nextProps: PropsSkuItem) {
    // console.log(nextProps.disableList)
    return (
        prevProps.activeStr === nextProps.activeStr &&
        // prevProps.activeNum === nextProps.activeNum &&
        prevProps.disableList.toString() === nextProps.disableList.toString()
    )
}

const SkuItem: React.FC<PropsSkuItem> = React.memo(({ el, fIndex, disableList, handleClick, activeStr }) => {
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
}, areEqual)

export default SkuItem
