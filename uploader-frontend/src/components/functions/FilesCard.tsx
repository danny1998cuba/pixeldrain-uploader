import { ApiErrors, IQueueElement } from "@/api/api.types";
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../ui/Spinner/Spinner";
import QueueElement from "./QueueElement";
import { Dialog } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import UploadModal from "./UploadModal";
import { QueueApiConector } from "@/api/queue";
import { useToast } from "@/hooks/use-toast";

interface Props {
    hasKey: boolean;
    queue: IQueueElement[];
    openSettings: () => void
    updateQueue: () => void
}

const FilesCard = ({ hasKey, queue, openSettings, updateQueue }: Props) => {
    const [currentTask, setCurrentTask] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [uploading, setUploading] = useState<boolean>(false)

    const { toast } = useToast()

    const startUploading = useCallback(async () => {
        const lookAtFront = await QueueApiConector.getQueueFront()

        if (lookAtFront) {
            setUploading(true)
            const res = await QueueApiConector.uploadCurrent()

            if (res.error) {
                toast({
                    description: res.message,
                    variant: "destructive"
                })
                setUploading(false)
            } else {
                setCurrentTask(res.message)
            }
        } else {
            toast({
                description: ApiErrors["EMPTY_QUEUE"],
                variant: "destructive"
            })
            window.location.reload()
            setUploading(false)
        }
    }, [toast])

    useEffect(() => {
        if (currentTask) {
            const checkProgress = async () => {
                const response = await QueueApiConector.checkUploadState(currentTask);

                if (!response.error) {
                    if (response.message === 'completed') {
                        setCurrentTask(null)
                        updateQueue()
                    } else if (response.message === 'failed') {
                        toast({
                            description: 'Falló la subida',
                            variant: "destructive"
                        })
                        setUploading(false)
                    } else {
                        setTimeout(checkProgress, 500);
                    }
                }
            };

            checkProgress();
        } else {
            if (uploading) {
                startUploading()
            }
        }
    }, [currentTask, toast, uploading])

    return (
        <>
            <Card className='h-full overflow-auto relative'>
                {
                    !hasKey &&
                    <CardContent className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-background/70 backdrop-blur-sm flex-col gap-3 z-10'>
                        No hay key

                        <Button variant='outline' onClick={openSettings}>Ir a Configuración</Button>
                    </CardContent>
                }

                {
                    (!!currentTask || uploading) &&
                    <CardContent className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-background/70 flex-col gap-3 z-10'>
                        {!uploading && <span>Se detendrá la subida cuando termine el archivo en curso.</span>}
                        <Button variant='outline' onClick={() => setUploading(false)} disabled={!uploading}>Detener subida automática</Button>
                    </CardContent>
                }

                <CardContent className='space-y-6'>
                    <div className="flex gap-4 justify-end sticky top-0 bg-background py-3">
                        <Dialog open={modalOpen}>
                            <DialogTrigger asChild>
                                <Button variant={"outline"} onClick={() => setModalOpen(true)}>Agregar archivos a la cola</Button>
                            </DialogTrigger>
                            <UploadModal isOpen={modalOpen} setIsOpen={setModalOpen} updateQueue={updateQueue} />
                        </Dialog>

                        <Button disabled={queue.length === 0 || currentTask !== null} onClick={() => startUploading()}>
                            {
                                currentTask !== null ?
                                    <div className="flex items-center gap-4">
                                        Subiendo...
                                        <Spinner color="gray" width="1.5rem" height="1.5rem" />
                                    </div> :
                                    <span>
                                        Comenzar subida a Pixeldrain
                                    </span>
                            }
                        </Button>
                    </div>

                    {
                        queue.length > 0 ?
                            <div className="grid grid-cols-4 gap-4">
                                {
                                    queue.map(q =>
                                        <QueueElement
                                            updateQueue={updateQueue}
                                            uploading={!!currentTask}
                                            key={`queue_element_${q.Upload_ID}`}
                                            element={q}
                                            isTop={q.Upload_ID === Math.min(...queue.map(qu => qu.Upload_ID))}
                                        />
                                    )
                                }
                            </div> :
                            <div className="h-[300px] w-full flex items-center justify-center">
                                Sin archivos
                            </div>
                    }
                </CardContent>
            </Card>

        </>
    )
}

export default FilesCard