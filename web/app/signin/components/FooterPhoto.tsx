import React from 'react'

const FooterPhoto = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 z-0 h-[48%]">
      <img
        src="/road.png"
        alt="Footer Photo"
        className="h-full w-full object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.2)_8%,#000_34%,#000_100%)]"
      />
    </div>
  )
}

export default FooterPhoto
