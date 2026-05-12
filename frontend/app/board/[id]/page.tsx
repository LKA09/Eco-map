'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, hashPassword, type Post } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type ModalAction = 'edit' | 'delete' | null

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 회원 삭제 확인
  const [showMemberDeleteConfirm, setShowMemberDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // 게스트 비밀번호 모달
  const [modalAction, setModalAction] = useState<ModalAction>(null)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) router.replace('/board')
        else setPost(data)
        setLoading(false)
      })
  }, [id, router])

  // 회원 삭제
  const handleMemberDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) router.push('/board')
    else { setDeleting(false); setShowMemberDeleteConfirm(false) }
  }

  // 게스트 비밀번호 확인 후 수정/삭제
  const handleGuestAction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post || !pwInput) return
    setPwError('')
    setPwLoading(true)

    const hashed = await hashPassword(pwInput)
    if (hashed !== post.guest_password) {
      setPwError('비밀번호가 틀렸습니다.')
      setPwLoading(false)
      return
    }

    if (modalAction === 'delete') {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (!error) router.push('/board')
      else { setPwError('삭제에 실패했습니다.'); setPwLoading(false) }
    } else {
      // 수정 페이지로 이동 — sessionStorage에 검증된 해시 저장
      sessionStorage.setItem(`guest_pw_${id}`, hashed)
      router.push(`/board/${id}/edit`)
    }
  }

  const openGuestModal = (action: ModalAction) => {
    setPwInput('')
    setPwError('')
    setModalAction(action)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f4ec] pt-16 flex items-center justify-center">
        <p className="text-[#4d5a52]">불러오는 중...</p>
      </main>
    )
  }

  if (!post) return null

  const isMemberAuthor = !!user && user.id === post.user_id
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

            {/* 회원 작성자 버튼 */}
            {isMemberAuthor && (
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/board/${post.id}/edit`}
                  className="rounded-full border border-[#d8d0bf] px-4 py-1.5 text-sm font-semibold text-[#4d5a52] transition hover:border-[#15231d] hover:text-[#15231d]"
                >
                  수정
                </Link>
                <button
                  onClick={() => setShowMemberDeleteConfirm(true)}
                  className="rounded-full border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            )}

            {/* 게스트 글: 항상 수정/삭제 버튼 표시 (비밀번호로 인증) */}
            {isGuestPost && (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => openGuestModal('edit')}
                  className="rounded-full border border-[#d8d0bf] px-4 py-1.5 text-sm font-semibold text-[#4d5a52] transition hover:border-[#15231d] hover:text-[#15231d]"
                >
                  수정
                </button>
                <button
                  onClick={() => openGuestModal('delete')}
                  className="rounded-full border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-[#2a3a30]">
            {post.content}
          </div>
        </article>
      </div>

      {/* 회원 삭제 확인 모달 */}
      {showMemberDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#15231d]">게시글을 삭제할까요?</h2>
            <p className="mt-2 text-sm text-[#4d5a52]">삭제한 게시글은 복구할 수 없습니다.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowMemberDeleteConfirm(false)}
                className="flex-1 rounded-full border border-[#d8d0bf] py-2.5 text-sm font-semibold text-[#4d5a52] transition hover:border-[#15231d]"
              >
                취소
              </button>
              <button
                onClick={handleMemberDelete}
                disabled={deleting}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 게스트 비밀번호 확인 모달 */}
      {modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#15231d]">
              {modalAction === 'edit' ? '글 수정' : '글 삭제'} — 비밀번호 확인
            </h2>
            <p className="mt-1 text-sm text-[#4d5a52]">
              작성 시 입력한 비밀번호를 입력해주세요.
            </p>
            <form onSubmit={handleGuestAction} className="mt-5 space-y-3">
              <input
                type="password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                placeholder="비밀번호"
                autoFocus
                className="w-full rounded-lg border border-[#d8d0bf] bg-[#fffdf6] px-4 py-2.5 text-sm outline-none focus:border-[#3b7d57] focus:ring-1 focus:ring-[#3b7d57]"
                required
              />
              {pwError && (
                <p className="text-sm text-red-600">{pwError}</p>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setModalAction(null)}
                  className="flex-1 rounded-full border border-[#d8d0bf] py-2.5 text-sm font-semibold text-[#4d5a52] transition hover:border-[#15231d]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={pwLoading}
                  className={`flex-1 rounded-full py-2.5 text-sm font-bold text-white transition disabled:opacity-50 ${
                    modalAction === 'delete'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-[#15231d] hover:bg-[#2f4639]'
                  }`}
                >
                  {pwLoading ? '확인 중...' : modalAction === 'edit' ? '수정하기' : '삭제하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
