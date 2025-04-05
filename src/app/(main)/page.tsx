import { getSession } from '@/lib/getSession'
import React from 'react'

const Home = async () => {

  const session = await getSession();
  console.log("********************");
  console.log(session);
  console.log("********************");
  
  return (
    <div>Home</div>
  )
}

export default Home