import {Devvit} from "@devvit/public-api";
import {CustomPostState} from "../../state.js";
import {ChoicesRow} from "../../components/choicesRow.js";
import {GameImage} from "../../components/gameImage.js";
import {AnswerRow} from "../../components/answerRow.js";
import {GuessRow} from "../../components/guessRow.js";

export const GamePage = (postState: CustomPostState) => {
    const game = postState.PageStates.game;
    return (
        <vstack alignment="center top" width="100%" height="100%" gap="none" padding="none">
            <spacer grow/>
            {game.image && <GameImage url={game.image} imageWidth={`${Math.min(postState.uiDims.height * (game.imageAspectRatio * 0.4), postState.uiDims.width)}px`} imageHeight={`${postState.uiDims.height * 0.4}px`} cornerRadius="medium" style="metadata" size="xsmall">{game.imageAttribution ?? ""}</GameImage>}
            <spacer size="xsmall" grow/>
            {game.choices && !game.finished && <ChoicesRow uiDims={postState.uiDims} choices={game.choices} selected={game.selected} onChoicePress={choice => game.choicePressed(choice)} reduceSize={postState.reduceSize}/>}
            <spacer size="xsmall" grow/>
            {game.answerShape && <AnswerRow answerShape={game.answerShape} currentGuess={game.currentGuess} getSlotWidth={game.getSlotWidth} onSlotPress={game.slotPressed} onSubmitPress={game.submitPressed} onSharePress={game.sharePressed} reduceSize={postState.reduceSize} disableSubmit={game.finished}/>}
            <spacer size="small" grow/>
            {game.chances && <GuessRow answerShape={game.answerShape} guesses={game.guesses} chances={game.chances} getSlotWidth={game.getSlotWidth} reduceSize={postState.reduceSize} disableSubmit={game.finished}/>}
            <spacer grow/>
        </vstack>
    );
};

