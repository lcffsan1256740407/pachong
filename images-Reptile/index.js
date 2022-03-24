let axios = require('axios')
let fs =require('fs')
let cheerio = require('cheerio')    //获取html文档内容,跟jquery一样

//获取页面页码总数
async function getPageNumber(){
    let res = await axios.get(`https://www.fabiaoqing.com/biaoqing/lists/page/1.html`)
    let $ = cheerio.load(res.data)
    let pageNumber = parseInt($('.ui.pagination.menu a:nth-last-child(3)').text())
    getImgs(pageNumber)
}

//获取每一页的表情包
async function getImgs(pageNumber){ 
    for(let i = 1 ; i<=pageNumber ; i++){
        await axios.get(`https://www.fabiaoqing.com/biaoqing/lists/page/${i}.html`).then(res=>{
            console.log(`这是页面------>${i}`)
            let $ = cheerio.load(res.data)
            $('.tagbqppdiv img').each((index,item)=>{
                let url = $(item).attr('data-original') //获取到当前页面的所有表情包
                fs.writeFile('./imagsUrls.txt',`${url}\n`,{flag:'a'},(err)=>{
                    if(!err){
                        console.log(url+"写入成功")
                    }
                })
            })
        })
    }
}

getPageNumber()