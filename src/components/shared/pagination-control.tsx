'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationControlProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Max numbered links to show before collapsing with an ellipsis. */
  siblingCount?: number
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/** Controlled pagination wrapper around the shadcn pagination primitives. */
export function PaginationControl({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationControlProps) {
  if (totalPages <= 1) return null

  const go = (target: number) => (event: React.MouseEvent) => {
    event.preventDefault()
    const clamped = Math.min(Math.max(target, 1), totalPages)
    if (clamped !== page) onPageChange(clamped)
  }

  const start = Math.max(2, page - siblingCount)
  const end = Math.min(totalPages - 1, page + siblingCount)
  const middle = range(start, end)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={go(page - 1)}
            aria-disabled={page === 1}
            className={
              page === 1 ? 'pointer-events-none opacity-50' : undefined
            }
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#" isActive={page === 1} onClick={go(1)}>
            1
          </PaginationLink>
        </PaginationItem>

        {start > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {middle.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href="#" isActive={p === page} onClick={go(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {end < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={page === totalPages}
              onClick={go(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={go(page + 1)}
            aria-disabled={page === totalPages}
            className={
              page === totalPages ? 'pointer-events-none opacity-50' : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
