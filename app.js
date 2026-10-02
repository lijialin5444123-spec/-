const categories = {
 commerce: {title:'电商视觉设计',en:'ECOMMERCE VISUAL',description:'电商详情页、首页与活动 KV。结合产品结构与卖点，完成产品及场景的三维视觉表达。'},
 motion: {title:'三维动效设计',en:'MOTION DESIGN',description:'从分镜规划到场景动画、动效制作与后期剪辑，呈现完整的三维动态视觉。'},
 render: {title:'产品建模与渲染',en:'PRODUCT RENDERING',description:'通过产品建模、材质纹理、灯光与构图，呈现产品的结构细节与真实质感。'},
 ai: {title:'AIGC 创意视觉',en:'AIGC VISUAL DESIGN',description:'使用 Midjourney 与 Stable Diffusion 探索创意方向，将 AIGC 生图融入视觉设计流程。'}
};
const qrDialog = document.querySelector('#qr-dialog');
document.querySelector('#wechat-open').addEventListener('click', () => qrDialog.showModal());
document.querySelectorAll('dialog').forEach(dialog => {
 dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
 dialog.addEventListener('click', event => {if(event.target === dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
});
let toastTimer;
function toast(message) {const el=document.querySelector('.toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600);}
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click',async()=>{
 const value=button.dataset.copy;
 try {
  if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(value);
  else{const field=document.createElement('textarea');field.value=value;field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw new Error('Copy unavailable');}
  toast('已复制：'+value);
 }catch{toast('未能自动复制，请选中联系方式手动复制');}
}));
if('IntersectionObserver' in window){
 document.documentElement.classList.add('js-motion');
 const reveals=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');reveals.unobserve(entry.target);}});},{threshold:0.06});
 document.querySelectorAll('.reveal').forEach(el=>reveals.observe(el));
}
