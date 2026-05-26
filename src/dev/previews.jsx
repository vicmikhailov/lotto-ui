import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import SystemInputCell from "@/components/SystemInputCell.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/SystemInputCell">
                <SystemInputCell/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews
