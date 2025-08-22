import { useCallback, useEffect, useState } from 'react'

// Sound configuration with Web Audio API fallback
export const SOUNDS = {
  // Button interaction sounds
  click: '/sounds/click.mp3',
  clickSoft: '/sounds/click-soft.mp3', 
  clickPrimary: '/sounds/click-primary.mp3',
  clickSecondary: '/sounds/click-secondary.mp3',
  
  // Key action sounds
  success: '/sounds/success.mp3',
  save: '/sounds/save.mp3',
  download: '/sounds/download.mp3',
  
  // Input interactions
  type: '/sounds/type.mp3',
  focus: '/sounds/focus.mp3',
  
  // Special actions
  theme: '/sounds/theme.mp3',
  upload: '/sounds/upload.mp3'
} as const

export type SoundType = keyof typeof SOUNDS

// Web Audio API synthetic sound generator
class SynthSoundGenerator {
  private audioContext: AudioContext | null = null

  private getAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext || AudioContext)()
    }
    return this.audioContext
  }

  playClick(volume = 0.3) {
    const ctx = this.getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }

  playClickSoft(volume = 0.2) {
    const ctx = this.getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(600, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05)
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.05)
  }

  playClickPrimary(volume = 0.35) {
    const ctx = this.getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08)
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.08)
  }

  playSuccess(volume = 0.4) {
    const ctx = this.getAudioContext()
    
    // Three-tone success sound
    const frequencies = [523, 659, 784] // C, E, G
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      const startTime = ctx.currentTime + index * 0.1
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(volume * 0.8, startTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.2)
    })
  }

  playType(volume = 0.15) {
    const ctx = this.getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(400, ctx.currentTime)
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.03)
  }
}

export type SoundType = keyof typeof SOUNDS

// Sound preferences management
const SOUND_PREFERENCES_KEY = 'invoice-generator-sound-preferences'

interface SoundPreferences {
  enabled: boolean
  volume: number
}

const defaultPreferences: SoundPreferences = {
  enabled: true,
  volume: 0.3 // 30% volume for subtle effects
}

export function useSoundPreferences() {
  const [preferences, setPreferences] = useState<SoundPreferences>(defaultPreferences)

  useEffect(() => {
    const saved = localStorage.getItem(SOUND_PREFERENCES_KEY)
    if (saved) {
      try {
        setPreferences({ ...defaultPreferences, ...JSON.parse(saved) })
      } catch {
        // Use defaults if parsing fails
      }
    }
  }, [])

  const updatePreferences = useCallback((newPrefs: Partial<SoundPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs }
      localStorage.setItem(SOUND_PREFERENCES_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return {
    preferences,
    updatePreferences,
    toggleEnabled: () => updatePreferences({ enabled: !preferences.enabled }),
    setVolume: (volume: number) => updatePreferences({ volume })
  }
}

// Main sound effects hook
export function useSoundEffects() {
  const { preferences } = useSoundPreferences()
  const [soundGenerator] = useState(() => new SynthSoundGenerator())

  const playSound = useCallback((soundType: SoundType) => {
    if (!preferences.enabled) return

    try {
      const volume = preferences.volume
      
      switch (soundType) {
        case 'click':
          soundGenerator.playClick(volume)
          break
        case 'clickSoft':
          soundGenerator.playClickSoft(volume * 0.7)
          break
        case 'clickPrimary':
          soundGenerator.playClickPrimary(volume)
          break
        case 'clickSecondary':
          soundGenerator.playClickSoft(volume * 0.8)
          break
        case 'success':
          soundGenerator.playSuccess(volume)
          break
        case 'save':
          soundGenerator.playSuccess(volume * 0.8)
          break
        case 'download':
          soundGenerator.playSuccess(volume)
          break
        case 'type':
          soundGenerator.playType(volume * 0.5)
          break
        case 'focus':
          soundGenerator.playClickSoft(volume * 0.6)
          break
        case 'theme':
          soundGenerator.playSuccess(volume * 0.7)
          break
        case 'upload':
          soundGenerator.playClickPrimary(volume * 0.8)
          break
        default:
          console.warn(`Unknown sound type: ${soundType}`)
      }
    } catch (error) {
      // Silently fail if audio context is not available
      console.debug('Audio not available:', error)
    }
  }, [preferences.enabled, preferences.volume, soundGenerator])

  return {
    playSound,
    enabled: preferences.enabled
  }
}

// Utility function to get the appropriate sound for button variants
export function getSoundForButtonVariant(variant?: string): SoundType {
  switch (variant) {
    case 'default':
      return 'clickPrimary'
    case 'destructive':
      return 'click'
    case 'outline':
      return 'clickSoft'
    case 'secondary':
      return 'clickSecondary'
    case 'ghost':
      return 'clickSoft'
    case 'link':
      return 'clickSoft'
    default:
      return 'click'
  }
}