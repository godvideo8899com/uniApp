import {ref, onMounted, onUnmounted,unref,computed} from 'vue'
export const useFormatResult = (data,callBack) => {
    const formatData=computed(()=>{
        return callBack(unref(data))
    })
    return formatData
}