import {Devvit} from "@devvit/public-api";
import {CustomPostState} from "../../state.js";
import {ChoicesRow} from "../../components/choicesRow.js";
import {GameImage} from "../../components/gameImage.js";
import {AnswerRow} from "../../components/answerRow.js";
import {GuessRow} from "../../components/guessRow.js";
import {ChoicesColumn} from "../../components/choicesColumn.js";

export const GamePage = (postState: CustomPostState) => {
    const game = postState.PageStates.game;
    if (postState.uiDims.width - postState.uiDims.height > 150 && !postState.reduceSize) {
        return (
            <hstack alignment="start top" width="100%" height="100%" gap="none" padding="none">
                {game.choices && !game.finished && <ChoicesColumn uiDims={postState.uiDims} choices={game.choices} selected={game.selected} onChoicePress={choice => game.choicePressed(choice)} reduceSize={postState.reduceSize}/>}
                <spacer grow/>
                <vstack alignment="center top" maxWidth="70%" height="100%" gap="none" padding="none">
                    <spacer grow/>
                    {game.image && <GameImage onImagePress={game.expandImagePressed} url={game.image} imageWidth={`${Math.min(postState.uiDims.height * (game.imageAspectRatio * 0.35), postState.uiDims.width * 0.7)}px`} imageHeight={`${postState.uiDims.height * 0.35}px`} cornerRadius="medium" style="metadata" size="xsmall">{game.imageAttribution ?? ""}</GameImage>}
                    <spacer size="xsmall" grow/>
                    {game.answerShape && <AnswerRow answerShape={game.answerShape} currentGuess={game.currentGuess} getSlotWidth={game.getSlotWidth} onSlotPress={game.slotPressed} onSubmitPress={game.submitPressed} onSharePress={game.sharePressed} reduceSize={postState.reduceSize} disableSubmit={game.finished}/>}
                    <spacer size="small" grow/>
                    {game.chances && <GuessRow answerShape={game.answerShape} guesses={game.guesses} chances={game.chances} getSlotWidth={game.getSlotWidth} reduceSize={postState.reduceSize} disableSubmit={game.finished}/>}
                    <spacer grow/>
                </vstack>
                <spacer grow/>
            </hstack>
        );
    } else {
        return (
            <vstack alignment="center top" width="100%" height="100%" gap="none" padding="none">
                <spacer grow/>
                {game.image && <GameImage onImagePress={game.expandImagePressed} url={game.image} imageWidth={`${Math.min(postState.uiDims.height * (game.imageAspectRatio * 0.4), postState.uiDims.width)}px`} imageHeight={`${postState.uiDims.height * 0.4}px`} cornerRadius="medium" style="metadata" size="xsmall">{game.imageAttribution ?? ""}</GameImage>}
                <spacer size="xsmall" grow/>
                {game.choices && !game.finished && <ChoicesRow uiDims={postState.uiDims} choices={game.choices} selected={game.selected} onChoicePress={choice => game.choicePressed(choice)} reduceSize={postState.reduceSize}/>}
                <spacer size="xsmall" grow/>
                {game.answerShape && <AnswerRow answerShape={game.answerShape} currentGuess={game.currentGuess} getSlotWidth={game.getSlotWidth} onSlotPress={game.slotPressed} onSubmitPress={game.submitPressed} onSharePress={game.sharePressed} reduceSize={postState.reduceSize} disableSubmit={game.finished}/>}
                <spacer size="small" grow/>
                {game.chances && <GuessRow answerShape={game.answerShape} guesses={game.guesses} chances={game.chances} getSlotWidth={game.getSlotWidth} reduceSize={postState.reduceSize} disableSubmit={game.finished}/>}
                <spacer grow/>
            </vstack>
        );
    }
};

