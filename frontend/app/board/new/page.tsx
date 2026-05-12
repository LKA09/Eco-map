'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, hashPassword } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function NewPostPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  // 공통
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 게스트 전용
  const [guestName, setGuestName] = useState('')
  const [guestPw, setGuestPw] = useState('')
  const [guestPwConfirm, setGuestPwConfirm] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setChecking(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }

    // 게스트: 이름·비밀번호 검증
    if (!user) {
      if (!guestName.trim()) {
        setError('이름을 입력해주세요.')
        return
      }
      if (guestPw.length < 4) {
        setError('비밀번호는 4자 이상 입력해주세요.')
        return
      }
      if (guestPw !== guestPwConfirm) {
        setError('비밀번호가 일치하지 않습니다.')
        return
      }
    }

    setLoading(true)

    if (user) {
      // 회원 글
      const nickname =
        user.user_metadata?.nickname ?? user.email?.split('@')[0] ?? '익명'
      const { error } = await supabase.from('posts').insert({
        title: title.trim(),
        content: content.trim(),
        author_name: nickname,
        user_id: user.id,
        guest_password: null,
      })
      if (error) {
        setError('글 등록에 실패했습니다.')
        setLoading(false)
        return
      }
    } else {
      // 게스트 글
      const hashed = await hashPassword(guestPw)
      const { error } = await supabase.from('posts').insert({
        title: title.trim(),
        content: content.trim(),
        author_name: guestName.trim(),
        user_id: null,
        guest_password: hashed,
      })
      if (error) {
        setError('글 등록에 실패했습니다.')
        setLoading(false)
        return
      }
    }

    router.push('/board')
  }

  if (checking) return null

  return (
    <main className="min-h-screen bg-[#f7f4ec] pt-16 text-[#15231d]">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/board" className="text-sm text-[#4d5a52] hover:text-[#15231d]">
            ← 게시판
          </Link>
          <span className="text-[#d8d0bf]">/</span>
          <span className="text-sm font-medium">새 글 작성</span>
        </div>

        <div className="rounded-xl border border-[#d8d0bf] bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">글 작성</h1>
            {!user && (
              <span className="rounded-full bg-[#e7efe4] px-3 py-1 text-xs font-semibold text-[#3b7d57]">
                게스트
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 게스트 전용: 이름 + 비밀번호 */}
            {!user && (
              <div className="rounded-lg border border-[#d8d0bf] bg-[#f7f4ec] p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4d5a52]">
                  게스트 정보 — 수정·삭제 시 비밀번호가 필요합니다
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-[#15231d] mb-1.5">
                      이름
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="닉네임"
                      className="w-full rounded-lg border border-[#d8d0bf] bg-white px-3 py-2 text-sm outline-none focus:border-[#3b7d57] focus:ring-1 focus:ring-[#3b7d57]"
                      maxLength={20}
                      required={!user}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#15231d] mb-1.5">
                      비밀번호
                    </label>
                    <input
                      type="password"
                      value={guestPw}
                      onChange={(e) => setGuestPw(e.target.value)}
                      placeholder="4자 이상"
                      className="w-full rounded-lg border border-[#d8d0bf] bg-white px-3 py-2 text-sm outline-none focus:border-[#3b7d57] focus:ring-1 focus:ring-[#3b7d57]"
                      required={!user}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#15231d] mb-1.5">
                      비밀번호 확인
                    </label>
                    <input
                      type="password"
                      value={guestPwConfirm}
                      onChange={(e) => setGuestPwConfirm(e.target.value)}
                      placeholder="다시 입력"
                      className="w-full rounded-lg border border-[#d8d0bf] bg-white px-3 py-2 text-sm outline-none focus:border-[#3b7d57] focus:ring-1 focus:ring-[#3b7d57]"
                      required={!user}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#15231d] mb-1.5">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
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
                placeholder="내용을 입력하세요"
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
                href="/board"
                className="flex-1 rounded-full border border-[#d8d0bf] py-3 text-center text-sm font-semibold text-[#4d5a52] transition hover:border-[#15231d] hover:text-[#15231d]"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-[#15231d] py-3 text-sm font-bold text-white transition hover:bg-[#2f4639] disabled:opacity-50"
              >
                {loading ? '등록 중...' : '게시하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
