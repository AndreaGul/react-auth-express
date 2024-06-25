import { useState } from "react";

const useStorage = (initialValue, itemKey) => {

    const itemValue = localStorage.getItem(itemKey);
    if(itemValue === null){
        localStorage.setItem(itemKey, JSON.stringify(initialValue))
    }

    const [state, setState] = useState(itemValue === null ? initialValue : itemValue === 'undefined' ? undefined : JSON.parse(itemValue));

    const changeState = (payload) => {
        if(typeof payload === 'function'){
            setState(payload);
            setState(curr => {
                localStorage.setItem(itemKey, JSON.stringify(curr));
                return curr;
            })
        }else{
            const newState = payload;
            setState(newState);
            localStorage.setItem(itemKey, JSON.stringify(newState));
        }
    }

    return [state, changeState];

}

export default useStorage;