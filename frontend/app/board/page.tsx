import Link from 'next/link'
import { createServerClient } from '@/lib/supabase-server'
import type { Post } from '@/lib/supabase'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BoardPage() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  const posts: Post[] = data ?? []

  return (
    <main className="min-h-screen bg-[#f7f4ec] pt-16 text-[#15231d]">
      {/* 헤더 영역 */}
      <div className="bg-[#15231d] px-5 py-10 text-white sm:px-8">
        <div className="mx-auto flex max-w-4xl items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f2c14e]">
              Community
            </p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">게시판</h1>
            <p className="mt-2 text-sm text-white/65">
              오량산 활동을 기록하고 공유하는 공간입니다.
            </p>
          </div>
          <Link
            href="/board/new"
            className="shrink-0 rounded-full bg-[#f2c14e] px-5 py-2.5 text-sm font-bold text-[#15231d] transition hover:bg-[#ffd36b]"
          >
            글쓰기
          </Link>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-[#d8d0bf] bg-white py-20 text-center">
            <p className="text-[#4d5a52]">아직 게시글이 없습니다.</p>
            <Link
              href="/board/new"
              className="mt-4 inline-block text-sm font-semibold text-[#3b7d57] hover:underline"
            >
              첫 번째 글을 작성해보세요
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#e8e3d8] overflow-hidden rounded-xl border border-[#d8d0bf] bg-white">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/board/${post.id}`}
                className="flex items-start justify-between gap-4 px-6 py-5 transition hover:bg-[#f7f4ec]"
              >
                <div className="min-w-0">
                  <p className="text-xs text-[#3b7d57] font-medium mb-1">
                    #{posts.length - i}
                  </p>
                  <h2 className="truncate font-semibold text-[#15231d]">
                    {post.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#4d5a52]">
                    {post.author_name}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-[#8a9188]">
                  {formatDate(post.created_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}