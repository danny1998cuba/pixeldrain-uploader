import { useCallback, useEffect, useState } from "react"
import Settings from "./components/functions/Settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Toaster } from "./components/ui/toaster"
import { GlobalsApiConector } from "./api/globals"
import FilesCard from "./components/functions/FilesCard"
import { IQueueElement } from "./api/api.types"
import { QueueApiConector } from "./api/queue"

const App = () => {
  const [hasKey, setHasKey] = useState<boolean>(false)
  const [queue, setQueue] = useState<IQueueElement[]>([])

  const [tab, setTab] = useState<string>("files");
  const onTabChange = (value: string) => {
    setTab(value);
  }

  const checkKey = useCallback(() => {
    GlobalsApiConector.hasAPIKey().then(res => {
      setHasKey(res)
    })
  }, [])

  const getQueue = useCallback(() => {
    QueueApiConector.getQueue().then(res => {
      setQueue(res)
    })
  }, [])

  useEffect(() => {
    checkKey(); getQueue()
  }, [checkKey, getQueue])

  return (
    <>
      <Tabs value={tab} onValueChange={onTabChange} className="w-[800px] h-[450px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="files">Archivos</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="h-full">
          <FilesCard
            hasKey={hasKey}
            queue={queue}
            openSettings={() => { setTab('settings') }}
            updateQueue={getQueue}
          />
          <div className="text-xs text-center w-full mt-2 flex items-center gap-3 justify-center">
            <span>
              2025 - Daniel Gonzalez (D98C_SW)
            </span>
            <img src="/logo-light-gray.svg" alt="" className="w-[50px] h-[50px]" />
            <a href="https://github.com/danny1998cuba" className="text-zinc-400 underline">https://github.com/danny1998cuba</a>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="h-full">
          <Settings checkKey={checkKey} hasKey={hasKey} />
          <div className="text-xs text-center w-full mt-2">2025 - Daniel Gonzalez (D98C_SW) - <a href="https://github.com/danny1998cuba" className="text-zinc-400 underline">https://github.com/danny1998cuba</a></div>
        </TabsContent>
      </Tabs>

      <Toaster />
    </>
  )
}

export default App