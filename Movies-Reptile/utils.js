let fs = require('fs')

// 读取文件
function ReadFile(url){
    return new Promise((reslove,reject)=>{
        fs.readFile(url,{flag:'r'},(err,data)=>{
            if(err){
                reject('读取文件失败')
            }else{
                reslove(data.toString())
            }
        })
    })
}

// 写入文件
function WriteFile(url,content){
    return new Promise((reslove,reject)=>{
        fs.writeFile(url,content,{flag:'a'},(err)=>{
            if(err){
                reject('文件写入失败')
            }else{
                reslove('文件写入成功')
            }
        })
    })
}

// 创建目录
function MakeDir(url){
    return new Promise((reslove,reject)=>{
        fs.mkdir(url,(err)=>{
            if(err){
                reject('创建文件目录失败')
            }else{
                reslove('目录创建完成')
            }
        })
    })
}

module.exports = {ReadFile,WriteFile,MakeDir}