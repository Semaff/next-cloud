export interface MyInputProps {
    placeholder?: string;
    name?: string;
    type?: string;
    className?: string;
    pattern?: string;
    title?: string;
    value?: string;
    onChange?: (...args: any[]) => void;
}

const MyInput = (props: MyInputProps) => {
    return (
        // Fixes the bug with 100%+ Input
        <span className="input-placeholder"> 
            <input
                className={`input ${props.className || ""}`}
                placeholder={props.placeholder}
                name={props.name}
                type={props.type || "text"}
                id={props.name}
                pattern={props.pattern}
                title={props.title}
                value={props.value}
                onChange={props.onChange}
            />
        </span>
    )
}

export default MyInput;