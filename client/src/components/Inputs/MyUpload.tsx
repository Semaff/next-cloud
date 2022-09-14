import { ReactNode } from "react";

interface MyUploadProps {
    name?: string;
    multiple?: boolean;
    children?: ReactNode | string;
    onChange?: (...args: any[]) => void;
}

const MyUpload = ({ name, children, multiple, onChange }: MyUploadProps) => {
    return (
        <>
            <label
                className="btn --filled --darken --justify-center"
                htmlFor={name}
            >
                {children}
            </label>
            <input
                className="input-file"
                type="file"
                id={name}
                multiple={multiple}
                name={name}
                onChange={onChange}
            />
        </>
    )
}

export default MyUpload;