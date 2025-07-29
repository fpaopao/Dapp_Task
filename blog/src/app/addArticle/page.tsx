'use client'

import {useState} from 'react'
import {supabase} from '@/lib/supabaseClient'
import {useRouter} from 'next/navigation'
import Link from 'next/link'

export default function page() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('draft')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title === '' || content === '') {
      alert("请检查输入");
      return false;
    } else {
      
      const {error} = await supabase.from('posts').insert([{
        user_id: "11111111-1111-1111-1111-111111111111",
        title,
        content,
        status: tags
      }])
      if (!error) {
        router.push('/')
      } else {
        alert('保存失败')
      }
    }
  }
  
  return (
    <main className="max-w-2xl mx-auto py-8">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-bold mb-6">新增文章</h1>
        <Link href={`/`}
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
};
