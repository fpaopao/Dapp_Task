'use client'
import Link from "next/link";
import DeleteBtn from "@/app/_components/deleteBtn";
import "@/css/index.scss"

export default function page({item}) {
  
  return (
    <div className="itembox">
      <div className="header">
        <Link className="goback" href={`/`}>goback</Link>
        <h1>{item && item.title}</h1>
        <p>{item && item.created_at}</p>
        <Link className="edit" href={`/edit/${item.id}`}>编辑</Link>
        <DeleteBtn id={item.id}/>
      </div>
      <div className="body">
        {item && item.content}
      </div>
    
    </div>
  )
}