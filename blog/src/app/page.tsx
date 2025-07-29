import 'antd/dist/reset.css'
import React from 'react';
import "../css/index.scss"

import ItemList from "@/app/_components/itemList";
import {getArticleList} from "@/api";
import Link from "next/link";

export default async function Home() {
  const list = await getArticleList();
  console.log(list)
  
  return (
    <div className="pagebox">
      <div className="nav">
        <Link href={`/addArticle`}
              className="bg-green-400 text-white flex items-center justify-center h-10 text-center w-20 rounded">
          添加文章
        </Link>
      </div>
      <div className="bodycontent">
        {list?.map((post) => (
          <ItemList key={post.id} post={post}/>
        ))}
      </div>
    </div>
  );
}
