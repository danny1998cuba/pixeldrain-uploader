import { API_ENDPOINTS } from "@/api/api.types"
import { APIConnection } from "@/api/connection"
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AxiosResponse } from "axios"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Spinner from "../ui/Spinner/Spinner"
import { Progress } from "../ui/progress"

interface Props {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    updateQueue: () => void
}

const UploadModal = ({ isOpen, setIsOpen, updateQueue }: Props) => {
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState<{ file: string; progress: number; loading: boolean }[]>([])

    const inputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    useEffect(() => {
        if (isOpen) {
            setFiles([])
            setLoading([])
        }
    }, [isOpen])

    const removeFile = (idx: number, identifier: string) => {
        setFiles(prev => prev.filter((_, index) => index !== idx))
        setLoading(prev => prev.filter(p => p.file === identifier))
    }

    const startUpload = () => {
        if (files.length > 0) {
            const promises: Promise<AxiosResponse<any, any>>[] = []

            files.forEach((file, index) => {
                const formData = new FormData()
                formData.append("file", file)

                const ident = `${file.name}_${index}`
                setLoading((prev) => prev.map(p => { return p.file === ident ? { ...p, loading: true } : p }))

                promises.push(
                    APIConnection.getInstance().post(API_ENDPOINTS.QUEUE_ADD, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                        validateStatus(_status) { return true },
                        onUploadProgress(progressEvent) {
                            if (progressEvent.loaded && progressEvent.total) {
                                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                setLoading(prev => prev.map(p => { return p.file === ident ? { ...p, progress: percentCompleted } : p }))
                            }
                        }
                    })
                )
            })

            Promise.all(promises).then(resp => {
                const errors = resp.filter(r => r.status !== 204)
                const fine = resp.filter(r => r.status === 204)

                toast({
                    title: "Subida completada",
                    description: `Correctamente: ${fine.length}\nCon errores: ${errors.length}`
                })

                updateQueue()
                setIsOpen(false)
            })
        }
    }

    return (
        <DialogContent className="max-w-[600px] h-[400px]">
            <div className="flex gap-4 flex-col">
                <DialogHeader className="mb-6">
                    <DialogTitle>Agregar archivos</DialogTitle>
                    <DialogDescription>
                        Carga los archivos que deseas agregar a la cola de subida
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 h-fit">
                    <Label htmlFor="files">
                        Archivos
                    </Label>
                    <Input
                        type="file"
                        id="files"
                        ref={inputRef}
                        onChange={(e) => {
                            if (!!e.target.files && e.target.files.length > 0 && !!e.target.files[0]) {
                                const file = e.target.files![0]
                                setFiles((prev) => [...prev, file])
                                setLoading(prev => [...prev, { file: `${file.name}_${loading.length}`, loading: false, progress: 0 }])
                                if (inputRef.current) { inputRef.current.value = '' }
                            }
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2 overflow-auto max">
                    {files.map((f, index) => {
                        const loadingFile = loading.find(l => l.file === `${f.name}_${index}`)

                        return <div key={`${f.name}_${index}`} className="flex justify-between px-3 items-center gap-4">
                            <span>
                                {f.name}
                            </span>

                            {
                                loadingFile?.loading &&
                                <Progress value={loadingFile?.progress || 0} className="w-[150px]" />
                            }

                            <button onClick={() => removeFile(index, `${f.name}_${index}`)} type="button" className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                    }
                    )}
                </div>
            </div>

            <DialogFooter className="items-end">
                <Button type="button" className="px-8" disabled={loading.some(l => !!l.loading)} variant="destructive" onClick={() => setIsOpen(false)}>Cerrar</Button>
                <Button type="button" disabled={files.length == 0 || loading.some(l => !!l.loading)} onClick={() => startUpload()}>
                    {
                        loading.some(l => !!l.loading) ?
                            <div className="flex items-center gap-4">
                                Cargando...
                                <Spinner color="gray" width="1.5rem" height="1.5rem" />
                            </div> :
                            <span>
                                Cargar archivos
                            </span>
                    }
                </Button>
            </DialogFooter>
        </DialogContent >
    )
}

export default UploadModal