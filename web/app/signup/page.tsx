import HomeBackdrop from '@/components/home/HomeBackdrop'
import PhoneFrame from '@/components/home/PhoneFrame'
import React from 'react'
import Photo from './components/Photo'
import Input from './components/Input'

const SignUp = () => {
  return (
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6'>
        <HomeBackdrop active/>
     <PhoneFrame >
        <div className='relative h-full w-full overflow-hidden bg-[#fbfff5]'>
          <Photo/>
          <Input/>
        </div>
     </PhoneFrame>
    </div>
  )
}

export default SignUp
