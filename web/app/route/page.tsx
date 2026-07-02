import HomeBackdrop from '@/components/home/HomeBackdrop'
import PhoneFrame from '@/components/home/PhoneFrame'
import RouteMap from '@/app/route/components/RouteMap'
import React from 'react'
import Footer from '@/components/home/Footer'
import "mapbox-gl/dist/mapbox-gl.css";

interface PageProps {
  searchParams: Promise<{ tripId?: string }>;
}

// Next.js-ийн стандартын дагуу Том үсгээр (RoutePage) нэрлэж, шууд default-оор экспортлов
export default async function RoutePage({ searchParams }: PageProps) {
  
  const resolvedParams = await searchParams;
  const tripId = resolvedParams.tripId;

  console.log("URL-аас амжилттай барьж авсан Trip ID:", tripId);

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <HomeBackdrop active={true} />
      <div className="relative z-10">
        <PhoneFrame>
          <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1">
              {/* Барьж авсан tripId-ийг RouteMap руу зөв дамжуулна */}
              <RouteMap tripId={tripId} />
            </div>
            <Footer />
          </div>
        </PhoneFrame>
      </div>
    </div>
  )
}