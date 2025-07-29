import Edit from "@/app/_components/edit";
import {getArticleList, getItemArticle} from "@/api";

export const revalidate = 60;

export async function generateStaticParams() {
  const res = await getArticleList()
  console.log(res, "ress")
  let a = res.map(post => ({id: post.id.toString()}));
  return a;// 返回API数据中的id字段
}


export default async function page({params}) {
  const {id} = await params;
  let list = await getItemArticle(id)
  let item = list && list[0];
  
  return (
    <Edit item={item}/>
  )
}