let axios = require('axios')
let utils = require('./utils')

let httpUrl = 'https://www.1905.com/vod/'   //1905电影天堂



// 封装一个请求数据函数
function req(url) {
    return new Promise((reslove, reject) => {
        axios.get(url).then(res => {
            headers = res.headers
            body = res.data
            reslove({headers,body})
        }).catch(err => reject(err))
    })
}
// 1.获取起始页面的所有分类地址             爬虫第一步:分类get!
async function getType(){
    let {headers,body} = await req(httpUrl)
    let reg = /<h2>按类型(.*?)<div class="grid-2x col-index-area">/igs
    let range = reg.exec(body)[1]
    let reg2 = /<a href="(.*?)" target="_blank" data-hrefexp="fr=vodhome_js_lx">(.*?)<\/a>/igs
    // 定义一个数组用来存储分类地址信息
    let TypeArray = []
    let msg ;
    // 通过while循环来将匹配返回内容push进数组中
    while( msg = reg2.exec(range)){
        let obj = {
            url:msg[1], //类别地址
            TypeName:msg[2] //类别名称
        }
        TypeArray.push(obj)
        // 创建文件目录
        await utils.MakeDir(`./movies/${msg[2]}`).catch(err=>console.log(err))
        // 根据类别查询该类别下所有电影
        getMovies(obj.url,obj.TypeName)
    }
}
// 2.通过分类,获取页面中所有电影链接        爬虫第二步:分类下面的电影!
async function getMovies(url,TypeName){
    let {headers,body} = await req(url)
    let reg = /<a class="pic-pack-outer" target="_blank" href="(.*?)" .*?><h3>(.*?)<\/h3><i class="score">/igs
    let MovieArray = []
    let Movies ;
    while( Movies = reg.exec(body) ){
        let obj = {
            url:Movies[1],  //电影url
            Name:Movies[2]  //电影名称
        }
        MovieArray.push(obj)
        getInfo(obj.url,TypeName)
    }
    console.log(`-----------------------分类${TypeName}-----------------------`)
    console.log(MovieArray) //打印该分类下所有电影
}
// 3.通过电影链接,获取电影的相关信息        爬虫第三步:电影的详细信息!
async function getInfo(url,TypeName){
    let {headers,body} = await req(url)
    // 筛选出电影名,电影英文名,文字描述,导演
    let reg = / <h1 class="playerBox-info-name playerBox-info-cnName">(.*?)<\/h1><span class="playerBox-info-name playerBox-info-enName">(.*?)<\/span>.*?<span id="playerBoxIntroCon">(.*?)<a.*?导演.*?data-hrefexp="fr=vodplay_ypzl_dy">(.*?)<\/a>/igs
    let info = reg.exec(body)
    let obj = {
        MoviesName:info[1]+""+info[2],  //电影中英文名
        Describe:info[3],   //电影描述
        Director:info[4],    //电影导演
        Url:url     //电影地址
    }
    await utils.WriteFile(`./movies/${TypeName}/${info[1]}.json`,JSON.stringify(obj)).catch(err=>console.log(err))
    // console.log(obj)    //打印电影详细信息
}

getType()


