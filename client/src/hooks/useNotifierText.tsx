import { useEffect, useState } from "react";

const useNotifierText = (initialValue: string = "") => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (value) {
            setTimeout(() => {
                setValue("");
            }, 2000);
        }
    }, [value]);

    return { value, setValue };
}

export default useNotifierText;