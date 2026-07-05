'use client'

import { User as UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'

interface UserAvatarProps {
  name: string
  avatar?: string
  className?: string
  fallbackClassName?: string
}

/**
 * Profile picture with graceful degradation: photo when set, initials when
 * only a name exists, and a person icon when neither is available.
 */
export function UserAvatar({
  name,
  avatar,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const initials = getInitials(name)
  return (
    <Avatar className={cn('ring-border ring-1', className)}>
      {avatar && <AvatarImage src={avatar} alt={name} />}
      <AvatarFallback
        className={cn(
          'bg-primary/10 text-primary font-medium',
          fallbackClassName
        )}
      >
        {initials || <UserIcon className="size-1/2" aria-hidden />}
      </AvatarFallback>
    </Avatar>
  )
}
