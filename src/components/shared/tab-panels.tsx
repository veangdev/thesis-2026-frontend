'use client'

import * as React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export interface TabPanel {
  value: string
  label: React.ReactNode
  /** Panel body. Omit for filter-style tabs that only drive external state. */
  content?: React.ReactNode
  contentClassName?: string
}

interface TabPanelsProps {
  tabs: TabPanel[]
  /** Initial tab when uncontrolled; defaults to the first tab. */
  defaultValue?: string
  /** Pass `value` + `onValueChange` to control the active tab. */
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  listClassName?: string
  /** Rendered between the tab list and the panels (e.g. scoped filters). */
  children?: React.ReactNode
}

/** Declarative wrapper over the Tabs primitives: one `tabs` prop instead of
 * hand-wiring TabsList/TabsTrigger/TabsContent at every call site. Drop down
 * to `@/components/ui/tabs` only for layouts this shape can't express. */
export function TabPanels({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
  listClassName,
  children,
}: TabPanelsProps) {
  return (
    <Tabs
      defaultValue={
        value === undefined ? (defaultValue ?? tabs[0]?.value) : undefined
      }
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      <TabsList className={listClassName}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {children}

      {tabs.map(
        (tab) =>
          tab.content !== undefined && (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className={tab.contentClassName}
            >
              {tab.content}
            </TabsContent>
          )
      )}
    </Tabs>
  )
}
