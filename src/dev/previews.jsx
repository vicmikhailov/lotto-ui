import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import SystemInputCell from "@/components/SystemInputCell.jsx";
import {CardHeader} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import ErrorBoundary from "@/components/ErrorBoundary.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/SystemInputCell">
                <SystemInputCell/>
            </ComponentPreview>
            <ComponentPreview path="/CardHeader">
                <CardHeader/>
            </ComponentPreview>
            <ComponentPreview path="/Separator">
                <Separator/>
            </ComponentPreview>
            <ComponentPreview path="/ErrorBoundary">
                <ErrorBoundary/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews
