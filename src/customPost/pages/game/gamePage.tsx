import {Devvit} from "@devvit/public-api";

import {AnswerBox} from "../../components/answerBox.js";
import {ChoicesColumn} from "../../components/choicesColumn.js";
import {ChoicesRow} from "../../components/choicesRow.js";
import {GameEndBox} from "../../components/gameEndBox.js";
import {GameImage} from "../../components/gameImage.js";
import {GuessBox} from "../../components/guessBox.js";
import {HelpOverlay} from "../../components/helpOverlay.js";
import {ImageOverlay} from "../../components/imageOverlay.js";
import {CustomPostState} from "../../state.js";
import {colors} from "./gamePageConstants.js";

export const GamePage = (postState: CustomPostState) => {
    const game = postState.PageStates.game;

    if (!game.isLoaded || !game.answerShape || !game.chances || !game.choices || !game.currentGameId) {
        postState.changePage("noGame");
        return <vstack alignment="middle center" backgroundColor={colors.background} grow height="100%" width="100%"><icon name="load" size="large"/></vstack>;
    }

    const reduceSize = postState.layout === "vertical";

    const [imageWidth, imageHeight] = game.imageDims;
    const gameImage = <GameImage
        cornerRadius="medium"
        imageHeight={`${imageHeight}px`}
        imageWidth={`${imageWidth}px`}
        onAttributionPress={game.attributionPressed}
        onExpandPress={game.expandImagePressed}
        size="xsmall"
        style="metadata"
        url={game.image.url}>
        {game.image.attribution ?? ""}
    </GameImage>;

    const middleBox = game.finished && game.fullGame ?
        <GameEndBox
            answer={game.fullGame.answer}
            endText={game.fullGame.endText}
            onSharePress={game.sharePressed}
            reduceSize={reduceSize}
            slotWidth={game.slotWidth}
            totalGuesses={game.guesses.length}
            won={game.won}/>
        : <AnswerBox
            answerShape={game.answerShape}
            currentGuess={game.currentGuess}
            disableSubmit={game.finished}
            onSlotPress={game.slotPressed}
            onSubmitPress={game.submitPressed}
            reduceSize={reduceSize}
            slotWidth={game.slotWidth}
        />;

    const guessBox = <GuessBox
        answerShape={game.answerShape}
        chances={game.chances}
        guesses={game.guesses}
        reduceSize={reduceSize}
        slotWidth={game.slotWidth}/>;

    let gameContent = null;
    switch (postState.layout) {
    case "horizontal":
        gameContent = (
            <hstack alignment="start top" gap="none" height="100%" padding="none" width="100%">
                {!game.finished && <ChoicesColumn choices={game.choices} disableChoice={game.notInAnswer} onChoicePress={choice => game.choicePressed(choice)} reduceSize={reduceSize} selected={game.selected} uiDims={postState.uiDims}/>}
                <spacer grow/>
                <vstack alignment="center top" gap="none" height="100%" padding="none">
                    <spacer grow size="xsmall"/>
                    {gameImage}
                    <spacer grow size="xsmall"/>
                    {middleBox}
                    <spacer grow size="xsmall"/>
                    {guessBox}
                    <spacer grow size="xsmall"/>
                </vstack>
                <spacer grow/>
            </hstack>
        );
        break;
    case "vertical":
        gameContent = (
            <vstack alignment="center top" gap="none" height="100%" padding="none" width="100%">
                <spacer grow size="xsmall"/>
                {gameImage}
                <spacer grow size="xsmall"/>
                {!game.finished && <ChoicesRow choices={game.choices} disableChoice={game.notInAnswer} onChoicePress={choice => game.choicePressed(choice)} reduceSize={reduceSize} selected={game.selected} uiDims={postState.uiDims}/>}
                {!game.finished && <spacer grow size="xsmall"/>}
                {middleBox}
                <spacer grow size="xsmall"/>
                {guessBox}
                <spacer grow size="xsmall"/>
            </vstack>
        );
        break;
    }

    let overlay = null;
    switch (game.overlay) {
    case "help":
        overlay = <HelpOverlay
            direction={postState.layout}
            imageHeight={imageHeight}
            imageWidth={imageWidth}/>;
        break;
    case "image":
        overlay = <ImageOverlay
            height="100%"
            imageHeight={`${postState.uiDims.height}px`}
            imageWidth={`${postState.uiDims.height}px`}
            onAttributionPress={game.attributionPressed}
            resizeMode="fit"
            size="xsmall"
            style="metadata"
            url={game.image.url}
            width="100%">
            {game.image.attribution ?? ""}
        </ImageOverlay>;
        break;
    }

    return (
        <zstack alignment="center top" height="100%" width="100%">
            {gameContent}
            {overlay}
            <vstack alignment="center middle" height="100%" width="100%">
                <spacer grow/>
                <hstack alignment="center middle" minWidth="100%" padding="medium">
                    <spacer grow/>
                    {(game.overlay !== "none" || !game.finished) &&
                        <vstack backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="full" onPress={game.overlay === "none" ? () => game.changeOverlay("help") : () => game.changeOverlay("none")} padding="small">
                            <icon color={colors.text} name={game.overlay === "none" ? "help" : "close-fill"} size="small"/>
                        </vstack>
                    }
                </hstack>
            </vstack>
        </zstack>
    );
};
