import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import{fetchPosts} from "./api/api"
import PostList from './components/postList'
function App() {



  return (
    <>
    <PostList />
    </>
  )
}

export default App
