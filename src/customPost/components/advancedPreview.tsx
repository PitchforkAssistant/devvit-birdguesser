import {Devvit} from "@devvit/public-api";
import {UIDimensions} from "@devvit/protos";
import {BirdNerdGamePartial} from "../../types/birdNerd/partialGame.js";
import {BirdNerdImage} from "../../types/birdNerd/image.js";
import {GameImage} from "./gameImage.js";
import {colors} from "../pages/game/gamePageConstants.js";

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
            <zstack backgroundColor={colors.background} grow height="100%" width="100%">
                <vstack alignment="center top" gap="none" grow height="100%" padding="none" width="100%">
                    <spacer grow/>
                    {image && <GameImage cornerRadius="medium" imageHeight={imageHeight} imageWidth={imageWidth} size="xsmall" style="metadata" url={image.url} >{image.attribution ?? ""}</GameImage>}
                    <spacer grow size="xsmall"/>
                    <hstack alignment="center middle" backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="medium" maxWidth="70%" padding="small">
                        <spacer grow height="52px" width="355px"/>
                    </hstack>
                    <spacer grow size="small"/>
                    <vstack alignment="center middle" backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="medium" gap="small" maxWidth="70%" padding="small">
                        <spacer grow height="140px" width="306px"/>
                    </vstack>
                    <spacer grow/>
                </vstack>
            </zstack>
        </blocks>
    );
};

export const advancedPreviewMaker = ({partialGame, uiDims}: AdvancedPreviewProps) => <AdvancedPreview partialGame={partialGame} uiDims={uiDims}/>;

