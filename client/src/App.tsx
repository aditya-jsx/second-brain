import { Button } from './components/UI/button'
import { PlusIcon } from "./components/icons/plus.tsx"
import { ShareIcon } from "./components/icons/shareIcon.tsx"

function App() {

  return (
    <>
      <Button size='sm' variant='primary' text='Add Content' startIcon={<PlusIcon size='sm' />}  />
      <Button size='sm' variant='secondary' text='Share Brain' startIcon={<ShareIcon size='sm' />} />
    </>
  )
}

export default App
