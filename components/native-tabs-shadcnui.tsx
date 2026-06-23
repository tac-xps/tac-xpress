"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface NativeTabItem {
  id: string
  label: React.ReactNode
  content?: React.ReactNode
}

export interface NativeTabsProps {
  items: NativeTabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  tabListClassName?: string
  tabTriggerClassName?: string
}

export function NativeTabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  tabListClassName,
  tabTriggerClassName,
}: NativeTabsProps) {
  return (
    <Tabs
      defaultValue={defaultValue ?? items[0]?.id}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      <TabsList className={tabListClassName}>
        {items.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            className={tabTriggerClassName}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) =>
        item.content ? (
          <TabsContent key={item.id} value={item.id} className="mt-4">
            {item.content}
          </TabsContent>
        ) : null
      )}
    </Tabs>
  )
}
