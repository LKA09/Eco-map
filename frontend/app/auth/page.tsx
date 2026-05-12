'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else {
        router.push('/board')
      }
    } else {
      if (!nickname.trim()) {
        setError('닉네임을 입력해주세요.')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname } },
      })
      if (error) {
        setError(error.message)
      } else {
        setMessage('가입 확인 이메일을 발송했습니다. 이메일을 확인해주세요.')
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#f7f4ec] pt-16 flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#d8d0bf] bg-white p-8 shadow-sm">
          {/* 탭 */}
          <div className="mb-8 flex rounded-lg bg-[#f0ede5] p-1">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setMessage('') }}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
                  mode === m
                    ? 'bg-white text-[#15231d] shadow-sm'
                    : 'text-[#4d5a52] hover:text-[#15231d]'
                }`}
              >
                {m === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-[#15231d] mb-1">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="게시판에 표시될 이름"
                  className="w-full rounded-lg border border-[#d8d0bf] bg-[#fffdf6] px-4 py-2.5 text-sm outline-none focus:border-[#3b7d57] focus:ring-1 focus:ring-[#3b7d57]"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#15231d] mb-1">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-lg border border-[#d8d0bf] bg-[#fffdf6] px-4 py-2.5 text-sm outline-none focus:border-[#3b7d57] focus:ring-1 focus:ring-[#3b7d57]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#15231d] mb-1">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? '6자 이상' : ''}
                className="w-full rounded-lg border border-[#d8d0bf] bg-[#fffdf6] px-4 py-2.5 text-sm outline-none focus:border-[#3b7d57] focus:ring-1 focus:ring-[#3b7d57]"
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}
            {message && (
              <p className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#15231d] py-3 text-sm font-bold text-white transition hover:bg-[#2f4639] disabled:opacity-50"
            >
              {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#4d5a52]">
            <Link href="/" className="text-[#3b7d57] hover:underline">
              홈으로 돌아가기
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
