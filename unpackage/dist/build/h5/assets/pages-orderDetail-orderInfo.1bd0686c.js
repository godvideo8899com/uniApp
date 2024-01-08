import{ah as e,p as l,V as a,k as s,o as t,c as n,w as u,g as o,b as i,q as r,f as p,t as c,j as d,E as v,a as x,h as f,F as m,d as y,z as k,v as g,u as h,K as _,A as b,B as j}from"./index-3c887390.js";import{_ as F}from"./uni-card.7a3d1e16.js";import{o as w,c as M,v as C,x as I,r as B}from"./api.9f049f6d.js";import{_ as D,a as E}from"./uni-popup.0d9cc951.js";import{_ as A}from"./addRecords.0801ea21.js";import{_ as L}from"./abButton.826902bd.js";import"./abMiniButton.144f1757.js";import"./dayjs.min.8a7ab859.js";const N={__name:"orderInfo",setup(N){let P=e("orderId");const T=l({}),q=["正常辣","微辣","特辣"];w((async e=>{e.id&&(P=e.id);let l=await M({id:P});T.value=l[0];let a=await C({orderId:P||"dfs2345"});K.value=a}));const z=l(""),K=l([]);a((()=>{if(!s())try{document.getElementsByClassName("uni-page-head-btn")[0].style.display="none"}catch(e){}}));const O=l(null),R=async()=>{if(z.value)return O.value.open();let e=await I({orderId:P});console.log(e),z.value=e,O.value.open()},V=()=>{console.log(z.value),k({filePath:z.value,success:e=>{g({title:"保存成功",icon:"success",mask:!0}),O.value.close()},fail:e=>{console.log(e),h({title:"失败",content:e.errMsg,showCancel:!0,success:({confirm:e,cancel:l})=>{}}),O.value.close()}})};return(e,l)=>{const a=_("abEmpty"),k=B(b("uni-card"),F),g=j,h=B(b("uni-popup-dialog"),D),w=B(b("uni-popup"),E),M=o;return t(),n(M,null,{default:u((()=>[!T.value.isFinish&&T.value.takeMeal?(t(),i("div",{key:0,class:"px-[12px] pt-[12px] text-center"},[r("p",null,[p(" 订单正在准备中，您的取餐号是:"),r("span",{class:"text-text3 text-16 font-bold"},c(T.value.takeMeal),1)])])):d("",!0),v(s)()?(t(),i("div",{key:1,class:"p-[12px] px-[16px]"},[x(L,{icon:"link",onClick:R},{default:u((()=>[p("为此订单生成网址二维码")])),_:1})])):d("",!0),x(k,null,{default:u((()=>{var e,l;return[r("div",{class:"text-12"},[r("div",{class:"grid grid-cols-2"},[r("span",null,"订单名："+c(T.value.orderName),1),r("span",null,[p("订单状态："),r("span",{class:f(T.value.isFinish?"text-text5":"text-text3")},c(T.value.isFinish?"已完成":"未完成"),3)]),r("span",null,"口味："+c(q[T.value.taste-1]),1),T.value.desk?(t(),i("span",{key:0},"桌位："+c(T.value.desk),1)):d("",!0),r("span",null,"是否打包："+c(T.value.isPack?"打包":"未打包"),1),r("span",null,"是否有加菜："+c(T.value.isAddMenu?"有":"无"),1),r("span",null,"下单方式："+c(T.value.userOperation?"客户自助":"管理员"),1),r("span",null,[p("订单金额："),r("span",{class:"text-text3 text-14"},c(null==(e=T.value.totalMoney)?void 0:e.toFixed(2)),1)]),T.value.isFinish?(t(),i("span",{key:1},[p("实收金额："),r("span",{class:"text-text3 text-14"},c((T.value.actualMoney||T.value.totalMoney).toFixed(2)),1)])):d("",!0),r("span",null,"商品总数："+c(T.value.totalCount),1)]),r("p",null,"订单ID："+c(T.value.id),1),r("p",null,"创建时间："+c(T.value.showTime),1),r("p",{class:"text-16 text-center my-[12px]"},"商品明细清单"),(null==(l=T.value.orderDetail)?void 0:l.length)?(t(),i("div",{key:0},[r("ul",null,[r("li",{class:"grid grid-cols-4 text-center py-[4px] font-bold"},[r("span",null,"名称"),r("span",null,"单价"),r("span",null,"数量"),r("span",null,"小记")]),(t(!0),i(m,null,y(T.value.orderDetail,(e=>(t(),i("li",{key:e.id,class:"grid grid-cols-4 text-center py-[4px]",style:{"border-bottom":"1px solid var(--border_c)"}},[r("span",null,c(e.name),1),r("span",null,c(e.price.toFixed(2)),1),r("span",null,c(e.count),1),r("span",{class:"text-text3"},c((e.price*e.count).toFixed(2)),1)])))),128))])])):(t(),n(a,{key:1,text:"暂无数据"})),K.value.length>1?(t(),n(A,{key:2,recordsList:K.value},null,8,["recordsList"])):d("",!0)])]})),_:1}),x(w,{ref_key:"popup2",ref:O,type:"dialog"},{default:u((()=>[x(h,{title:"订单二维码",confirmText:"保存二维码",duration:2e3,"before-close":!0,onClose:l[0]||(l[0]=e=>O.value.close()),onConfirm:V},{default:u((()=>[r("div",{class:"flex justify-center w-full"},[x(g,{src:z.value,class:"w-full"},null,8,["src"])])])),_:1})])),_:1},512)])),_:1})}}};export{N as default};
