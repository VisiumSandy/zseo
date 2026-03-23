'use client'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

interface TopBarProps {
  user: { name?: string | null; email?: string | null; image?: string | null }
}

export function TopBar({ user }: TopBarProps) {
  return (
    <header className="h-14 border-b border-border flex items-center justify-end px-4 bg-card/30 md:px-6 mt-[52px] md:mt-0">
      <div className="flex items-center gap-2">
        {user?.image && (
          <Image src={user.image} alt={user.name || ''} width={28} height={28} className="rounded-full" />
        )}
        <div className="text-sm hidden sm:block">
          <p className="font-medium leading-none text-xs">{user?.name}</p>
          <p className="text-muted-foreground text-xs mt-0.5 truncate max-w-[150px]">{user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="ml-1 text-muted-foreground hover:text-foreground transition-colors text-xs border border-border rounded-lg px-2 py-1.5">
          Déco
        </button>
      </div>
    </header>
  )
}
