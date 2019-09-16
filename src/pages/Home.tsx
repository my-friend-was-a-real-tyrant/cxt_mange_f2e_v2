import React from 'react'
import welcome from 'assets/images/analyze_on_screen.png'

const Home = () => {
  return (
    <div className="home">
      <img src={welcome} alt=""/>
      <p>欢迎进入AI车险通管理后台</p>
    </div>
  )
}

export default Home
