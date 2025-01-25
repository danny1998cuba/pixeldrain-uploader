import { IQueueElement } from "@/api/api.types"
import IndeterminateProgressBar from "../ui/IndeterminateProgressBar/IndeterminateProgressBar";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { QueueApiConector } from "@/api/queue";

interface Props {
    element: IQueueElement;
    isTop: boolean;
    uploading: boolean;
    className?: string;
    updateQueue: () => void
}

const QueueElement = ({ element, className, isTop, uploading, updateQueue }: Props) => {
    return (
        <div className={`${className} flex flex-col items-center text-center relative`}>
            <Button className="absolute -top-6 -right-3" variant="ghost" onClick={() => {
                QueueApiConector.removeFromQueue(element.Upload_ID).then(() => {
                    updateQueue()
                })
            }}>
                <X />
            </Button>

            <img src={`/mimetypes/${element.mimeType.replace("/", '-')}.png`} alt="Sin imagen" />

            <p className="mb-3">
                {element.filename}
            </p>
            {
                (isTop && uploading) &&
                <IndeterminateProgressBar />
            }
        </div>
    )
}

export default QueueElement