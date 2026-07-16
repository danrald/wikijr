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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4 text-[#212529] dark:text-slate-100">
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <button
              onClick={onToggle}
              aria-expanded={sidebarOpen}
              className="p-2 text-[#212529] dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            />
          }
        >
          <MenuIcon size={20} />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6} className="z-50">
            <Tooltip.Popup className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-2 py-1 text-xs">
              {sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>

      <span className="font-semibold text-[#212529] dark:text-slate-100 tracking-tight">WikiJr</span>

      <div className="ml-auto flex items-center gap-3">
        <Input
          placeholder="Search..."
          className="hidden sm:block w-56 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm text-[#212529] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-slate-400 dark:focus:border-slate-500"
        />

        <Menu.Root>
          <Menu.Trigger
            className="outline-none focus-visible:ring-2 focus-visible:bg-slate-400 "
            aria-label="Profile menu"
          >
            <Avatar.Root className="h-8 w-8 bg-slate-400 flex items-center justify-center text-white text-sm font-medium">
              <Avatar.Fallback>D</Avatar.Fallback>
            </Avatar.Root>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end" sideOffset={8} className="z-50">
              <Menu.Popup className="min-w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg py-1 text-[#212529] dark:text-slate-100 outline-none">
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium">Daniel</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">daniel.aldridge@gmail.com</p>
                </div>

                <Separator className="my-1 h-px bg-slate-200 dark:bg-slate-700" />

                <Menu.Group>
                  <Menu.GroupLabel className="px-3 py-1.5 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
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
                        className="grid grid-cols-[1.25rem_1rem_1fr] items-center gap-2 px-3 py-2 text-sm cursor-default select-none outline-none data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-slate-800"
                      >
                        <span className="col-start-1">
                          <Menu.RadioItemIndicator>
                            <Check size={14} />
                          </Menu.RadioItemIndicator>
                        </span>
                        <Icon size={14} className="col-start-2 text-slate-500 dark:text-slate-400" />
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
