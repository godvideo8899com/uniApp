"use strict";const e=require("../../common/vendor.js");if(!Array){e.resolveComponent("uni-icons")()}Math;const l={__name:"abRadio",props:["list","modelValue"],emits:["update:modelValue"],setup(l,{emit:a}){const o=l,t=e.ref(o.modelValue);e.watch((()=>o.modelValue),(e=>{t.value=e}));return(o,u)=>({a:e.f(l.list,((l,o,u)=>({a:"1576bdf7-0-"+u,b:e.p({type:l.value===t.value?"circle-filled":"circle",color:"",size:"18"}),c:e.t(l.label||l.text),d:l.value===t.value?1:"",e:e.o((e=>(e=>{t.value=e.value,a("update:modelValue",e.value)})(l)))})))})}},a=e._export_sfc(l,[["__scopeId","data-v-1576bdf7"]]);wx.createComponent(a);
