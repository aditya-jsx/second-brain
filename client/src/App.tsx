import { Button } from './components/UI/button'
import { PlusIcon } from "./components/icons/plus.tsx"

function App() {

  return (
    <>
      <Button size='sm' variant='primary' text='Hello how are you' startIcon={<PlusIcon size='sm' />}  />
      <Button size='md' variant='secondary' text='Byee' />
      <Button size='lg' variant='secondary' text='Byee' />
    </>
  )
}

export default App
