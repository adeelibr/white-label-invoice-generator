"use client"

import { useCallback, useEffect, useState } from 'react'

// Sound configuration with audio files
export const SOUNDS = {
  // Button interaction sounds
  click: '/sounds/click.wav',
  clickSoft: '/sounds/click-soft.wav', 
  clickPrimary: '/sounds/click-primary.wav',
  clickSecondary: '/sounds/click-secondary.wav',
  
  // Key action sounds
  success: '/sounds/success.wav',
  save: '/sounds/save.wav',
  download: '/sounds/download.wav',
  
  // Input interactions
  type: '/sounds/type.wav',
  focus: '/sounds/focus.wav',
  
  // Special actions
  theme: '/sounds/theme.wav',
  upload: '/sounds/upload.wav'
} as const

export type SoundType = keyof typeof SOUNDS

// Audio file player class
class AudioFilePlayer {
  private audioCache: Map<string, HTMLAudioElement> = new Map()

  private getAudio(soundPath: string): HTMLAudioElement | null {
    // Only create Audio objects on the client side
    if (typeof window === 'undefined') return null
    
    if (!this.audioCache.has(soundPath)) {
      const audio = new Audio(soundPath)
      audio.preload = 'auto'
      // Set reasonable defaults
      audio.volume = 0.3
      this.audioCache.set(soundPath, audio)
    }
    return this.audioCache.get(soundPath)!
  }

  async playAudio(soundPath: string, volume = 0.3) {
    try {
      const audio = this.getAudio(soundPath)
      if (!audio) return // Skip if running on server
      
      audio.volume = volume
      audio.currentTime = 0 // Reset to beginning for quick repeated plays
      await audio.play()
    } catch (error) {
      // Silently fail if audio can't be played (e.g., user hasn't interacted with page yet)
      console.debug('Audio playback failed:', error)
    }
  }

  preloadAll(sounds: Record<string, string>) {
    // Only preload on client side
    if (typeof window === 'undefined') return
    
    // Preload all sound files
    Object.values(sounds).forEach(soundPath => {
      this.getAudio(soundPath)
    })
  }
}


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
  const [audioPlayer] = useState(() => {
    const player = new AudioFilePlayer()
    // Preload all sound files
    player.preloadAll(SOUNDS)
    return player
  })

  const playSound = useCallback((soundType: SoundType) => {
    if (!preferences.enabled) return

    const soundPath = SOUNDS[soundType]
    if (!soundPath) {
      console.warn(`Unknown sound type: ${soundType}`)
      return
    }

    try {
      const volume = preferences.volume
      audioPlayer.playAudio(soundPath, volume)
    } catch (error) {
      // Silently fail if audio is not available
      console.debug('Audio not available:', error)
    }
  }, [preferences.enabled, preferences.volume, audioPlayer])

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