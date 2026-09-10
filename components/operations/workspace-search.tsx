"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { workspaceNavigation } from "./navigation"
export function WorkspaceSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
  function navigate(href: string) {
    setOpen(false)
    setQuery("")
    router.push(href)
  }
  return (
    <>
      <Button
        id="tour-search"
        variant="outline"
        className="h-9 gap-2 text-muted-foreground"
        aria-label="Search workspace or AWB"
        onClick={() => setOpen(true)}
      >
        <Search />
        <span className="hidden xl:inline">Search workspace or AWB</span>
        <kbd className="ml-6 hidden font-mono text-xs xl:inline">Ctrl K</kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search the workspace"
        description="Find a page or enter an AWB number to track a shipment."
      >
        <Command>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search pages or enter an AWB…"
            maxLength={80}
            className="h-12 text-sm"
          />
          <CommandList>
            <CommandEmpty>
              No matching pages. Enter a shipment reference to track it.
            </CommandEmpty>
            {query.trim() && (
              <>
                <CommandGroup heading="Shipment tracking">
                  <CommandItem
                    forceMount
                    value={`track-${query}`}
                    onSelect={() =>
                      navigate(
                        `/dashboard/tracking?awb=${encodeURIComponent(query.trim())}`
                      )
                    }
                  >
                    <PackageSearch />
                    Track “{query.trim()}”
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            {workspaceNavigation.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map(({ title, href, icon: Icon }) => (
                  <CommandItem
                    key={href}
                    value={title}
                    onSelect={() => navigate(href)}
                  >
                    <Icon />
                    {title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
