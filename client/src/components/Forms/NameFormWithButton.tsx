import NameForm, { NameFormProps } from "./NameForm";
import MyButton from "../Buttons/MyButton";

interface NameFormWithButtonProps extends NameFormProps {
    btnText: string;
}

const NameFormWithButton = ({ btnText, labelText, style, onSubmit }: NameFormWithButtonProps) => {
    return (
        <NameForm labelText={labelText} onSubmit={onSubmit} style={style}>
            <div className="form__footer">
                <MyButton className="--filled" type="submit">
                    {btnText}
                </MyButton>
            </div>
        </NameForm>
    )
}

export default NameFormWithButton;