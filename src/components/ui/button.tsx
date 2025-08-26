'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { type HTMLMotionProps, motion, type Transition } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { LoadingDots } from './loading-dots'

const buttonVariants = cva(
  "relative overflow-hidden cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground bg-gradient-to-r from-brand-primary to-brand-secondary',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      size: {
        default: 'h-11 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 px-8 has-[>svg]:px-6',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const rippleVariants = cva('absolute rounded-full size-5 pointer-events-none', {
  variants: {
    variant: {
      default: 'bg-primary-foreground',
      destructive: 'bg-destructive',
      outline: 'bg-input',
      secondary: 'bg-secondary',
      ghost: 'bg-accent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const loadingVariants = cva('!w-full', {
  variants: {
    variant: {
      default: '!text-primary-foreground',
      white: '!text-black dark:!text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type Ripple = {
  id: number
  x: number
  y: number
}

type ButtonProps = HTMLMotionProps<'button'> & {
  children: React.ReactNode
  rippleClassName?: string
  scale?: number
  transition?: Transition
  isLoading?: boolean
  animate?: boolean
} & VariantProps<typeof buttonVariants>

function Button({
  ref,
  children,
  onClick,
  className,
  rippleClassName,
  variant,
  size,
  scale = 10,
  transition = { duration: 0.6, ease: 'easeOut' },
  isLoading = false,
  animate = true,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement)

  const createRipple = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const newRipple: Ripple = {
        id: Date.now(),
        x,
        y,
      }

      setRipples((prev) => [...prev, newRipple])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 600)
    },
    [],
  )

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event)
      if (onClick) {
        onClick(event)
      }
    },
    [createRipple, onClick],
  )

  return (
    <motion.button
      ref={buttonRef}
      data-slot="ripple-button"
      onClick={handleClick}
      whileTap={animate ? { scale: 0.95 } : undefined}
      whileHover={animate ? { scale: 1.05 } : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex h-full w-full min-w-10 items-center justify-center">
          <LoadingDots
            className={cn(
              loadingVariants({
                variant:
                  !variant || variant === 'default' ? 'default' : 'white',
              }),
            )}
            size={24}
          />
        </div>
      ) : (
        children
      )}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale, opacity: 0 }}
          transition={transition}
          className={cn(
            rippleVariants({ variant, className: rippleClassName }),
          )}
          style={{
            top: ripple.y - 10,
            left: ripple.x - 10,
          }}
        />
      ))}
    </motion.button>
  )
}

export { Button, type ButtonProps }
