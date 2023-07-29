window.addEventListener('DOMContentLoaded',()=>{

    Array.from(document.querySelectorAll('.pic-tag-img')).map(x=>{


        x.addEventListener('mouseover',e=> Array.from(e.target.parentElement.querySelectorAll('.pic-tag-tags')).map(a=>{
            a.style.display =''
            a.addEventListener('mouseover',e=>e.target.style.display = '' )
        }));
        x.addEventListener('mouseleave',e=> Array.from(e.target.parentElement.querySelectorAll('.pic-tag-tags')).map(a=>a.style.display ='none'));
        

    })


});