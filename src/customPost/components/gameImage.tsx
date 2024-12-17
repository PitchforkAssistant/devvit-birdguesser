import {Devvit} from "@devvit/public-api";
import {RoundedImage, RoundedImageProps} from "devvit-helpers";

export type GameImageProps = {
    onImagePress: () => void | Promise<void>
} & RoundedImageProps & Devvit.Blocks.TextProps & Devvit.Blocks.StackProps & Devvit.Blocks.HasStringChildren;

export const GameImage = (props: GameImageProps) => (
    <zstack alignment="center middle" height={props.imageHeight} width={props.imageWidth}>
        <RoundedImage {...props} />
        <vstack height={props.imageHeight} alignment="end bottom" padding="none" width="100%">
            <hstack padding="none" alignment="end bottom" width="100%">
                <vstack padding="xsmall">
                    <button onPress={props.onImagePress} appearance="plain" icon="expand-right-fill" size="small"/>
                </vstack>
                <spacer grow/>
                {props.children ? (
                    <hstack darkBackgroundColor="rgba(0, 0, 0, 0.5)" lightBackgroundColor="rgba(255, 255, 255, 0.5)" cornerRadius="full" padding="none">
                        <spacer size="xsmall"/>
                        <text {...props} selectable={false}>
                            {props.children}
                        </text>
                        <spacer size="xsmall"/>
                    </hstack>
                ) : null}
            </hstack>
        </vstack>
    </zstack>
);

