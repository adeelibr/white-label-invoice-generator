import * as React from "react"
import { Input as BaseInput } from "@/components/ui/input"
import { Textarea as BaseTextarea } from "@/components/ui/textarea"
import { useSoundEffects } from "@/lib/sounds"
import { cn } from "@/lib/utils"

// Enhanced Input with sound effects
export const InputWithSound = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, onFocus, onChange, ...props }, ref) => {
  const { playSound } = useSoundEffects()

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    playSound('focus')
    if (onFocus) {
      onFocus(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Play subtle typing sound occasionally (not every keystroke)
    if (Math.random() < 0.3) { // 30% chance to avoid being annoying
      playSound('type')
    }
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <BaseInput
      className={cn(className)}
      onFocus={handleFocus}
      onChange={handleChange}
      ref={ref}
      {...props}
    />
  )
})
InputWithSound.displayName = "InputWithSound"

// Enhanced Textarea with sound effects
export const TextareaWithSound = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, onFocus, onChange, ...props }, ref) => {
  const { playSound } = useSoundEffects()

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    playSound('focus')
    if (onFocus) {
      onFocus(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Play subtle typing sound occasionally
    if (Math.random() < 0.2) { // 20% chance for textarea
      playSound('type')
    }
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <BaseTextarea
      className={cn(className)}
      onFocus={handleFocus}
      onChange={handleChange}
      ref={ref}
      {...props}
    />
  )
})
TextareaWithSound.displayName = "TextareaWithSound"