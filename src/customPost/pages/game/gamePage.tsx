import {Devvit} from "@devvit/public-api";
import {CustomPostState} from "../../state.js";
import {ChoicesRow} from "../../components/choicesRow.js";
import {GameImage} from "../../components/gameImage.js";
import {AnswerRow} from "../../components/answerRow.js";
import {GuessRow} from "../../components/guessRow.js";
import {ChoicesColumn} from "../../components/choicesColumn.js";
import {OverlayImage} from "../../components/overlayImage.js";
import {HelpOverlay} from "../../components/helpOverlay.js";

export const GamePage = (postState: CustomPostState) => {
    const game = postState.PageStates.game;

    let direction: "columns" | "rows" = "columns";
    let gameContent = null;
    let imageWidth: Devvit.Blocks.SizePixels = `${postState.uiDims.height * game.imageAspectRatio}px`;
    let imageHeight: Devvit.Blocks.SizePixels = `${postState.uiDims.height}px`;
    if (postState.uiDims.width - postState.uiDims.height > 150 && !postState.reduceSize) {
        direction = "columns";
        imageWidth = `${Math.min(postState.uiDims.height * (game.imageAspectRatio * 0.35), postState.uiDims.width * 0.7)}px`;
        imageHeight = `${postState.uiDims.height * 0.35}px`;
        gameContent = (
            <hstack alignment="start top" width="100%" height="100%" gap="none" padding="none">
                {game.choices && !game.finished && <ChoicesColumn disableChoice={game.notInAnswer} uiDims={postState.uiDims} choices={game.choices} selected={game.selected} onChoicePress={choice => game.choicePressed(choice)} reduceSize={postState.reduceSize}/>}
                <spacer grow/>
                <vstack alignment="center top" maxWidth="70%" height="100%" gap="none" padding="none">
                    <spacer grow/>
                    {game.image && <GameImage onExpandPress={game.expandImagePressed} url={game.image} imageWidth={imageWidth} imageHeight={imageHeight} cornerRadius="medium" style="metadata" size="xsmall" onAttributionPress={game.attributionPressed}>{game.imageAttribution ?? ""}</GameImage>}
                    <spacer size="xsmall" grow/>
                    {game.answerShape && <AnswerRow totalGuesses={game.guesses.length} won={game.won} answerShape={game.answerShape} currentGuess={game.currentGuess} getSlotWidth={game.getSlotWidth} onSlotPress={game.slotPressed} onSubmitPress={game.submitPressed} onSharePress={game.sharePressed} reduceSize={postState.reduceSize} disableSubmit={game.finished}/>}
                    <spacer size="small" grow/>
                    {game.chances && <GuessRow answerShape={game.answerShape} guesses={game.guesses} chances={game.chances} getSlotWidth={game.getSlotWidth} reduceSize={postState.reduceSize} disableSubmit={game.finished}/>}
                    <spacer grow/>
                </vstack>
                <spacer grow/>
            </hstack>
        );
    } else {
        direction = "rows";
        imageWidth = `${Math.min(postState.uiDims.height * (game.imageAspectRatio * 0.4), postState.uiDims.width)}px`;
        imageHeight = `${postState.uiDims.height * 0.4}px`;
        gameContent = (
            <vstack alignment="center top" width="100%" height="100%" gap="none" padding="none">
                <spacer grow/>
                {game.image && <GameImage onExpandPress={game.expandImagePressed} url={game.image} imageWidth={imageWidth} imageHeight={imageHeight} cornerRadius="medium" style="metadata" size="xsmall" onAttributionPress={game.attributionPressed}>{game.imageAttribution ?? ""}</GameImage>}
                <spacer size="xsmall" grow/>
                {game.choices && !game.finished && <ChoicesRow disableChoice={game.notInAnswer} uiDims={postState.uiDims} choices={game.choices} selected={game.selected} onChoicePress={choice => game.choicePressed(choice)} reduceSize={postState.reduceSize}/>}
                <spacer size="xsmall" grow/>
                {game.answerShape && <AnswerRow totalGuesses={game.guesses.length} won={game.won} answerShape={game.answerShape} currentGuess={game.currentGuess} getSlotWidth={game.getSlotWidth} onSlotPress={game.slotPressed} onSubmitPress={game.submitPressed} onSharePress={game.sharePressed} reduceSize={postState.reduceSize} disableSubmit={game.finished}/>}
                <spacer size="small" grow/>
                {game.chances && <GuessRow answerShape={game.answerShape} guesses={game.guesses} chances={game.chances} getSlotWidth={game.getSlotWidth} reduceSize={postState.reduceSize} disableSubmit={game.finished}/>}
                <spacer grow/>
            </vstack>
        );
    }

    return (
        <zstack alignment="center top" width="100%" height="100%">
            {gameContent}
            {game.overlay === "help" && <HelpOverlay direction={direction} imageWidth={imageWidth} imageHeight={imageHeight}/>}
            {game.overlay === "image" && game.image && <OverlayImage onImagePress={game.expandImagePressed} url={game.image} width="100%" height="100%" imageWidth={`${postState.uiDims.height}px`} imageHeight={`${postState.uiDims.height}px`} resizeMode="fit" style="metadata" size="xsmall" onAttributionPress={game.attributionPressed}>{game.imageAttribution ?? ""}</OverlayImage>}
            <vstack alignment="center middle" width="100%" height="100%">
                <spacer grow/>
                <hstack padding="medium" alignment="center middle" minWidth="100%">
                    <spacer grow/>
                    {(game.overlay !== "none" || !game.finished) &&
                        <vstack backgroundColor={game.overlay === "none" ? "rgba(255, 255, 255, 0.2)" : "#dce1ce"} cornerRadius="full" padding="small" onPress={game.overlay === "none" ? () => game.changeOverlay("help") : () => game.changeOverlay("none")}>
                            <icon name={game.overlay === "none" ? "help" : "close-fill"} size="small" color="#111"/>
                        </vstack>
                    }
                </hstack>
            </vstack>
        </zstack>
    );
};
