import {supabase} from '../lib/supabaseClient'

// 获取所有文章
export async function getArticleList() {
  const {data, error} = await supabase
    .from('posts')
    .select(`*`)
    .order("created_at", {ascending: false})
  
  if (error) throw new Error('Failed to fetch articles')
  return data;
}

// 获取每一个文章的具体信息
export async function getItemArticle(id) {
  const {data, error} = await supabase
    .from('posts')
    .select(`*`)
    .eq('id', id);
  return data;
}

// 删除
export async function deleteItemArticle(id) {
  const {data, error} = await supabase
    .from('posts')
    .delete()
    .eq('id', id);
  return data;
}

// 编辑
export async function editItemArticle(id, dataObj) {
  const {data, error} = await supabase
    .from('posts')
    .update(dataObj)
    .eq('id', id);
  return data;
}