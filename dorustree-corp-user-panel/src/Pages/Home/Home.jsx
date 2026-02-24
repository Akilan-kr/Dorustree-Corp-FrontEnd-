import React from 'react'
import Header from '../../Components/Header/Header'
import ExploreProduct from '../ExploreProduct/ExploreProduct'

function Home() {
  return (
    <main className='container'>
      <Header />
      <ExploreProduct/>
      {/* <ExploreMenu category={category}  setCategory={setCategory}/> */}
      {/* <FoodPowderDisplay category={category} searchText={''}/> */}
    </main>
  )
}

export default Home