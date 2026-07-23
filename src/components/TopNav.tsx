import { Avatar } from '@base-ui/react/avatar'
import { Input } from '@base-ui/react/input'
import { Menu } from '@base-ui/react/menu'
import { Separator } from '@base-ui/react/separator'
import { Tooltip } from '@base-ui/react/tooltip'
import { Check, Menu as MenuIcon, Monitor, Moon, Sun } from 'lucide-react'
import { useThemeMode, type ThemeMode } from '../lib/theme'

interface TopNavProps {
  sidebarOpen: boolean
  onToggle: () => void
}

const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'auto', label: 'System', icon: Monitor },
]

export default function TopNav({ sidebarOpen, onToggle }: TopNavProps) {
  const [mode, changeMode] = useThemeMode()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[var(--header-bg)] backdrop-blur-lg border-b border-line flex items-center px-4 gap-4 text-sea-ink">
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <button
              onClick={onToggle}
              aria-expanded={sidebarOpen}
              className="btn-icon text-sea-ink"
            />
          }
        >
          <MenuIcon size={20} />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6} className="z-50">
            <Tooltip.Popup className="bg-sea-ink text-foam px-2 py-1 text-xs">
              {sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>

      <span className="font-semibold text-sea-ink tracking-tight">WikiJr</span>

      <div className="ml-auto flex items-center gap-3">
        <Input
          placeholder="Search..."
          className="input hidden sm:block w-56 py-1.5"
        />

        <Menu.Root>
          <Menu.Trigger
            className="outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lagoon-deep"
            aria-label="Profile menu"
          >
            <Avatar.Root className="h-8 w-8 bg-lagoon-deep flex items-center justify-center text-foam text-sm font-medium">
              <Avatar.Fallback>D</Avatar.Fallback>
            </Avatar.Root>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end" sideOffset={8} className="z-50">
              <Menu.Popup className="popup min-w-52 py-1 outline-none">
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium">Daniel</p>
                  <p className="text-xs text-sea-ink-soft">daniel.aldridge@gmail.com</p>
                </div>

                <Separator className="my-1 h-px bg-line" />

                <Menu.Group>
                  <Menu.GroupLabel className="px-3 py-1.5 text-xs uppercase tracking-wide text-sea-ink-soft">
                    Theme
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    value={mode}
                    onValueChange={(value) => changeMode(value as ThemeMode)}
                  >
                    {themeOptions.map(({ value, label, icon: Icon }) => (
                      <Menu.RadioItem
                        key={value}
                        value={value}
                        className="grid grid-cols-[1.25rem_1rem_1fr] items-center gap-2 px-3 py-2 text-sm cursor-default select-none outline-none data-[highlighted]:bg-link-hover"
                      >
                        <span className="col-start-1">
                          <Menu.RadioItemIndicator>
                            <Check size={14} />
                          </Menu.RadioItemIndicator>
                        </span>
                        <Icon size={14} className="col-start-2 text-sea-ink-soft" />
                        <span className="col-start-3">{label}</span>
                      </Menu.RadioItem>
                    ))}
                  </Menu.RadioGroup>
                </Menu.Group>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
    </header>
  )
}
