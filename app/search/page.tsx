type SearchParams = { [key: string]: string | string[] | undefined }
import { cookies, headers } from 'next/headers'
import { createPost } from './actions' 
// 模拟接口延迟 3 秒
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams>  }) {
    await delay(3000) // 延迟 3 秒再返回数据

    const sp = await searchParams
    
    const cookieStore = await cookies()
    const headerStore = await headers()
    const q =  JSON.stringify(sp)
    const q1 =  JSON.stringify(cookieStore)
    const q2 =  JSON.stringify(headerStore)
    return <div>
        <form action={createPost}>
            <input type="text" name="name" />
            <input type="text" name="age" />
            <button type="submit">提交</button>
        </form>
        <div>Page{q}{q1}{q2}</div>
    </div>;
}