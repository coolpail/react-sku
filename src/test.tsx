import React, { useState, useRef, createContext, useContext, useCallback, useMemo, RefForwardingComponent, useImperativeHandle, forwardRef } from 'react';

interface MyInputHandles {
  focus(): void
}

const MyInput: RefForwardingComponent<MyInputHandles, {}> = (
  props,
  ref
) => {
  const inputRef =  useRef<HTMLInputElement>(null!)
  useImperativeHandle(ref, () => ({
    focus: () => {
      console.log(inputRef, 'inputRef')
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }))
//   console.log(inputRef)
  return <input {...props} ref={inputRef}/>
}
export default forwardRef(MyInput)
