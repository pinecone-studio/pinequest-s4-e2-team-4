import HomeBackdrop from '@/components/home/HomeBackdrop'
import PhoneFrame from '@/components/home/PhoneFrame'
import RouteMap from '@/app/route/components/RouteMap'
import React from 'react'
import Footer from '@/components/home/Footer'

export const page = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <HomeBackdrop active={true} />
      <div className="relative z-10">
        <PhoneFrame>
          <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1">
              <RouteMap />
            </div>
            <Footer />
          </div>
        </PhoneFrame>
      </div>
    </div>
  )
}

export default page
