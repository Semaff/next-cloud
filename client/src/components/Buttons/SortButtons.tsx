import { MouseEvent, useRef } from "react";
import { ESorts } from "../../types/ESorts";
import MyButton from "./MyButton";

interface SortButtonsProps {
    curSort: ESorts,
    setCurSort: (curSort: ESorts) => void;
}

const SortButtons = ({ curSort, setCurSort }: SortButtonsProps) => {
    const changeSort = (e: MouseEvent<HTMLButtonElement>) => {
        const newSort = e.currentTarget.name as ESorts;
        setCurSort(newSort);
    }

    return (
        <div className="btn-wrapper">
            <MyButton
                name={ESorts.NAME}
                onClick={e => changeSort(e)}
                className={curSort === ESorts.NAME ? "active" : ""}
            >
                Name
            </MyButton>
            <MyButton
                name={ESorts.SIZE}
                onClick={e => changeSort(e)}
                className={curSort === ESorts.SIZE ? "active" : ""}
            >
                Size
            </MyButton>
            <MyButton
                name={ESorts.MODIFIED}
                onClick={e => changeSort(e)}
                className={curSort === ESorts.MODIFIED ? "active" : ""}
            >
                Modified
            </MyButton>
        </div>
    )
}

export default SortButtons;