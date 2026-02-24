'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const TabsContext = React.createContext<{ selectedTab: string; setSelectedTab: (tab: string) => void } | undefined>(undefined)

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [selectedTab, setSelectedTab] = React.useState(defaultValue)

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className={cn('tabs', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn('flex space-x-4', className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)

  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component')
  }

  const { selectedTab, setSelectedTab } = context
  const isSelected = selectedTab === value

  return (
    <Button
      variant="ghost"
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => setSelectedTab(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-none',
        isSelected
          ? 'border-b-2 border-blue-600 text-blue-600'
          : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent',
        className
      )}
    >
      {children}
    </Button>
  )
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = React.useContext(TabsContext)

  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component')
  }

  const { selectedTab } = context
  const isSelected = selectedTab === value

  if (!isSelected) return null

  return (
    <div
      role="tabpanel"
      className={cn('mt-2', className)}
    >
      {children}
    </div>
  )
} 