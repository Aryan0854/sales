"use client"

import * as React from "react"
import type { ToastProps, ToastActionElement } from "@radix-ui/react-toast"
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const ToastProvider = useToast.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof useToast.Viewport>,
  React.ComponentPropsWithoutRef<typeof useToast.Viewport>
>(({ className, ...props }, ref) => (
  <useToast.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = useToast.Viewport.displayName

const Toast = React.forwardRef<
  React.ElementRef<typeof useToast.Root>,
  React.ComponentPropsWithoutRef<typeof useToast.Root>
>(({ className, variant, children, ...props }, ref) => {
  const { toast } = useToast()
  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  }[variant || "info"]

  return (
    <useToast.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        variant === "success" && "border-green-500 bg-green-50 text-green-900",
        variant === "error" && "border-red-500 bg-red-50 text-red-900",
        variant === "info" && "border-blue-500 bg-blue-50 text-blue-900",
        variant === "warning" && "border-yellow-500 bg-yellow-50 text-yellow-900",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <div className="grid gap-1">{children}</div>
      <useToast.Close className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100">
        <X className="h-4 w-4" />
      </useToast.Close>
    </useToast.Root>
  )
})
Toast.displayName = useToast.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof useToast.Action>,
  React.ComponentPropsWithoutRef<typeof useToast.Action>
>(({ className, ...props }, ref) => (
  <useToast.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = useToast.Action.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof useToast.Title>,
  React.ComponentPropsWithoutRef<typeof useToast.Title>
>(({ className, ...props }, ref) => (
  <useToast.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
ToastTitle.displayName = useToast.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof useToast.Description>,
  React.ComponentPropsWithoutRef<typeof useToast.Description>
>(({ className, ...props }, ref) => (
  <useToast.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))
ToastDescription.displayName = useToast.Description.displayName

type ToastPropsWithVariant = ToastProps & {
  variant?: "success" | "error" | "info" | "warning"
}

export {
  Toast,
  ToastAction,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  type ToastPropsWithVariant as ToastProps,
  type ToastActionElement,
}
