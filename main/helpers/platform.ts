import os from 'os'

export const isMac = os.platform() === 'darwin'
export const isWindows = os.platform() === 'win32'
export const isLinux = os.platform() === 'linux'

type PlatformSelect<T> = { mac?: T; windows?: T; linux?: T }

export function platformSelect<T>({ mac, windows, linux }: PlatformSelect<T>) {
  if (isMac) {
    return mac
  } else if (isWindows) {
    return windows
  } else if (isLinux) {
    return linux
  }
}
