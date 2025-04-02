'use client'

import { Button } from '@/components/button'
import { ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState, useRef, useCallback } from 'react'

// Constants
const FALLBACK_VIDEO_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
const DESKTOP_TIMEOUT_MS = 600000

// Types
interface DemoSectionProps {
  onDesktopDeployed: (url: string, id: string) => void
  onDesktopStopped: () => void
  desktopId?: string
}

interface DesktopResponse {
  streamUrl: string
  id: string
}

// Main component
export function DemoSection({
  onDesktopDeployed,
  onDesktopStopped,
  desktopId,
}: DemoSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [streamUrl, setStreamUrl] = useState<string>(FALLBACK_VIDEO_URL)
  const demoContentRef = useRef<HTMLDivElement>(null)

  // Function to launch the demo
  const launchDemo = async () => {
    setIsLoading(true)

    // Check if we're on mobile (using the same logic as in DesktopIframe)
    const isMobile = window.innerWidth < 768;
    
    // Scroll to the demo content only on mobile
    if (demoContentRef.current) {
      if (isMobile) {
        // On mobile, scroll to the top of the demo content
        demoContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // On desktop, scroll to center the demo content
        demoContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    try {
      const { streamUrl, id } = await deployVirtualDesktop()
      setStreamUrl(streamUrl)

      if (onDesktopDeployed) {
        onDesktopDeployed(streamUrl, id)
      }
    } catch (error) {
      console.error('Error executing action:', error)
      setStreamUrl(FALLBACK_VIDEO_URL)
    }

    // Simulate minimum loading time for better UX
    setTimeout(() => setIsLoading(false), 800)
  }

  // Function to handle stopping the desktop
  const handleStopDesktop = async (id: string) => {
    setIsLoading(true)
    const success = await stopVirtualDesktop(id)

    if (success) {
      // Show a placeholder or different content after stopping
      setStreamUrl('about:blank')
      setTimeout(() => {
        setIsLoading(false)
        setStreamUrl(FALLBACK_VIDEO_URL)
        // Call the parent component's callback to handle any parent state updates
        onDesktopStopped()
      }, 800)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full w-full rounded-lg border border-gray-300 bg-gray-50 overflow-hidden flex-col relative">
      <DemoHeader
        desktopId={desktopId}
        onStopDesktop={handleStopDesktop}
      />
      <DemoContent
        isLoading={isLoading}
        isDemoLaunched={!!desktopId}
        streamUrl={streamUrl}
        onLaunchDemo={launchDemo}
        ref={demoContentRef}
      />
      
      {/* Mobile stop button - only visible on mobile devices */}
      {desktopId && (
        <div className="md:hidden w-full flex justify-center mt-4 mb-6">
          <button
            onClick={() => handleStopDesktop(desktopId)}
            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            <ComputerDesktopIcon className="mr-2 h-4 w-4" />
            Stop Desktop
          </button>
        </div>
      )}
    </div>
  )
}

const DemoHeader = ({
  desktopId,
  onStopDesktop,
}: {
  desktopId?: string
  onStopDesktop: (id: string) => Promise<void>
}) => (
  <div className="border-b border-gray-300 bg-white p-6">
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="flex-shrink-0 md:max-w-xs">
        <h3 className="text-lg font-semibold text-gray-900">
          Try an interactive demo
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          See how easy it is to deploy a virtual desktop with our API
        </p>

        {desktopId && (
          <button
            onClick={() => onStopDesktop(desktopId)}
            className="mt-4 hidden md:inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            <ComputerDesktopIcon className="mr-2 h-4 w-4" />
            Stop Desktop
          </button>
        )}
      </div>
    </div>
  </div>
)

const LoadingState = () => (
  <div className="flex h-full w-full items-center justify-center bg-gray-50">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
  </div>
)

const DesktopIframe = ({ streamUrl }: { streamUrl: string }) => {
  const [scale, setScale] = useState(0.5);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Calculate and set the optimal scale based on container size
  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // Calculate how much we need to scale down to fit
    const widthScale = (containerWidth * 0.85) / 1024;
    const heightScale = (containerHeight * 0.85) / 768;
    
    // Use the smaller scale to ensure it fits both dimensions
    const optimalScale = Math.min(widthScale, heightScale);
    
    setScale(Math.max(0.1, Math.min(1.0, optimalScale)));
  }, []);

  // Set up resize observer to update scale when container size changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    updateScale();
    
    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [updateScale]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-[400px] md:h-[500px] bg-black"
    >
      <div 
        className="w-full h-full flex items-center justify-center overflow-auto"
        style={{ 
          alignItems: isMobile ? 'flex-start' : 'center',
          paddingTop: isMobile ? '60px' : '0'
        }}
      >
        <div 
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: isMobile ? 'top center' : 'center center',
          }}
        >
          <iframe
            src={streamUrl}
            width={1024}
            height={768}
            style={{ border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; clipboard-read; clipboard-write; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const InitialDemoState = ({ onLaunchDemo }: { onLaunchDemo: () => void }) => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="text-center">
      <ComputerDesktopIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
      <p className="text-center text-lg font-medium">
        Deploy a virtual desktop
      </p>
      <p className="mt-2 max-w-md text-center text-sm">
        Production ready, secure, and scalable
      </p>

      <button
        onClick={onLaunchDemo}
        className="mx-auto mt-6 flex items-center rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
      >
        <ComputerDesktopIcon className="mr-2 h-4 w-4" />
        Launch demo
      </button>
    </div>
  </div>
)

const DemoContent = React.forwardRef<
  HTMLDivElement,
  {
    isLoading: boolean
    isDemoLaunched: boolean
    streamUrl: string
    onLaunchDemo: () => void
  }
>(({
  isLoading,
  isDemoLaunched,
  streamUrl,
  onLaunchDemo,
}, ref) => {
  let content;
  
  if (isLoading) {
    content = <LoadingState />;
  } else if (isDemoLaunched) {
    content = <DesktopIframe streamUrl={streamUrl} />;
  } else {
    content = <InitialDemoState onLaunchDemo={onLaunchDemo} />;
  }
  
  return (
    <div ref={ref} className="flex-grow flex justify-center items-center min-h-[400px] max-h-[400px] md:min-h-[500px] md:max-h-[500px]">
        {content}
    </div>
  );
})

DemoContent.displayName = 'DemoContent';

// API functions
const deployVirtualDesktop = async (): Promise<DesktopResponse> => {
  try {
    const response = await fetch('/api/playground/desktop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timeoutMs: DESKTOP_TIMEOUT_MS }),
    })

    if (!response.ok) {
      throw new Error('Failed to deploy desktop')
    }

    const data = await response.json()
    return { streamUrl: data.streamUrl, id: data.id }
  } catch (error) {
    console.error('Error deploying desktop:', error)
    // Return a fallback URL for demo purposes
    return {
      streamUrl: FALLBACK_VIDEO_URL,
      id: 'demo-fallback-id',
    }
  }
}

const stopVirtualDesktop = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/playground/desktop', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    if (!response.ok) {
      throw new Error('Failed to stop desktop')
    }

    return true
  } catch (error) {
    console.error('Error stopping desktop:', error)
    return false
  }
}
