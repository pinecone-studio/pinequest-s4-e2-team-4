import HomeBackdrop from '@/components/home/HomeBackdrop'
import PhoneFrame from '@/components/home/PhoneFrame'
import React from 'react'

const SignUp = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen w-full'>
        <HomeBackdrop active/>
     <PhoneFrame >
        <div></div>
     </PhoneFrame>
    </div>
  )
}

export default SignUp

