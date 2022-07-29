import { MouseEvent, useRef } from "react";
import { ESorts } from "../types/ESorts";

interface ControlButtonsProps {
    sort: ESorts;
    setSort: (sort: ESorts) => void;
}

const ControlButtons = ({ sort, setSort }: ControlButtonsProps) => {
    const divRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        setSort(e.currentTarget.name as ESorts);
        const activeBtn = divRef.current?.querySelector(".active");
        activeBtn?.classList.remove("active");
        e.currentTarget.classList.add("active");
    }

    return (
        <div className="gap" ref={divRef}>
            <button
                onClick={e => handleClick(e)}
                className="btn active"
                type="button"
                name={ESorts.NAME}
            >
                Name
            </button>
            <button
                onClick={e => handleClick(e)}
                className="btn"
                type="button"
                name={ESorts.SIZE}
            >
                Size
            </button>
            <button
                onClick={e => handleClick(e)}
                className="btn"
                type="button"
                name={ESorts.MODIFIED}
            >
                Modified
            </button>
        </div>
    )
}

export default ControlButtons;