import { CSSProperties } from "react";
import MyInput, { MyInputProps } from "./MyInput";
import MyLabel, { MyLabelProps } from "./MyLabel";

type MyInputWithLabelProps = MyInputProps & MyLabelProps & {
    view: "vertical" | "horizontal";
    styles?: CSSProperties
};

const MyInputWithLabel = (props: MyInputWithLabelProps) => {
    const wrapperClasses = ["input-wrapper"];
    if (props.view === "vertical") {
        wrapperClasses.push("flex-dir-column");
    }

    if (props.view === "horizontal") {
        wrapperClasses.push("align-center");
    }

    return (
        <div className={wrapperClasses.join(" ")} style={props.styles}>
            <MyLabel {...props} />
            <MyInput {...props} />
        </div >
    )
}

export default MyInputWithLabel;