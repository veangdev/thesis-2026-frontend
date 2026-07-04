'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: cn(
          'relative flex flex-col gap-4 md:flex-row',
          defaultClassNames.months
        ),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 select-none aria-disabled:opacity-50',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 select-none aria-disabled:opacity-50',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-8 w-full items-center justify-center px-8',
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          'text-sm font-medium select-none',
          defaultClassNames.caption_label
        ),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground flex-1 rounded-md text-[0.8rem] font-normal select-none',
          defaultClassNames.weekday
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        day: cn(
          'group/day relative aspect-square h-full w-full p-0 text-center select-none',
          defaultClassNames.day
        ),
        today: cn(
          'bg-accent text-accent-foreground rounded-md',
          defaultClassNames.today
        ),
        outside: cn(
          'text-muted-foreground aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        disabled: cn(
          'text-muted-foreground opacity-50',
          defaultClassNames.disabled
        ),
        range_start: cn('rounded-l-md', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('rounded-r-md', defaultClassNames.range_end),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) =>
          orientation === 'left' ? (
            <ChevronLeftIcon className="size-4" {...chevronProps} />
          ) : (
            <ChevronRightIcon className="size-4" {...chevronProps} />
          ),
        DayButton: ({
          day,
          modifiers,
          className: dayClassName,
          ...dayProps
        }) => {
          // `day` is destructured only so it is not spread onto the DOM element.
          void day
          return (
            <button
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'size-8 w-full p-0 font-normal',
                modifiers.selected &&
                  !modifiers.range_middle &&
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                modifiers.range_middle &&
                  'bg-accent text-accent-foreground rounded-none',
                dayClassName
              )}
              {...dayProps}
            />
          )
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
