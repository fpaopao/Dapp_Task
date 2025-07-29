'use client';
import {useParams, useRouter} from 'next/navigation';
import {deleteItemArticle} from "@/api";

export default function ({id}) {
  const params = useParams(); // 备用方案
  const actualId = id || params?.id; // 优先使用Props
  console.log(actualId, "actualId");
  
  const router = useRouter()
  
  const deleteItem = async (id) => {
    console.log(id);
    let res = await deleteItemArticle(id)
    if (!res) {
      alert('删除成功');
      router.push('/')
    } else {
      alert('删除失败');
    }
  }
  
  return (<span className="delete" onClick={() => deleteItem(actualId)}>删除</span>)
}