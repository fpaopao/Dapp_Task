
export const revalidate = 60;

export async function generateStaticParams() {
  const res = await getArticleList()
  console.log(res, "ress")
  let a = res.map(post => ({id: post.id.toString()}));
  return a;// 返回API数据中的id字段
}

import {getArticleList, getItemArticle} from "@/api/index.tsx"
import Detail from "@/app/_components/detail"


export default async function page({params}) {
  const {id} = await params;
  let list = await getItemArticle(id)
  let item = list && list[0];
  
  return (
    <Detail item={item} list={list}/>
  )
}