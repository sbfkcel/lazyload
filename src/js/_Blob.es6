export default (array,option)=>{
    if(window.Blob){
        return new Blob(array,option)
    }else{
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
        if(window.BlobBuilder){
            let bb = new BlobBuilder();
            bb.append(array);
            return bb.getBlob(typeof option === 'object' ? option.type : undefined);
        };
        return bb;
    };
};