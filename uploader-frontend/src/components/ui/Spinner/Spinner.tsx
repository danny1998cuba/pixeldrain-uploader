import './Spinner.css'

interface Props {
    className?: string;
    color?: string;
    width?: string;
    height?: string;
}

const Spinner = ({
    className,
    color = "white",
    width = "48px",
    height = "48px",
}: Props) => {
    return (
        <span className={`loader ${className}`} style={{
            "--color": color,
            "--spinner-width": width,
            "--spinner-height": height,
        } as React.CSSProperties}></span>
    )
}

export default Spinner