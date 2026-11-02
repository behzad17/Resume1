/* Native buttons provide Enter/Space activation and a touch-friendly toggle. */
(() => {
 const folders=document.querySelectorAll('[data-skill-folder]');
 folders.forEach(folder=>{
   let pinned=false,hover=false;
   const title=folder.querySelector('.skill-folder__title').textContent;
   const skills=[...folder.querySelectorAll('.skill-folder__tags > span')].map(x=>x.textContent).join('، ');
   const update=()=>{
     const open=pinned||hover;
     folder.classList.toggle('is-open',open);
     folder.setAttribute('aria-expanded',String(open));
     folder.setAttribute('aria-label',title+'؛ '+skills+'؛ '+(open?'بستن پوشه':'باز کردن پوشه'));
   };
   folder.addEventListener('click',()=>{pinned=!pinned;update();});
   folder.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;update();}});
   folder.addEventListener('pointerleave',()=>{hover=false;update();});
   folder.addEventListener('pointercancel',()=>{hover=false;update();});
   folder.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;hover=false;update();}});
   update();
 });
 if('IntersectionObserver' in window){
   const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
     if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}
   }),{threshold:.15});
   folders.forEach(folder=>observer.observe(folder));
 }
})();