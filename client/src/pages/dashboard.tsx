import { useState } from 'react'
import { Button } from '../components/UI/button'
import { Card } from '../components/UI/card.tsx'
import { CreateContentModal } from '../components/UI/createContentModal.tsx'
import { PlusIcon } from "../components/icons/plus.tsx"
import { ShareIcon } from "../components/icons/shareIcon.tsx"
import { Sidebar } from '../components/UI/sideBar.tsx'
import { useContent } from '../hooks/useContent.tsx'

export function Dashboard() {

  const [modalOpen, setModalOpen] = useState(false);
  const contents = useContent();

  return (
    <>
      <div className="flex">

        {/* sidebar */}
        <div>
          <Sidebar />
        </div>

        {/* content Screen */}
        <div className='w-full h-full'>
          <CreateContentModal open={modalOpen} onClose={()=>{
            setModalOpen(false);
          }} />


          {/* Content */}
          <div className='flex flex-col gap-4'>

            {/* nav */}
            <div className='border-b px-4 py-2 '>
              <div className='flex justify-end gap-2 mr-2 '>
                <Button size='sm' onClick={()=>{setModalOpen(true)}} variant='primary' text='Add Content' startIcon={<PlusIcon size='sm' />}  />
                <Button size='sm' variant='secondary' text='Share Brain' startIcon={<ShareIcon size='sm' />} />
              </div>
            </div>
            
            {/* cards */}
            <div className='flex gap-8 m-2 ml-6'>
              {contents.map(({type, link, title}) =>
                <Card startIcon={<PlusIcon size='sm' />} endIcon={<ShareIcon size='sm' />} title={title} heading='Future Projects' link={link} type={type} />
              )}

              <Card startIcon={<PlusIcon size='sm' />} endIcon={<ShareIcon size='sm' />} title='Project Ideas' heading='Future Projects' link={"https://www.youtube.com/watch/PJ3ZQk_lr9E?si=FDfXn9Mwmip2Ptwy"} type='youtube' />
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
