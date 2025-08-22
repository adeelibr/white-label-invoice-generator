"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Volume2, VolumeX, Volume1 } from "lucide-react"
import { useSoundPreferences, useSoundEffects } from "@/lib/sounds"

export function SoundSettings() {
  const { preferences, toggleEnabled, setVolume } = useSoundPreferences()
  const { playSound } = useSoundEffects()

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const testSound = () => {
    playSound('clickPrimary')
  }

  const getVolumeIcon = () => {
    if (!preferences.enabled) return <VolumeX className="h-4 w-4" />
    if (preferences.volume < 0.3) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {getVolumeIcon()}
          Sound Effects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Sounds */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="sound-enabled" className="text-sm font-medium">
              Enable Sound Effects
            </Label>
            <p className="text-xs text-muted-foreground">
              Play subtle sound effects for interactions
            </p>
          </div>
          <Switch
            id="sound-enabled"
            checked={preferences.enabled}
            onCheckedChange={toggleEnabled}
          />
        </div>

        {/* Volume Control */}
        {preferences.enabled && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Volume ({Math.round(preferences.volume * 100)}%)
            </Label>
            <div className="flex items-center gap-3">
              <Volume1 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[preferences.volume]}
                onValueChange={handleVolumeChange}
                max={1}
                min={0.1}
                step={0.1}
                className="flex-1"
              />
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Test Sound Button */}
        {preferences.enabled && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testSound}
              className="w-full"
            >
              Test Sound
            </Button>
          </div>
        )}

        {/* Info Text */}
        <div className="text-xs text-muted-foreground">
          Sound effects provide audio feedback for button clicks and key actions to enhance the user experience.
        </div>
      </CardContent>
    </Card>
  )
}