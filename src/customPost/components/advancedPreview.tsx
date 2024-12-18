import {Devvit} from "@devvit/public-api";
import {UIDimensions} from "@devvit/protos";
import {BirdNerdGamePartial, BirdNerdImage} from "../../utils/birdNerd.js";
import {GameImage} from "./gameImage.js";

export type AdvancedPreviewProps = {
    partialGame: BirdNerdGamePartial;
    uiDims: UIDimensions;
};

export const AdvancedPreview = (props: AdvancedPreviewProps) => {
    const game = props.partialGame;
    const image: BirdNerdImage = game.images[0] ?? {
        url: "",
        attribution: "",
    };
    const imageWidth: Devvit.Blocks.SizePixels = `${Math.min(props.uiDims.height * ((image.aspectRatio ?? 2) * 0.4), props.uiDims.width)}px`;
    const imageHeight: Devvit.Blocks.SizePixels = `${props.uiDims.height * 0.4}px`;
    return (
        <blocks height="tall">
            <zstack width="100%" height="100%" backgroundColor="#D3DAC2" grow>
                <vstack alignment="center top" width="100%" height="100%" gap="none" padding="none" grow>
                    <spacer grow/>
                    {image && <GameImage url={image.url} imageWidth={imageWidth} imageHeight={imageHeight} cornerRadius="medium" style="metadata" size="xsmall" >{image.attribution ?? ""}</GameImage>}
                    <spacer size="xsmall" grow/>
                    <hstack alignment="center middle" border="thick" borderColor="rgba(255, 255, 255, 0.2)" backgroundColor="rgba(255, 255, 255, 0.2)" cornerRadius="medium" padding="small" maxWidth="70%">
                        <spacer width="355px" height="52px" grow/>
                    </hstack>
                    <spacer size="small" grow/>
                    <vstack gap="small" alignment="center middle" border="thick" borderColor="rgba(255, 255, 255, 0.2)" backgroundColor="rgba(255, 255, 255, 0.2)" cornerRadius="medium" padding="small" maxWidth="70%">
                        <spacer width="306px" height="140px" grow/>
                    </vstack>
                    <spacer grow/>
                </vstack>
            </zstack>
        </blocks>
    );
};

export const advancedPreviewMaker = ({partialGame, uiDims}: AdvancedPreviewProps) => <AdvancedPreview partialGame={partialGame} uiDims={uiDims}/>;

