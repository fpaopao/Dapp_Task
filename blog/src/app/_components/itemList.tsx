import "../../css/index.scss"
import Link from "next/link";

export default async function itemList({post}) {

  
   return (
    <Link href={`/articleDetail/${post.id}`}>
      <div className='item-list'>
        <h4>{post.title}</h4>
        <div>
          {post.content}
        </div>
      </div>
    </Link>
  )
}