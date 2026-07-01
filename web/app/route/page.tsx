import HomeBackdrop from '@/components/home/HomeBackdrop'
import PhoneFrame from '@/components/home/PhoneFrame'
import RouteMap from '@/app/route/components/RouteMap'
import React from 'react'
import Footer from '@/components/home/Footer'

interface PageProps {
  searchParams: Promise<{ tripId?: string }>;
}

export const page = async ({ searchParams }: PageProps) => {
  
  const { tripId } = await searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <HomeBackdrop active={true} />
      <div className="relative z-10">
        <PhoneFrame>
          <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1">
           
              <RouteMap tripId={tripId} />
            </div>
            <Footer />
          </div>
        </PhoneFrame>
      </div>
    </div>
  )
}

export default page