export default (e,type,fn,mark)=>{
    if(e.addEventListener){
        e.addEventListener(type,fn,false);
    }else if(e.attachEvent){
        //e.detachEvent('on'+type,fn);
        e.attachEvent('on'+type,()=>{
            fn.call(e,window.event);
        });
    };
};