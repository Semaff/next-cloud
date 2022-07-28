import Delete from "./SVG/Delete";
import Upload from "./SVG/Upload";

const ActionButtons = () => {
    return (
        <div className="gap">
            <label htmlFor="upload-file" className="label-file">
                <Upload /> Upload
            </label>
            <input className="input-file" type="file" name="upload-file" id="upload-file" />

            <label htmlFor="delete-file" className="label-file">
                <Delete /> Delete
            </label>
            <input className="input-file" type="file" name="delete-file" id="delete-file" />
        </div>
    )
}

export default ActionButtons;