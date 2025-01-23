import {UIDimensions} from "@devvit/protos";
import {Devvit} from "@devvit/public-api";
import {max} from "lodash";

import {defaultAppSettings} from "../../settings.js";
import {BirdNerdImage} from "../../types/birdNerd/image.js";
import {BirdNerdGamePartial} from "../../types/birdNerd/partialGame.js";
import {choiceCharacterWidth, choiceHeightColumn, colors, guessRowHeight, horizontalLayoutPadding, verticalLayoutPadding} from "../pages/game/gamePageConstants.js";
import {getChoicesColumnCount} from "./choicesColumn.js";
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

    const aspect = game.images[0]?.aspectRatio ?? 2;
    const slotPixelWidth = choiceCharacterWidth * ((max(game.choices.map(choice => choice.length)) ?? 0) + 2);

    // TODO: Deduplicate this code that was copied from GameState.imageSize
    // Because the Devvit <image> element doesn't support percentage-based sizing or a grow property,
    // we need to calculate the best possible image size in pixels based on the estimated size of the other UI elements.
    const guessesHeight = (game.chances ?? defaultAppSettings.defaultChances) * guessRowHeight;
    const paddingHeight = 4 * horizontalLayoutPadding;
    const usedHeight = guessesHeight + paddingHeight;
    const maxImageHeight = Math.max(props.uiDims.height - usedHeight, 10);

    const choicesWidth = getChoicesColumnCount(game.choices, choiceHeightColumn, props.uiDims.height) * slotPixelWidth;
    const paddingWidth = 3 * verticalLayoutPadding;
    const usedWidth = choicesWidth + paddingWidth;
    const maxImageWidth = Math.max(props.uiDims.width - usedWidth, 10);

    // We want to preserve aspect ratio, but we also want to fill all available space.
    // If the imageWidth would result in the image being too tall, we'll need to scale based on maxImageHeight instead.
    // Otherwise we'll get the height based on the width we calculated.
    let imageWidth = Math.min(maxImageWidth, maxImageHeight * aspect);
    let imageHeight = maxImageHeight;
    if (imageWidth / aspect > maxImageHeight) {
        imageWidth = maxImageHeight * aspect;
    } else {
        imageHeight = imageWidth / aspect;
    }

    return (
        <blocks height="tall">
            <zstack backgroundColor={colors.background} grow height="100%" width="100%">
                <vstack alignment="center top" gap="none" grow height="100%" padding="none" width="100%">
                    <spacer grow/>
                    {image && <GameImage cornerRadius="medium" imageHeight={`${imageHeight}px`} imageWidth={`${imageWidth}px`} size="xsmall" style="metadata" url={image.url} >{image.attribution ?? ""}</GameImage>}
                    <spacer grow size="xsmall"/>
                    <hstack alignment="center middle" backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="medium" height="52px" maxWidth="70%" padding="small">
                        <spacer grow width={`${slotPixelWidth * game.answerShape.length + 50}px`}/>
                    </hstack>
                    <spacer grow size="small"/>
                    <vstack alignment="center middle" backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="medium" gap="small" maxWidth="70%" padding="small">
                        <spacer grow height={`${guessesHeight}px`} width={`${slotPixelWidth * game.answerShape.length}px`}/>
                    </vstack>
                    <spacer grow/>
                </vstack>
            </zstack>
        </blocks>
    );
};

export const advancedPreviewMaker = ({partialGame, uiDims}: AdvancedPreviewProps) => <AdvancedPreview partialGame={partialGame} uiDims={uiDims}/>;

