import { MouseEvent, useRef } from "react";
import { ESorts } from "../../types/ESorts";
import MyButton from "./MyButton";

interface SortButtonsProps {
    currentSort: ESorts,
    setCurrentSort: (curSort: ESorts) => void;
}

const SortButtons = ({ currentSort, setCurrentSort }: SortButtonsProps) => {
    const changeSort = (e: MouseEvent<HTMLButtonElement>) => {
        const newSort = e.currentTarget.name as ESorts;
        setCurrentSort(newSort);
    }

    return (
        <div className="btn-wrapper">
            <MyButton
                name={ESorts.NAME}
                onClick={e => changeSort(e)}
                className={currentSort === ESorts.NAME ? "active" : ""}
            >
                Name
            </MyButton>
            <MyButton
                name={ESorts.SIZE}
                onClick={e => changeSort(e)}
                className={currentSort === ESorts.SIZE ? "active" : ""}
            >
                Size
            </MyButton>
            <MyButton
                name={ESorts.MODIFIED}
                onClick={e => changeSort(e)}
                className={currentSort === ESorts.MODIFIED ? "active" : ""}
            >
                Modified
            </MyButton>
        </div>
    )
}

export default SortButtons;