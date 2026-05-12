'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Post } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [post, setPost] = useState<Post | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [loadingInit, setLoadingInit] = useState(true)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) { router.replace('/board'); return }
      setPost(data)

      if (data.user_id === null) {
        // 게스트 글: 상세 페이지에서 검증한 해시를 sessionStorage에서 확인
        const stored = sessionStorage.getItem(`guest_pw_${id}`)
        if (!stored || stored !== data.guest_password) {
          router.replace(`/board/${id}`)
          return
        }
        setAuthorized(true)
      } else {
        // 회원 글: user_id 일치 확인
        if (!user || user.id !== data.user_id) {
          router.replace(`/board/${id}`)
          return
        }
        setAuthorized(true)
      }

      setTitle(data.title)
      setContent(data.content)
      setLoadingInit(false)
    }
    init()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }
    setError('')
    setLoading(true)

    const { error } = await supabase
      .from('posts')
      .update({
        title: title.trim(),
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      setError('수정에 실패했습니다. 다시 시도해주세요.')
      setLoading(false)
    } else {
      sessionStorage.removeItem(`guest_pw_${id}`)
      router.push(`/board/${id}`)
    }
  }

  if (loadingInit || !authorized) {
    return (
      <main className="min-h-screen bg-[#f7f4ec] pt-16 flex items-center justify-center">
        <p className="text-[#4d5a52]">확인 중...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f4ec] pt-16 text-[#15231d]">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={`/board/${id}`}
            className="text-sm text-[#4d5a52] hover:text-[#15231d]"
          >
            ← 게시글로 돌아가기
          </Link>
          <span className="text-[#d8d0bf]">/</span>
          <span className="text-sm font-medium">수정</span>
        </div>

        <div className="rounded-xl border border-[#d8d0bf] bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">글 수정</h1>
            {post?.user_id === null && (
              <span className="rounded-full bg-[#e7efe4] px-3 py-1 text-xs font-semibold text-[#3b7d57]">
                게스트
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#15231d] mb-1.5">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-[#d8d0bf] bg-[#fffdf6] px-4 py-2.5 text-sm outline-none focus:border-[#3b7d57] focus:ring-1 focus:ring-[#3b7d57]"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#15231d] mb-1.5">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full resize-y rounded-lg border border-[#d8d0bf] bg-[#fffdf6] px-4 py-3 text-sm outline-none focus:border-[#3b7d57] focus:ring-1 focus:ring-[#3b7d57]"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Link
                href={`/board/${id}`}
                className="flex-1 rounded-full border border-[#d8d0bf] py-3 text-center text-sm font-semibold text-[#4d5a52] transition hover:border-[#15231d] hover:text-[#15231d]"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-[#15231d] py-3 text-sm font-bold text-white transition hover:bg-[#2f4639] disabled:opacity-50"
              >
                {loading ? '저장 중...' : '수정 완료'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
