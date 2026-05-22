'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, hashPassword, type Post } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type ModalAction = 'edit' | 'delete' | null

export default function PostActions({ post }: { post: Post }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  const [showMemberDeleteConfirm, setShowMemberDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const handleMemberDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('posts').delete().eq('id', post.id)
    if (!error) router.push('/board')
    else { setDeleting(false); setShowMemberDeleteConfirm(false) }
  }

  const handleGuestAction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pwInput) return
    setPwError('')
    setPwLoading(true)

    const hashed = await hashPassword(pwInput)
    if (hashed !== post.guest_password) {
      setPwError('비밀번호가 틀렸습니다.')
      setPwLoading(false)
      return
    }

    if (modalAction === 'delete') {
      const { error } = await supabase.from('posts').delete().eq('id', post.id)
      if (!error) router.push('/board')
      else { setPwError('삭제에 실패했습니다.'); setPwLoading(false) }
    } else {
      sessionStorage.setItem(`guest_pw_${post.id}`, hashed)
      router.push(`/board/${post.id}/edit`)
    }
  }

  const openGuestModal = (action: ModalAction) => {
    setPwInput('')
    setPwError('')
    setModalAction(action)
  }

  const isMemberAuthor = !!user && user.id === post.user_id
  const isGuestPost = post.user_id === null

  return (
    <>
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
              {pwError && <p className="text-sm text-red-600">{pwError}</p>}
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
    </>
  )
}