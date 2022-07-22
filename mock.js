import Mock from "mockjs"

const {newsList} = Mock.mock({
    'newsList|75':[
        {
            "name":"@ctitle()",
            "date":"@date(yyyy-MM-dd)"
        }
    ]
})

//get query
const getQuery = (url,name) =>{
    const index = url.indexOf('?')
    if(index !== -1){
        const queryStrArr = url.substr(index+1).split('&')
        for(var i=0;i<queryStrArr.length;i++) {
            const itemArr = queryStrArr[i].split('=')
            console.log(itemArr)
            if(itemArr[0] == name){
                return itemArr[1]
            }
        }
    }
    return null
}

//original data
Mock.mock(/\/api\/get\/data/,'get',(options)=>{
    const pageindex = getQuery(options.url,'pageindex')
    const pagesize = getQuery(options.url,'pagesize')
    const start = (pageindex-1)*pagesize
    const end = pageindex*pagesize
    const totalPage = Math.ceil(newsList.length/pagesize)
    const list = pageindex>totalPage?[]:newsList.slice(start,end)
    
    return {
        status: 200,
        message: "success",
        list:list,
        total:newsList.length,
        page:totalPage
    }
})

//add data
Mock.mock('/api/add/data','post',(options)=>{
    const body = JSON.parse(options.body)
    newsList.push(Mock.mock({
        "name": body.name,
        "date": body.date
    }))

    return {
        status:200,
        message:"添加成功",
        list:newsList,
        total:newsList.length
    }
})

//delete data
Mock.mock('/api/delete/data','post',(options)=>{
    const body = JSON.parse(options.body)
    const index = newsList.findIndex(item=> item.name === body.name)
    newsList.splice(index,1)

    return {
        status:200,
        message:"删除成功",
        list:newsList,
        total:newsList.length
    }
})