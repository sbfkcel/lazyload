const path = require('path');

let publicPath = path.join(__dirname,'_public'),        //公共数据路径
    publicData = fws.require(publicPath),               //公共数据
    pageData = {                                        //页面数据
        body:"Hello"
    };

//将公共数据写到入页面数据中
for(let i in publicData){
    pageData[i] = publicData[i];
};
module.exports = pageData;