(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[695],{7894:function(e,t,s){Promise.resolve().then(s.t.bind(s,2972,23)),Promise.resolve().then(s.bind(s,2296))},2296:function(e,t,s){"use strict";s.d(t,{default:function(){return x}});var a=s(7437),l=s(5863),r=s(7689),n=s(9658),i=s(2265),d=s(9656),o=s.n(d),c=s(4131);function x(){let[e,t]=(0,i.useState)([]),[s,d]=(0,i.useState)(null),[x,m]=(0,i.useState)(!1),[h,u]=(0,i.useState)(null),[p,f]=(0,i.useState)(!1),b=(0,i.useRef)(null),v=c.Z.get("authToken")||"no token",[g,j]=(0,i.useState)(!1),[y,N]=(0,i.useState)(null),[w,D]=(0,i.useState)(!1);(0,i.useEffect)(()=>{k()},[]);let k=async()=>{let e=await fetch("/api/documentNames",{method:"GET",headers:{"Content-Type":"application/json"}}),s=await e.json();s&&(console.log(s),t(s))},C=async e=>{var t;let s=null===(t=e.target.files)||void 0===t?void 0:t[0];if(s){if(s.size>10485760){u("File size must be less than 10MB");return}await S(s)}},S=async e=>{m(!0),u(null);try{let t;await o()(e).then(e=>{t=e}).catch(e=>console.error("Failed to extract text from pdf",e));let s=new FormData;s.append("name",e.name),s.append("content",t),s.append("file",e),s.append("user_id",v),await fetch("/api/documentUpload",{method:"POST",body:s}),k()}catch(e){console.error("Upload error:",e),u(e.message||"Failed to upload file")}finally{m(!1),b.current&&(b.current.value="")}},M=async e=>{e.preventDefault(),f(!1);let t=e.dataTransfer.files[0];t&&await S(t)},T=e=>new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),_=(e,t)=>{t.stopPropagation(),N(e),j(!0)},E=async()=>{if(y){D(!0);try{if(!(await fetch("/api/deleteDocument",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:y})})).ok)throw Error("Failed to delete document");t(e.filter(e=>e.id!==y)),(null==s?void 0:s.id)===y&&d(null),k()}catch(e){u("Failed to delete document"),setTimeout(()=>u(""),3e3)}finally{D(!1),j(!1),N(null)}}};return(0,a.jsx)("div",{className:"min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8",children:(0,a.jsxs)("div",{className:"max-w-4xl mx-auto",children:[(0,a.jsx)("div",{className:"text-center mb-12",children:(0,a.jsx)("h1",{className:"text-4xl font-semibold text-gray-900 ",children:"Document Manager"})}),h&&(0,a.jsx)("div",{className:"mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md",children:(0,a.jsxs)("div",{className:"flex",children:[(0,a.jsx)("div",{className:"flex-shrink-0",children:(0,a.jsx)("svg",{className:"h-5 w-5 text-red-400",viewBox:"0 0 20 20",fill:"currentColor",children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})})}),(0,a.jsx)("div",{className:"ml-3",children:(0,a.jsx)("p",{className:"text-sm text-red-700",children:h})})]})}),(0,a.jsx)("div",{className:"bg-white rounded-xl shadow-md overflow-hidden mb-8",children:(0,a.jsx)("div",{className:"p-6",children:(0,a.jsx)("div",{className:"border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ".concat(p?"border-blue-500 bg-blue-50":"border-gray-300 hover:border-blue-400"),onDragOver:e=>{e.preventDefault(),f(!0)},onDragLeave:e=>{e.preventDefault(),f(!1)},onDrop:M,children:(0,a.jsxs)("label",{className:"flex flex-col items-center justify-center h-48 cursor-pointer",children:[(0,a.jsxs)("div",{className:"flex flex-col items-center justify-center pt-5 pb-6",children:[x?(0,a.jsx)(l.Z,{className:"w-10 h-10 text-blue-500 animate-spin mb-4"}):(0,a.jsx)(r.Z,{className:"w-10 h-10 text-blue-500 mb-4"}),(0,a.jsx)("p",{className:"mb-2 text-lg font-medium text-gray-700",children:x?"Uploading...":"Drop your file here"}),(0,a.jsxs)("p",{className:"text-sm text-gray-500",children:["or ",(0,a.jsx)("span",{className:"text-blue-500 hover:text-blue-600",children:"browse"})]}),(0,a.jsx)("p",{className:"mt-1 text-xs text-gray-500",children:"Supported formats: TXT, MD, JSON, CSV, PDF(max 10MB)"})]}),(0,a.jsx)("input",{ref:b,type:"file",className:"hidden",accept:".pdf",onChange:C,disabled:x})]})})})}),(0,a.jsx)("div",{className:"bg-white rounded-xl shadow-md overflow-hidden",children:(0,a.jsxs)("div",{className:"p-6",children:[(0,a.jsx)("h2",{className:"text-xl font-semibold text-gray-900 mb-6 flex items-center",children:"Your Documents"}),0===e.length?(0,a.jsx)("div",{className:"text-center py-8 text-gray-500",children:"No documents uploaded yet"}):(0,a.jsx)("div",{className:"space-y-2",children:e.map((e,t)=>(0,a.jsxs)("div",{className:"group flex items-center p-4 rounded-lg transition-colors duration-200 ".concat((null==s?void 0:s.id)===e.id?"bg-blue-50":"hover:bg-gray-50"),children:[(0,a.jsxs)("div",{className:"flex-1 flex items-center cursor-pointer",onClick:()=>d(e),children:[(0,a.jsx)(n.Z,{className:"w-5 h-5 mr-3 ".concat((null==s?void 0:s.id)===e.id?"text-blue-500":"text-gray-400 group-hover:text-blue-500")}),(0,a.jsxs)("div",{className:"flex-1",children:[(0,a.jsx)("h3",{className:"font-medium ".concat((null==s?void 0:s.id)===e._id?"text-blue-700":"text-gray-900"),children:e.name}),(0,a.jsxs)("p",{className:"text-sm text-gray-500",children:["Uploaded ",T(e.created_at)]})]})]}),(0,a.jsx)("button",{onClick:t=>_(e._id,t),className:"p-2 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity","aria-label":"Delete document",children:(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"text-gray-500 hover:text-red-500",children:[(0,a.jsx)("path",{d:"M3 6h18"}),(0,a.jsx)("path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}),(0,a.jsx)("path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"})]})})]},t))})]})}),g&&(0,a.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:(0,a.jsxs)("div",{className:"bg-white p-6 rounded-xl shadow-xl",children:[(0,a.jsx)("h3",{className:"text-lg font-semibold mb-4",children:"Confirm Deletion"}),(0,a.jsx)("p",{className:"mb-6",children:"Are you sure you want to delete this document?"}),(0,a.jsxs)("div",{className:"flex justify-end space-x-4",children:[(0,a.jsx)("button",{onClick:()=>j(!1),className:"px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50",disabled:w,children:"Cancel"}),(0,a.jsx)("button",{onClick:E,className:"px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center",disabled:w,children:w?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[(0,a.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,a.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Deleting..."]}):"Delete"})]})]})})]})})}}},function(e){e.O(0,[489,727,328,971,117,744],function(){return e(e.s=7894)}),_N_E=e.O()}]);