import React, { useState, useEffect } from 'react';
import { keyItem } from './type/index'
import './App.css';
import { getAllSku, getAllKey } from './api'
import { useRequest } from './hook'
import Result from './components/Result'
import SkuItem from './components/SkuItem'
import { useSku } from './hook'


export default function App() {
  //属性集合
  const [skuList, setSkuList] = useState<string[]>([])
  //服务端返回的sku key结果
  const { data: [sku, key], loading } = useRequest([getAllSku(), getAllKey()], [], [{}, []])
  //维护一份数量为零时的数组
  const { disableList, setDisableList, result, onlySkuList } = useSku(skuList, key, sku)
  useEffect(() => {
    setSkuList(onlySkuList)
  }, [onlySkuList])
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>, fIndex: number, sIndex: number) => {
    const val = e.currentTarget.innerText;
    skuList[fIndex] = val
    setSkuList([...skuList])
  }
  useEffect(() => {
    setSkuList(new Array(key.length).fill('[^;]*'))
    setDisableList(Array.from(key, () => []))
  }, [key])
  return (
    <div>
      {
        loading
          ? 'loading...'
          : <div>
            {
              key.map((el: keyItem, fIndex: number) => (
                <SkuItem
                  fIndex={fIndex}
                  el={el}
                  // activeNum={activeIdx[fIndex]}
                  activeStr={skuList[fIndex]}
                  handleClick={handleClick}
                  key={el.name}
                  disableList={disableList[fIndex]}
                />
              ))
            }
            <Result result={result} />
          </div>
      }
    </div>
  )
}
