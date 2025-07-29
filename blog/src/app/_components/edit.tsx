'use client'
import Link from "next/link";
import {useState} from "react";
import { editItemArticle} from "@/api";
import {useRouter} from 'next/navigation'
export default function Edit({item}) {
  console.log(item, '111');
  const [title, setTitle] = useState(item.title)
  const [content, setContent] = useState(item.content)
  const [tags, setTags] = useState(item.status)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(111, title)
    
    if (item.title === '' || item.content === '') {
      alert("请检查输入");
      return false;
    } else {
      console.log({
        title,
        content,
        status: tags
      })
      const res = await editItemArticle(item.id, {
        title,
        content,
        status: tags
      })
      console.log(res)
      if (!res) {
        router.push(`/articleDetail/${item.id}`)
      } else {
        alert('保存失败')
      }
    }
  }
  return (
    <main className="max-w-2xl mx-auto py-8">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-bold mb-6">编辑文章</h1>
        <Link href={`/articleDetail/${item.id}`}
              className="bg-green-400 text-white flex items-center justify-center h-10 text-center w-20 rounded">
          goback
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded h-40"
          placeholder="正文"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        >
          <option value="draft">草稿</option>
          <option value="published">发布</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          保存
        </button>
      </form>
    </main>
  )
}