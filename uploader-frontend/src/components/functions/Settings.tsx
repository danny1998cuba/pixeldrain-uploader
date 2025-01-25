import { GlobalsApiConector } from '@/api/globals'
import { FormEvent, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '../ui/toast'

interface Props {
    hasKey: boolean;
    checkKey: () => void
}

const Settings = ({ checkKey, hasKey }: Props) => {
    const [key, setKey] = useState<string>("")
    const { toast } = useToast()

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (key !== "") {
            const res = await GlobalsApiConector.setApiKey(key)

            toast({
                description: res.message,
                variant: res.error ? 'destructive' : "default"
            })

            setKey(""); checkKey();
        } else {
            toast({
                description: "Sin clave",
                variant: 'destructive'
            })
        }
    }

    const removeKey = async () => {
        toast({
            title: "Confirmación",
            description: "¿Estás seguro de eliminar la clave de Pixeldrain? No prodrás subir archivos mientras no tengas una clave activa",
            action: <ToastAction altText='Confirmar' onClick={async () => {
                const res = await GlobalsApiConector.removeApiKey()
                toast({
                    description: res.message,
                    variant: res.error ? 'destructive' : "default"
                })

                if (!res.error) { checkKey() }
            }}>Confirmar</ToastAction>,
        })
    }

    return (
        <Card className='h-full overflow-auto py-3'>
            <CardContent className='space-y-6'>
                <h2 className='text-xl font-semibold'>Clave de Pixeldrain</h2>
                <p>Clave registrada: {hasKey ? "Sí" : "No"}</p>

                <form onSubmit={submit} className='flex flex-col gap-4 items-end border rounded-md px-6 py-4' method='POST'>
                    <div className="space-y-1 w-full">
                        <Label htmlFor="key">{hasKey ? "Cambiar" : "Registrar"} clave de Pixeldrain</Label>
                        <Input id="key" name='key' type='password' value={key} onChange={(e) => { setKey(e.target.value) }} />
                    </div>

                    <Button type='submit' className='w-fit' disabled={key === ""}>Guardar clave</Button>
                </form>

                <Button type='button' className='w-full' variant='destructive' disabled={!hasKey} onClick={removeKey}>Eliminar la clave</Button>
            </CardContent>
        </Card>
    )
}

export default Settings