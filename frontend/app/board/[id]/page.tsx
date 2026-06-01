import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase-server'
import PostActions from './PostActions'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServerClient()
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) notFound()

  const isGuestPost = post.user_id === null

  return (
    <main className="min-h-screen bg-[#f7f4ec] pt-16 text-[#15231d]">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="mb-6">
          <Link href="/board" className="text-sm text-[#4d5a52] hover:text-[#15231d]">
            ← 게시판으로 돌아가기
          </Link>
        </div>

        <article className="rounded-xl border border-[#d8d0bf] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold leading-snug sm:text-3xl">
            {post.title}
          </h1>

          <div className="mt-3 flex items-center justify-between gap-4 border-b border-[#e8e3d8] pb-5">
            <div className="flex items-center gap-2 text-sm text-[#4d5a52]">
              <span className="font-medium text-[#15231d]">{post.author_name}</span>
              {isGuestPost && (
                <span className="rounded-full bg-[#f0ede5] px-2 py-0.5 text-xs text-[#8a9188]">
                  게스트
                </span>
              )}
              <span>·</span>
              <span>{formatDate(post.created_at)}</span>
              {post.updated_at !== post.created_at && (
                <span className="text-xs text-[#8a9188]">· 수정됨</span>
              )}
            </div>

            <PostActions post={post} />
          </div>

          <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-[#2a3a30]">
            {post.content}
          </div>
        </article>
      </div>
    </main>
  )
}