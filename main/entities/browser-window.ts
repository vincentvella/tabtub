import { BrowserWindow as ElectronBrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { screen } from 'electron'
import ElectronStore from 'electron-store'

type WindowDimensions = Pick<BrowserWindowConstructorOptions, 'x' | 'y' | 'width' | 'height'>

export class BrowserWindow {
  key: string = 'window-state'
  name: string
  store: ElectronStore<Record<string, unknown>>
  defaults: BrowserWindowConstructorOptions
  self: ElectronBrowserWindow
  state: WindowDimensions

  constructor(windowName: string, options: BrowserWindowConstructorOptions) {
    const name = `${this.key}-${windowName}`
    this.store = new ElectronStore({ name })
    this.defaults = options
    this.state = this.ensureVisibleOnSomeDisplay(this.restore())
    const browserOptions: BrowserWindowConstructorOptions = {
      ...options,
      ...this.state,
      title: 'TabTub',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        // sandbox: true,
        ...options.webPreferences,
      },
    }
    this.self = new ElectronBrowserWindow(browserOptions)
    this.setupListeners()
  }

  private restore = () => {
    const defaultDimensions: WindowDimensions = {
      width: this.defaults.width,
      height: this.defaults.height,
    }

    const restored = this.store.get(this.key, defaultDimensions)
    return restored
  }

  private getCurrentPosition = (): WindowDimensions => {
    const position = this.self.getPosition()
    const size = this.self.getSize()
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    }
  }

  private windowWithinBounds = (dimensions: WindowDimensions, bounds: WindowDimensions) => {
    return (
      dimensions.x >= bounds.x &&
      dimensions.y >= bounds.y &&
      dimensions.x + dimensions.width <= bounds.x + bounds.width &&
      dimensions.y + dimensions.height <= bounds.y + bounds.height
    )
  }

  private resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds
    return Object.assign({}, this.defaults, {
      x: (bounds.width - this.defaults.width) / 2,
      y: (bounds.height - this.defaults.height) / 2,
    })
  }

  private ensureVisibleOnSomeDisplay = (windowState: WindowDimensions) => {
    const visible = screen
      .getAllDisplays()
      .some((display) => this.windowWithinBounds(windowState, display.bounds))
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return this.resetToDefaults()
    }
    return windowState
  }

  private setupListeners() {
    this.self.on('close', this.saveState)
  }

  public saveState = () => {
    if (!this.self.isMinimized() && !this.self.isMaximized()) {
      Object.assign(this.state, this.getCurrentPosition())
    }
    this.store.set(this.key, this.state)
  }
}
