import React, { useState } from 'react'
import { addPost, fetchPosts, fetchTags } from '../api/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const PostList = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const {data:postData, isLoading, isError,error} = useQuery({
    queryKey: ["posts", {page}],
    queryFn: ()=>fetchPosts(page),
  })
  const {data:tagsData} = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  })
  const {mutate, isError:isPostError,isPending, error:postError, reset} =  useMutation({
    mutationFn: addPost,
    onMutate:()=>{ return {id:1} },
    onSuccess:(data, variable, context)=>{
      queryClient.invalidateQueries({
        queryKey : ["posts"],
        exact:true,
        // predicate: query => {
        //   query.queryKey[0] === "posts" && query.queryKey[1] >= 2
        // }
      })
    },
    // onError: (error, variable, context)=>{},
    // onSettled: (data,error, variable, context)=>{}
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const title = formData.get("title")
    const tags = Array.from(formData.keys().filter(key=>formData.get(key)==='on'))
   
    if(!title || !tags)return
    mutate({id:postData?.data.length+1,title, tags})
    e.target.reset()
  }
  return (
    <div className='container'>
      <form className='p-5 border-sky-100	border-2	rounded-3xl' onSubmit={handleSubmit}>
        <input type="text" name="title" className='px-4 py-2 rounded border-2 border-cyan-500' placeholder='Enter you post title...'/>
        <div className='flex justify-center'>
          {tagsData?.map(tag =>{
            return (
              <div className='px-5 py-3' key={tag}>
                <input type="checkbox" name={tag} id={tag} />
                <label className="pl-1"htmlFor={tag}>{tag}</label>
              </div>
            )
          })}
        </div>
        <button  className='m-3 cursor-pointer'>Add Post</button>
      </form>
          
        <h1 className='p-5'>My post</h1>
        <div className="my-5">
          <button onClick={()=> setPage(oldPage=>Math.max(oldPage-1,0))
          } disabled={!postData?.prev}
          >Prev</button>
          <span className='px-3'>Current: {page}</span>
          <button onClick={() => {setPage((old) => old + 1)}}
          disabled={!postData?.next}
          >Next</button>
        </div>
        {isLoading && isPending && <p>Loading...</p>}
        {isError && <p>{error?.message}</p>}
        {isPostError && <p onClick= {()=>reset()} >Unable to post...Please try later</p>}
        <div className='flex flex-wrap'>
        {postData?.data?.map((post)=>{
            return (
            <div className='text-stone-400 mt-2 p-5 w-2/6 shadow-sm	' key={post.id}>
              <h2 className='text-lg font-medium m-2 text-stone-600	uppercase'>{post.title}</h2>
              {post.tags.map(tag => {
                  return (
                      <li  key= {tag}>{tag}</li>
                  )
              })}
            
            </div>)
        })}
        </div>

    </div>
  )
}

export default PostList